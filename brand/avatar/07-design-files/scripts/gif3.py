from PIL import Image, ImageFilter
import numpy as np, math
OUT=512; FPS=25
base=Image.open('catears_v3.png').convert('RGB')
hands=Image.open('ziwu3.png').convert('RGB').resize(base.size,Image.LANCZOS).convert('RGBA')
hands.putalpha(Image.open('ziwu_mask7.png'))
W=1024; CX,CY=470,880
yy,xx=np.mgrid[0:W,0:W]
def glow(amp,cy):
    r=np.sqrt(((xx-CX)/1.25)**2+(yy-cy)**2)
    a=np.clip(np.exp(-(r/150)**2)*amp,0,1)
    g=np.zeros((W,W,4),np.uint8); g[...,0]=255; g[...,1]=214; g[...,2]=130; g[...,3]=(a*255).astype(np.uint8)
    return Image.fromarray(g,'RGBA')
def frame(off,amp):
    f=base.convert('RGBA')
    if amp>0: f.alpha_composite(glow(amp,CY+off))
    if off<400: f.alpha_composite(hands,(0,int(round(off))))
    return f.convert('RGB').resize((OUT,OUT),Image.LANCZOS)
eo=lambda t:1-(1-t)**3; ei=lambda t:t**3
frames=[];dur=[]
frames.append(frame(500,0)); dur.append(700)
n=int(0.8*FPS)
for i in range(1,n+1):
    t=i/n; frames.append(frame(330*(1-eo(t)),0.0)); dur.append(40)
n=int(2.0*FPS)
for i in range(n):
    t=i/n; amp=0.42*math.sin(math.pi*t)**2; frames.append(frame(0,amp)); dur.append(40)
n=int(0.6*FPS)
for i in range(1,n+1):
    t=i/n; frames.append(frame(330*ei(t),0)); dur.append(40)
import os,shutil,subprocess
shutil.rmtree('frames',ignore_errors=True); os.makedirs('frames')
k=0
for f,d in zip(frames,dur):
    for _ in range(max(1,round(d/40))):
        f.save(f'frames/{k:04d}.png'); k+=1
subprocess.run(['ffmpeg','-y','-loglevel','error','-framerate','25','-i','frames/%04d.png','-vf','split[a][b];[a]palettegen=max_colors=256:stats_mode=full[p];[b][p]paletteuse=dither=none','taocrypt_ziwu.gif'],check=True)
print(k)
