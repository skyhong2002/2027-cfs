# 2026-09-27 贊助徵求書再再 Review：操作與截圖紀錄

- 網站：https://skyhong2002.github.io/2027-cfs/
- 核對 main：`d45ac2473b4c360ae742017080db33a877b74f80`。測試時未修改網站程式。
- 日期：2026-09-27（Asia/Taipei）。瀏覽器：Chromium 153.0.8010.12，Linux headless。
- 桌面 1440×1000；手機 390×844、touch/mobile 模擬，deviceScaleFactor 1。未把模擬當成 iOS／Android 真機驗證。
- 證據為正式預覽站的原始截圖、DOM 量測、實際 click／鍵盤／CDP touch 手勢；封鎖 Google Analytics 與所有 POST，沒有送出聯絡表單或寄信。
- PDF：確認導覽按鈕呼叫 window.print；再用 Page.printToPDF、A4、背景圖形開啟輸出。沒有自動化操作 OS 的列印視窗。
- 原 PDF 44 頁、78,647,918 bytes，為避免 repository 膨脹，本包保留指定頁面 JPEG、全文 text、pdfinfo 與 SHA-256；原 PDF 留在本機 `/tmp/cfs-review-export-a4-original.pdf`。

## GitHub 追蹤

- [總追蹤 #39](https://github.com/skyhong2002/2027-cfs/issues/39)
- [10/2 最終版里程碑](https://github.com/skyhong2002/2027-cfs/milestone/1)
- 共 19 張子議題（#40–#58），附步驟、狀態、截圖與驗收條件。

## 回饋逐項對應

| 編號 | 回饋者 | 問題／提案 | 核對狀態 |
| --- | --- | --- | --- |
| 1 | Denny | [#40 合作方向 CTA 跳到品項並自動選取對應分類](https://github.com/skyhong2002/2027-cfs/issues/40) · [證據紀錄](cta.md) | 已重現 |
| 2 | 阿六、Neko | [#41 精簡新聞截圖數量與文字密度](https://github.com/skyhong2002/2027-cfs/issues/41) · [證據紀錄](news.md) | 現況已重現；內容取捨待決策 |
| 3 | NT | [#42 椅套品項就近說明 R0／R1／R2 容量與場地差異](https://github.com/skyhong2002/2027-cfs/issues/42) · [證據紀錄](chair.md) | 已重現 |
| 4 | Bonnie、Yoru | [#43 精簡 Navbar 並調整導覽順序](https://github.com/skyhong2002/2027-cfs/issues/43) · [證據紀錄](nav.md) | 現況已重現；會議要求已列明 |
| 5 | Yoru | [#44 聯絡入口改為 mailto 並調整 Contact 的位置](https://github.com/skyhong2002/2027-cfs/issues/44) · [證據紀錄](contact.md) | 現況已重現；表單保留方式待決策 |
| 6 | Yoru | [#45 將活動／場地詳情入口提前到方案選購之前](https://github.com/skyhong2002/2027-cfs/issues/45) · [證據紀錄](venue.md) | 已重現 |
| 7 | Yoru | [#46 調整頁面後段大片黑色區塊的視覺銜接](https://github.com/skyhong2002/2027-cfs/issues/46) · [證據紀錄](dark.md) | 現況已截圖；視覺方案待決策 |
| 8 | 海鷗、Yoru | [#47 整併前後重複敘事並確認 section 排序](https://github.com/skyhong2002/2027-cfs/issues/47) · [證據紀錄](structure.md) | 現況已截圖；資訊架構待決策 |
| 9 | 海鷗 | [#48 手機活動時程文字被截斷，需要橫向捲動才能讀完](https://github.com/skyhong2002/2027-cfs/issues/48) · [證據紀錄](schedule.md) | 已重現 |
| 10 | 海鷗 | [#49 評估手機贊助方案預設收合與展開入口](https://github.com/skyhong2002/2027-cfs/issues/49) · [證據紀錄](collapse.md) | 設計提案；現況已量測 |
| 11 | 無風 | [#50 修復 PDF 匯出的分頁、檔案大小與可交付性](https://github.com/skyhong2002/2027-cfs/issues/50) · [證據紀錄](pdf.md) | 已重現（Chromium A4） |
| 12 | NT | [#51 改善「回顧 2026 年」手機數字與說明換行](https://github.com/skyhong2002/2027-cfs/issues/51) · [證據紀錄](review.md) | 現況已重現 |
| 13 | NT | [#52 改善「受眾與統計」手機彈窗的圖表與閱讀密度](https://github.com/skyhong2002/2027-cfs/issues/52) · [證據紀錄](stats.md) | 現況已截圖；改善目標待確認 |
| 14 | tang yu | [#53 品項彈窗左右切換未沿用目前分類排序](https://github.com/skyhong2002/2027-cfs/issues/53) · [證據紀錄](order.md) | 已重現 |
| 15 | tang yu | [#54 追查品項切換後樣式不一致的觸發條件](https://github.com/skyhong2002/2027-cfs/issues/54) · [證據紀錄](style.md) | 未重現外觀失真；分類文案情境有落差 |
| 16 | tang yu | [#55 品項彈窗加入明確的上一項／下一項箭頭](https://github.com/skyhong2002/2027-cfs/issues/55) · [證據紀錄](arrows.md) | 已重現 |
| 17 | tang yu | [#56 手機長文彈窗斜向下滑會誤切到下一個品項](https://github.com/skyhong2002/2027-cfs/issues/56) · [證據紀錄](scroll.md) | 已重現 |
| 18 | tang yu | [#57 評估手機方案固定表頭／品項欄並同時比較兩方案](https://github.com/skyhong2002/2027-cfs/issues/57) · [證據紀錄](sticky.md) | 新設計提案；目前行為已重現 |
| 19 | 會議共識 | [#58 10/2 前同步最新品項文案試算表並驗證網站資料來源](https://github.com/skyhong2002/2027-cfs/issues/58) · [證據紀錄](copy.md) | 交付任務；試算表內容本次未讀取／未修改 |

阿六與 Neko 的新聞數量／密度回饋合併同一項；Bonnie 與 Yoru 的 Navbar 回饋合併同一項。NT 的「回顧 2026」與統計彈窗分開追蹤。原阿「LGTM」記為無新增待辦，不建立空 issue。

## 待決策與不能誤報的地方

- 手機預設收合與固定表頭／兩方案比較分開記錄，最後須形成同一套展開行為。
- 本版整表自由滑動是先前明確要求；新的 sticky 提案是需求變更。
- 「樣式不一致」本次未重現外框跑版，保留問題單補觸發條件。
- 「最後黑色區塊」截取 time 與 footer，待確認所指範圍。
- 「session 可能回到 2026」按 section／資訊流提案記錄，沒有擅自改回舊年度。
- 原始回饋中的「手機使用者通常不看」是待驗證假設。
- 指定文案試算表僅作交付來源引用；本次未讀取／修改、未執行 fetch-data，不能宣稱已同步最新文案。

## 重跑操作

`reproduce.cjs` 是本次審查腳本；使用 Playwright 連到獨立的 Chromium CDP 埠（預設 9334，可用 CDP_URL 指定）。先啟動專用 headless Chromium，再執行：

```bash
PLAYWRIGHT_MODULE=/path/to/playwright node reproduce.cjs desktop
PLAYWRIGHT_MODULE=/path/to/playwright node reproduce.cjs mobile
PLAYWRIGHT_MODULE=/path/to/playwright node reproduce.cjs extra
PLAYWRIGHT_MODULE=/path/to/playwright node reproduce.cjs pdf
```

腳本會覆寫 evidence 中同名檔案，PDF 原檔不納入 git。PDF 轉圖使用 `pdftoppm -f N -l N -r 90 -jpeg -singlefile`。量測 JSON 分別在 evidence/desktop.json、mobile.json、extra.json、pdf.json。

## 交付期限

2026-10-02（Asia/Taipei）最終版。此次只建立具體 issue 與證據，不代表已完成修正或設計決策。
