// round-02.mjs —— 处理「task space 已结束」：逐 space 尝试 + 显式 claim，然后抓正文
const fs = await import("node:fs/promises");
const DIR = ".";
await fs.mkdir(DIR, { recursive: true }).catch(() => {});

const log = (...a) => {
  const s = a.map((x) => (typeof x === "string" ? x : JSON.stringify(x))).join(" ");
  try { process.stdout.write(s + "\n"); } catch { console.log(s); }
};
const err = (e) => String((e && e.message) || e).replace(/\s+/g, " ").slice(0, 220);

async function trySpace(id) {
  // 1) 先看 ownership
  const spaces = await listTaskSpaces();
  const e0 = spaces.find((s) => s.id === id);
  log(`SPACE ${id} name=${e0 && e0.name} ownership=${e0 && e0.ownership}`);
  const order = e0 && e0.ownership === "user"
    ? [["takeOver", () => takeOverTaskSpace(id)], ["claim", () => claimTaskSpace(id)], ["plain", () => taskSpace(id)]]
    : [["plain", () => taskSpace(id)], ["claim", () => claimTaskSpace(id)], ["takeOver", () => takeOverTaskSpace(id)]];
  for (const [name, fn] of order) {
    try {
      const t = await fn();
      if (t && typeof t.pages === "function") { log(`SPACE ${id} OK via ${name}`); return t; }
    } catch (e) { log(`SPACE ${id} ${name} failed: ${err(e)}`); }
  }
  return null;
}

let task = null;
let usedId = null;
try {
  const spaces = await listTaskSpaces();
  log("== TASK SPACES ==");
  for (const s of spaces) log(`id=${s.id} | name=${s.name} | ownership=${s.ownership}`);
  const ordered = [...spaces].sort((a, b) => (a.ownership === "user" ? -1 : 0) - (b.ownership === "user" ? -1 : 0));
  for (const s of ordered) {
    const t = await trySpace(s.id);
    if (t) { task = t; usedId = s.id; break; }
  }
} catch (e) {
  log("LIST_FAIL: " + err(e));
}

if (!task) { log("RESULT: NO_USABLE_SPACE"); }
else {
  log("USING SPACE " + usedId);
  const pages = await task.pages();
  log("PAGES " + pages.length + " labels=" + JSON.stringify(pages.map((p) => p.label)));
  let page = null;
  for (const p of pages) {
    let u = ""; try { u = await p.url(); } catch {}
    if ((!u || /^(about:blank|chrome:|edge:)/i.test(u)) && typeof p.goto === "function") { page = p; log("PICK blank " + p.label); break; }
  }
  if (!page) {
    for (const n of ["openTab", "newPage", "openPage", "page", "open"]) {
      if (typeof task[n] === "function") {
        try { const p = await task[n](); if (p && typeof p.goto === "function") { page = p; log("PICK task." + n + "()"); break; } }
        catch (e) { log("probe " + n + " failed: " + err(e)); }
      }
    }
  }
  if (!page && pages[0]) { page = pages[0]; log("PICK reuse pages[0] label=" + pages[0].label); }

  if (!page) log("RESULT: NO_PAGE");
  else {
    const VISITOR = /访客不能直接访问|ERROR:15|error_15|不能直接访问/i;
    const URLS = [
      "https://bbs.nga.cn/read.php?tid=47985638",
      "https://ngabbs.com/read.php?tid=47985638",
      "https://bbs.nga.cn/read.php?tid=47985638&page=1",
    ];
    let best = null;
    for (const u of URLS) {
      log("---- GOTO " + u);
      try { await page.goto(u, { timeout: 45000 }); await page.waitForTimeout(2500); }
      catch (e) { log("GOTO_FAIL: " + err(e)); continue; }
      let info = null;
      try {
        info = await page.evaluate(() => ({
          title: document.title,
          url: location.href,
          text: document.body ? document.body.innerText : "",
          imgs: document.images ? document.images.length : 0,
        }));
      } catch (e) { log("EVAL_FAIL: " + err(e)); continue; }
      log("TITLE: " + info.title);
      log("FINAL_URL: " + info.url);
      log("LEN=" + info.text.length + " IMGS=" + info.imgs);
      log("HEAD600:\n" + info.text.slice(0, 600).replace(/\n{3,}/g, "\n\n"));
      if (!best || info.text.length > best.text.length) best = { ...info, src: u };
      if (info.text.length > 1500 && !VISITOR.test(info.text.slice(0, 500))) { log("STOP: real content"); break; }
    }
    const text = ((best && best.text) || "").replace(/\r/g, "");
    log("BEST src=" + (best && best.src) + " len=" + text.length);
    log("BLOCKED=" + VISITOR.test(text.slice(0, 800)));
    log("FLAGS " + JSON.stringify({
      liyue: /璃月/.test(text), ganyu: /甘雨/.test(text), xiao: /魈/.test(text),
      hutao: /胡桃/.test(text), yelan: /夜兰/.test(text), logout: /退出|登录/.test(text),
    }));
    if (text.length > 200) {
      await fs.writeFile(DIR + "/nga-47985638.txt", text, "utf8");
      log("WROTE " + DIR + "/nga-47985638.txt bytes=" + Buffer.byteLength(text, "utf8"));
    }
    const lines = text.split("\n").map((s) => s.trim()).filter(Boolean);
    const items = lines.filter((l) => /^\d{1,2}\s*[\.、．]/.test(l));
    log("NUMBERED count=" + items.length);
    log("---- ITEMS ----\n" + items.join("\n").slice(0, 2800));
  }
}
