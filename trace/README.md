# 一次多层级智能体协作的原始流水 · 完整对话流水

## 1. 这是什么

这是一次实际发生过的多层级智能体协作的**原始对话流水**，不是事后写的总结。主会话里的一个智能体将任务拆成若干块，分别下派给子代理，其中一层负责人又继续往下派执行层。这里保存的是每一步的原始事件：用户原话、调度台的可见输出、每一次工具调用与结果、子代理的回报。

为什么原样公开比总结更有说服力：总结是写完之后的重构，读者无法判断哪些结论是真跑出来的、哪些是后来“顺理成章”的；原始流水把拆分、派活、跑偏、被打回、重新派活这些过程都留在里面，含失败和返工。它的价值不在结论精彩，在于可复核。

本仓库不包含任何模型权重、提示词工程或代码，只有这次协作的记录本身。

## 2. 怎么读

1. 先读 [`main.md`](main.md)。它是主线：从用户第一句话开始，一路到任务收尾，中间发生的每一次工具调用和每一条子代理回报都在里面。
2. 然后打开 [`index.json`](index.json)，按序号挑子代理读。`agents/` 下每个文件就是一支下线的完整流水，文件名带两位序号和短名。
3. 主会话里标注的「子代理回报」是各路成果的汇入口：想看某一块结果是从哪来的，先在主线找回报，再去对应的 `agents/` 文件里看它是怎么做出来的。

`raw/` 下是每个会话经过筛选后的事件，每行一个 JSON，不做美化，供需要自己写脚本重新统计的人使用。

阅读顺序建议：先看一个回合里调度台怎么拆任务，再看 `🔧` 那一行带的参数摘要和随后的工具结果，你就能看出它在哪一步确认了什么事实、在哪一步被数据推翻。

## 3. 删改原则

为了让它能被读，对原始数据做了以下处理。每一条都写在这里，读者可以自行判断哪些东西被动过：

1. **剥除了消息事件内部的推理字段**。模型的思考过程不属于对外内容，只保留它对外说出来的那部分（「调度台」标题下的文字）。做法不是删掉某一类推理事件，而是在 `raw/*.jsonl` 的 `assistant/message` 事件内部按字段剥除四处载体：`stream` 里 `type` 为 `reasoning-chunks` 的正文分片；`chunk.blockType` 为 `reasoning` 的块起止标记；`chunk.block.type` 为 `reasoning` 的整段正文（`block-end` 项里存着全文）；`replayState.blocks` 中 `type` 为 `reasoning` 的条目（其 `thinkingSignature` 里同样存着推理摘要）。剥除后块序号重排为连续编号；对外可见文本除脱敏替换外一字未改。因此你会看到“说了一句就直接调工具”的错觉，那是因为中间的推理被拿掉了。
2. **删除了插件转换事件与步骤事件**。这些只是运行机制的吵音（每一步的起止、翻译插件的请求与回包、系统插入的上下文块）。技术上它们占了一半以上的事件数，但不影响任何一个结论。
3. **工具结果截断到 1200 字符、工具参数截断到 600 字符**。原文体量过大（单个会话就有一万多行工具输出），截断处标注了原文字符数。被截掉的多数是长文本读取结果和层叠的列目输出，不含判断。
4. **记忆注入块被替换成一行占位**。主会话开头附带的「〔记忆召回·自动〕」是系统自动检索历史记忆后灌进去的，不是用户说的话，也不是模型写的。同样因为接入机制带进来的工作区约束与技能目录块也被整块去掉。
5. **脱敏**。本机绝对路径改写为仓库内相对路径或 `./`；本机用户名改写为「用户」；他人的账号标识改写为「某用户」；凭据与密钥相关字样全部去除。`raw/` 里的文本分片与工具参数分片按同一套规则处理——早期版本只脱敏了对外可见文本，`stream` 分片通道被漏掉，这一版补齐。会话 id 保留，因为它是本次协作内部的编号，无法用来定位到人。
6. **用户原话一字未改**，包括错别字与简写（比如把“类似于”写成 `~`、把“相当于”写成 `=`）。子代理、工具输出的文字同样只做截断与脱敏，不改语句。唯一例外是脱敏替换本身。
7. **外部链接已置为相对路径，这是有意为之，不是坏链**。正文里原本指向站外页面的超链接，已统一改写为仓库内相对路径或 `./`，因此读者点过去遇到空地址属正常现象，不要误以为抓取或导出出错。需要回溯某条结论的原始来源，请查本仓库 `docs/` 下对应的取证报告，那里保留了检索式、抓取时间与原文摘录。

