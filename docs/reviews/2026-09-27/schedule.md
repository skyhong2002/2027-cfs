# 手機活動時程文字被截斷，需要橫向捲動才能讀完

回饋：海鷗。狀態：已重現。

## 重現／查看步驟

1. 使用 390×844 手機尺寸。
2. 開 #place-staff-popup。
3. 往下捲至「活動時程」，不要先橫向拖動。

## 實際觀察

timeline 可視寬 294px，內容 scrollWidth 為 640px，white-space: pre。日期右側的說明被截斷，例如「公開宣傳、議程徵稿（預計）」無法一次讀完；截圖可見水平捲軸。

## 驗收條件

- [ ] 320–430px 下日期和完整事件文字可閱讀，不需額外橫向捲動。
- [ ] 長文字合理換行且日期／連線對齊；中英文都檢查。
- [ ] 活動詳情彈窗縱向捲動保持正常。

## 證據

- [mobile-schedule.jpg](evidence/mobile-schedule.jpg)

## 相關

src/components/section/Time.astro
