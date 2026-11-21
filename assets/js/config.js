// 全局Umami统计脚本
document.write(`
  <script defer src="https://umami.taocrypt.us.kg/script.js" data-website-id="c55c635d-ea1a-4681-8cb0-edc2754925d6"></script>
`);

// 全局信息配置（仅存储内容，不涉及样式）
window.globalConfig = {
  personal: {
    name: "Taocrypt",
    desc: "以道󠅄御密󠅑，󠅟显隐守正󠅓，阴阳相󠅢济，动󠅩静󠅠用󠅤奇",
    email: "email@taocrypt.com",
    emailHref: "mailto:email@taocrypt.com",
    avatar: {
      qlogo: "/assets/img/avatar.webp"
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
    iconSvg: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
      <path d="M7.5 7h9a5 5 0 0 1 4.9 6l-.8 3.9a2.4 2.4 0 0 1-4.1 1.1L14 15.5h-4L7.5 18a2.4 2.4 0 0 1-4.1-1.1L2.6 13A5 5 0 0 1 7.5 7z"/><path d="M7.5 10v3M6 11.5h3"/><circle cx="15.5" cy="10.6" r=".9" fill="currentColor" stroke="none"/><circle cx="17.6" cy="12.6" r=".9" fill="currentColor" stroke="none"/>
    </svg>`
  },
  {
    name: "Blog",
    subname: "雲在青天水在瓶.",
    href: "https://blog.taocrypt.us.kg/",
    iconSvg: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 20h9"/><path d="M16.4 3.6a2 2 0 0 1 2.9 2.9L8.5 17.3 4 18.5l1.2-4.5z"/><path d="m14.5 5.5 3 3"/>
    </svg>`
  }
],
  projects: [
    { name: "ShareQR", desc: "从系统分享面板一键唤起：复制到剪贴板 + 弹出 MD3 二维码卡片，点外部即关闭。", href: "https://github.com/Taocrypt/ShareQR", cover: "/assets/img/covers/shareqr.svg", tags: ["Kotlin", "Android"], stars: true },
    { name: "Tergate", desc: "手机上的 SSH 终端，内置本地 MCP Server，让 AI Agent 通过手机安全地操作服务器。", href: "https://github.com/Taocrypt/Tergate", cover: "/assets/img/covers/tergate.svg", tags: ["Rust", "Android"], soon: true },
    { name: "MicMask", desc: "安卓端侧实时变声：AI 变声（RVC）、音调变声、虚拟声卡，免 Root 注入麦克风。", href: "https://github.com/Taocrypt/MicMask", cover: "/assets/img/covers/micmask.svg", tags: ["Kotlin", "ONNX"], soon: true },
    { name: "PureConnect", desc: "跨平台 VPN 客户端，支持 EasyConnect 与 aTrust，覆盖 Android / Windows / macOS / Linux。", href: "https://github.com/Taocrypt/PureConnect", cover: "/assets/img/covers/pureconnect.svg", tags: ["Dart", "Flutter"], stars: true },
    { name: "magpie-android", desc: "magpie 网关的安卓外壳：悬浮窗、Cloudflare / Tailscale 远程访问、应用内更新。", href: "https://github.com/Taocrypt/magpie-android", cover: "/assets/img/covers/magpie-android.svg", tags: ["Java", "Android"], stars: true },
    { name: "oh-my-cpa-android", desc: "在手机本地运行 CLIProxyAPI 与 oh-my-cpa 控制台，免服务器免 Root。", href: "https://github.com/Taocrypt/oh-my-cpa-android", cover: "/assets/img/covers/oh-my-cpa-android.svg", tags: ["Java", "Android"], stars: true }
  ],
  tools: [
    { name: "wget-md3", desc: "Material Design 3 风格的在线网站下载工具", href: "https://github.com/Taocrypt/wget-md3", tech: "JavaScript" },
    { name: "LinkPass", desc: "借助 github.io 域名实现 QQ、微信链接防红跳转", href: "https://github.com/Taocrypt/LinkPass", tech: "SCSS" },
    { name: "WinTunRepair", desc: "Windows TUN 联网异常一键修复，支持备份与失败回滚", href: "https://github.com/Taocrypt/WinTunRepair", tech: "PowerShell" }
  ]
};
