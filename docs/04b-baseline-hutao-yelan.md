# 胡桃 / 夜兰 官方数值基线（gcsim 源码级取证）

取证日期：2026-11-26
唯一数值源：`github.com/genshinsim/gcsim` main 分支 Go 源码（raw.githubusercontent.com 直连可读）。
中文命座/天赋原名：**未核到**（api.hakush.in、gi.yatta.moe 本机不可达，Fandom 无中文条目接入）。下文命座名一律给 gcsim 源码注释里的英文语义，中文原名待另一路核对，**不要凭记忆填入**。

gcsim 帧数换算：1 秒 = 60 帧。倍率表为 10 级天赋 15 档（天赋 1 级 → 15 级）。

---

## 一、胡桃（火 / 长柄 / 五星）

来源文件（`internal/characters/hutao/`）：`hutao.go`、`asc.go`、`skill.go`、`burst.go`、`charge.go`、`cons.go`、`zz_hutao.dm.go`

### 1. 基础与技能等级

| 项 | 值 | 证据 |
| --- | --- | --- |
| 元素能量上限 | 60 | `hutao.go` `c.EnergyMax = 60` |
| E 等级加成来源 | C3（`SkillCon = 3`） | `hutao.go` |
| Q 等级加成来源 | C5（`BurstCon = 5`） | `hutao.go` |
| 重击体力消耗 | 25 | `hutao.go` `ActionStam` 返回 25 |
| 彼岸蝶舞期间重击体力 | 0（C1 起） | `hutao.go` `if paramitaBuff && Cons >= 1 { return 0 }` |
| 彼岸蝶舞元素转换 | 普攻/重击/下落攻击转火元素 | `hutao.go` `Snapshot` |

### 2. 普攻 / 重击倍率（天赋 1 级 → 15 级）

| 段数 | 倍率 |
| --- | --- |
| N1 | 46.8864% → 107.6256% |
| N2 | 48.2539% → 110.7647% |
| N3 | 61.05% → 140.1375% |
| N4 | 65.641% → 150.6758% |
| N5（两段） | 33.2737% + 35.2% → 76.3782% + 80.8% |
| N6 | 85.9584% → 197.3136% |
| 重击 | 135.96% → 312.09% |
| 下落（碰撞/低空/高空） | 65.4192% / 130.8107% / 163.3896%（1 级） |

证据：`zz_hutao.dm.go` 中 `attack`、`charge`、`collision`、`lowPlunge`、`highPlunge` 数组。

### 3. 元素战技 E（彼岸蝶舞 / Guide to Afterlife）

- 攻击力提升 = `ppatk[天赋等级] × 生命值上限`，**3.841% → 7.751%**（1 级 → 15 级）。
- 提升上限 = `基础攻击力 × 4`（`skill.go`：`maxBonus := c.Stat(attributes.BaseATK) * 4`）。
- 持续 540 + 14 帧 = **9 秒**（`modifier.NewBaseWithHitlag(paramitaBuff, 540+skillStart)`）。
- 冷却 960 帧 = **16 秒**（`c.SetCDWithDelay(action.ActionSkill, 960, 14)`）。
- 施放扣血：**当前生命值的 30%**（`Amount: 0.30 * c.CurrentHP()`）。
- 命中产球：2 或 3 颗火元素微粒（50% 概率为 3），粒子 ICD 5 秒。
- 血梅香施加方式：**彼岸蝶舞状态下的重击命中**才挂（`charge.go` `ppChargeAttack` 的回调 `c.applyBB`）；Q 命中挂血梅香需 **C2**（`burst.go`：`if Cons >= 2 { bbcb = c.applyBB }`）。
- 血梅香伤害 = `bb[天赋等级]`，**64% → 152%**（火伤，单次跳跃倍率）。
- 血梅香节奏：**每 240 帧（4 秒）跳一次**；状态持续 **570 帧 = 9.5 秒**，故通常跳 2 次（`skill.go` `QueueEnemyTask(..., 240)` + `AddStatus(bbDebuff, 570, true)`）。
- 重击「彼岸蝶舞」形态：起手追加 1.8 秒蝶舞时长，结束时扣回（`charge.go` `ExtendStatus(paramitaBuff, 1.8*60)`）。

### 4. 元素爆发 Q（安神秘法 / Spirit Soother）

| 项 | 值 |
| --- | --- |
| 倍率（血量 > 50%） | 303.272% → 611.992% |
| 倍率（血量 ≤ 50%） | 379.09% → 764.99%（`burstLow`） |
| 治疗量 | 生命值上限的 6.2625% → 12.6375%（低血 8.35% → 16.85%） |
| 能量消耗 | 60 |
| 冷却 | 900 帧 = 15 秒 |
| 治疗次数上限 | 最多 5 次（`burstHealCount == 5` 返回） |

