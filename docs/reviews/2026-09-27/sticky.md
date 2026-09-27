# 評估手機方案固定表頭／品項欄並同時比較兩方案

GitHub issue：[#57](https://github.com/skyhong2002/2027-cfs/issues/57)。

回饋：tang yu。狀態：新設計提案；目前行為已重現。

## 重現／查看步驟

1. 390×844 手機開 #plans。
2. 往右滑比較表，再往下捲過方案名稱。

## 實際觀察

表格可視寬 358px、scrollWidth 832px。表頭和左側敘述都是 position:static，滑動時一起移走；初始畫面主要顯示敘述與一個方案。這是 d45ac24 依前次「左側敘述不要固定」要求實作，不能當成未修復的舊 bug。

## 驗收條件

- [ ] 先確認最新決議是否改採 sticky 表頭＋敘述欄，取代先前整表自由滑動要求。
- [ ] 若採用，在 320–430px 下設計可讀的兩方案比较方式（例如選擇兩方案），不要硬擠四欄。
- [ ] 上下／左右捲動保持標籤與數值對應，不能遮住價格、按鈕或品項。
- [ ] 與手機預設收合提案一起決定展開後的行為，桌面保留完整比較。

## 證據

- [mobile-plans.jpg](evidence/mobile-plans.jpg)
- [mobile-plans-horizontal.jpg](evidence/mobile-plans-horizontal.jpg)
- [mobile-plans-vertical.jpg](evidence/mobile-plans-vertical.jpg)

## 相關

與 [評估手機贊助方案預設收合與展開入口](collapse.md) 有設計依存；既有 commit d45ac2473b4c360ae742017080db33a877b74f80。
