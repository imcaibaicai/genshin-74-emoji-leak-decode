# 子代理 scout-yelan-baseline · 夜兰真实数值基线取证

> 会话 id：`0e8904f5-e939-445e-ba4b-3bf2690c9bcb`  ·  事件 84 条  ·  1 个回合  ·  层级：第 2 层
>
> 原始 JSONL：`raw/0e8904f5-e939-445e-ba4b-3bf2690c9bcb.jsonl`

## 回合 1

### 用户

> 你是只读取证侦察者，为「原神 7.4 深测」调研项目核实**夜兰（Yelan，水/弓/五星/璃月）的真实数值基线**。你不是结论作者，只负责把真实游戏数据抓准、标好出处。
>
> ## 输出（唯一允许写的文件）
> `./`
> （`_scratch` 目录不存在就新建；只写这一个文件，其它文件一律不碰。）
>
> ## 必须核实的 9 项
> 逐项给：结论值 + 出处 URL + 抓取时间（2026-11-26）+ 标注 `[已核]` 或 `[未核到]`。
>
> 1. C1 原文与效果。
> 2. **C2 原文**：那个「14%」到底挂在哪条效果上？是否按生命值上限计算？是否有「每 1.8 秒至多一次」这类触发间隔？
> 3. **C4 原文**：单层是 10% 生命值上限吗？是否存在「最多 40%」这样的叠层上限？持续 25 秒？叠层条件是不是「络命丝标记的敌人数」？
> 4. **C6 原文**：破局矢的持续时间（是否 20 秒 / 5 次）、是否「视为重击伤害」、倍率是否为「蓄力瞄准射击的 156%」这类数值。
> 5. E 萦络纵命索的伤害是否按生命值上限系数计算，给系数。
> 6. Q 渊图玲珑骰的协同攻击「玄掷玲珑」是否按生命值上限系数计算，给系数与触发频率。
> 7. 蓄力瞄准射击（含破局矢）的倍率结构：吃攻击力还是生命值？
> 8. 夜兰两个固有天赋的名称与内容。
> 9. 夜兰 Q 的「骰子」机制细节：骰子数量是否与某个可叠层数相关；是否有 1/2/3/4 分档的量。
>
> ## 来源优先级
> `github.com/genshin-sim/gcsim`（`internal/characters/yelan/`）→ `github.com/frzyc/genshin-optimizer`（`libs/gi/dm/src/characters/yelan`）→ Fandom / Genshin Impact Wiki → 其它攻略站。
> GitHub 可用 `raw.githubusercontent.com` 直接抓文件，比网页搜索更可靠。
>
> ## 纪律
> - 不许编造任何数值。查不到就写「未核到」，并列出你试过的 URL。
> - 工具调用 **≤7 次**，到第 7 次必须停手落盘，先写已拿到的部分。
> - 报告里区分「原文照抄」与「你的归纳」。
>
> ## 返回给我（≤250 字）
> 9 项各一句结论（带 `[已核]`/`[未核到]`）、文件绝对路径与字节数。不要贴长正文。
> Your final answer is delivered automatically if your parent is still online. Include the result and relevant evidence in that answer; the parent does not receive your full transcript, tool output, or reasoning. If your last action is a message to your parent, the completion notice omits your final answer; include the result and relevant evidence in that message.

### 用户

> 〔已省略注入的历史记忆〕
>
> AutoCAD 2020 只剩 0.18GB 且 0 个 exe 已不可用，改走 ezdxf+ODA；Agent学习 目录已不存在
>   Markdown 半角波浪号被渲染成删除线：完整结论（2026-10-13 更正）
>   DSH_HOME 实测 4.4 万文件/2.94GB；20 个 junction 指向 4 根；plugins 内 dshgo 带 407 链接；配置真实绝对路…
> （正文用 mem_get <id>；与当前情况不符就用 mem_save 传 supersedes 修正。）

### 用户

> Time sampled while preparing turn 1, step 1: 2026-11-26T12:25:11+08:00[Asia/Shanghai]
> Browser time zone for this request: unavailable. Ask the user to clarify otherwise-unqualified dates and times.
> Elapsed since the preceding model-visible message: unavailable.

### 调度台

> 我先去 gcsim 抓取夜兰的角色源码，这是目前最可靠的一手数据源。同时确认输出目录是否存在。

