// round-01.mjs —— NGA tid=47985638 探路（只读：goto / waitForTimeout / evaluate）
const fs = await import("node:fs/promises");
const DIR = ".";
await fs.mkdir(DIR, { recursive: true }).catch(() => {});

const log = (...a) =>
  console.log(a.map((x) => (typeof x === "string" ? x : JSON.stringify(x))).join(" "));

async function connect(id) {
  const spaces = await listTaskSpaces();
  const entry = spaces.find((s) => s.id === id) || spaces[0];
  if (!entry) throw new Error("no task space available");
  if (entry.ownership !== "user") return await taskSpace(entry.id);
  try {
    return await takeOverTaskSpace(entry.id);
  } catch (e) {
    log("takeOver failed: " + String(e.message || e).slice(0, 160));
    return await claimTaskSpace(entry.id);
  }
}

function isBlank(u) {
  return !u || /^(about:blank|chrome:\/\/newtab|edge:\/\/newtab|chrome:newtab)/i.test(u);
}

async function acquirePage(task) {
  const pages = await task.pages();
  for (const p of pages) {
    let u = "";
    try { u = await p.url(); } catch {}
    if (isBlank(u) && typeof p.goto === "function") { log("USE blank page: " + p.label); return p; }
  }
  for (const name of ["openTab", "newPage", "openPage", "page", "open"]) {
    if (typeof task[name] === "function") {
      try {
        const p = await task[name]();
        if (p && typeof p.goto === "function") { log("USE task." + name + "()"); return p; }
      } catch (e) { log("probe task." + name + " failed: " + String(e.message || e).slice(0, 120)); }
    }
  }
  log("FALLBACK reuse pages[0] (label=" + (pages[0] && pages[0].label) + ")");
  return pages[0];
}

const spaces = await listTaskSpaces();
log("== TASK SPACES ==");
for (const s of spaces) log(`id=${s.id} | name=${s.name} | ownership=${s.ownership}`);

const pick = spaces.find((s) => s.ownership === "user") || spaces[0];
log("PICK " + JSON.stringify({ id: pick.id, name: pick.name, ownership: pick.ownership }));

const task = await connect(pick.id);
const page = await acquirePage(task);

const VISITOR = /访客不能直接访问|ERROR:15|error_15|需要登录/i;
const URLS = [
  "https://bbs.nga.cn/read.php?tid=47985638",
  "https://ngabbs.com/read.php?tid=47985638",
  "https://bbs.nga.cn/read.php?tid=47985638&page=1",
];

let best = null;
for (const u of URLS) {
  log("---- GOTO " + u);
  try {
    await page.goto(u, { timeout: 45000 });
    await page.waitForTimeout(2500);
  } catch (e) {
    log("GOTO_FAIL: " + String(e.message || e).slice(0, 200));
    continue;
  }
  let info = null;
  try {
    info = await page.evaluate(() => ({
      title: document.title,
      url: location.href,
      text: document.body ? document.body.innerText : "",
      imgs: document.images ? document.images.length : 0,
      hasLogin: /\u9000\u51fa|\u767b\u5f55|\u6d88\u606f|\u5e16\u5b50/.test(document.body ? document.body.innerText : ""),
    }));
  } catch (e) {
    log("EVAL_FAIL: " + String(e.message || e).slice(0, 200));
    continue;
  }
  log("TITLE: " + info.title);
  log("FINAL_URL: " + info.url);
  log("LEN=" + info.text.length + " IMGS=" + info.imgs);
  log("HEAD600:\n" + info.text.slice(0, 600).replace(/\n{3,}/g, "\n\n"));
  if (!best || info.text.length > best.text.length) best = { ...info, src: u };
  if (info.text.length > 1500 && !VISITOR.test(info.text.slice(0, 500))) { log("STOP: looks like real content"); break; }
}

const text = ((best && best.text) || "").replace(/\r/g, "");
log("---- BEST src=" + (best && best.src) + " len=" + text.length);
log("VISITOR_BLOCK=" + VISITOR.test(text.slice(0, 800)));
log("HAS_LIYUE=" + /\u7483\u6708/.test(text) + " HAS_GANYU=" + /\u7518\u96e8/.test(text) + " HAS_XIAO=" + /\u9b48/.test(text) + " HAS_HUTAO=" + /\u80e1\u6843/.test(text) + " HAS_YELAN=" + /\u591c\u5170/.test(text));

if (text.length > 200) {
  await fs.writeFile(DIR + "/nga-47985638.txt", text, "utf8");
  log("WROTE " + DIR + "/nga-47985638.txt bytes=" + Buffer.byteLength(text, "utf8"));
}

// 抽出编号条目
const lines = text.split("\n").map((s) => s.trim()).filter(Boolean);
const items = lines.filter((l) => /^\d{1,2}\s*[\.、．]/.test(l));
log("---- NUMBERED LINES count=" + items.length);
let acc = "";
for (const l of items) {
  if (acc.length > 2600) break;
  acc += l + "\n";
}
log("---- ITEMS ----\n" + acc.slice(0, 2600));
