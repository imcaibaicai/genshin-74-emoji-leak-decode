// neigui-01.mjs —— 只读：修标题提取，四个关键词组合搜贴吧，dump 全量文本待人工判读
import fs from "node:fs/promises";

const OUT = "./out/";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function connect() {
  const spaces = await listTaskSpaces();
  const entry = spaces && spaces[0];
  if (!entry) throw new Error("没有可用 task space");
  if (entry.ownership !== "user") return await taskSpace(entry.id);
  try { return await takeOverTaskSpace(entry.id); } catch { return await claimTaskSpace(entry.id); }
}

const ts = await connect();
await fs.mkdir(OUT, { recursive: true });
let page = (await ts.pages()).find((p) => /tieba|baidu/i.test((p && p.label) || ""));
if (!page) page = (await ts.pages())[0];
if (!page) throw new Error("拿不到 page 句柄");

const KW = /7\.4|7．4|璃月|加强|爆料|内鬼|emoji|表情/i;

function extract() {
  const anchors = [];
  for (const a of document.querySelectorAll('a[href*="/p/"]')) {
    const m = (a.href || "").match(/\/p\/(\d+)/);
    if (!m) continue;
    const box = a.closest("li,div,table,tr");
    const t = (box ? box.innerText || "" : a.textContent || "").replace(/\s+/g, " ").trim();
    anchors.push({ tid: m[1], t: t.slice(0, 160), raw: (a.textContent || "").replace(/\s+/g, " ").trim().slice(0, 60) });
  }
  const map = new Map();
  for (const x of anchors) {
    const old = map.get(x.tid);
    if (!old || (x.t || "").length > (old.t || "").length) map.set(x.tid, x);
  }
  const first = document.querySelector(".s_post, .s_post_list, .result, #content_left");
  const txt = document.body ? document.body.innerText || "" : "";
  return {
    url: location.href, title: document.title, len: txt.length,
    blocked: /安全验证|请输入验证码/.test(txt),
    anchors: [...map.values()],
    html: (first ? first.outerHTML : "").slice(0, 2500),
    text: txt.slice(0, 9000),
  };
}

async function grab(url, waitMs) {
  try { await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 }); } catch (e) {}
  await sleep(waitMs);
  return await page.evaluate(extract);
}

const BASE = "https://tieba.baidu.com/f/search/res?ie=utf-8&qw=";
const BARKW = "&kw=" + encodeURIComponent("原神内鬼吧");
const queries = [
  { id: "q1", url: BASE + encodeURIComponent("7.4 璃月 加强") + BARKW },
  { id: "q2", url: BASE + encodeURIComponent("7.4 加强 内鬼") },
  { id: "q3", url: BASE + encodeURIComponent("璃月 加强 爆料") },
  { id: "q4", url: BASE + encodeURIComponent("原神 7.4 璃月 加强") },
];

const steps = [];
const allHits = [];
const seen = new Set();
for (const q of queries) {
  let S = null;
  try { S = await grab(q.url, 8500); } catch (e) { steps.push({ id: q.id, url: q.url, err: String(e).slice(0, 200) }); continue; }
  const hits = (S.anchors || []).filter((x) => KW.test(x.t));
  for (const h of hits) h.q = q.id;
  steps.push({ id: q.id, url: q.url, title: S.title, len: S.len, blocked: S.blocked, nA: (S.anchors || []).length, nHit: hits.length });
  await fs.writeFile(OUT + "neigui-01-" + q.id + ".txt", S.text + "\n\n=== HTML ===\n" + S.html, "utf8");
  for (const h of hits) if (!seen.has(h.tid)) { seen.add(h.tid); allHits.push(h); }
  if (q.id === "q1") steps[steps.length - 1].html = (S.html || "").slice(0, 800);
  console.log("[" + q.id + "] n=" + (S.anchors || []).length + " hit=" + hits.length + " blocked=" + S.blocked);
  for (const h of hits.slice(0, 8)) console.log("   " + h.tid + " | " + h.t);
}

await fs.writeFile(OUT + "neigui-01.json", JSON.stringify({ steps, hits: allHits }, null, 2), "utf8");
console.log("=== TOTAL HITS " + allHits.length + " ===");
console.log(JSON.stringify({ steps, hits: allHits }, null, 2).slice(0, 4000));