## 4. 血缘树

下面是主线加全部支线的层级关系。缩进表示上下级：

- **主会话（总控）** — 33 回合、484 条事件 → [main.md](main.md)
  - `lexicon-scout`（解码爆料 emoji 符号表） — 1 回合、25 条事件 → [agents/01-lexicon-scout.md](agents/01-lexicon-scout.md)
  - `precedent-scout`（调研老角色加强先例） — 1 回合、28 条事件 → [agents/02-precedent-scout.md](agents/02-precedent-scout.md)
  - `newmech-scout`（攻新机制类符号语义） — 1 回合、25 条事件 → [agents/03-newmech-scout.md](agents/03-newmech-scout.md)
  - `leakstyle-scout`（找同款emoji爆料译稿） — 1 回合、33 条事件 → [agents/04-leakstyle-scout.md](agents/04-leakstyle-scout.md)
  - `baseline-scout`（抽四人数值基线） — 1 回合、19 条事件 → [agents/05-baseline-scout.md](agents/05-baseline-scout.md)
  - `system62-scout`（攻6.2魔导系统逐条细则） — 1 回合、31 条事件 → [agents/06-system62-scout.md](agents/06-system62-scout.md)
  - `tieba-hunt`（追贴吧原帖与同批他图） — 1 回合、35 条事件 → [agents/07-tieba-hunt.md](agents/07-tieba-hunt.md)
  - `baseline-b`（抽胡桃夜兰数值基线） — 1 回合、40 条事件 → [agents/08-baseline-b.md](agents/08-baseline-b.md)
  - `baseline-a`（抽甘雨魈数值基线） — 1 回合、36 条事件 → [agents/09-baseline-a.md](agents/09-baseline-a.md)
  - `line-ganyu`（甘雨线：解码与数值推演） — 1 回合、151 条事件 → [agents/10-line-ganyu.md](agents/10-line-ganyu.md)
    - `g-scout-baseline`（甘雨数值基线取证） — 1 回合、45 条事件 → [agents/11-g-scout-baseline.md](agents/11-g-scout-baseline.md)
      - `g-panel`（核甘雨面板与蓄力） — 1 回合、23 条事件 → [agents/12-g-panel.md](agents/12-g-panel.md)
    - `g-scout-c35`（6.2 蒙德批 c3c5 处置） — 1 回合、31 条事件 → [agents/13-g-scout-c35.md](agents/13-g-scout-c35.md)
    - `g-scout-positioning`（甘雨配队配装与档位） — 1 回合、24 条事件 → [agents/14-g-scout-positioning.md](agents/14-g-scout-positioning.md)
    - `g-writer`（撰写甘雨解码交付文件） — 2 回合、98 条事件 → [agents/15-g-writer.md](agents/15-g-writer.md)
  - `line-hutao`（胡桃线：解码与数值推演） — 1 回合、139 条事件 → [agents/16-line-hutao.md](agents/16-line-hutao.md)
    - `scout-da-quan`（查证「大权」语义） — 1 回合、23 条事件 → [agents/17-scout-da-quan.md](agents/17-scout-da-quan.md)
    - `scout-baseline`（核胡桃数值与命座原文） — 1 回合、37 条事件 → [agents/18-scout-baseline.md](agents/18-scout-baseline.md)
    - `scout-context`（提炼既有口径与可信度链） — 1 回合、28 条事件 → [agents/19-scout-context.md](agents/19-scout-context.md)
    - `writer-hutao-json`（写 chars/hutao.json） — 3 回合、60 条事件 → [agents/20-writer-hutao-json.md](agents/20-writer-hutao-json.md)
    - `writer-hutao-md`（写 chars/hutao.md） — 2 回合、48 条事件 → [agents/21-writer-hutao-md.md](agents/21-writer-hutao-md.md)
  - `line-xiao`（魈线：解码与数值推演） — 1 回合、129 条事件 → [agents/22-line-xiao.md](agents/22-line-xiao.md)
    - `scout-xiao-baseline`（核验魈数值基线） — 1 回合、25 条事件 → [agents/23-scout-xiao-baseline.md](agents/23-scout-xiao-baseline.md)
    - `writer-md`（写 chars/xiao.md） — 2 回合、87 条事件 → [agents/24-writer-md.md](agents/24-writer-md.md)
    - `writer-json`（写 chars/xiao.json） — 1 回合、34 条事件 → [agents/25-writer-json.md](agents/25-writer-json.md)
  - `line-yelan`（夜兰线：解码与数值推演） — 1 回合、106 条事件 → [agents/26-line-yelan.md](agents/26-line-yelan.md)
    - `scout-yelan-baseline`（夜兰真实数值基线取证） — 1 回合、32 条事件 → [agents/27-scout-yelan-baseline.md](agents/27-scout-yelan-baseline.md)
    - `scout-yelan-mech`（夜兰机制自洽性检验） — 1 回合、20 条事件 → [agents/28-scout-yelan-mech.md](agents/28-scout-yelan-mech.md)
    - `writer-yelan`（写夜兰 md 与 json 交付物） — 2 回合、40 条事件 → [agents/29-writer-yelan.md](agents/29-writer-yelan.md)
  - `reddit-tg-hunt`（改道Reddit与TG找同批图） — 1 回合、36 条事件 → [agents/30-reddit-tg-hunt.md](agents/30-reddit-tg-hunt.md)
  - `textver-scout`（追文字版爆料原文） — 1 回合、30 条事件 → [agents/31-textver-scout.md](agents/31-textver-scout.md)
  - `compiler`（合成总报告与横向表） — 1 回合、107 条事件 → [agents/32-compiler.md](agents/32-compiler.md)
  - `star-sys-scout`（攻星烁体系与加强写法） — 1 回合、27 条事件 → [agents/33-star-sys-scout.md](agents/33-star-sys-scout.md)
  - `oracle-scout`（攻🔮与巴比洛斯线索） — 1 回合、23 条事件 → [agents/34-oracle-scout.md](agents/34-oracle-scout.md)
  - `verify-scout`（核胡桃夜兰两处疑点） — 1 回合、24 条事件 → [agents/35-verify-scout.md](agents/35-verify-scout.md)
  - `stardiff-scout`（攻星扩散机制与7.4名单） — 1 回合、37 条事件 → [agents/36-stardiff-scout.md](agents/36-stardiff-scout.md)
  - `backfill`（补写两份缺的报告） — 1 回合、44 条事件 → [agents/37-backfill.md](agents/37-backfill.md)
  - `feather-scout`（申鹤羽毛区机制全解） — 1 回合、26 条事件 → [agents/38-feather-scout.md](agents/38-feather-scout.md)
  - `reaction-scout`（星扩散剧变反应伤害结构） — 1 回合、29 条事件 → [agents/39-reaction-scout.md](agents/39-reaction-scout.md)
  - `ladder-scout`（梯子符号发散专攻） — 1 回合、29 条事件 → [agents/40-ladder-scout.md](agents/40-ladder-scout.md)
  - `debunk-scout`（核夜兰加强辟谣真伪） — 1 回合、42 条事件 → [agents/41-debunk-scout.md](agents/41-debunk-scout.md)
  - `ladder-write`（落盘梯子发散报告） — 1 回合、30 条事件 → [agents/42-ladder-write.md](agents/42-ladder-write.md)
  - `final-writer`（写v5修订与终局判定） — 1 回合、27 条事件 → [agents/43-final-writer.md](agents/43-final-writer.md)
  - `nga-fetch`（用ego-lite抓NGA原文） — 1 回合、47 条事件 → [agents/44-nga-fetch.md](agents/44-nga-fetch.md)
  - `nga-page-e`（抓NGA帖末页找编号条目） — 1 回合、32 条事件 → [agents/45-nga-page-e.md](agents/45-nga-page-e.md)
  - `errata-writer`（写来源勘误补记） — 1 回合、27 条事件 → [agents/46-errata-writer.md](agents/46-errata-writer.md)
  - `tieba-ego`（用ego-lite翻贴吧原帖） — 1 回合、44 条事件 → [agents/47-tieba-ego.md](agents/47-tieba-ego.md)
  - `neigui-tieba`（内鬼吧抓7.4爆料图） — 1 回合、46 条事件 → [agents/48-neigui-tieba.md](agents/48-neigui-tieba.md)
  - `packager`（打包脱敏成可开源仓库） — 2 回合、77 条事件 → [agents/49-packager.md](agents/49-packager.md)
  - `case-study`（写调度统筹模式复盘） — 1 回合、63 条事件 → [agents/50-case-study.md](agents/50-case-study.md)
  - `release-fixer`（修补开源目录三处问题） — 1 回合、76 条事件 → [agents/51-release-fixer.md](agents/51-release-fixer.md)
  - `release-finisher`（并入复盘文档并收尾） — 1 回合、63 条事件 → [agents/52-release-finisher.md](agents/52-release-finisher.md)
  - `trace-export`（导出主会话与子代理流水） — 1 回合、48 条事件 → [agents/53-trace-export.md](agents/53-trace-export.md)

