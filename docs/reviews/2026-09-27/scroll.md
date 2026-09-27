# 手機長文彈窗斜向下滑會誤切到下一個品項

GitHub issue：[#56](https://github.com/skyhong2002/2027-cfs/issues/56)。

回饋：tang yu。狀態：已重現。

## 重現／查看步驟

1. 390×844 觸控模式開 /item/1/（午餐旗、點心旗）。
2. 從 (240,700) 垂直往上滑到 (240,250)，用來閱讀下方內容。
3. 接著從 (250,700) 斜向上滑到 (175,250)：垂直 450px、水平 75px。

## 實際觀察

純垂直滑動後仍是 item/1，彈窗 scrollTop=442。斜向閱讀手勢後卻切到 item/14「獨家議程」，scrollTop 歸零。onTouchEnd 只判斷 abs(dx)>50，未比較垂直位移；一般下捲稍偏左右就被當作換品項。

## 驗收條件

- [ ] 以垂直為主的手勢只捲內容，不切品項；優先判斷方向與滑動意圖。
- [ ] 到長文底端仍可正常捲動，不意外捲背景或丟失閱讀位置。
- [ ] 真正的水平品項切換與照片 carousel 手勢不互相誤觸。
- [ ] iOS Safari／Android Chrome 真機回歸；本次是 Chromium 觸控模擬。

## 證據

- [mobile-long-popup-top.jpg](evidence/mobile-long-popup-top.jpg)
- [mobile-long-popup-vertical.jpg](evidence/mobile-long-popup-vertical.jpg)
- [mobile-long-popup-diagonal.jpg](evidence/mobile-long-popup-diagonal.jpg)

## 相關

src/pages/index.astro onTouchStart/onTouchEnd；與 [品項彈窗左右切換未沿用目前分類排序](order.md)、[品項彈窗加入明確的上一項／下一項箭頭](arrows.md) 相關。
