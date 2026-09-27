# 追查品項切換後樣式不一致的觸發條件

回饋：tang yu。狀態：未重現外觀失真；分類文案情境有落差。

## 重現／查看步驟

1. 人才招募開第一項，按右方向鍵。
2. 重新整理 item/19 深連結。
3. 比較全部分類開彈窗並切換後的外觀。

## 實際觀察

本次 Chromium 桌面上，方向鍵切換及 item 深連結重整後仍維持相同圖片／文字兩欄 popup 外框，未重現「不是符合贊助書的樣式」。另觀察到分類卡片切換文案，但彈窗始終列出全部三種用途；這是可確認的情境落差，不能直接當成原回饋的同一個 bug。

## 驗收條件

- [ ] 補記原問題的品項、分類、上一頁／下一頁操作、瀏覽器與前後截圖。
- [ ] 確認是外框樣式、內容分類、直接開網址或上一頁／下一頁哪一種問題，再修正。
- [ ] 驗證首頁開啟、方向鍵、重新整理、返回都維持設計與所選分類情境。

## 證據

- [desktop-popup-before.jpg](evidence/desktop-popup-before.jpg)
- [desktop-popup-after.jpg](evidence/desktop-popup-after.jpg)
- [desktop-popup-direct.jpg](evidence/desktop-popup-direct.jpg)

## 相關

與 [品項彈窗左右切換未沿用目前分類排序](order.md)、[品項彈窗加入明確的上一項／下一項箭頭](arrows.md) 相關，但不可因修了排序便直接關閉本單。
