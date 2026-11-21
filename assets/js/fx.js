// 交互特效：气流墨线背景 / 解密文字 / 卡片聚光描边 / 柔和渐显
(function () {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const pointer = { x: 0, y: 0, tx: 0, ty: 0, on: 0, target: 0 };

  // ---------- 1. 气流墨线：沿流场缓慢游走的金色细线，指针处形成太极般的涡旋 ----------
  const cv = document.getElementById("fx");
  const ctx = cv && cv.getContext("2d");
  let W = 0, H = 0, dpr = 1, ps = [], t = 0, running = true;
  const rand = (a, b) => a + Math.random() * (b - a);
  function spawn(p) {
    p.x = rand(-40, W + 40); p.y = rand(-40, H + 40);
    p.life = 0; p.max = rand(220, 520); p.w = rand(.4, 1.1); p.hi = Math.random() < .08;
    return p;
  }
  // 画布按「大视口」尺寸建一次；手机地址栏伸缩只改高度，不重建、不清屏
  function resize() {
    const nd = Math.min(window.devicePixelRatio || 1, 1.5);
    const nW = document.documentElement.clientWidth || innerWidth;
    const nH = Math.max(innerHeight, screen.height || 0, H);
    if (nW === W && nH <= H && nd === dpr) return;
    let snap = null;
    if (W && H) { snap = document.createElement("canvas"); snap.width = cv.width; snap.height = cv.height; snap.getContext("2d").drawImage(cv, 0, 0); }
    const sx = W ? nW / W : 1, sy = H ? nH / H : 1;
    dpr = nd; W = nW; H = nH;
    cv.width = W * dpr; cv.height = H * dpr;
    cv.style.width = W + "px"; cv.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (snap) ctx.drawImage(snap, 0, 0, snap.width, snap.height, 0, 0, snap.width / dpr * sx, snap.height / dpr * sy);
    const n = Math.round(Math.min(420, Math.max(120, (W * H) / 4200)));
    if (!ps.length) ps = Array.from({ length: n }, () => { const p = spawn({}); p.life = rand(0, p.max); return p; });
    else {
      for (const p of ps) { p.x *= sx; p.y *= sy; }
      while (ps.length < n) { const p = spawn({}); p.life = rand(0, p.max); ps.push(p); }
      if (ps.length > n) ps.length = n;
    }
  }
  // 平滑伪噪声流场
  function angle(x, y) {
    const s = .0021;
    return Math.sin(x * s + t * .18) * 1.6 + Math.cos(y * s * 1.3 - t * .12) * 1.4 + Math.sin((x + y) * s * .6 + t * .07) * 1.2;
  }
  let raf = 0, last = 0;
  function loop() { if (!raf) raf = requestAnimationFrame(tick); }
  function tick(now) {
    raf = 0;
    if (!running) return;
    const dt = last ? Math.min(3, (now - last) / 16.667) : 1; last = now;
    t += dt / 60;
    pointer.x += (pointer.tx - pointer.x) * .08; pointer.y += (pointer.ty - pointer.y) * .08;
    pointer.on += (pointer.target - pointer.on) * .05;
    // 拖尾：轻微擦除上一帧
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = "rgba(0,0,0,.06)";
    ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = "lighter";
    for (const p of ps) {
      let a = angle(p.x, p.y), vx = Math.cos(a) * .55 * dt, vy = Math.sin(a) * .55 * dt;
      if (pointer.on > .01) {
        const dx = p.x - pointer.x, dy = p.y - pointer.y, d2 = dx * dx + dy * dy, R = 220 * 220;
        if (d2 < R) { const f = (1 - d2 / R) * pointer.on * 1.4, d = Math.sqrt(d2) || 1; vx += (-dy / d) * f - dx / d * f * .15; vy += (dx / d) * f - dy / d * f * .15; }
      }
      const x0 = p.x, y0 = p.y;
      p.x += vx; p.y += vy; p.life += dt;
      const k = Math.sin(Math.min(1, p.life / p.max) * Math.PI);
      ctx.strokeStyle = p.hi ? `rgba(255,236,190,${.55 * k})` : `rgba(232,176,74,${.22 * k})`;
      ctx.lineWidth = p.w;
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(p.x, p.y); ctx.stroke();
      if (p.life > p.max || p.x < -60 || p.x > W + 60 || p.y < -60 || p.y > H + 60) spawn(p);
    }
    ctx.globalCompositeOperation = "source-over";
    loop();
  }
  if (ctx && !reduce) {
    resize();
    let rt; addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(resize, 150); });
    document.addEventListener("visibilitychange", () => { running = !document.hidden; last = 0; if (running) loop(); });
    loop();
  }
  addEventListener("pointermove", (e) => {
    pointer.tx = e.clientX; pointer.ty = e.clientY; pointer.target = 1;
    if (pointer.on < .01) { pointer.x = e.clientX; pointer.y = e.clientY; }
  }, { passive: true });
  const off = () => (pointer.target = 0);
  addEventListener("pointerleave", off);
  addEventListener("pointerup", (e) => { if (e.pointerType !== "mouse") setTimeout(off, 500); });
  document.addEventListener("mouseleave", off);

  // ---------- 2. 解密文字 ----------
  const GLYPHS = "01ABCDEF#$%&*+=<>/\\|☰☱☲☳☴☵☶☷";
  function decrypt(el, delay = 0) {
    const text = el.dataset.text || el.textContent;
    el.dataset.text = text;
    if (reduce || !text.trim()) return;
    el.setAttribute("aria-label", text);
    let frame = 0;
    const total = Math.max(18, text.length * 3);
    setTimeout(function run() {
      const reveal = Math.floor((frame / total) * text.length);
      el.textContent = [...text].map((c, i) => (i < reveal || c === " " ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0])).join("");
      if (frame++ < total) requestAnimationFrame(run); else el.textContent = text;
    }, delay);
  }
  const heroName = document.querySelector(".name[data-decrypt]");
  if (heroName) { decrypt(heroName, 350); heroName.addEventListener("pointerenter", () => decrypt(heroName)); }

  // ---------- 3. 卡片：聚光描边（光随指针在边框上流动） ----------
  const cards = [...document.querySelectorAll(".card")];
  if (fine) addEventListener("pointermove", (e) => {
    for (const c of cards) {
      const r = c.getBoundingClientRect();
      c.style.setProperty("--mx", e.clientX - r.left + "px");
      c.style.setProperty("--my", e.clientY - r.top + "px");
    }
  }, { passive: true });
  cards.forEach((c) => c.addEventListener("pointerdown", (e) => {
    const r = c.getBoundingClientRect();
    c.style.setProperty("--mx", e.clientX - r.left + "px");
    c.style.setProperty("--my", e.clientY - r.top + "px");
  }));

  // ---------- 4. 头像：点击转一圈 ----------
  const av = document.querySelector(".avatar");
  if (av) av.addEventListener("click", () => { av.classList.remove("spin"); void av.offsetWidth; av.classList.add("spin"); });

  // ---------- 5. 渐显（上浮 + 去模糊，错落） + 标题解密 ----------
  const targets = document.querySelectorAll(".hero, .title, .card");
  if ("IntersectionObserver" in window && !reduce) {
    document.querySelectorAll(".links, .projects, .tools").forEach((g) =>
      [...g.children].forEach((c, i) => c.style.setProperty("--d", (i % 6) * 80 + "ms")));
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      const en = e.target.querySelector && e.target.querySelector(".title-en[data-decrypt]");
      if (en) decrypt(en, 200);
      io.unobserve(e.target);
    }), { threshold: .12, rootMargin: "0px 0px -6% 0px" });
    targets.forEach((el) => { el.classList.add("reveal"); io.observe(el); });
  }
})();
