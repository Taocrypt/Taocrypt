from PIL import Image, ImageFilter
import numpy as np
im=Image.open('catears_wm.png').convert('RGB'); A=np.array(im).astype(float)
r,g,b=A[...,0],A[...,1],A[...,2]; lum=(r+g+b)/3
H,W=lum.shape; yy,xx=np.mgrid[0:H,0:W]
reg=(xx>=318)&(xx<=382)&(yy>=984)
M=reg&(lum>70)&(lum<230)&((r-b)>-6)
Mi=Image.fromarray((M*255).astype('uint8')).filter(ImageFilter.MaxFilter(5)); M=(np.array(Mi)>0)&reg&~((lum<75)|((b-r)>12))
# fill from nearby bright robe pixels
B=A.copy()
good=(lum>228)&~M
for y,x in zip(*np.nonzero(M)):
    y0,y1,x0,x1=max(0,y-14),min(H,y+15),max(0,x-14),min(W,x+15)
    gm=good[y0:y1,x0:x1]
    if gm.sum()>0: B[y,x]=np.median(A[y0:y1,x0:x1][gm],0)
out=Image.fromarray(B.clip(0,255).astype('uint8'))
print('masked',M.sum())
# sharpen ribbons
sh=out.filter(ImageFilter.UnsharpMask(radius=1.6,percent=160,threshold=2))
rm=Image.new('L',out.size,0)
from PIL import ImageDraw
d=ImageDraw.Draw(rm)
d.rectangle((0,380,200,700),fill=255); d.rectangle((730,550,890,840),fill=255)
rm=rm.filter(ImageFilter.GaussianBlur(12))
out=Image.composite(sh,out,rm)
out.save('catears_v2.png')
s=Image.new('RGB',(1200,600))
s.paste(im.crop((300,940,420,1024)).resize((300,210)),(0,0)); s.paste(out.crop((300,940,420,1024)).resize((300,210)),(300,0))
s.paste(im.crop((0,400,180,700)).resize((300,500//1)).crop((0,0,300,390)),(600,0)); s.paste(out.crop((0,400,180,700)).resize((300,500)).crop((0,0,300,390)),(900,0))
s.save('/tmp/v2.png')
