// Beacon 访问统计（自建，https://beacon.0666555.xyz，应用 taocrypt）
// 匿名随机 ID，不用 Cookie、不采集个人信息。
(function () {
  // 网址末尾加 #stat 可在页面上看到统计是否发送成功（排查用）
  var DEBUG = location.hash === "#stat";
  function dbg(m) {
    if (!DEBUG) return;
    var d = document.createElement("div");
    d.textContent = m;
    d.style.cssText = "position:fixed;left:12px;right:12px;bottom:12px;z-index:99999;padding:10px 14px;border-radius:10px;background:#111;color:#f3d27a;font:14px/1.4 system-ui;border:1px solid #f3d27a55";
    (document.body || document.documentElement).appendChild(d);
  }
  // 任何线上域名都统计（自动记录 host 区分来源）；只跳过本地预览和内网地址
  var H = location.hostname;
  if (!/^https?:$/.test(location.protocol) || !H || /^(localhost|127\.|0\.0\.0\.0|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|\[?::1\]?$)/.test(H) || /\.(local|localhost|internal|lan)$/.test(H))
    return dbg("本地预览，不统计");
  var BASE = "https://beacon.0666555.xyz", APP = "taocrypt", KEY = "bk__OFFxOXkyamPj9Zqbj2AO1dO";
  var URL_ = BASE + "/v1/" + APP + "/events?k=" + KEY;
  function rid() {
    var a = new Uint8Array(16); (window.crypto || window.msCrypto).getRandomValues(a);
    return Array.prototype.map.call(a, function (b) { return ("0" + b.toString(16)).slice(-2); }).join("");
  }
  function store(s, k) { try { return s.getItem(k) || (s.setItem(k, rid()), s.getItem(k)); } catch (e) { return rid(); } }
  var iid = store(localStorage, "beacon_iid"), sid = store(sessionStorage, "beacon_sid");
  var ua = navigator.userAgent;
  var os = /Android/.test(ua) ? "android" : /iPhone|iPad|iPod/.test(ua) ? "ios" : /Windows/.test(ua) ? "windows" : /Mac OS X/.test(ua) ? "macos" : /Linux/.test(ua) ? "linux" : "other";
  var dev = /Mobi|Android|iPhone/.test(ua) ? "mobile" : "desktop";
  function send(ev) {
    var body = JSON.stringify({ iid: iid, sid: sid, ver: "web", ch: H.slice(0, 60), os: os, dev: dev, lang: navigator.language || "", ev: ev });
    // text/plain 不触发预检；sendBeacon 页面关闭时也能发出
    fetch(URL_, { method: "POST", body: body, keepalive: true, mode: "cors", credentials: "omit", headers: { "Content-Type": "text/plain" } })
      .then(function (r) { dbg("统计已发送：HTTP " + r.status); })
      .catch(function (e) {
        dbg("统计发送失败：" + e);
        try { navigator.sendBeacon && navigator.sendBeacon(URL_, new Blob([body], { type: "text/plain" })); } catch (e2) {}
      });
  }
  function host(u) { try { return new URL(u).hostname; } catch (e) { return ""; } }
  var ev = [];
  try { if (!sessionStorage.getItem("beacon_launched")) { sessionStorage.setItem("beacon_launched", "1"); ev.push({ n: "$launch", t: Date.now() }); } } catch (e) {}
  var ref = host(document.referrer);
  var p = { path: location.pathname.slice(0, 100), w: String(screen.width) };
  if (ref && ref !== location.hostname) p.ref = ref;
  var q = new URLSearchParams(location.search);
  if (q.get("utm_source")) p.utm = q.get("utm_source").slice(0, 40);
  p.host = location.hostname; // 区分 GitHub Pages / Cloudflare Pages 两个域名
  ev.push({ n: "$screen", t: Date.now(), p: p });
  send(ev);
  // 外链点击
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[href]");
    if (!a) return;
    var h = a.getAttribute("href") || "";
    var to = /^mailto:/.test(h) ? "mailto" : host(a.href);
    if (!to || to === location.hostname) { if (!/^\/[^/]/.test(h)) return; to = h.slice(0, 60); }
    send([{ n: "link_click", t: Date.now(), p: { to: to, text: (a.textContent || "").trim().slice(0, 40) } }]);
  }, true);
})();
