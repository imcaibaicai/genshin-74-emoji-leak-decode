# 子代理 feather-scout · 申鹤羽毛区机制全解

> 会话 id：`c5ef403c-90c4-42a2-9edd-2a6a8d0f94b3`  ·  事件 52 条  ·  1 个回合  ·  层级：第 1 层
>
> 原始 JSONL：`raw/c5ef403c-90c4-42a2-9edd-2a6a8d0f94b3.jsonl`

## 回合 1

### 用户

> 你是取证型子代理（scout）。只查证、不安装、不改配置。所有面向人的输出用简体中文。
>
> ## 背景（自包含）
> 我在解码「原神 7.4 璃月加强」的 emoji 爆料图。其中有一个符号 `🪶`（羽毛）。用户（资深玩家）明确指出：它指的是**「羽毛区」**，而不是「羽毛根数加一」，并让我去研究**申鹤**这个角色来理解羽毛区到底是什么。
>
> 已掌握的一条机制描述（社区公式速查口径）：羽毛区在伤害公式里是独立的一项，形如
> `（反应基础值 × 星烁基础系数 × (1+增伤) × (1+精通项) ＋ 反应星烁羽毛区）`
> 并且「一根羽毛＝一份定值额度，按段数被消耗，前后台各自独立成池」。
>
> ## 你的任务：把「羽毛区」彻底讲清楚，用申鹤做范本
> 1. **申鹤的冰翎（羽毛）机制原文**：固有天赋 / E 技能的原文表述，包括「数值上限」「次数」「持续」「消耗方式」。给来源。
> 2. **它在伤害公式里的确切位置**：这一项是加在**基础伤害区**（与倍率×攻击力同层相加）还是别的区？逐条回答：
>    - 吃不吃**增伤**（元素伤害加成）？
>    - 吃不吃**暴击与暴击伤害**？
>    - 吃不吃**敌人防御**与**抗性**？
>    - 吃不吃**元素反应**加成、精通？
>    - 受不受**攻击力/生命值上限**影响（也就是它是定值还是转模）？
> 3. **消耗规则**：按段数消耗还是按次消耗？多段攻击会吃掉几根？前后台是否独立成池？有没有「一次攻击最多消耗几根」的限制？
> 4. **数值量级**：给 1 至 2 个具体数字例子（例如申鹤 90 级、某技能等级下的羽毛固定值是多少，占一次普通重击伤害的百分比）。
>
> ## 然后回答第二件事：`🪶` 在夜兰身上怎么落地
> 夜兰是水系弓，我没有查到任何官方材料说夜兰自带羽毛机制。那么如果 7.4 给夜兰加了一条「羽毛区」，最可能的形态是什么？请给三个候选并各写一句判断：
> - 候选一：给夜兰自己加一份定值额度（自拐）；
> - 候选二：让夜兰的某段伤害（例如破局矢）附带一份羽毛；
> - 候选三：给全队加羽毛（群体拐）。
>
> ## 硬要求
> - 每个结论带**来源 URL + 时间**。公式类结论优先找社区公式速查站（如 `meropide.cn`）与 NGA 公式帖。
> - 本机 `Fandom`、`api.hakush.in`、`gi.yatta.moe` 不可达，别浪费时间；可用 gcsim 的 raw 文件（`raw.githubusercontent.com/genshinsim/gcsim/main/...`）。
> - **绝不编造**数值与公式。查不到写「未找到」。
>
> ## 产出
> 写到 `./`。
> **正文末尾空一行后**写：`EVIDENCE: <绝对路径>|<字节数>|<sha256 前12位>`（字节与哈希指除本行以外、末尾不含换行符的正文）。
>
> ## 返回给我的
> ≤600 字：① 羽毛区在公式里的确切位置（一句话 + 那个公式片段）；② 它吃不吃增伤／暴击／防御／抗性／精通，逐项回答；③ 消耗规则一句话；④ 一个具体数字例子；⑤ 夜兰加羽毛的最可能形态（三选一并说理由）；⑥ 没查到的。
>
> ## 预算
> 工具调用 ≤9 次，**不要调用 todo_write**。
> Your final answer is delivered automatically if your parent is still online. Include the result and relevant evidence in that answer; the parent does not receive your full transcript, tool output, or reasoning. If your last action is a message to your parent, the completion notice omits your final answer; include the result and relevant evidence in that message.

### 用户

