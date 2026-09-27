# 合作方向 CTA 跳到品項並自動選取對應分類

回饋：Denny。狀態：已重現。

## 重現／查看步驟

1. 首頁捲到「SITCON 能提供什麼？」。
2. 點「人才招募」的「查看贊助方案」。
3. 查看目的區塊及品項分類；品牌曝光／產品推廣同樣檢查。

## 實際觀察

三張卡片 href 都是 #plans。點人才招募後網址為 #plans，品項分類仍是 all，沒有導向人才招募品項。

## 驗收條件

- [ ] 人才招募／品牌曝光／產品推廣分別跳至 #items 並選取對應 tab，呈現該分類的排序與文案。
- [ ] CTA 文字與目的相符；中英文與手機一致。
- [ ] 教育支持維持明確的開源築夢入口，除非會議另有決議。

## 證據

- [desktop-highlights.jpg](evidence/desktop-highlights.jpg)
- [desktop-cta-destination.jpg](evidence/desktop-cta-destination.jpg)

## 相關

src/components/section/Highlights.astro、src/i18n/*.json、ItemsPopup.astro