低血判定：`low := c.CurrentHPRatio() <= 0.5`（`burst.go`）。

### 5. 固有天赋

| 天赋 | 触发条件 | 数值 | 证据 |
| --- | --- | --- | --- |
| （A1，中文名未核到） | 彼岸蝶舞状态结束（切人/到期）时 | **除胡桃外全队暴击率 +12%，持续 8 秒**（480 帧） | `asc.go` `a1()` |
| （A4，中文名未核到） | **生命值 ≤ 50%** | **火元素伤害加成 +33%** | `asc.go` `a4()` |
| 生活天赋 | 源码未实现（gcsim 不建模合成类天赋） | **未核到** | — |

补充：`asc.go` 注释写明 A4 游戏内实际是**每 0.3 秒检查一次**血量，而非实时判定。

### 6. 命座 C1 ~ C6（数值全部来自源码，中文原名未核到）

| 命座 | 英文语义（源码注释） | 数值与机制 |
| --- | --- | --- |
| C1 | 彼岸蝶舞期间重击不消耗体力 | 重击体力 25 → **0**（`hutao.go` `ActionStam`） |
| C2 | 血梅香伤害提升；Q 也能施加血梅香 | 血梅香每跳额外 **+生命值上限 × 10%** 固定值；`Cons >= 2` 时 Q 命中挂血梅香（`skill.go` `ai.FlatDmg += c.MaxHP() * 0.1`） |
| C3 | E 等级 +3 | `SkillCon = 3` |
| C4 | 击败被自己血梅香影响的敌人后，队友暴击率提升 | 除胡桃外全队 **暴击率 +12%，持续 15 秒**（900 帧）（`cons.go` `c4()`） |
| C5 | Q 等级 +3 | `BurstCon = 5` |
| C6 | 濒死时暴击率拉满 | 生命值 **≤ 25%**（或受致命一击后复活至 1 点生命）时 **暴击率 +100%，持续 10 秒**（600 帧），**冷却 60 秒**（3600 帧）；每 2 秒轮询检查（`cons.go` `checkc6`） |

---

## 二、夜兰（水 / 弓 / 五星）

来源文件（`internal/characters/yelan/`）：`yelan.go`、`asc.go`、`skill.go`、`burst.go`、`aimed.go`、`zz_yelan.dm.go`
注意：**该目录没有 `cons.go`**，命座逻辑散在 `yelan.go`（C1/C3/C5 的等级加成与次数）、`skill.go`（C4）、`burst.go`（C2/C6）。

### 1. 基础与技能等级

| 项 | 值 | 证据 |
| --- | --- | --- |
| 元素能量上限 | 70 | `yelan.go` `c.EnergyMax = 70` |
| E 等级加成来源 | C5（`SkillCon = 5`） | `yelan.go` |
| Q 等级加成来源 | C3（`BurstCon = 3`） | `yelan.go` |
| 初始状态 | 默认自带「破局」 | `yelan.go` `if !ok || breakthrough > 0 { c.breakthrough = true }` |

### 2. 普攻 / 重击倍率（天赋 1 级 → 15 级）

| 段数 | 倍率 |
| --- | --- |
| N1 | 40.678% → 108.79% |
| N2 | 39.044% → 104.42% |
| N3 | 51.6% → 138% |
| N4（两段） | 32.508% × 2 → 86.94% × 2 |
| 瞄准射击（未满蓄） | 43.86% → 117.3% |
| 瞄准射击（满蓄） | 124% → 294.5% |
| **破局矢** | **生命值上限的 11.576% → 27.493%** |

### 3. 破局矢触发条件

- 「破局」状态由 **E 命中敌人时每个目标 34% 概率**获得（`skill.go` `if c.Core.Rand.Float64() < 0.34 { c.breakthrough = true }`）。
- 满蓄力瞄准射击消耗「破局」，改为发射**破局矢**，伤害按生命值上限结算（`aimed.go`）。

### 4. 元素战技 E（萦络纵命索 / Lingering Lifeline）

- 伤害 = `skill[天赋等级] × 生命值上限`，**22.6136% → 53.7073%**（`skill.go` `FlatDmg: skill[...] * c.MaxHP()`）。
- 冷却 **600 帧 = 10 秒**；命中产 **4 颗水元素微粒**（粒子 ICD 0.3 秒）。
- 机制：沿路径牵引并标记敌人，移动结束时对**所有被标记目标**炸一次伤害。
- 命中时若 Q 的玄掷玲珑在场，**额外触发一次协同攻击**（`skill.go` 中 `if c.StatusIsActive(burstKey) { c.summonExquisiteThrow() }`）。

