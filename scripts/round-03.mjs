// round-03.mjs —— 补全 tid=47985638 正文、抓帖内链接、检索定位真正的 7.4 璃月爆料帖
const fs = await import("node:fs/promises");
const DIR = ".";
const log = (...a) => {
  const s = a.map((x) => (typeof x === "string" ? x : JSON.stringify(x))).join(" ");
  try { process.stdout.write(s + "\n"); } catch { console.log(s); }
};

const spaces = await listTaskSpaces();
const task = await taskSpace(spaces[0].id);
const pages = await task.pages();
let page = null;
for (const p of pages) {
  let u = ""; try { u = await p.url(); } catch {}
  if (/ngabbs\.com|bbs\.nga\.cn/.test(u)) { page = p; break; }
}
if (!page) {
  for (const n of ["openTab", "newPage", "openPage", "page"]) {
    if (typeof task[n] === "function") { try { const p = await task[n](); if (p && p.goto) { page = p; break; } } catch (e) { log("probe " + n + ": " + String(e.message || e).slice(0, 100)); } }
  }
}
if (!page) page = pages[0];
log("PAGE " + page.label);

const THREAD = "https://ngabbs.com/read.php?tid=47985638";

// 1) 回原帖，滚动到底把懒加载内容补全，并抓所有 tid 链接
await page.goto(THREAD, { timeout: 45000 });
await page.waitForTimeout(2500);
for (let i = 0; i < 4; i++) {
  try { await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); } catch {}
  await page.waitForTimeout(900);
}
const full = await page.evaluate(() => ({
  len: document.body.innerText.length,
  text: document.body.innerText,
  links: [...document.querySelectorAll('a[href*="tid="]')].map((a) => ({
    tid: (a.href.match(/tid=(\d+)/) || [])[1] || "",
    t: (a.textContent || "").replace(/\s+/g, " ").trim().slice(0, 60),
  })).filter((x) => x.tid),
}));
log("THREAD_SCROLLED len=" + full.len);
const uniq = new Map();
for (const l of full.links) if (l.tid !== "47985638" && !uniq.has(l.tid)) uniq.set(l.tid, l.t);
log("OTHER_TIDS " + uniq.size);
let k = 0;
for (const [tid, t] of uniq) { if (k++ > 24) break; log(`  ${tid} | ${t}`); }

// 2) 检索：璃月 / 爆料 / 7.4
const SEARCH = [
  "https://bbs.nga.cn/thread.php?key=%E7%92%83%E6%9C%88%E5%8A%A0%E5%BC%BA&fid=-1",
  "https://bbs.nga.cn/thread.php?key=%E7%92%83%E6%9C%88&fid=-1",
  "https://ngabbs.com/thread.php?key=%E7%92%83%E6%9C%88&fid=-1",
];
const cands = new Map();
for (const u of SEARCH) {
  log("---- SEARCH " + u);
  try { await page.goto(u, { timeout: 45000 }); await page.waitForTimeout(2000); }
  catch (e) { log("SEARCH_FAIL " + String(e.message || e).slice(0, 140)); continue; }
  const r = await page.evaluate(() => ({
    title: document.title,
    len: document.body.innerText.length,
    head: document.body.innerText.slice(0, 300),
    rows: [...document.querySelectorAll('a[href*="tid="]')].map((a) => ({
      tid: (a.href.match(/tid=(\d+)/) || [])[1] || "",
      t: (a.textContent || "").replace(/\s+/g, " ").trim(),
    })).filter((x) => x.tid && x.t.length > 6),
  }));
  log("SEARCH_TITLE " + r.title + " LEN=" + r.len);
  log("SEARCH_HEAD " + r.head.replace(/\n/g, " / ").slice(0, 260));
  for (const x of r.rows) {
    if (/璃月|爆料|7\.4|甘雨|胡桃|加强/.test(x.t) && !cands.has(x.tid)) {
      cands.set(x.tid, x.t);
      log(`  HIT ${x.tid} | ${x.t.slice(0, 70)}`);
    }
  }
  if (cands.size) break;
}
if (!cands.size) {
  // 帖内链接里找候选
  for (const [tid, t] of uniq) if (/璃月|爆料|7\.4|甘雨|加强/.test(t)) cands.set(tid, t);
}
log("CANDIDATES " + cands.size);

// 3) 逐个开候选，找带编号条目 + 璃月的正文
let best = null;
for (const [tid, t] of cands) {
  const u = "https://ngabbs.com/read.php?tid=" + tid;
  log("---- OPEN " + u + " | " + t.slice(0, 50));
  try { await page.goto(u, { timeout: 45000 }); await page.waitForTimeout(2200); }
  catch (e) { log("OPEN_FAIL " + String(e.message || e).slice(0, 120)); continue; }
  for (let i = 0; i < 3; i++) {
    try { await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); } catch {}
    await page.waitForTimeout(700);
  }
  const d = await page.evaluate(() => ({ title: document.title, len: document.body.innerText.length, text: document.body.innerText }));
  const hasItem = /(^|\n)\s*1\s*[\.、．]\s*\S/.test(d.text) && /璃月/.test(d.text);
  log(`  TITLE=${d.title.slice(0, 60)} LEN=${d.len} LIYUE=${/璃月/.test(d.text)} ITEM10=${/(^|\n)\s*10\s*[\.、．]/.test(d.text)}`);
  if (hasItem && (!best || d.len > best.len)) best = { ...d, tid, url: u };
  if (hasItem && /10\s*[\.、．]/.test(d.text)) break;
}

if (best) {
  log("BEST tid=" + best.tid + " len=" + best.len + " title=" + best.title);
  await fs.writeFile(DIR + "/nga-47985638.txt", best.text.replace(/\r/g, ""), "utf8");
  const txt = best.text.replace(/\r/g, "");
  log("WROTE bytes=" + Buffer.byteLength(txt, "utf8"));
  const lines = txt.split("\n").map((s) => s.trim()).filter(Boolean);
  const items = lines.filter((l) => /^\d{1,2}\s*[\.、．]/.test(l) && l.length > 6);
  log("NUMBERED count=" + items.length);
  log("---- ITEMS ----\n" + items.join("\n").slice(0, 3000));
} else {
  log("RESULT: NO_ITEM_THREAD_FOUND");
  const d = await page.evaluate(() => ({ title: document.title, text: document.body.innerText.slice(0, 400) }));
  log("LAST " + d.title + " :: " + d.text.replace(/\n/g, " / ").slice(0, 350));
}
