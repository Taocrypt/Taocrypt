// 根据 config.js 渲染个人主页（黑金「以道御密」主题）
(function () {
  const cfg = window.globalConfig;
  if (!cfg) return console.error("全局配置未加载");
  const { personal, links = [], projects = [], tools = [] } = cfg;
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const ext = (href) => /^https?:/.test(href) ? ' target="_blank" rel="noopener noreferrer"' : "";
  const arrow = '<svg class="arrow" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>';
  const mail = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z"/><path d="m2 8 7.5 6a4 4 0 0 0 5 0L22 8"/></svg>';
  const RAW = "https://raw.githubusercontent.com/Taocrypt/Taocrypt/output";
  const starImg = (n) => `<img class="stars" src="${RAW}/badges/${encodeURIComponent(n)}.svg" alt="stars" height="20" loading="lazy">`;
  const gh = links.find((l) => /github\.com/i.test(l.href));

  // 1. 头部
  $("hero").innerHTML = `
    <button class="avatar" type="button" aria-label="${esc(personal.name)}">
      <span class="ring"></span>
      <img class="av-base" src="${personal.avatar.qlogo}" alt="Taocrypt 头像" width="160" height="160">
    </button>
    <p class="eyebrow">◆ 以道御密 · TAO × CRYPT ◆</p>
    <h1 class="name" data-decrypt>${esc(personal.name)}</h1>
    <p class="motto">${personal.desc}</p>
    <div class="actions">
      <a class="btn btn-gold" href="${personal.emailHref}">${mail}<span>${esc(personal.email)}</span></a>
      ${gh ? `<a class="btn btn-ghost" href="${gh.href}"${ext(gh.href)}>${gh.iconSvg}<span>GitHub</span></a>` : ""}
    </div>`;

  // 2. 链接
  $("links").innerHTML = links.map((l) => `
    <a class="card link" href="${l.href}"${ext(l.href)}>
      <span class="link-icon">${l.iconSvg}</span>
      <span class="link-text"><b>${esc(l.name)}</b><small>${esc(l.subname)}</small></span>
      ${arrow}
    </a>`).join("");

  // 3. 精选项目
  $("projects").innerHTML = projects.map((p) => `
    <a class="card project" href="${p.href}"${ext(p.href)}>
      <div class="cover"><img src="${p.cover}" alt="${esc(p.name)}" loading="lazy" width="1050" height="450"></div>
      <div class="project-body">
        <div class="project-head">
          <b>${esc(p.name)}</b>
          ${p.soon ? `<span class="pill pill-soon" data-soon="${esc(p.name)}">COMING SOON</span>` : ""}
          ${p.stars ? starImg(p.name) : ""}
        </div>
        <p>${esc(p.desc)}</p>
        <div class="tags">${(p.tags || []).map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
      </div>
    </a>`).join("");

  // 4. 更多工具
  $("tools").innerHTML = tools.map((t) => `
    <a class="card tool" href="${t.href}"${ext(t.href)}>
      <span class="tool-text"><b>${esc(t.name)}</b><small>${esc(t.desc)}</small></span>
      <span class="tag">${esc(t.tech)}</span>
      ${arrow}
    </a>`).join("");

  // 5. 未开源项目公开后自动去掉 COMING SOON、换成星标（status.json 由每日工作流生成）
  if (document.querySelector("[data-soon]")) fetch(`${RAW}/status.json`, { cache: "no-cache" })
    .then((r) => r.ok ? r.json() : null)
    .then((st) => {
      if (!st || !Array.isArray(st.public)) return;
      document.querySelectorAll("[data-soon]").forEach((el) => {
        if (st.public.includes(el.dataset.soon)) el.outerHTML = starImg(el.dataset.soon);
      });
    }).catch(() => {});
})();