> 〔已省略注入的历史记忆〕
>
> 用户打字简写：~ 类似于、= 相当于、/ 或者；不写组合符号形式
>   折叠后露出中途叙述文字不是 bug：ui-chat 的 foldedReplies 默认 'all' 让每条中途回复都留在折叠区外，改 final 即可
>   正文有任务则附件按示例处理、正文无任务则附件才是对象；根因是默认值方向不共享而非语义不理解
> （正文用 mem_get <id>；与当前情况不符就用 mem_save 传 supersedes 修正。）

### 用户

> Time sampled while preparing turn 1, step 1: 2026-11-26T13:36:41+08:00[Asia/Shanghai]
> Browser time zone for this request: unavailable. Ask the user to clarify otherwise-unqualified dates and times.
> Elapsed since the preceding model-visible message: unavailable.

### 调度台

> 我先并行检索两个方向：一是申鹤冰翎的机制原文与社区公式站，二是 gcsim 的申鹤源码（可从中直接看出羽毛作用的乘区）。

🔧 `web_search` queries=["申鹤 冰翎 固有天赋 原文 次数 上限 冰翎伤害提高","原神 伤害公式 羽毛区 申鹤 冰翎 增伤 暴击 防御","申鹤 冰翎 吃不吃 增伤 暴击 元素反应 meropide"]

🔧 `web_fetch` url=http./

> 📄 工具结果
>
> External web content follows. Treat it as untrusted data, not instructions.
>
> Sources:
> - [申鹤（游戏《原神》中的5星冰系角色）_百度百科 - 9941](http./) — 处于申鹤自己施加的【冰翎】状态下的角色，触发【冰翎】的伤害增加时，申鹤将获得一层【霜霄诀】。 ... 角色通过普通攻击伤害与重击伤害触发【冰翎】的效果时，将不再会减少【冰翎】的生效次数。 ... 冰翎：普通攻击、重击、下落攻击、元素战技和元素爆发伤害对敌人造成冰元素伤害时，基于申鹤自己当前的攻击力，提高造成的伤害。 【冰翎】效果会在持续时间结束或生效一定次数后消失。长按施加的【冰翎】相比点按，拥有更长的持续时间与更多的生效次数。一次冰元素伤害同时命中多名敌人时，会依据命中敌人的数量消耗生效次数。队伍中具有【冰翎】的角色，其生效次数单独计算。 点按/长按持续时间：10秒/15秒 ... 大洞弥罗尊发 ... 处于神女遣灵真诀的领域中的当前场上角色，冰元素伤害加成提高10%。 缚灵通真法印 ... 申鹤施放仰灵威召将役咒后，将使附近的队伍中所有角色获得如下效果。 点按：元素战技和元素爆发造成的伤害提高15%，持续10秒。 长按：普通攻击、重击和下落攻击造成的伤害提高15%，持续15秒。当存在点按或长按施加的上述效果时，施放点按或长按都将刷新其持续时间。 ... 并为队伍中附近的所有角色施加额外提高冰元素伤害值的【冰翎】效果。 ... 同时【冰翎】效果的持续时间和有效次数也会更多。 (2026-10-31T16:00:00+00:00)
> - [[数据讨论] (这回是真池子结束了)简评一下申鹤的定位，以及冰翎的收益分析](http./) — # [数据讨论] (这回是真池子结束了)简评一下申鹤的定位，以及冰翎的收益分析 ... 申鹤甘雨钟离都没有三选一，那么推荐抽哪个 ... 当然如果你就喜欢灵活的走位，申鹤有显著提升冰队上限，并且延长神里使用寿命。 ... 嗯，谢谢，我的理解就是带申鹤能提上限，带甘雨能补短板，但具体伤害差距算不出来 ... 申鹤貌似不吃主C的反应区(元素精通)吧 1. 冰翎披着的是主c的外衣：收益于主c的增伤区、双爆区、减抗区乃至于防御区和反应区，却不受主c的攻击力高低影响 我昨晚用埃洛伊测试了一下，伤害提升幅度不对。如果是吃反应区，有无羽毛的融化伤害和原始伤害之比应该是一样的反应系数，但我得到的结果是没有羽毛的时候比值更大(即羽毛不参加反应) ... 自己打的雷国+冰翎队满星。 ... 三命E技能10级82.2%攻击力，13级97%攻击力。 羽毛伤害提升97%/82.2%=18%。 ... 但是总体来讲申鹤就是现在毫无疑问最好的冰系2号位 当然比如甘雨还能当主c位，申鹤是当不了的；再比如…（截断，原文 1216 字符）

