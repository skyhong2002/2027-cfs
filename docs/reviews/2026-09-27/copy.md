# 10/2 前同步最新品項文案試算表並驗證網站資料來源

GitHub issue：[#58](https://github.com/skyhong2002/2027-cfs/issues/58)。

回饋：會議共識。狀態：交付任務；試算表內容本次未讀取／未修改。

## 重現／查看步驟

1. 行銷在本次指定的「贊助徵求書排序及文案 - SITCON 2027」修改品項內容。
2. 開對應網站品項與各分類，比對最新核定文字。
3. 檢查 scripts/sheet.json 的公開 CSV 設定與指定試算表的對應關係。

## 實際觀察

目前網站使用 repo 中的靜態資料；scripts/sheet.json 使用 published 2PACX ID，僅靠該 ID 不能判定是否就是本次 1ggq2rcQF1N_KAs_hiLFxa-61mBU1nvT_mx7PLWUtvg4 試算表。本次未讀取私有表格、未執行 fetch-data，也未宣稱已比對最新文案。此單追蹤資料同步與驗收，不代替 #38 的文案撰寫。

## 驗收條件

- [ ] 確認指定試算表、發布 CSV、各分頁 gid 與品項 ID 的對應及讀取權限。
- [ ] 行銷定稿後同步通用描述、三類用途、排序與中英文，逐項檢查網站卡片／popup／PDF。
- [ ] 匯入不覆蓋尚待確認的正式商務資料；沿 #13、#19 檢查價格／期限。
- [ ] 2026-10-02（Asia/Taipei）前完成定稿、同步、建置與發布驗收。

## 證據

- [extra-chair.jpg](evidence/extra-chair.jpg)
- [desktop-popup-after.jpg](evidence/desktop-popup-after.jpg)

## 相關

來源：https://docs.google.com/spreadsheets/d/1ggq2rcQF1N_KAs_hiLFxa-61mBU1nvT_mx7PLWUtvg4/edit?gid=0#gid=0
相關 #38、#13、#19；scripts/sheet.json。
