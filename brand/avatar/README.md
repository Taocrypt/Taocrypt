# Taocrypt Avatar Kit

黑金「以道御密」头像素材包。母版 1024×1024，所有尺寸均由母版一次缩放生成（Lanczos），不做二次编辑。

## 目录

| 目录 | 内容 | 用途 |
|---|---|---|
| 01-master | 1024 PNG / JPG / WebP 母版 | 存档、再导出 |
| 02-square | 方形 32–1024 PNG，320/512 WebP | 大多数平台上传（平台自己裁圆） |
| 03-circle | 透明底圆形 32–1024 PNG | 名片、PPT、网页、签名档 |
| 04-rounded | ios-*（圆角 22.37%）、android-*（圆角 25%）、squircle-*（超椭圆），android-adaptive（前景 432、背景 #0b0e16、满版） | App 图标、桌面快捷方式、PWA |
| 05-platforms | 各平台推荐尺寸，website/ 为网站用 avatar.png 512 + avatar.webp 320 | 直接上传 |
| 06-animated | 子午诀动图：MP4 1024/512、GIF 512/320、WebP 512；frames-1024 逐帧 PNG（103 帧，25fps）；keyframes.png 关键帧；contact-sheet-all-frames.png 全帧合成图 | 动态头像（Telegram/Discord Nitro/B 站大会员等）、展示 |
| 07-design-files | layers/：静态底图、手势源图、手势蒙版、RGBA 手势层；scripts/：合成与水印脚本；favicon-pixel-taiji.svg | 重新出图、改动画 |
| 08-favicon | 网站图标：SVG、ICO(16/32/48)、apple-touch 180、PWA 192/512 | 网站 |

## 平台尺寸参考（05-platforms）

GitHub 460 · X/Twitter 400 · Bilibili 400 · QQ 640 · 微信 640 · 微博 400 · 知乎 400 · Telegram 640 · Discord 512 · Reddit 256 · Steam 184 · Google 512 · LinkedIn 400 · Gravatar 512 · 网站/OG 1024

## 动图说明

- 时长约 4.1 秒循环：静止 0.7s → 抬手结子午诀 0.8s → 金光呼吸 2.0s → 放下 0.6s。
- 编码链：逐帧 PNG → MP4（x264）→ GIF（全局调色板、无抖动），避免部分播放器的残影。
- 需要更小的 GIF 用 320 版；平台支持视频头像优先用 MP4。

## 再导出

```
python3 07-design-files/scripts/gif3.py   # 依赖 Pillow、numpy、ffmpeg
```

## 版权提示

人物形象衍生自参考插画，个人头像使用风险较低，商用前请自行确认授权。
逐帧 PNG（frames-1024）与完整压缩包见 Releases：avatar-kit
