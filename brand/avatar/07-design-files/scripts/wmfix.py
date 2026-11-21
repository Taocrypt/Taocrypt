from PIL import Image, ImageDraw, ImageFont, ImageFilter
import numpy as np, math
src=Image.open('/workspace/work/avatar6/grok_catears.png').convert('RGB')
A=np.array(src).astype(float)
P0=np.array([316.7,793.3]); P1=np.array([375,871.7])
u=(P1-P0)/np.linalg.norm(P1-P0); v=np.array([-u[1],u[0]])
H,W=A.shape[:2]; yy,xx=np.mgrid[0:H,0:W]
rel=np.stack([xx-P0[0],yy-P0[1]],-1)
s=rel@u; t=rel@v
box=(s>-20)&(s<np.linalg.norm(P1-P0)+10)&(np.abs(t)<10)
r,g,b=A[...,0],A[...,1],A[...,2]; lum=(r+g+b)/3
txt=box&((b-r)<5)&((r-b)<30)&(lum<200)&(lum>115)
m=Image.fromarray((txt*255).astype('uint8')).filter(ImageFilter.MaxFilter(3))
M=np.array(m)>0
np.save('wm_mask.npy',M)
# diffusion inpaint
y0,y1,x0,x1=760,900,290,410
B=A[y0:y1,x0:x1].copy(); Mc=M[y0:y1,x0:x1]; B[Mc]=np.nan
known=~M
for it in range(400):
    pad=np.pad(B,((1,1),(1,1),(0,0)),constant_values=np.nan)
    nb=np.stack([pad[:-2,1:-1],pad[2:,1:-1],pad[1:-1,:-2],pad[1:-1,2:]])
    import warnings
    with warnings.catch_warnings():
        warnings.simplefilter('ignore'); mean=np.nanmean(nb,0)
    upd=Mc & ~np.isnan(mean[...,0])
    B[upd]=mean[upd]
Af=A.copy(); Af[y0:y1,x0:x1]=np.nan_to_num(B)
out=Image.fromarray(Af.clip(0,255).astype('uint8'))
out.save('clean_wm.png')
# redraw text
SS=4; ang=math.degrees(math.atan2(u[1],u[0])); C=(P0+P1)/2 + v*0.0
f=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf',18*SS)
s_='@taocrypt'; tw=f.getlength(s_); asc,desc=f.getmetrics()
T=Image.new('RGBA',(int(tw)+8*SS,asc+desc+4*SS),(0,0,0,0)); ImageDraw.Draw(T).text((4*SS,2*SS),s_,font=f,fill=(150,135,95,165))
T=T.rotate(-ang,expand=True,resample=Image.BICUBIC); T=T.resize((T.width//SS,T.height//SS),Image.LANCZOS)
o=out.convert('RGBA'); o.alpha_composite(T,(int(round(C[0]-T.width/2)),int(round(C[1]-T.height/2))))
o=o.convert('RGB'); o.save('catears_wm.png')
row=Image.new('RGB',(1560,762))
row.paste(src.crop((270,770,530,1024)).resize((780,762),Image.LANCZOS),(0,0))
row.paste(o.crop((270,770,530,1024)).resize((780,762),Image.LANCZOS),(780,0)); row.save('/tmp/cmpw.png')
print(M.sum(), np.abs(np.array(o).astype(int)-np.array(src).astype(int)).sum(-1).astype(bool)[~box].sum())
