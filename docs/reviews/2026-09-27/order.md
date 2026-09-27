# 品項彈窗左右切換未沿用目前分類排序

GitHub issue：[#53](https://github.com/skyhong2002/2027-cfs/issues/53)。

回饋：tang yu。狀態：已重現。

## 重現／查看步驟

1. 首頁品項選「人才招募」。
2. 清單前兩項為「會場攤位」、「獨家導遊團行程」。
3. 開第一項「會場攤位」，按鍵盤 ArrowRight。
4. 以「全部」分類做對照。

## 實際觀察

人才招募中從 item/28（會場攤位）跳到 item/19（SITCON 網站議程表置入），不是視覺清單的下一項。全部分類從 item/7（T-shirt）到 item/5（帆布袋）則符合清單。程式 getItemPopupIds() 使用固定 popup DOM 順序，卡片排序後沒有同步。

## 驗收條件

- [ ] 鍵盤左右、觸控切換及新加的品項箭頭共用目前分類的可見品項與排序。
- [ ] 不跳入目前分類排除的項目；第一／最後一項邊界行為一致。
- [ ] 切換後返回清單保留分類；包含售完／截止等排序狀態的回歸。

## 證據

- [desktop-talent-list.jpg](evidence/desktop-talent-list.jpg)
- [desktop-popup-before.jpg](evidence/desktop-popup-before.jpg)
- [desktop-popup-after.jpg](evidence/desktop-popup-after.jpg)
- [extra-all-after-arrow.jpg](evidence/extra-all-after-arrow.jpg)

## 相關

src/pages/index.astro getItemPopupIds/navigateToAdjacent；ItemsPopup.astro sortCards。
