# 改善「受眾與統計」手機彈窗的圖表與閱讀密度

GitHub issue：[#52](https://github.com/skyhong2002/2027-cfs/issues/52)。

回饋：NT。狀態：現況已截圖；改善目標待確認。

## 重現／查看步驟

1. 390×844 手機點「受眾與統計」。
2. 閱讀身份分佈，再向下看開發程度、學校與社群統計。

## 實際觀察

彈窗可視高度 844px，scrollHeight 4,663px；前兩張 canvas 各為 310×420px，其他四張各 310×250px。第一屏包含大幅照片、圖表與細小圖例，資訊需多次捲動。此次未重現水平溢出或完全無法捲動，保留原回饋為可讀性改善。

## 驗收條件

- [ ] 確認手機最需要的統計優先順序，減少非必要佔高。
- [ ] 圖例文字、數字與點選提示易讀，避免只能靠顏色辨認。
- [ ] 長彈窗可順暢捲動並找到關閉按鈕；需 iOS Safari／Android 真機回歸。

## 證據

- [mobile-stats.jpg](evidence/mobile-stats.jpg)
- [mobile-stats-scrolled.jpg](evidence/mobile-stats-scrolled.jpg)

## 相關

src/components/section/About.astro；與 [改善「回顧 2026 年」手機數字與說明換行](review.md) 分開追蹤。
