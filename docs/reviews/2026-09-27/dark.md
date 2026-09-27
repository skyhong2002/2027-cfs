# 調整頁面後段大片黑色區塊的視覺銜接

回饋：Yoru。狀態：現況已截圖；視覺方案待決策。

## 重現／查看步驟

1. 桌面捲至「我們準備好了／一年一度的時刻」附近與 footer。
2. 手機捲到頁面底部，比較前後背景與內容密度。

## 實際觀察

time 使用照片加兩層 0.8 黑色遮罩，至少一個螢幕高；footer 也是深色。原話「最後一塊黑色」沒有明指 time 或 footer，已把兩處截圖供設計定位，尚不假定只需改其中一處。

## 驗收條件

- [ ] 先確認回饋指的是 time、footer 或兩者，再決定背景、明暗與區塊高度。
- [ ] 改善與前段的銜接，維持文字對比與聯絡入口可讀。
- [ ] 桌面／手機及 PDF 各自檢查。

## 證據

- [desktop-time.jpg](evidence/desktop-time.jpg)
- [desktop-footer.jpg](evidence/desktop-footer.jpg)
- [mobile-footer.jpg](evidence/mobile-footer.jpg)

## 相關

src/components/section/Time.astro、Footer.astro；與 [整併前後重複敘事並確認 section 排序](structure.md) 相關。
