// 全局Umami统计脚本
document.write(`
  <script defer src="https://umami.taocrypt.us.kg/script.js" data-website-id="c55c635d-ea1a-4681-8cb0-edc2754925d6"></script>
`);

// 全局信息配置（仅存储内容，不涉及样式）
window.globalConfig = {
  personal: {
    name: "Taocrypt",
    desc: "以道󠅄御密󠅑，󠅟显隐守正󠅓，阴阳相󠅢济，动󠅩静󠅠用󠅤奇",
    email: "root@taocrypt.us.kg",
    emailHref: "mailto:root@taocrypt.us.kg",
    avatar: {
      qlogo: "/img/icon_white.png"
    }
  },
  links: [
  {
    name: "GitHub",
    subname: "@Taocrypt",
    href: "https://github.com/taocrypt",
    iconSvg: `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.107.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
    </svg>`
  },
  {
    name: "Game",
    subname: "玩会游戏，放松一下～",
    href: "/game",
    iconSvg: `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
      <path d="M21 6h-2V4c0-1.103-.897-2-2-2H7c-1.103 0-2 .897-2 2v2H3c-1.103 0-2 .897-2 2v10c0 1.103.897 2 2 2h2v2c0 1.103.897 2 2 2h8c1.103 0 2-.897 2-2v-2h2c1.103 0 2-.897 2-2V8c0-1.103-.897-2-2-2zm-4 12H7V8h10v10zm-8-4c-.828 0-1.5-.672-1.5-1.5S8.172 11 9 11s1.5.672 1.5 1.5S9.828 14 9 14zm7-1.5c0-.828-.672-1.5-1.5-1.5s-1.5.672-1.5 1.5.672 1.5 1.5 1.5 1.5-.672 1.5-1.5zM9 9h6V7c0-1.103-.897-2-2-2h-2c-1.103 0-2 .897-2 2v2z"/>
    </svg>`
  },
  {
    name: "Blog",
    subname: "雲在青天水在瓶.",
    href: "https://blog.taocrypt.us.kg/",
    iconSvg: `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
    </svg>`
  }
],
  projects: [
  {
    name: "LinkPass",
    desc: "通过github.io域名实现QQ、微信防红接口",
    href: "https://github.com/Taocrypt/LinkPass",
    imgSrc: "/img/LinkPass.png",
    imgAlt: "QQ、微信防红接口工具"
  },
  {
    name: "wget-md3",
    desc: "Material Design 3 风格的在线网站下载工具",
    href: "https://github.com/Taocrypt/wget-md3",
    imgSrc: "/img/wget-md3.png",
    imgAlt: "Material Design 3 在线下载工具"
  },
  {
    name: "ShareQR",
    desc: "ShareQR 是一个极简、即用即走的「分享→二维码」工具。",
    href: "https://github.com/Taocrypt/ShareQR",
    imgSrc: "/img/ShareQR.png",
    imgAlt: "极简分享转二维码工具"
  },
  {
    name: "h5player-mod",
    desc: "音视频增强脚本（Taocrypt魔改版）",
    href: "https://github.com/Taocrypt/h5player-mod",
    imgSrc: "/img/h5player-mod.png",
    imgAlt: "音视频增强魔改脚本"
  }
]
};