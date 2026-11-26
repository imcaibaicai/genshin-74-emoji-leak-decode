// tieba-01.mjs —— 只读：打开剑斗绮谭吧列表页，等安全验证自己过，导出正文与帖子链接
import fs from "node:fs/promises";

const OUT = "./out/";
const DIRS = [
  "assets/more/",
  "docs/",
  OUT,
];

async function connect(spaceId = 1) {
  const spaces = await listTaskSpaces();
  const entry = spaces.find((s) => s.id === spaceId) || (spaces && spaces[0]);
  if (!entry) throw new Error("找不到任何 space" + "，请确认 ego lite 已打开；spaces=" + JSON.stringify(spaces?.map?.((s) => s.id)));
  if (entry.ownership !== "user") return await taskSpace(entry.id);
  try {
    return await takeOverTaskSpace(entry.id);
  } catch (e) {
    return await claimTaskSpace(entry.id);
  }
}

const ts = await connect(1);
const page = ts?.page ?? ts;

for (const d of DIRS) await fs.mkdir(d, { recursive: true });

const URL_LIST = "https://tieba.baidu.com/f?kw=%E5%89%91%E6%96%97%E7%BB%AE%E8%B0%AD&ie=utf-8";
const rep = { step: "list", url_tried: URL_LIST };

try {
  try {
    await page.goto(URL_LIST, { waitUntil: "domcontentloaded", timeout: 45000 });
  } catch (e) {
    rep.goto_err = String(e).slice(0, 200);
  }
  // 给 JS 挑战留足时间，不点验证码
  await page.waitForTimeout(7000);

  rep.final_url = page.url();
  rep.title = await page.title().catch(() => "");
  const info = await page.evaluate(() => {
    const txt = document.body ? document.body.innerText || "" : "";
    const links = [...document.querySelectorAll('a[href*="/p/"]')].map((a) => ({
      t: (a.innerText || "").replace(/\s+/g, " ").trim().slice(0, 80),
      h: a.href,
    }));
    const uniq = [];
    const seen = new Set();
    for (const l of links) {
      const m = l.h.match(/\/p\/(\d+)/);
      if (!m) continue;
      if (seen.has(m[1])) continue;
      seen.add(m[1]);
      uniq.push({ tid: m[1], t: l.t, h: "https://tieba.baidu.com/p/" + m[1] });
    }
    return {
      len: txt.length,
      head: txt.slice(0, 1800),
      blocked: /安全验证|请输入验证码|网络不给力|百度安全/.test(txt),
      threads: uniq.slice(0, 80),
    };
  });

  rep.len = info.len;
  rep.blocked = info.blocked;
  rep.head = info.head;
  rep.thread_count = info.threads.length;
  rep.threads = info.threads;
  rep.ok = true;
} catch (e) {
  rep.ok = false;
  rep.err = String(e).slice(0, 400);
}

await fs.writeFile(OUT + "tieba-01.json", JSON.stringify(rep, null, 2), "utf8");
console.log(JSON.stringify({ ok: rep.ok, blocked: rep.blocked, title: rep.title, final_url: rep.final_url, len: rep.len, thread_count: rep.thread_count, err: rep.err, goto_err: rep.goto_err }));
console.log("---- HEAD ----");
console.log((rep.head || "").slice(0, 1200));
console.log("---- THREADS ----");
for (const t of rep.threads || []) console.log(t.tid + " | " + t.t);
