# 07 · Reddit / Telegram / wotpack 原图追查

任务：为「原神 7.4 深测」璃月老角色加强的四张 emoji 爆料图寻找原图与符号解读。以下全部为公开可读页面，未登录、未安装任何软件。

## 一、各渠道结果

| 渠道 | 具体地址 | 结果 |
| --- | --- | --- |
| Telegram 网页预览 | https://t.me/s/vanileaks | 抓不到；直连与经 127.0.0.1:7890 均为 SSL 握手失败（curl 报 schannel failed to receive handshake，http_code 000） |
| Telegram 网页预览 | https://t.me/s/ToukoLeaks 、/hxg_diluc 、/genshinleaks 、/GenshinIntel | 同上，五个频道表现完全一致，全部未取得任何 HTML |
| web_fetch 通道 | https://t.me/s/vanileaks | 失败，返回 TypeError: fetch failed |
| Reddit JSON | https://www.reddit.com/r/Genshin_Impact_Leaks/search.json?q=7.4%20Liyue&restrict_sr=1&sort=new&limit=50 | 失败，返回 TypeError: fetch failed，未取得任何帖子数据 |
| wotpack.ru 站内搜索 | https://wotpack.ru/?s=Genshin+7.4 | 成功，HTTP 200，返回 2026 年内 7.1 至 7.4 系列文章列表 |
| wotpack.ru 爆料文 | https://wotpack.ru/poyavilis-novye-insaydy-o-baffah-geroev-v-genshin-impact/ | 成功，HTTP 200，正文 9949 字符，含名单归属与图片来源说明 |
| wotpack.ru 版本汇总 | https://wotpack.ru/obnovlenie-7-4-v-genshin-impact-kogda-vyydet-bannery-novye-personazhi-i-usileniya/ | 成功，HTTP 200，正文 8688 字符 |

结论：Telegram 与 Reddit 在本机网络环境下不可达（非 403，而是 TLS 层被重置），因此无法取得任何 TG 频道原图或 CDN 直链。唯一可用渠道是 wotpack.ru。

## 二、wotpack 抄回的名单归属（俄语原文对照）

- 出处：Ferskani，2026-09-09，《Появились новые инсайды о баффах героев в Genshin Impact》。
- 前两波加强：蒙德角色在 6.2、Звёздный проводник 角色在 6.7；下一波在第 7.4 版海灯节（Праздник морских фонарей）。
- hxg_diluc 转述 DK2 的名单：钟离（Чжун Ли）、魈（Сяо）、刻晴（Кэ Цин）、烟绯（Янь Фэй）、甘雨（Гань Юй）。DK2 对胡桃（Ху Тао）是否加强表示不了解。
- LoveHappy 的主张：除上述外还会加强胡桃、重云（Чун Юнь）、夜兰（Е Лань）。wotpack 明确括注该源「почти в половине данных ошибается」（近一半数据出错），要求按可疑来源对待。
- ToukoLeaks 的说法：新一波加强是「会一起上场」的璃月角色，类比岩系列武器（Каменное оружие）按队伍中岩元素人数生效的被动词条。
- WWWhatever 补充：绝大多数璃月四星会被加强；明确不包括达达利亚（Тарталья）、散兵（Странник）、神里绫华（Аями Камисато）。
- 反面证据：Bubblefish 数月前给出的名单（达达利亚、散兵、绫华、魈）被认为有误；tw741 基本同意「搞好关系是真的」提到的神里绫人、莱依拉、鹿野院平藏、兰艳等，但对部分四星例外。
- 配图版权声明：该文所用图片作者为 Gjd12751。

## 三、关于 emoji 符号解读

未找到。wotpack 两篇文章都只以文字转述爆料者名单与来源归属，没有逐条罗列 emoji 图上的符号与其含义，也没有逐格描述四张图的排版。站内搜索列表亦未出现专门解读 emoji 图的文章标题。因此本渠道无法提供任何 symbol 到含义的映射。

关于「加强名单图」：未找到独立于正文的名单图。文章正文内嵌的爆料截屏（skriny-insaydov-o-baffah-geroev-li-yue.jpg）是爆料者消息截图的拼图，不是 emoji 图，也不是独立名单图；其内容需人工看图确认，本次未做 OCR。

## 四、已下载图片清单

| 文件名 | 绝对路径 | 字节数 | sha256 前12位 |
| --- | --- | --- | --- |
| wotpack-璃月加强名单截屏-01.jpg | assets/more\wotpack-璃月加强名单截屏-01.jpg | 108646 | 0EF6A15992AD |
| wotpack-题图璃月五人-02.jpg | assets/more\wotpack-题图璃月五人-02.jpg | 566632 | E47F3846FD13 |
| wotpack-74题图灯会-03.jpg | assets/more\wotpack-74题图灯会-03.jpg | 59464 | 7CFD828B7F79 |

说明：抓取过程中先按 URL 批量落过 14 张图，其中多数是文末推荐位配图（2026/11 普通攻略封面），无情报价值，已在本轮清理，只保留上表三张与本文直接相关的图。目录内未覆盖任何既有文件。

## 五、失败记录（原样保留）

- Telegram 五频道、Reddit 搜索接口：SSL 握手失败或 fetch failed，无返回体，非 HTTP 错误码。
- 未尝试任何需登录接口；未安装任何软件；除本目录与本文外未改动磁盘。

EVIDENCE: docs/07-reddit-tg-hunt.md|5032|64AD0CD5F981
