// 生成 GitHub 主页统计卡片（stats.svg / langs.svg），由 .github/workflows/profile.yml 每日运行
import { writeFileSync, mkdirSync } from "node:fs";

const LOGIN = process.env.LOGIN || "Taocrypt";
const OUT = process.env.OUT || "dist";
const token = process.env.GITHUB_TOKEN;

const query = `query($login:String!){
  user(login:$login){
    followers{totalCount}
    contributionsCollection{
      totalCommitContributions totalPullRequestContributions totalIssueContributions
      contributionCalendar{totalContributions}
    }
    repositories(ownerAffiliations:OWNER, privacy:PUBLIC, first:100){
      totalCount
      nodes{ name isFork stargazerCount forkCount
        languages(first:10, orderBy:{field:SIZE, direction:DESC}){ edges{ size node{ name color } } } }
    }
  }
}`;

const res = await fetch("https://api.github.com/graphql", {
  method: "POST",
  headers: { ...(token ? { Authorization: `bearer ${token}` } : {}), "Content-Type": "application/json" },
  body: JSON.stringify({ query, variables: { login: LOGIN } }),
});
const json = await res.json();
if (!json.data) { console.error(JSON.stringify(json)); process.exit(1); }
const u = json.data.user;
const own = u.repositories.nodes.filter(r => !r.isFork);
const stars = own.reduce((a, r) => a + r.stargazerCount, 0);
const forks = own.reduce((a, r) => a + r.forkCount, 0);
const c = u.contributionsCollection;

const langs = {};
for (const r of own) for (const e of r.languages.edges) {
  const k = e.node.name;
  langs[k] ??= { size: 0, color: e.node.color || "#8b949e" };
  langs[k].size += e.size;
}
// 太暗的语言色在深色卡片上看不清，提亮一点
function lift(hex) {
  const n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  if (0.2126 * r + 0.7152 * g + 0.0722 * b > 70) return hex;
  const m = v => Math.round(v + (255 - v) * 0.45).toString(16).padStart(2, "0");
  return "#" + m(r) + m(g) + m(b);
}
const total = Object.values(langs).reduce((a, l) => a + l.size, 0) || 1;
const top = Object.entries(langs).sort((a, b) => b[1].size - a[1].size).slice(0, 6)
  .map(([name, l]) => ({ name, color: lift(l.color), pct: (l.size / total) * 100 }));
const shown = top.reduce((a, t) => a + t.pct, 0) || 1;

