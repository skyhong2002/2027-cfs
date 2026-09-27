# 品項彈窗加入明確的上一項／下一項箭頭

GitHub issue：[#55](https://github.com/skyhong2002/2027-cfs/issues/55)。

回饋：tang yu。狀態：已重現。

## 重現／查看步驟

1. 桌面開 item/28（會場攤位）彈窗。
2. 尋找切換上一個／下一個品項的左右按鈕。

## 實際觀察

此彈窗可見控制只有右上角 close-btn，沒有品項導覽箭頭。部分有多張圖的品項有 carousel-prev／next，但那些只切照片，不是切品項。

## 驗收條件

- [ ] 在品項彈窗左右提供清楚可見、可鍵盤操作的上一項／下一項按鈕。
- [ ] 與圖片 carousel 按鈕區別，使用可理解的 aria-label。
- [ ] 切換順序沿用目前分類；邊界禁用或循環規則一致；手機觸控目標足夠。

## 證據

- [desktop-popup-before.jpg](evidence/desktop-popup-before.jpg)
- [mobile-long-popup-top.jpg](evidence/mobile-long-popup-top.jpg)

## 相關

依賴 [品項彈窗左右切換未沿用目前分類排序](order.md)；src/components/items/ItemPopup.astro、src/pages/index.astro。
