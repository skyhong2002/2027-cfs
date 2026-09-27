# 椅套品項就近說明 R0／R1／R2 容量與場地差異

GitHub issue：[#42](https://github.com/skyhong2002/2027-cfs/issues/42)。

回饋：NT。狀態：已重現。

## 重現／查看步驟

1. 開啟 /2027-cfs/item/22/（會議室椅套曝光）。
2. 比較 R0、R1、R2 子項目及價格。
3. 嘗試在彈窗中找到各廳席位，或點 R0／R1／R2 看場地。

## 實際觀察

彈窗列 R0 $50,000、R1／R2 各 $28,000，但未列容量；這個彈窗的 .venue-link 數量為 0。容量藏在較後面的活動詳情：目前網站資料為 R0 426 席，R1／R2 各 112 席，正式數字仍依 #13 確認。

## 驗收條件

- [ ] 在子項目旁提供席位／規模及差異，或可直接操作的場地詳情連結。
- [ ] 開場地詳情後可回到原品項，不遺失選擇。
- [ ] 沿用共同場地資料來源，中英文同步，避免在兩處維護不同數字。

## 證據

- [extra-chair.jpg](evidence/extra-chair.jpg)
- [desktop-venue.jpg](evidence/desktop-venue.jpg)

## 相關

相關 #13；src/components/items/ItemPopup.astro、src/utils/venue-linkify.ts。
