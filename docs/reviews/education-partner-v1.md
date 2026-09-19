# 教育公益／CSR 合作窗口：第一版操作回饋

這是代理依企業教育公益窗口情境進行的模擬操作，並非真實合作夥伴訪談。測試地址為 `http://127.0.0.1:4321/2027-cfs/`，使用 Chromium 桌面 1440 × 1000、手機 390 × 844，偏好減少動態。所有 POST 請求均攔截，沒有寄信、送出外部表單或真的聯絡任何人。

## 情境與結論

「基金會希望支持因經濟因素難以參與技術交流的學生，需要了解支援方式、計畫資格、可支持的人數，以及可以帶回內部審核的內容。」

目前可以從計畫說明走到合作清單、產生可檢視的信件草稿，再準備寄出。桌面與手機均可完成；不需要先選企業曝光方案。所有價格待確認屬於目前資料狀態，不能據此判定介面故障，也不能推估為零元。

我能直接讀懂以下差異：

- 遠道而來票：提供參與票券，不含交通與住宿補助。
- 開源築夢計畫：票券加上交通與住宿補助，對象不限偏鄉學生。
- 本版列的是規劃中的合作回饋；人數、金額、資格細則、補助上限與曝光規格仍待確認。

「加入開源築夢洽談需求」用語清楚，清單也明確標示沒有計入小計。信件草稿自動附上這項意願、基金會輸入的資格／補助／成果報告問題，以及「不是訂單、正式報價或名額保留」說明。畫面顯示尚未寄出，沒有製造已送達的假象。

## 實測紀錄

| 任務                                      | 結果                                               |
| ----------------------------------------- | -------------------------------------------------- |
| 空清單進站                                | 顯示可先瀏覽或直接聯絡，小計為破折號，沒有宣稱免費 |
| 以鍵盤 Enter 加入築夢需求                 | 成功；按鈕 `aria-pressed` 更新，清單新增築夢項目   |
| 重新載入                                  | 築夢選擇保持                                       |
| 填入測試單位、姓名、Email、問題並產生草稿 | 成功；完整需求包含在 textarea 與 mailto 中         |
| 個資是否寫入 localStorage                 | 沒有；保存的是 tierId、itemIds、dream              |
| 切到英文頁                                | 需求保留，築夢清單改為英文                         |
| 英文品項鍵盤開啟                          | URL 保持 `/en/item/6/`；焦點進入關閉按鈕           |
| Dialog Tab、Escape                        | 焦點留在 dialog；Escape 關閉                       |
| Browser Back／Forward                     | Back 關閉 dialog，Forward 重新打開，英文路徑維持   |
| 英文品項直達＋reload                      | 英文 dialog 正常恢復                               |
| 手機選單前往築夢                          | 可前往並收合選單，無水平溢出                       |
| 手機移除全部選擇                          | 回到清楚的空狀態                                   |
| 手機空清單產生聯絡草稿                    | 成功，草稿說明尚未選方案、希望先討論目標           |
| 壞掉的 localStorage JSON                  | 不崩潰，顯示空清單；另有下述錯誤警告問題           |
| Runtime page errors                       | 本次路徑未出現                                     |

## 具體問題

### EDU-01：列印缺少活動識別，且夾帶頁面導覽