共 54 个会话（一个主会话 + 53 支子代理会话）。子代理的名字与会话 id 的对应关系提取自主会话的子代理目录事件，不是人工边的。

## 5. 这份流水的规模

| 项 | 数量 |
| --- | --- |
| 会话数 | 54 |
| 原始事件总数 | 6089 |
| 保留并展开的事件 | 2970 |
| 工具调用次数 | 798 |
| 回合数 | 93 |
| 主会话事件 / 回合 | 1039 / 33 |
| 子代理文件 | 53 |
| 目录总字节 | 15,671,659（约 14.9 MiB） |

原始数据是按帧压缩的 zstd，一个文件里有成百上千个独立帧；本目录里的 `raw/` 已经是拆开并逐行解析后的结果。

## 6. 合规与边界

- 流水里出现的第三方内容（帖子原文、图片链接、游戏数据的转述）**版权不属于本仓库**，引用仅为存证什么样的输入会产生这样的输出；需要使用请去找原出处。
- 本目录**不含任何凭据**：无账号、无密钥、无 `token`，无本机用户名与绝对路径。
- 模型内部的推理过程不属于对外内容，已按字段从消息事件里剥除（见第 3 节第 1 条）；保留的是对外可见的输出与工具调用。
- 流水中的引用形式与格式标记（引用块、工具行）本仓库自行定义，不代表任何对外规范。


补充说明：主会话里除了用户原话，还有两类由运行时注入的消息。一类是系统提醒（例如工具调用后提醒更新任务清单），流水里标注为「系统提醒」，不算用户说的话；一类是子代理完成通知（原文以 Background subagent … finished 开头的英文），标注为「子代理回报 · 名字」并完整保留，那是各路成果的汇入口。
