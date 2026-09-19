# SITCON 2027 原始資料查核

查核日期：2026-09-20。用途：讓 2027 prototype 僅顯示可核實的今年資訊；未核實欄位明顯標記待公布，不以過去年度數字或日期補齊。

## 可直接使用的 2027 資料

| 欄位 | 可核實內容 | 精確來源 | 判讀 |
| --- | --- | --- | --- |
| 活動名稱 | SITCON 2027 學生計算機年會 | <https://sitcon.org/2027/> | 官方 2027 頁面 |
| 活動日期 | 2027 年 3 月 13 日（六） | <https://sitcon.org/2027/>；<https://gitlab.com/sitcon-tw/2027/-/work_items/236> | 官網與本年度官方任務描述一致 |
| 地點 | 中央研究院人文社會科學館 | <https://sitcon.org/2027/>；<https://gitlab.com/sitcon-tw/2027/-/work_items/236> | 兩個來源一致 |
| 合作聯絡信箱 | contact@sitcon.org | <https://sitcon.org/2027/> | 官網導覽、2027 區塊與 footer 均提供；可作洽詢入口 |
| 贊助資訊公開狀態 | 尚未公布 | <https://sitcon.org/2027/> | 官網明確說明 2027 徵稿與贊助資訊尚未公布；該頁其他年份連結為回顧資料 |

官網的歷年累積人數、2025 單屆參與人次、學校數、背景比例，均**不是 2027 成果或 2027 預估**，不帶入 prototype 的數字欄位。照片則依使用者最後修正保留原有呈現，授權集中於影像來源頁。

## Google 試算表與現有資料管線

### README 所指的 2027 試算表

- 文件網址：<https://docs.google.com/spreadsheets/d/1VCkTOO8Jb1EilClyu3acL9NXixV0-euB1kSoPPod2Bk/edit>
- 來源脈絡：本 repo `README.md` 稱為「2027 年 Google 試算表」。
- 未登入公開讀取 `edit`、`export?format=csv&gid=592413769`、`gviz/tq?tqx=out:csv&gid=592413769` 均回應 HTTP 401。
- 結論：能確認 README 的指向，**不能確認其中的任何價格、權益或截止日**。未使用或要求帳號權限；不能把讀取受限解讀成檔案不存在。

### `scripts/sheet.json` 已發布的 CSV

此來源能公開讀取，但內容含大量過年度截止日，不能認定為 2027 核定資料。README 的編輯 ID 與發布 ID 不同，且原文件受限，本次也無法獨立證明二者對應關係。

- 品項：<https://docs.google.com/spreadsheets/d/e/2PACX-1vRqAYtLs5ZnyDruqzu_EIS8FvZOlGigPL9QkjtPMHpRmy0oOI7dzX-NH59UzoQFn84EYjQwDzgP7BkW/pub?gid=0&single=true&output=csv>
- 方案：<https://docs.google.com/spreadsheets/d/e/2PACX-1vRqAYtLs5ZnyDruqzu_EIS8FvZOlGigPL9QkjtPMHpRmy0oOI7dzX-NH59UzoQFn84EYjQwDzgP7BkW/pub?gid=592413769&single=true&output=csv>
- 品項說明：<https://docs.google.com/spreadsheets/d/e/2PACX-1vRqAYtLs5ZnyDruqzu_EIS8FvZOlGigPL9QkjtPMHpRmy0oOI7dzX-NH59UzoQFn84EYjQwDzgP7BkW/pub?gid=1029987303&single=true&output=csv>

可觀察的資料問題：

- 品項第一筆「午餐旗、點心旗」截止時間為 `2025/12/25`，其他品項與 repo JSON 留有 2026 年截止日。
- 網路宣傳說明仍有 `2026/06/28` 的曝光結束時間。
- 方案 CSV 顯示領航級 179,000、深耕級 109,000、前瞻級 79,000、新芽級 35,000；**僅記錄來源現況，不代表已核定的 2027 價格**。
- 攤位、贈票、R0 影片、曝光及社群貼文數量同樣不能因出现在這份 CSV 就當成 2027 核定權益。

建議：今年方案／價格／權益未經可讀的 2027 決議交叉確認前，標記「2027 方案規劃中」「價格待公布」「權益待確認」。若要測試比較與選配操作，使用明確的 placeholder 資料，避免沿用既有價格並只替換年份。

## 官方 GitLab 公開專案