const esc = s => String(s).replace(/[&<>"]/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));
const fmt = n => n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, "") + "k" : String(n);

const frame = (w, h, title, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
<defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#05070d"/><stop offset="1" stop-color="#111827"/></linearGradient>
<linearGradient id="gold" x1="0" x2="1"><stop offset="0" stop-color="#f5d78e"/><stop offset="1" stop-color="#e8b04a"/></linearGradient></defs>
<style>
.t{font:700 15px ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;fill:#f5d78e;letter-spacing:1px}
.l{font:500 13px -apple-system,"Segoe UI",Helvetica,Arial,"PingFang SC","Microsoft YaHei",sans-serif;fill:#9ca3af}
.v{font:800 24px -apple-system,"Segoe UI",Helvetica,Arial,sans-serif;fill:url(#gold)}
.s{font:600 12px ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;fill:#e5e7eb}
.i{animation:in .8s ease backwards}@keyframes in{from{opacity:0;transform:translateY(6px)}}
.bar{transform-box:fill-box;animation:grow 1.2s ease backwards}@keyframes grow{from{transform:scaleX(0)}}
</style>
<rect x=".5" y=".5" width="${w - 1}" height="${h - 1}" rx="16" fill="url(#bg)" stroke="#e8b04a" stroke-opacity=".25"/>
<text class="t" x="28" y="38">${esc(title)}</text>
<line x1="28" y1="52" x2="${w - 28}" y2="52" stroke="#e8b04a" stroke-opacity=".18"/>
${body}
</svg>`;

const items = [
  ["Total Stars", fmt(stars)], ["Forks", fmt(forks)], ["Public Repos", fmt(u.repositories.totalCount)],
  ["Contributions (1y)", fmt(c.contributionCalendar.totalContributions)], ["Commits (1y)", fmt(c.totalCommitContributions)],
  ["PRs + Issues (1y)", fmt(c.totalPullRequestContributions + c.totalIssueContributions)],
];
const statsBody = items.map(([k, v], i) => {
  const x = 28 + (i % 3) * 140, y = 98 + Math.floor(i / 3) * 70;
  return `<g class="i" style="animation-delay:${i * .12}s"><text class="v" x="${x}" y="${y}">${esc(v)}</text><text class="l" x="${x}" y="${y + 22}">${esc(k)}</text></g>`;
}).join("\n");
const W = 460, H = 210;

let off = 0;
const bar = top.map(t => { const w = (t.pct / shown) * (W - 56); const r = `<rect x="${28 + off}" y="70" width="${w.toFixed(2)}" height="10" fill="${t.color}"/>`; off += w; return r; }).join("");
const legend = top.map((t, i) => {
  const x = 28 + (i % 2) * 205, y = 112 + Math.floor(i / 2) * 30;
  return `<g class="i" style="animation-delay:${.3 + i * .1}s"><circle cx="${x + 5}" cy="${y - 4}" r="5" fill="${t.color}"/><text class="s" x="${x + 18}" y="${y}">${esc(t.name)} <tspan fill="#9ca3af">${t.pct.toFixed(1)}%</tspan></text></g>`;
}).join("\n");
const langBody = `<clipPath id="cb"><rect x="28" y="70" width="${W - 56}" height="10" rx="5"/></clipPath><g clip-path="url(#cb)" class="bar">${bar}</g>\n${legend}`;

mkdirSync(OUT, { recursive: true });
writeFileSync(`${OUT}/stats.svg`, frame(W, H, "◆ GITHUB STATS", statsBody));
writeFileSync(`${OUT}/langs.svg`, frame(W, H, "◆ TOP LANGUAGES", langBody));
console.log({ stars, forks, top });

// 星标徽章：README 不再依赖 shields.io（经 camo 代理常加载失败）
const badge = (label, value) => {
  const lw = label.length > 2 ? label.length * 7 + 26 : 24, vw = String(value).length * 7.5 + 14, w = lw + vw;
  const icon = `<path transform="translate(7 4.5) scale(0.6875)" fill="#f5d78e" d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"/>`;
  const text = label.length > 2 ? `<text x="${(lw + 14) / 2}" y="14" fill="#f5d78e">${label}</text>` : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="20" role="img" aria-label="${label}: ${value}">
<clipPath id="c"><rect width="${w}" height="20" rx="4"/></clipPath><g clip-path="url(#c)"><rect width="${lw}" height="20" fill="#0b1220"/><rect x="${lw}" width="${vw}" height="20" fill="#e8b04a"/></g>${icon}
<g font-family="Verdana,DejaVu Sans,sans-serif" font-size="11" text-anchor="middle">${text}<text x="${lw + vw / 2}" y="14" fill="#0b1220" font-weight="bold">${value}</text></g></svg>`;
};
mkdirSync(`${OUT}/badges`, { recursive: true });
for (const r of own) writeFileSync(`${OUT}/badges/${r.name}.svg`, badge("★", r.stargazerCount));
writeFileSync(`${OUT}/badges/total.svg`, badge("Total Stars", stars));

// 项目标题图：项目名 + 星标做成同一张 SVG，避免 README 里文字与徽章在各端（尤其手机 App）错位
const escT = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
const titleSvg = (name, value) => {
  // 近似 Helvetica Bold 字宽（/1000 em），配合 textLength 让各端宽度一致
  const cw = ch => /[ijl.]/.test(ch) ? 278 : /[-ftr]/.test(ch) ? 360 : /[mw]/.test(ch) ? 860 : /[MW]/.test(ch) ? 900 : /[A-Z]/.test(ch) ? 722 : /[0-9]/.test(ch) ? 556 : 600;
  const nw = Math.round([...name].reduce((a, ch) => a + cw(ch), 0) * 0.02);
  const H = 32, cy = H / 2;
  let pill = "", w = nw + 4;
  if (value !== null && value !== undefined) {
    const vw = String(value).length * 9 + 14, lw = 26, x = nw + 12;
    w = x + lw + vw + 2;
    pill = `<g transform="translate(${x} ${cy - 11})"><clipPath id="p"><rect width="${lw + vw}" height="22" rx="5"/></clipPath><g clip-path="url(#p)"><rect width="${lw}" height="22" fill="#0b1220"/><rect x="${lw}" width="${vw}" height="22" fill="#e8b04a"/></g>`
      + `<path transform="translate(6 4) scale(0.875)" fill="#f5d78e" d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"/>`
      + `<text x="${lw + vw / 2}" y="15.5" text-anchor="middle" font-family="Verdana,DejaVu Sans,sans-serif" font-size="12" font-weight="bold" fill="#0b1220">${value}</text></g>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${H}" viewBox="0 0 ${w} ${H}" role="img" aria-label="${escT(name)}${value != null ? ` ★ ${value}` : ""}">`
    + `<text x="0" y="${cy + 7}" textLength="${nw}" lengthAdjust="spacingAndGlyphs" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif" font-size="20" font-weight="700" fill="#d4a537">${escT(name)}</text>${pill}</svg>`;
};
mkdirSync(`${OUT}/titles`, { recursive: true });
for (const r of own) writeFileSync(`${OUT}/titles/${r.name}.svg`, titleSvg(r.name, r.stargazerCount));
// 未开源项目：仓库公开前标题带 COMING SOON；公开后自动走上面的星标标题，并写入 status.json 供网站读取
const UPCOMING = ["Tergate", "MicMask"];
const soonSvg = (name) => {
  const svg = titleSvg(name, null);
  const w = Number(svg.match(/width="(\d+)"/)[1]), x = w + 8, pw = 112;
  const pill = `<g transform="translate(${x} 5)"><rect width="${pw}" height="22" rx="11" fill="#e8b04a" fill-opacity=".14" stroke="#e8b04a" stroke-opacity=".6"/><text x="${pw / 2}" y="15" text-anchor="middle" font-family="Verdana,DejaVu Sans,sans-serif" font-size="11" font-weight="bold" letter-spacing="1" fill="#f5d78e">COMING SOON</text></g>`;
  return svg.replace(/width="\d+" height="32" viewBox="0 0 \d+ 32"/, `width="${x + pw + 2}" height="32" viewBox="0 0 ${x + pw + 2} 32"`).replace("</svg>", pill + "</svg>");
};
const publicNames = new Set(own.map(r => r.name));
for (const n of UPCOMING) if (!publicNames.has(n)) writeFileSync(`${OUT}/titles/${n}.svg`, soonSvg(n));
writeFileSync(`${OUT}/status.json`, JSON.stringify({ updated: new Date().toISOString(), public: [...publicNames], upcoming: UPCOMING.filter(n => !publicNames.has(n)) }));
