// tieba-02.mjs —— 只读：列表页 → 吧内搜索 → 候选帖抓图与楼层正文
import fs from "node:fs/promises";

const OUT = "./out/";
const MORE = "assets/more/";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = [];

async function connect() {
  const spaces = await listTaskSpaces();
  const entry = spaces && spaces[0];
  if (!entry) throw new Error("没有可用 task space");
  if (entry.ownership !== "user") return await taskSpace(entry.id);
  try {
    return await takeOverTaskSpace(entry.id);
  } catch {
    return await claimTaskSpace(entry.id);
  }
}

const ts = await connect();
await fs.mkdir(MORE, { recursive: true });
await fs.mkdir(OUT, { recursive: true });

// 取一个页面句柄：优先已有百度页，否则新开一个
let page = null;
const pages = (await ts.pages()) || [];
page = pages.find((p) => /tieba|baidu/i.test((p && p.label) || ""));
if (!page) {
  if (typeof ts.open === "function") page = await ts.open("about:blank", { as: "tieba" });
  else page = pages[0];
}
if (!page) throw new Error("拿不到 page 句柄");
log.push("page=" + (page.label || "?") + " goto=" + typeof page.goto + " evaluate=" + typeof page.evaluate);

const rep = { page_label: page.label || null, list: null, search: null, threads: [], images: [], log };

async function grab(url, waitMs) {
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
  } catch (e) {
    log.push("goto_err " + String(e).slice(0, 120));
  }
  await sleep(waitMs);
  return await page.evaluate(() => {
    const txt = document.body ? document.body.innerText || "" : "";
    const links = [...document.querySelectorAll('a[href*="/p/"]')].map((a) => ({
      t: (a.innerText || "").replace(/\s+/g, " ").trim().slice(0, 100),
      h: a.href,
    }));
    const seen = new Set();
    const uniq = [];
    for (const l of links) {
      const m = (l.h || "").match(/\/p\/(\d+)/);
      if (!m || seen.has(m[1])) continue;
      seen.add(m[1]);
      uniq.push({ tid: m[1], t: l.t, h: "https://tieba.baidu.com/p/" + m[1] });
    }
    return {
      url: location.href,
      title: document.title,
      blocked: /安全验证|请输入验证码|百度安全/.test(txt) || /百度安全验证/.test(document.title),
      len: txt.length,
      head: txt.slice(0, 1500),
      threads: uniq,
    };
  });
}

const KW = /7\.4|7．4|璃月|加强|爆料|内鬼|emoji|表情/i;

// 1) 列表页
try {
  const L = await grab("https://tieba.baidu.com/f?kw=%E5%89%91%E6%96%97%E7%BB%AE%E8%B0%AD&ie=utf-8", 8000);
  rep.list = { url: L.url, title: L.title, blocked: L.blocked, len: L.len, head: L.head, thread_count: L.threads.length };
  rep.list.threads = L.threads.slice(0, 60);
} catch (e) {
  rep.list = { err: String(e).slice(0, 200) };
}

// 2) 吧内搜索
try {
  const S = await grab("https://tieba.baidu.com/f/search/res?ie=utf-8&qw=7.4+%E7%92%83%E6%9C%88&kw=%E5%89%91%E6%96%97%E7%BB%AE%E8%B0%AD", 8000);
  rep.search = { url: S.url, title: S.title, blocked: S.blocked, len: S.len, head: S.head, thread_count: S.threads.length };
  rep.search.threads = S.threads.slice(0, 60);
} catch (e) {
  rep.search = { err: String(e).slice(0, 200) };
}

// 3) 候选帖：命中关键词的 tid 去重
const cand = [];
const pushIf = (arr, src) => {
  for (const t of arr || []) {
    if (!KW.test(t.t)) continue;
    if (cand.some((c) => c.tid === t.tid)) continue;
    cand.push({ ...t, src });
  }
};
pushIf(rep.search?.threads, "search");
pushIf(rep.list?.threads, "list");
log.push("candidates=" + cand.length + " -> " + cand.map((c) => c.tid + ":" + c.t.slice(0, 24)).join(" | "));

