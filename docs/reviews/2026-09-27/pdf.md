# 修復 PDF 匯出的分頁、檔案大小與可交付性

GitHub issue：[#50](https://github.com/skyhong2002/2027-cfs/issues/50)。

回饋：無風。狀態：已重現（Chromium A4）。

## 重現／查看步驟

1. 桌面開首頁，點 Navbar「匯出 PDF」。
2. 使用 A4、背景圖形開啟輸出。此次自動化確認按鈕呼叫 window.print，並以 Chromium Page.printToPDF 產生相同列印 CSS 的 PDF，沒有操作 OS 列印對話框。
3. 查看 PDF 第 10／11 頁、總頁數與檔案大小。

## 實際觀察

輸出 44 頁，78,647,918 bytes（約 78.6 MB／75 MiB）。第 10 頁只有「選擇適合你的方案」標題與大片空白，第 11 頁才是比較表；列印模式同時展開 44 個 popup。原始輸出留存本機，repo 附頁面轉圖、pdfinfo、SHA-256 與逐頁文字，避免把 78.6 MB 檔案塞入 git。圖表在本次 PDF 有顯示，未把它誤報成空白。

## 驗收條件

- [ ] 標題與主要內容避免分離，不產生只有單一標題的空白頁。
- [ ] 決定對外 PDF 的內容範圍與合理頁數，避免直接把所有 popup 無差別展開。
- [ ] 優化影像與輸出體積，團隊訂定可寄送的檔案大小上限。
- [ ] 逐頁檢查表格、圖片、長文、聯絡方式；Chrome／Edge 至少一次人工列印驗收，中英文檢查。

## 證據

- [pdf-page-10.jpg](evidence/pdf-page-10.jpg)
- [pdf-page-11.jpg](evidence/pdf-page-11.jpg)
- [pdf-page-7.jpg](evidence/pdf-page-7.jpg)
- [export-a4-info.txt](evidence/export-a4-info.txt)
- [export-a4.txt](evidence/export-a4.txt)

## 相關

src/components/Popup.astro、各元件 @media print、src/pages/index.astro。