### 5. 元素爆发 Q（玄掷玲珑 / Depth-Clarion Dice）

| 项 | 值 |
| --- | --- |
| 初始爆发倍率 | 生命值上限的 7.308% → 17.3565%（`burst`） |
| 协同攻击单发倍率 | 生命值上限的 4.872% → 11.571% × 3 发（`burstDice`） |
| 持续时间 | **15 秒**（900 帧，`c.AddStatus(burstKey, 15*60, false)`） |
| 冷却 | **18 秒**（`c.SetCD(action.ActionBurst, 18*60)`） |
| 能量消耗 | 70 |
| 协同攻击触发条件 | 普通攻击命中，或 E 命中（`minazuki.WithMandatory(..., 60, ...)`） |
| 协同攻击间隔 | **ICD 60 帧 = 1 秒**（1 秒内最多触发一次，每次 3 发） |
| 挂水节奏 | 注释：每第 3 次命中附着水（`// apply hydro every 3rd hit`） |

### 6. 固有天赋

| 天赋 | 触发条件 | 数值 |
| --- | --- | --- |
| A1（中文名未核到） | 队伍元素类型数量 1 / 2 / 3 / 4 种 | **生命值上限 +6% / 12% / 18% / 30%**（代码：`count*0.06`，4 种时固定 0.30） |
| A4（中文名未核到） | 玄掷玲珑存在期间 | 当前场上角色**伤害 +1%，每秒再 +3.5%，上限 +50%**，持续 15 秒；重放 Q 会清掉旧层（`asc.go` `a4()`） |
| 生活天赋 | 源码未实现 | **未核到** |

夜兰与生命值上限的挂钩点共四处：破局矢 11.576%~27.493%、E 22.6136%~53.7073%、Q 初始 7.308%~17.3565%、协同单发 4.872%~11.571%（均按生命值上限结算）。

### 7. 命座 C1 ~ C6（数值全部来自源码，中文原名未核到）

| 命座 | 英文语义 | 数值与机制 |
| --- | --- | --- |
| C1 | E 使用次数 +1 | 元素战技次数 **2 次**（`yelan.go` `SetNumCharges(action.ActionSkill, 2)`） |
| C2 | 协同攻击追加伤害 | 每次协同额外 **生命值上限 × 14%**，**ICD 1.8 秒**（108 帧，`burst.go` `14.0/100*hp`、`c.c2icd = c.Core.F + 1.8*60`） |
| C3 | Q 等级 +3 | `BurstCon = 3` |
| C4 | 标记敌人提升全队生命上限 | 每个被 E 标记的敌人 **生命值上限 +10%**，**上限 +40%**，**持续 25 秒**（1500 帧），作用于全队（`skill.go`） |
| C5 | E 等级 +3 | `SkillCon = 5` |
| C6 | Q 后强化 | Q 释放后获得 **20 秒**的 C6 状态（`burst.go` `c.Core.Status.Add(c6Status, 20*60)`）；**具体强化效果在已抓取文件中未实现/未体现，未核到** |

---

## 三、未核到清单（不要猜）

1. 两人全部命座与固有天赋的**中文原名**（hakush.in / yatta.moe 不可达）。
2. **90 级基础面板**：生命 / 攻击 / 防御白值、突破加成属性 —— gcsim 源码只引用 `BaseATK`、`MaxHP` 计算派生量，不含面板白值。
3. 夜兰 **C6 的具体效果实现**（源码仅体现 20 秒状态计时）。
4. 两人**生活天赋**数值。
5. 胡桃 Q 治疗的具体触发对象上限解释（源码仅限制最多 5 次回调）。

## 四、抓取记录

- 成功：`raw.githubusercontent.com/genshinsim/gcsim/main/internal/characters/hutao/{cons,skill,burst,charge,asc,hutao}.go`、`.../hutao/zz_hutao.dm.go`；`.../yelan/{skill,asc,burst,yelan,aimed}.go`、`.../yelan/zz_yelan.dm.go`；`api.github.com/repos/genshinsim/gcsim/contents/internal/characters/{hutao,yelan}`。
- 404：`.../hutao/char.go`、`.../yelan/char.go`、`.../yelan/cons.go`（夜兰确实无该文件）。
- 被墙/失败：`api.hakush.in/gi/data/zh/character/10000046.json`、`.../10000060.json`、`gi.yatta.moe/api/v2/CHS/avatar/10000046`（web_fetch 与 curl 走 7890 代理均为 fetch failed / 空响应）。

EVIDENCE: docs/04b-baseline-hutao-yelan.md|10546|2a8156cc22e5