### 查閱範圍與限制

- 官方群組：<https://gitlab.com/sitcon-tw>
- 公開專案清單 API：<https://gitlab.com/api/v4/groups/sitcon-tw/projects?include_subgroups=true&per_page=100>
- 2027 主專案：<https://gitlab.com/sitcon-tw/2027>（project ID `84406071`）。讀取公開 issues 全部分頁，repository 只列出 `LICENSE`。
- 行銷組 2027 專案：<https://gitlab.com/sitcon-tw/marketing/2027>（project ID `85894247`）。公開 metadata 可見；公開 issue 列表為空；repository 與 wiki API 回 HTTP 403。不能據此判斷沒有內部資料。
- 主專案 issue 的描述可讀，但 notes API 回 HTTP 401，因此**未驗證討論串中的額外決議**。

### 與今年 CFS 直接相關的公開任務

| 官方任務 | 公開內容 | 可採用程度 |
| --- | --- | --- |
| [#236 手寫感謝信](https://gitlab.com/sitcon-tw/2027/-/work_items/236) | 明載 2027-03-13（六）、中央研究院人文社會科學館；感謝對象與寄送仍待確認 | 可交叉確認活動日期／地點；不可推定贊助權益 |
| [#234 SITCONTIX 廣告版位 template](https://gitlab.com/sitcon-tw/2027/-/work_items/234) | 要求評估企業 Logo 版位、popup、曝光／CTR 數據及維護文件；內部 template 期限 2026-10-02，描述提到 10/5 開始寄信 | 2027 真實工作項，但功能仍為需求；不能當成已可交付權益。10/5 是內部寄信時程，不是贊助截止日 |
| [#181 SITCONTIX 廣告可行性與觀感](https://gitlab.com/sitcon-tw/2027/-/work_items/181) | 已關閉；描述為評估，可能提供給補助清寒交通費的企業作獨特曝光 | 關閉狀態本身不等於某定價／權益定案；notes 無法讀取 |
| [#179 遠道而來票贊助規劃](https://gitlab.com/sitcon-tw/2027/-/work_items/179) | 開啟中，due date 2026-10-16；公開 description 為空 | 無法核實方案、人數、價格或權益；due date 是工作期限 |
| [#102 遠道而來票討論](https://gitlab.com/sitcon-tw/2027/-/work_items/102) | 對象、贊助誘因、宣傳管道、基金會合作等規劃方向 | 可支持「正在規劃支持參與的方式」，無法支持具体金額／資格／執行承諾 |
| [#76 CFS 資訊流調整](https://gitlab.com/sitcon-tw/2027/-/work_items/76) | 開啟中、工作期限 2026-10-15 | 沒有公開的方案與價格內容 |
| [#75 CFS 資訊流調整](https://gitlab.com/sitcon-tw/2027/-/work_items/75) | 已關閉、工作期限 2026-10-01 | 描述僅說明討論資訊流；無公開價目 |

## 2027 prototype 欄位處理建議

| 欄位                                        | 建議呈現                                                                        |
| ------------------------------------------- | ------------------------------------------------------------------------------- |
| 日期、地點                                  | 可直接呈現已核實的 2027-03-13 與中央研究院人文社會科學館                        |
| 合作聯絡                                    | 可使用 `contact@sitcon.org`；不要沿用去年個人姓名、私人電話或舊任組長聯絡資料   |
| 方案名稱、價格、各級權益                    | 顯著 placeholder，待可讀的 2027 正式資料／核定決議                              |
| 品項售價、數量、獨家承諾、截止日            | 顯著 placeholder；不可把舊截止日期年份 +1                                       |
| 開源築夢／遠道而來補助資格、人數、金額      | 附件中討論可供設計，但本次官方公開來源尚不足以核實；待行政與行銷確認            |
| SITCONTIX 廣告、追蹤、其他新功能            | 官方仍在規劃中的功能，標示待確認；不可列成已保證交付                            |
| 2027 受眾成果、活動照片、講者、實際合作案例 | 尚無本年度活動成果；使用清楚 placeholder，依使用者要求不以歷年資料充數          |
| 贊助洽談截止日                              | 本次沒有核實到；標記待公布。10/5、10/15、10/16 等內部工作日期不可誤作對外截止日 |

此文件只記錄研究結果，沒有修改 Google 試算表、GitLab 任務、網站資料或圖片，也沒有對任何人發送聯絡訊息。