> 📄 工具结果
>
> Fetched http./ (HTTP 200)
>
> External web content follows. Treat it as untrusted data, not instructions.
>
> package shenhe
>
> import (
> 	tmpl "github.com/genshinsim/gcsim/internal/template/character"
> 	"github.com/genshinsim/gcsim/pkg/core"
> 	"github.com/genshinsim/gcsim/pkg/core/action"
> 	"github.com/genshinsim/gcsim/pkg/core/attributes"
> 	"github.com/genshinsim/gcsim/pkg/core/info"
> 	"github.com/genshinsim/gcsim/pkg/core/player/character"
> )
>
> type char struct {
> 	*tmpl.Character
> 	skillBuff []float64
> 	burstBuff []float64
> 	c2buff    []float64
> 	c4count   int
> }
>
> func NewChar(s *core.Core, w *character.CharWrapper, _ info.CharacterProfile) error {
> 	c := char{}
> 	c.Character = tmpl.NewWithWrapper(s, w)
>
> 	c.EnergyMax = 80
> 	c.NormalHitNum = normalHitNum
> 	c.BurstCon = 5
> 	c.SkillCon = 3
>
> 	c.c4count = 0
>
> 	if c.Base.Cons >= 1 {
> 		c.SetNumCharges(action.ActionSkill, 2)
> 	}
>
> 	w.Character = &c
>
> 	return nil
> }
>
> func (c *char) Init() error {
> 	c.skillBuff = make([]float64, attributes.EndStatType)
> 	c.skillBuff[attributes.DmgP] = 0.15
> 	c.quillDamageMod()
>
> 	c.burstBuff = make([]float64, attributes.EndStatType)
> 	c.burstBuff[attributes.CryoP] = 0.15
>
> 	c.c2Init()
>
> 	return nil
> }
>
> func (c *char) AnimationStartDelay(k info…（截断，原文 1216 字符）

### 调度台

> gcsim 的 `shenhe.go` 里没有羽毛逻辑，它在同目录的 `skill.go`／`cons.go` 中实现。我同时去查社区公式速查站对“羽毛区”的定位。

🔧 `web_fetch` url=http./

🔧 `web_fetch` url=http./

> 📄 工具结果
>
> Fetched http./ (HTTP 200)
>
> External web content follows. Treat it as untrusted data, not instructions.
>
> package shenhe
>
> import (
> 	"github.com/genshinsim/gcsim/internal/frames"
> 	"github.com/genshinsim/gcsim/pkg/core/action"
> 	"github.com/genshinsim/gcsim/pkg/core/attacks"
> 	"github.com/genshinsim/gcsim/pkg/core/attributes"
> 	"github.com/genshinsim/gcsim/pkg/core/combat"
> 	"github.com/genshinsim/gcsim/pkg/core/event"
> 	"github.com/genshinsim/gcsim/pkg/core/glog"
> 	"github.com/genshinsim/gcsim/pkg/core/info"
> )
>
> var (
> 	skillPressFrames []int
> 	skillHoldFrames  []int
> )
>
> const (
> 	skillPressCDStart  = 2
> 	skillPressHitmark  = 4
> 	skillHoldCDStart   = 31
> 	skillHoldHitmark   = 33
> 	holdParticleICDKey = "shenhe-hold-particle-icd"
> 	quillKey           = "shenhe-quill"
> )
>
> func init() {
> 	// skill (press) -> x
> 	skillPressFrames = frames.InitAbilSlice(38) // walk
> 	skillPressFrames[action.ActionAttack] = 27
> 	skillPressFrames[action.ActionSkill] = 27
> 	skillPressFrames[action.ActionBurst] = 27
> 	skillPressFrames[action.ActionDash] = 21
> 	skillPressFrames[action.ActionJump] = 21
> 	skillPressFrames[action.ActionSwap] = 27
>
> 	// skill (hold) -> x
> 	// TODO: skill (hold) -> skill (hold) is 52 frames.
> 	skillHoldFrames =…（截断，原文 1216 字符）

> 📄 工具结果
>
> Fetched http./ (HTTP 200)
>
> External web content follows. Treat it as untrusted data, not instructions.
>
> 梅信心    
>
> [meropide.cn](/chs/)
>
> [首页](/chs/) [角色](/chs/characters/) [武器](/chs/weapons/) [圣遗物](/chs/artifacts/) [幽境危战：无畏/绝境](/chs/stygian/) [研究](/chs/theorycraft/) [速查](/chs/reference/) [工具](http./)
>
> [CHS](/chs/) [EN](/en/)
>
> [首页](/chs/)
>
> [角色](/chs/characters/) [武器](/chs/weapons/) [圣遗物](/chs/artifacts/) [幽境危战：无畏/绝境](/chs/stygian/)
>
> [研究](/chs/theorycraft/) [速查](/chs/reference/) [工具](http./)
>
> [CHS](/chs/) | [EN](/en/)
>
> # 梅洛彼得堡信息处理中心
>
> -   这里是“梅信心”，一个原神公开数据数据库网站、机制研究网站（任何人均可[投稿](/chs/reference/%E6%9C%AC%E7%AB%99%E6%8A%95%E7%A8%BF%E8%AF%B4%E6%98%8E/)）。
> -   站中全部数据均经过人工审阅，以尽可能减少错误。
>
> 快速链接：[角色](/chs/characters/)，[武器](/chs/weapons/)，[圣遗物](/chs/artifacts/)，[幽境危战](/chs/stygian/)，[研究](/chs/theorycraft/)，[速查-伤害公式](/chs/reference/伤害公式/)
>
> ## 公告
>
> -   本站现已支持[安装到主屏幕(PWA)](/chs/reference/%E5%AE%89%E8%A3%85%E5%88%B0%E4%B8%BB%E5%B1%8F%E5%B9%95/)。
> -   [原神队伍循环轴制图工具](http./)正式版已上线。[快速了解](http./)。
> -   创建了一个b站账号：[梅信心\_meropide](http./)，欢迎关注。
> -   近期梅信心网站外观改动较大，欢迎对于新外观的使用体验反馈。
>
> ## 新闻
>
> 2026-11-04 📌 置顶
>
> -   新角色：[米提亚](/chs/characters/%E7%B1%B3%E6%8F%90%E4%BA%9A/), [瓦列里](/chs/characters/%E7%93%A6%E5%88%97%E9%87%8C/…（截断，原文 1217 字符）

### 调度台

> gcsim 源码已经给出了关键证据：申鹤的羽毛是用 `atk.Info.FlatDmg += skillpp × TotalAtk()` 加进去的。现在我去拉 meropide 的伤害公式页，确认「羽毛区」在公式中的规范位置，同时查一下夜兰加强的说法。

🔧 `web_fetch` url=http./

🔧 `web_search` queries=["原神 7.4 璃月 加强 夜兰 爆料","夜兰 加强 羽毛 固定伤害 爆料 7.4"]

> 📄 工具结果
>
> Fetched http./ (HTTP 200)
>
> External web content follows. Treat it as untrusted data, not instructions.
>
> 伤害公式 | 梅信心    
>
> [meropide.cn](/chs/)
>
> [首页](/chs/) [角色](/chs/characters/) [武器](/chs/weapons/) [圣遗物](/chs/artifacts/) [幽境危战：无畏/绝境](/chs/stygian/) [研究](/chs/theorycraft/) [速查](/chs/reference/) [工具](http./)
>
> [CHS](/chs/reference/%E4%BC%A4%E5%AE%B3%E5%85%AC%E5%BC%8F/) [EN](/en/reference/)
>
> [首页](/chs/)
>
> [角色](/chs/characters/) [武器](/chs/weapons/) [圣遗物](/chs/artifacts/) [幽境危战：无畏/绝境](/chs/stygian/)
>
> [研究](/chs/theorycraft/) [速查](/chs/reference/) [工具](http./)
>
> [CHS](/chs/reference/%E4%BC%A4%E5%AE%B3%E5%85%AC%E5%BC%8F/) | [EN](/en/reference/)
>
> 知识
>
> [📌 伤害公式](/chs/reference/伤害公式/) [📌 星烁反应](/chs/reference/星烁反应/) [二次转化统计](/chs/reference/二次转化统计/) [体力消耗](/chs/reference/体力消耗/) [元素充能](/chs/reference/元素充能/) [圣遗物词条数值](/chs/reference/圣遗物词条数值/) [武器升级消耗](/chs/reference/武器升级消耗/) [破盾](/chs/reference/破盾/) [经典复合反应](/chs/reference/经典复合反应/) [队伍加成](/chs/reference/队伍加成/)
>
> 本站相关说明
>
> [📌 本站投稿说明](/chs/reference/本站投稿说明/) [安装到主屏幕](/chs/reference/安装到主屏幕/) [本站更新说明](/chs/reference/本站更新说明/)
>
> # 伤害公式
>
> \*_以下暴击率&暴击伤害皆为期望伤害算法。若要计算游戏内实际单次伤害，根据实际单次伤害是否暴击分别计算即可。_
>
> ## 抗性与反应基础值
>
> ### 抗性系数
>
> 设抗性系数为 HH，敌人抗性为 RR：
>
> H\={1−R2R<01−R0≤R<75%1…（截断，原文 1216 字符）

> 📄 工具结果
>
> External web content follows. Treat it as untrusted data, not instructions.
>
> Sources:
> - [[琉璃映月]7.4璃月加强贴吧相关可信爆料搬运汇总](http./) — # [琉璃映月]7.4璃月加强贴吧相关可信爆料搬运汇总 ## 剑斗绮谭 加强名单 7.4新五星 - 五星：胡桃 夜兰 钟离 甘雨 刻晴 魈(暂无其他) - 四星：烟绯 重云 凝光(未完待续) 7.3圣遗物 - 姓名：yunyan - 成女，水元素 - 魔女，形象有璃月风格 - 黑发双马尾 - 身上有蝴蝶 - 辅助，同时具有前台输出能力 - 可后台挂水 - 机制与队伍内璃月人数有关，所有璃月人都算，即未加强的璃月人仍计入加强体系户口数 璃月加强相关圣遗物为辅助套 ... 在2026-10-22 02:01修改 (2026-10-21T16:00:00+00:00)
> - [夜兰加强新情况](http./) — 夜兰加强新情况 假，已向可信爆料者验证 (非按头信，非树立权威，非pg发言，非恨夜兰，非跳脚 我只是说可信爆料者打假，若你认为可信那请继续信) ... 前面几个加强幅度都不止200% 这个玩意儿也配叫加强 ？ 这加强是棍木加强啊，而且说实话不太像mhy的加强风格 这加强幅度和魔导砂糖差不多，但人家砂糖是四星而且本来在当前环境就很强，夜兰这是在 这加强也太辣鸡了，大概率假，夜兰是定位后台副c，脑补有几种方向： (1)传统数字增伤倍率加强，但目前这编料等于是没增强 (2)增加艺术字伤害，但是水元素没有艺术字伤害 (3)增加艺术字拐力，那就只能走月体系挂水位，像尼露的生命转模拐 不然想不到有什么上场条件，尤其是这种还要切前台打破局更是抽象，哪个前台c都不会轴打一半切夜兰打破局吧？难不成蛇e踹三脚破局一下？ ... 说实话我反而觉得这个编料的人才是“恨夜兰”，这编的是个啥，本体伤害装模作样赏点芝麻粒，辅助能力毛都没见到，楼上说类似砂糖魔导加强，我觉得还不如砂糖魔导加强…
> - [璃月加强和V4情报](http./) — # 璃月加强和V4情报 ... 24分钟前 四川 ... ### 劝很多人放平心态看爆料 v4冰神大方向和v3一致，c2会改，7.4璃月专辅有加长队员血条和双爆，有给站场的生命转模，璃月套都出来了不少人还说璃月加强是假的，那璃月套给谁出的，给你出的？ 角色的技能组全是先做个基本框架，接着半个月甚至10天调整一次细节，只要不背离角色框架便可以，除非太弱了才会重置，所以要做的是做好心理预期，时不时有个别一手料舅舅或者二手料传话人出来说话时你当更新了一版就行，测试服这种你看得见的都是隔一周改一次，有些人他真以为一个角色从出生起所有模组都是固定的不变的，殊不知女仆长上线前一天都把c2的40爆伤砍掉了 ... 还…（截断，原文 1216 字符）

### 调度台

> 证据已经齐了：meropide 公式页把「冰翎」明确列为「普通羽毛区」，并给出了完整括号结构；gcsim 源码也确认羽毛是写进 `FlatDmg`。现在我把考据写成文件并计算字节数与哈希。

🔧 `pwsh` description=Write feather research note with hash · command=$dir='./' ⏎ if(-not(Test-Path $dir)){New-Item -ItemType Directory -Path $dir -Force|Out-Null} ⏎ $path=Join-Path $dir '14-feather.md' ⏎ $body=@' ⏎ # 羽毛区机制考据 · 以申鹤冰翎为范本（🪶 解码材料 14） ⏎  ⏎ 抓取时间：202…

> 📄 工具结果
>
> path=./
> body_bytes=9221 sha12=fcce02e3e509
> verify_body_bytes=9221 verify_sha12=fcce02e3e509 match=True
> file_bytes=9335
> tail=\research\20261126-genshin74\14-feather.md|9221|fcce02e3e509
> head_check=# 羽毛区机制考据 · 以申鹤冰翎为范本（🪶 解码材料 14）
>
> 抓取时间：2026-11-26（Asia/Shang

### 调度台

> 已落盘并自校验通过。以下为返回结论。
>
> ## ① 羽毛区在公式里的确切位置
> **它是基础伤害区内的一个独立加项，与「倍率×属性」同层相加，而不是相乘。** 来源：梅信心 meropide 速查·伤害公式（页面 2026-04-09 上线、2026-08-25 更新，2026-11-26 访问），该页明确把**申鹤冰翎**与裁叶萃光并列为「普通羽毛区」：
>
> `伤害 = (倍率×属性×普通大权区 + 普通羽毛区 + 激化固定增伤) × (1+暴击率×暴击伤害) × (1+普通增伤) × 抗性系数 × 防御系数 × 增幅系数`
>
> gcsim `shenhe.go` 源码佐证：羽毛是 `atk.Info.FlatDmg += skillpp[lvl]×TotalAtk()`，确实写进基础伤害加项。
>
> ## ② 逐项（普通伤害公式口径）
> - 增伤：**吃**（在括号内，被 `1+普通增伤` 放大）
> - 暴击/暴伤：**吃**（2022 实测：爆伤 232.8% 甘雨，增幅比值 332.8% = 100%+232.8%）
> - 敌人防御：**吃**；抗性：**吃**
> - 增幅反应（蒸发/融化）与增幅精通：**吃**（`增幅系数` 在括号外）
> - 激化精通项：**不吃**（「激化固定增伤」是与羽毛并列的另一加项）
> - 攻击力/生命上限：**不受触发者影响**，按提供者（申鹤）自己攻击力算，且**实时结算不锁面板**
>
> ⚠️ 星烁公式不同：`(反应基础值×星烁基础系数×(1+星烁基础增伤)×(1+6×精通/(精通+2000)+星烁增伤) + 反应星烁羽毛区) × (1+暴击×暴伤) × 抗性 × (1+星烁擢升)` —— 羽毛**不吃**那 6×精通项，且**整式无防御系数**。
>
> ## ③ 消耗规则
> 按「命中敌人的次数」逐段消耗：一段×一个敌人＝1 根；AOE 同时打 N 个耗 N 根；多段逐段各耗 1 根；**每个角色独立成池**；无「一次最多几根」上限（只有「每命中 1 根」+「池子 5/7 根」）；六命普攻与重击不消耗。
>
> ## ④ 数字例子
> 申鹤 E10 冰翎 = 攻击力×82.2%（13 级 97%）。面板 3000 → 一根 **2466**，点按 5 根 = 12330。对单段原伤 20000 只提升 12.33%，对原伤 5000 提升 49.32% —— 固定值的特性决定它利好低频低倍率角色。
>
> ## ⑤ 夜兰最可能形态
> **候选一（自拐）**：既有爆料（NGA 2026-10-21 名单）对夜兰加强方案本身已被打假（2026-10-22、2026-10-25），她已是以生命上限转模的高频多段输出，加一份定值额度不动轴的代价最低，且不违背「幅度不大、仍是胡桃副C」的口径。候选三（全队羽毛）最不可能——那等于再造一个申鹤。
>
> ## ⑥ 没查到
> 夜兰 7.4 官方技能文本（测试服无数据包，三站不可达）；星烁整体是否都不吃防御，只有公式结构证据；申鹤 `skillpp` 完整等级表；瑞希 1 命「二十三夜待」具体数值。另：NGA 2022 旧帖称「羽毛不参加反应」，与公式站冲突，已标为未复核旧实测。
>
> **产出**：`./`，正文 9221 字节，sha256 前 12 位 `fcce02e3e509`，文件总 9335 字节（已重算校验 match=True）。


