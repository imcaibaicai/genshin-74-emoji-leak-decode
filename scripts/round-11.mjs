// round-11.mjs —— tid=47985638 末页与中间页找编号条目。只读：goto / waitForTimeout / evaluate。
const fs = await import("node:fs/promises");
const DIR = ".";
const log = (...a) => {
  const s = a.map((x) => (typeof x === "string" ? x : JSON.stringify(x))).join(" ");
  try { process.stdout.write(s + "\n"); } catch { console.log(s); }
};

// ---- 接管 task space（三种情况全覆盖）----
let task = null;
const spaces = await listTaskSpaces();
// 优先挑已经有 NGA 标签页的 space
for (const s of spaces) {
  try {
    const t = await taskSpace(s.id);
    const ps = await t.pages();
    let ok = false;
    for (const p of ps) { let u = ""; try { u = await p.url(); } catch {} if (/ngabbs\.com|bbs\.nga\.cn/.test(u)) { ok = true; break; } }
    if (ok) { task = t; log("SPACE " + s.id + " (已有NGA页)"); break; }
  } catch (e) { log("space " + s.id + " taskSpace失败: " + String(e.message || e).slice(0, 80)); }
}
if (!task) {
  const s = spaces[0];
  try { task = await taskSpace(s.id); log("SPACE " + s.id + " (直接)"); }
  catch (e) {
    log("taskSpace失败: " + String(e.message || e).slice(0, 120));
    try { task = await takeOverTaskSpace(s.id); log("SPACE " + s.id + " (takeOver)"); }
    catch (e2) {
      log("takeOver失败: " + String(e2.message || e2).slice(0, 120));
      task = await claimTaskSpace(s.id); log("SPACE " + s.id + " (claim)");
    }
  }
}

// ---- 找页面：复用已有 NGA 标签页，绝不新开、绝不关闭 ----
const pages = await task.pages();
let page = null;
for (const p of pages) { let u = ""; try { u = await p.url(); } catch {} if (/ngabbs\.com|bbs\.nga\.cn/.test(u)) { page = p; break; } }
if (!page) {
  for (const p of pages) { let u = ""; try { u = await p.url(); } catch {} if (/^https?:/.test(u)) { page = p; break; } }
}
if (!page) page = pages[0];
log("PAGE " + page.label + " 现有标签页=" + pages.length);

const TID = "47985638";
const TARGETS = [
  { label: "e", url: `https://ngabbs.com/read.php?tid=${TID}&page=e` },
  { label: "2", url: `https://ngabbs.com/read.php?tid=${TID}&page=2` },
  { label: "3", url: `https://ngabbs.com/read.php?tid=${TID}&page=3` },
];

const LIMIT_RE = /访问过于频繁|请求过于频繁|访问太快|稍后再试|操作过于频繁|请稍后重试|您的访问/i;
const results = [];
let hit = null;

for (let i = 0; i < TARGETS.length; i++) {
  const t = TARGETS[i];
  if (i > 0) { log("WAIT 25000ms 再走下一页"); await page.waitForTimeout(25000); }
  log("---- VISIT[" + (i + 1) + "/3] " + t.url);
  let gotoErr = "";
  try { await page.goto(t.url, { timeout: 45000 }); } catch (e) { gotoErr = String(e.message || e).slice(0, 140); log("GOTO_FAIL " + gotoErr); continue; }
  await page.waitForTimeout(3000);
  // 滚动补懒加载（只读操作）
  for (let k = 0; k < 3; k++) {
    try { await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); } catch {}
    await page.waitForTimeout(900);
  }
  const d = await page.evaluate(() => ({ title: document.title, url: location.href, text: document.body.innerText }));
  const txt = (d.text || "").replace(/\r/g, "");
  const lines = txt.split("\n").map((s) => s.trim()).filter(Boolean);
  const items = lines.filter((l) => /^\d{1,2}\s*[\.、．]/.test(l) && l.length > 4);
  const hasItem = items.length >= 2;
  const hasLiyue = /璃月角色/.test(txt) && /(两名|三名)/.test(txt);
  const hasDmg = /(Z和Q|重击)/.test(txt) && /伤害变为原来/.test(txt);
  const limited = txt.length < 300 || LIMIT_RE.test(txt);
  const rec = {
    page: t.label, url: t.url, finalUrl: d.url, title: d.title,
    len: txt.length, bytes: Buffer.byteLength(txt, "utf8"),
    itemCount: items.length, hasItem, hasLiyue, hasDmg, limited, gotoErr,
  };
  log(`  TITLE=${(d.title || "").slice(0, 50)} LEN=${txt.length} BYTES=${rec.bytes} ITEMS=${items.length} LIYUE=${hasLiyue} DMG=${hasDmg} LIMITED=${limited}`);
  log(`  HEAD=${txt.replace(/\n/g, " / ").slice(0, 180)}`);

  // 原始存档：每页单独一份，便于证据核对
  await fs.writeFile(`${DIR}/nga-${TID}-p${t.label}.txt`, txt, "utf8");
  rec.file = `${DIR}/nga-${TID}-p${t.label}.txt`;

  if (hasItem || hasLiyue || hasDmg) {
    hit = { ...rec, txt, items };
    results.push(rec);
    log("  HIT on page=" + t.label);
    await fs.writeFile(`${DIR}/nga-${TID}-page-e.txt`, txt, "utf8");
    log("  WROTE " + `${DIR}/nga-${TID}-page-e.txt` + " bytes=" + rec.bytes);
    log("---- ITEMS(" + items.length + ") ----\n" + items.join("\n").slice(0, 4000));
    if (hasLiyue || hasDmg) {
      const around = lines.filter((l) => /璃月|伤害变为原来|Z和Q|重击|两名|三名|胡桃/.test(l)).slice(0, 30);
      log("---- SEG ----\n" + around.join("\n").slice(0, 3000));
    }
    break;
  }
  results.push(rec);
  if (limited) { log("  STOP: 疑似限流，按约束立刻停止"); break; }
}

log("RESULT_JSON " + JSON.stringify(results));
log("HIT_PAGE " + (hit ? hit.page : "NONE"));