// 4) 逐帖抓：正文全文 + 图片地址 + 页面内取图转 base64
let imgSeq = 0;
for (const c of cand.slice(0, 5)) {
  let D;
  try {
    D = await grab(c.h, 6000);
  } catch (e) {
    rep.threads.push({ tid: c.tid, url: c.h, err: String(e).slice(0, 200) });
    continue;
  }
  const detail = await page.evaluate(() => {
    const srcs = new Set();
    for (const im of document.images) {
      for (const k of ["src", "data-original", "bpic", "data-src"]) {
        const v = im.getAttribute(k) || (k === "src" ? im.src : "");
        if (v && /tiebapic|hiphotos|bdimg|baidu\.com/.test(v) && /\.(jpg|jpeg|png|webp|gif)/i.test(v)) srcs.add(v);
      }
    }
    const floors = [...document.querySelectorAll('div[class*="d_post_content"], .p_content, .d_post')].map((e) =>
      (e.innerText || "").replace(/\s+/g, " ").trim().slice(0, 600)
    ).filter(Boolean);
    const txt = document.body ? document.body.innerText || "" : "";
    // 找含 emoji 或符号解读的行
    const emojiLines = txt.split("\n").map((s) => s.trim())
      .filter((s) => s && (/\p{Extended_Pictographic}/u.test(s) || /[★☆●○▲△□■◆◇]/.test(s)))
      .slice(0, 40);
    return { imgs: [...srcs].slice(0, 15), floors: floors.slice(0, 40), emojiLines, len: txt.length, full: txt.slice(0, 12000) };
  });
  rep.threads.push({
    tid: c.tid, url: c.h, title: D.title, blocked: D.blocked, len: D.len,
    img_count: detail.imgs.length, imgs: detail.imgs, emojiLines: detail.emojiLines, floors: detail.floors,
    text: detail.full,
  });

  // 下载：页面内 fetch → base64 → 落盘
  for (const u of detail.imgs) {
    imgSeq += 1;
    const nn = String(imgSeq).padStart(2, "0");
    const ext = (/\.(jpe?g)/i.test(u) ? "jpg" : /\.webp/i.test(u) ? "webp" : /\.gif/i.test(u) ? "gif" : "png");
    const name = "贴吧-" + c.tid.slice(-4) + "-" + nn + "." + ext;
    try {
      const b64 = await page.evaluate(async (src) => {
        try {
          const r = await fetch(src, { credentials: "include" });
          if (!r.ok) return "ERR:" + r.status;
          const ab = await r.arrayBuffer();
          let bin = "";
          const bytes = new Uint8Array(ab);
          const CH = 0x8000;
          for (let i = 0; i < bytes.length; i += CH) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + CH));
          return "OK:" + btoa(bin);
        } catch (e) { return "ERR:" + String(e).slice(0, 80); }
      }, u);
      if (typeof b64 === "string" && b64.startsWith("OK:")) {
        const buf = Buffer.from(b64.slice(3), "base64");
        await fs.writeFile(MORE + name, buf);
        rep.images.push({ file: MORE + name, src: u, bytes: buf.length });
      } else {
        rep.images.push({ file: null, src: u, err: String(b64).slice(0, 80) });
      }
    } catch (e) {
      rep.images.push({ file: null, src: u, err: String(e).slice(0, 80) });
    }
  }
  log.push("thread " + c.tid + " imgs=" + detail.imgs.length + " floors=" + detail.floors.length);
}

rep.log = log;
await fs.writeFile(OUT + "tieba-02.json", JSON.stringify(rep, null, 2), "utf8");
console.log(JSON.stringify({
  page_label: rep.page_label,
  list: rep.list && { blocked: rep.list.blocked, len: rep.list.len, thread_count: rep.list.thread_count, title: rep.list.title },
  search: rep.search && { blocked: rep.search.blocked, len: rep.search.len, thread_count: rep.search.thread_count, title: rep.search.title },
  candidates: cand.map((c) => ({ tid: c.tid, t: c.t, src: c.src })),
  threads: rep.threads.map((t) => ({ tid: t.tid, title: t.title, blocked: t.blocked, len: t.len, img_count: t.img_count, emoji: (t.emojiLines || []).length })),
  images: rep.images,
  log,
}, null, 2).slice(0, 6000));