🔧 `pwsh` description=抓取 gcsim 夜兰源码并过滤关键行 · command=$ErrorActionPreference='Continue' ⏎ [Console]::OutputEncoding=[System.Text.Encoding]::UTF8 ⏎ $dir='./' ⏎ "DIR_EXISTS: " + (Test-Path $dir) ⏎ "PARENT_EXISTS: " + (Test-Path (Split-Path $dir…

> 📄 工具结果
>
> DIR_EXISTS: False
> PARENT_EXISTS: True
>
> ===== yelan.go FAIL: Response status code does not indicate success: 404 (Not Found).
>
> ===== skill.go FAIL: Response status code does not indicate success: 404 (Not Found).
>
> ===== burst.go FAIL: Response status code does not indicate success: 404 (Not Found).
>
> ===== chargeattack.go FAIL: Response status code does not indicate success: 404 (Not Found).
>
> ===== talent.go FAIL: Response status code does not indicate success: 404 (Not Found).
>
> ===== cons.go FAIL: Response status code does not indicate success: 404 (Not Found).
>
> ===== constellation.go FAIL: Response status code does not indicate success: 404 (Not Found).

### 调度台

> gcsim 路径返回 404，我需要先确认仓库里的真实目录名，所以用 GitHub API 列目录。

🔧 `pwsh` description=用 GitHub API 探测 gcsim 夜兰目录真实路径 · command=[Console]::OutputEncoding=[System.Text.Encoding]::UTF8 ⏎ $ua=@{'User-Agent'='dsh-scout'} ⏎ $try=@( ⏎  'http./', ⏎  'http./', ⏎  'http./' ⏎ ) ⏎ foreach($u in $try){ ⏎   foreach($p in @($null,'htt./…

> 📄 工具结果
>
> == DIRECT FAIL http./ -> Response status code does not indicate success: 404 (Not Found).
> == PROXY FAIL http./ -> Response status code does not indicate success: 404 (Not Found).
> == DIRECT FAIL http./ -> Response status code does not indicate success: 404 (Not Found).
> == PROXY FAIL http./ -> Response status code does not indicate success: 404 (Not Found).
> == DIRECT FAIL http./ -> Response status code does not indicate success: 404 (Not Found).
> == PROXY FAIL http./ -> Response status code does not indicate success: 404 (Not Found).

### 调度台

> 仓库根路径也 404，可能组织名不同。我并行探测几个候选组织与 genshin-optimizer 的路径。

🔧 `pwsh` description=探测多个候选仓库组织与目录 · command=[Console]::OutputEncoding=[System.Text.Encoding]::UTF8 ⏎ $ua=@{'User-Agent'='dsh-scout'} ⏎ $cands=@( ⏎  'http./', ⏎  'http./', ⏎  'http./', ⏎  'http./' ⏎ ) ⏎ foreach($u in $cands){ ⏎   $ok=$false ⏎   …

> 📄 工具结果
>
> == DIRECT OK http./ (200, 6189 chars)
>    repo=genshinsim/gcsim branch=main
> == DIRECT FAIL http./ -> Response status code does not indicate success: 404 (Not Found).
> == PROXY FAIL http./ -> Response status code does not indicate success: 404 (Not Found).
> == DIRECT OK http./ (200, 5635 chars)
>    repo=frzyc/genshin-optimizer branch=master
> == DIRECT OK http./ (200, 2174 chars)
> == DIRLIST OK: aimed.go, asc.go, attack.go, burst.go, config.yml, skill.go, yelan.go, zz_yelan.dm.go

### 调度台

> 组织名确认为 `genshinsim/gcsim`。现在把夜兰的 5 个源文件全文抓下来。

🔧 `pwsh` description=抓取夜兰五个源文件全文 · command=[Console]::OutputEncoding=[System.Text.Encoding]::UTF8 ⏎ $ua=@{'User-Agent'='dsh-scout'} ⏎ $base='http./' ⏎ foreach($f in @('yelan.go','zz_yelan.dm.go','skill.go','burst.go','aimed.go'))…

> 📄 工具结果
>
> ########## yelan.go (2174 chars) ##########
> package yelan
>
> import (
> 	tmpl "github.com/genshinsim/gcsim/internal/template/character"
> 	"github.com/genshinsim/gcsim/internal/template/minazuki"
> 	"github.com/genshinsim/gcsim/pkg/core"
> 	"github.com/genshinsim/gcsim/pkg/core/action"
> 	"github.com/genshinsim/gcsim/pkg/core/attributes"
> 	"github.com/genshinsim/gcsim/pkg/core/info"
> 	"github.com/genshinsim/gcsim/pkg/core/keys"
> 	"github.com/genshinsim/gcsim/pkg/core/player/character"
> )
>
> const (
> 	breakthroughStatus = "yelan_breakthrough"
> 	c6Status           = "yelan_c6"
> 	burstKey           = "yelanburst"
> 	burstICDKey        = "yelanburstICD"
> )
>
> type char struct {
> 	*tmpl.Character
> 	a4buff       []float64
> 	breakthrough bool // tracks breakthrough state
> 	c2icd        int
> 	c6count      int
> 	c4count      int // keep track of number of enemies tagged
> 	burstWatcher *minazuki.Watcher
> }
>
> func NewChar(s *core.Core, w *character.CharWrapper, p info.CharacterProfile) error {
> 	c := char{}
> 	c.Character = tmpl.NewWithWrapper(s, w)
>
> 	c.EnergyMax = 70
> 	c.NormalHitNum = normalHitNum
> 	c.BurstCon = 3
> 	c.SkillCon = 5
>
> 	c.c2icd = 0
> 	c.c6count = 0
>
> 	breakthrough, ok := p.Params["breakthrough"]
> 	if !ok || breakthrough……（截断，原文 1216 字符）

### 调度台

> 机制部分已拿到 gcsim 源码级证据。还需 `attack.go`（含固有天赋 a1/a4）和 Fandom 的原文描述，这一步一起取。

🔧 `pwsh` description=抓取 attack.go 与 Fandom 命座天赋原文 · command=[Console]::OutputEncoding=[System.Text.Encoding]::UTF8 ⏎ $ua=@{'User-Agent'='dsh-scout'} ⏎ try{ ⏎   $r=Invoke-WebRequest -UseBasicParsing -Uri 'http./' -Headers $ua -TimeoutSec 40 ⏎   "`n#…

> 📄 工具结果
>
> ########## attack.go (3032 chars) ##########
> package yelan
>
> import (
> 	"fmt"
>
> 	"github.com/genshinsim/gcsim/internal/frames"
> 	"github.com/genshinsim/gcsim/pkg/core/action"
> 	"github.com/genshinsim/gcsim/pkg/core/attacks"
> 	"github.com/genshinsim/gcsim/pkg/core/attributes"
> 	"github.com/genshinsim/gcsim/pkg/core/combat"
> 	"github.com/genshinsim/gcsim/pkg/core/info"
> )
>
> var (
> 	attackFrames   [][]int
> 	attackHitmarks = [][]int{{13}, {13}, {18}, {15, 29}}
> )
>
> const normalHitNum = 4
>
> func init() {
> 	attackFrames = make([][]int, normalHitNum)
>
> 	attackFrames[0] = frames.InitNormalCancelSlice(attackHitmarks[0][0], 15)
> 	attackFrames[1] = frames.InitNormalCancelSlice(attackHitmarks[1][0], 21)
> 	attackFrames[2] = frames.InitNormalCancelSlice(attackHitmarks[2][0], 38)
> 	attackFrames[3] = frames.InitNormalCancelSlice(attackHitmarks[3][1], 67)
> }
>
> // Normal attack damage queue generator
> // relatively standard with no major differences versus other bow characters
> // Has "travel" parameter, used to set the number of frames that the arrow is in the air (default = 10)
> func (c *char) Attack(p map[string]int) (action.Info, error) {
> 	travel, ok := p["travel"]
> 	if !ok {
> 		travel = 10
> 	}
>
> 	if c.Base.Cons >= 6 && c……（截断，原文 1215 字符）

### 调度台

> `attack.go` 里没有固有天赋，它们应在 `asc.go`。同时 Fandom 直连 TLS 失败，改用 7890 代理重试。

🔧 `pwsh` description=抓 asc.go 并代理访问 Fandom 原文 · command=[Console]::OutputEncoding=[System.Text.Encoding]::UTF8 ⏎ $ua=@{'User-Agent'='Mozilla/5.0 dsh-scout'} ⏎ try{ ⏎   $r=Invoke-WebRequest -UseBasicParsing -Uri 'http./' -Headers $ua -TimeoutS…

> 📄 工具结果
>
> ########## asc.go (1724 chars) ##########
> package yelan
>
> import (
> 	"github.com/genshinsim/gcsim/pkg/core/attributes"
> 	"github.com/genshinsim/gcsim/pkg/core/info"
> 	"github.com/genshinsim/gcsim/pkg/core/player/character"
> 	"github.com/genshinsim/gcsim/pkg/modifier"
> )
>
> // When the party has 1/2/3/4 Elemental Types, Yelan's Max HP is increased by 6%/12%/18%/30%.
> func (c *char) a1() {
> 	if c.Base.Ascension < 1 {
> 		return
> 	}
> 	partyEleTypes := make(map[attributes.Element]bool)
> 	for _, char := range c.Core.Player.Chars() {
> 		partyEleTypes[char.Base.Element] = true
> 	}
> 	count := len(partyEleTypes)
>
> 	m := make([]float64, attributes.EndStatType)
> 	m[attributes.HPP] = float64(count) * 0.06
> 	if count >= 4 {
> 		m[attributes.HPP] = 0.3
> 	}
>
> 	c.AddStatMod(character.StatMod{
> 		Base:         modifier.NewBase("yelan-a1", -1),
> 		AffectedStat: attributes.HPP,
> 		Amount: func() []float64 {
> 			return m
> 		},
> 	})
> }
>
> // So long as an Exquisite Throw is in play, your own active character deals 1% more DMG.
> // This increases by a further 3.5% DMG every second. The maximum increase to DMG dealt is 50%.
> // The pre-existing effect will be dispelled if Depth-Clarion Dice is recast during its duration.
> func (c *char) a……（截断，原文 1215 字符）

### 调度台

> 抓取取证已到第 6 次调用，固有天赋 `a1`/`a4` 注释已拿到；Fandom 直连与代理都 TLS 失败。现在按纪律停手落盘，把已核到的写进文件，缺失的如实标 `[未核到]`。

🔧 `pwsh` command=[Console]::OutputEncoding=[System.Text.Encoding]::UTF8 ⏎ $dir='./' ⏎ if(-not (Test-Path $dir)){ New-Item -ItemType Directory -Path $dir -Force | Out-Null } ⏎ $file=Join-Path $dir 'yelan-…

> ❌ 错误结果
>
> Error: invalid arguments: missing required property "description"

### 调度台

> 写入时漏了 `description`，我补上再写一次。

🔧 `pwsh` description=写入夜兰数值基线取证报告 · command=[Console]::OutputEncoding=[System.Text.Encoding]::UTF8 ⏎ $dir='./' ⏎ if(-not (Test-Path $dir)){ New-Item -ItemType Directory -Path $dir -Force | Out-Null } ⏎ $file=Join-Path $dir 'yelan-…

> 📄 工具结果
>
> WROTE: ./
> BYTES: 10627
> LINES: 246
> DIR_CONTENT: yelan-baseline.md, yelan-mechcheck.md, yelan-spec.md

### 调度台

> 夜兰基线取证完成，已写入 `_scratch/yelan-baseline.md`（10,627 字节，246 行；同目录另有他人文件 `yelan-mechcheck.md`、`yelan-spec.md`，我未触碰）。
>
> **9 项结论**
> 1. C1：E 可用次数 1→2 次（`SetNumCharges(Skill,2)`）[已核]（官方文案未核到）
> 2. C2：14% 挂在「玄掷玲珑」额外一支箭上，`FlatDmg = 14/100*hp`，按生命值上限，CD `1.8*60` 帧＝1.8 秒 [已核]（文案未核到）
> 3. C4：单层 `HPP+0.1`＝10% MaxHP，代码夹到 `0.4`＝最多 4 层，`25*60` 帧＝25 秒，`c4count` 按被络命丝标记敌人数 [已核]（文案未核到）
> 4. C6：`20*60`＝20 秒、`c6count>=5`＝5 次、`AttackTagExtra`＝重击、`barb*MaxHP*1.56`＝破局矢 156% 且吃生命值 [已核]（文案未核到）
> 5. E：`Mult:0`＋`FlatDmg`，Lv1 22.6136%～Lv15 53.7073%，Lv10 40.7045% MaxHP，CD 10 秒 [已核]
> 6. Q 协同：`burstDice` Lv10 8.7696% MaxHP×每轮 3 支，`WithMandatory(...,60,...)`＝每 1 秒至少一波 [已核]
> 7. 满蓄瞄准 `fullaim` Lv10 223.2% 攻击力；破局矢 `barb` Lv10 20.8368% MaxHP，仅满蓄触发、E 命中 34% 概率获得 [已核]
> 8. a1：队伍元素类型 1/2/3/4→+6%/12%/18%/30% MaxHP；a4：站场角色 +1% 每秒再 +3.5%、上限 +50%、15 秒 [已核]（**天赋名称未核到**）
> 9. 骰子数量/1-2-3-4 分档：gcsim 无任何建模，固定 3 支 [未核到]
>
> **关键更正**：任务给的 `genshin-sim/gcsim` 是 404，正确组织名是 **`genshinsim/gcsim`**；该目���无 `talent.go`，固有天赋在 `asc.go`，命座散在 `yelan.go`/`burst.go`/`skill.go`/`attack.go`。Fandom 的 `api.php` wikitext 直连与 7890 代理均 SSL 握手失败，官方原文需换 TLS 客户端补抓。