追蹤：[Issue #11](https://github.com/skyhong2002/2027-cfs/issues/11)。已修正並完成回歸：print-only 標頭包含 SITCON 2027、Email 與網址；頁面導覽在列印時隱藏。以下保留初次發現的重現紀錄。

優先級：P1。重現方式：加入築夢需求，列印／輸出 PDF。已輸出 `/tmp/cfs-browser-audit/education-proposal.pdf` 並使用 `pdftotext` 檢查實際 PDF。

實際列印內容從「01 認識受眾、02 比較方案、03 選配品項、04 整理需求」導覽開始；清單主標是「把想法，整理成下一步」，文件本身沒有 SITCON 2027 名稱、聯絡 Email 或可回到徵求書的網址。企業將 PDF 轉寄主管或列印時，不容易識別是哪個活動的提案。

原因：print CSS 隱藏 `main > section:not(#proposal)`，但沒有隱藏 main 內的導覽；全站 header/footer 被隱藏後，也沒有替清單提供列印專用的活動識別。

建議：列印只保留清單，加入「SITCON 2027 合作討論清單」、官方聯絡方式與網站連結。驗收需同時看中英文 PDF，確認導覽消失且識別資訊可見；保留非正式報價與金額待確認說明。

### EDU-02：損壞資料修復後，仍錯誤顯示「無法儲存」

追蹤：[Issue #12](https://github.com/skyhong2002/2027-cfs/issues/12)。已修正並完成回歸：成功寫入後清除警告，reload 可恢復選擇；真的禁止 storage 時仍保留提醒。以下保留初次發現的重現紀錄。

優先級：P2。重現方式：將 `cfs2027-proposal-v1` 的 localStorage 設為 `{broken`，reload，再加入築夢需求。

畫面最初顯示「此瀏覽器無法儲存清單」。加入後已成功寫回有效 JSON `{"tierId":null,"itemIds":[],"dream":true}`，但警告仍保持，與實際可儲存的狀態矛盾。

建議：分開處理「舊內容無法解析」與「瀏覽器禁止寫入」；成功寫入時恢復 storageAvailable 狀態並清除過期警告。驗收包括 corrupt JSON、成功重新選擇後 reload 還原，以及真正禁止 storage 時仍有適當提醒。

## 非故障的後續討論點

CSR 窗口接下來需要行政組確認申請資格、審核方式、補助上限、支持名額與成果回報形式。這些目前已有待確認文字，可以先完成合作意願洽談；等資料確認後再補上，不應自行填造數字或改成已承諾權益。

暫存測試腳本與結果位於 `/tmp/cfs-browser-audit/education.cjs`、`education.json`，手機畫面為 `education-mobile-dream.png` 與 `education-mobile-proposal.png`。本次沒有修改 UI、資料或 Git commit。

## 可重用整合 smoke

新增 `scripts/browser-smoke.cjs`。優先使用專案的 Playwright devDependency；也可透過環境指定外部 Playwright package，並將同一份測試用於本機或部署網址：

```bash
PLAYWRIGHT_MODULE=/tmp/weave-browser/node_modules/playwright \
CFS_TEST_URL=http://127.0.0.1:4321/2027-cfs \
CFS_SMOKE_OUTPUT=/tmp/cfs-browser-audit/regression \
node scripts/browser-smoke.cjs
```

一般先使用 `require("playwright")`，找不到時再採用 `PLAYWRIGHT_MODULE`。若需手動指定 Chromium，設定 `BROWSER_EXECUTABLE`。腳本啟動時最多等候服務就緒 15 秒，避免 CI 背景啟動伺服器的時序問題。輸出包含 JSON 結果、桌面／手機 PDF 與畫面；失敗會回傳非零 exit code。所有 POST 一律阻擋並記錄為失敗，測試不開啟 mailto 或送信。

驗收涵蓋桌面／手機的 root、中英文 item／quotation 與文件標題，方案＋品項＋築夢選擇、Plan C 合作方向進入中英文草稿（Issue #14）、reload、草稿個資不保存、待確認不變為零元、列印識別、英文 history back／forward、鍵盤 dialog、損壞／禁止 storage，以及 same-site HTTP 錯誤和 runtime exceptions。Native dialog 的 Tab 循環容許瀏覽器焦點暫回 BODY（browser chrome）；不允許背景頁面的控制項取得焦點。

整合回歸結果：本機桌面與手機共 **23 組檢查全部通過**；沒有 POST 嘗試、runtime exception 或同站 HTTP 錯誤。Issue #11、#12 與 #14 的驗收均涵蓋其中。PDF 另以 `pdftotext` 確認活動名稱與聯絡資訊已實際輸出。
