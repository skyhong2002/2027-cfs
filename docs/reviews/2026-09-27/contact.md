# 聯絡入口改為 mailto 並調整 Contact 的位置

回饋：Yoru。狀態：現況已重現；表單保留方式待決策。

## 重現／查看步驟

1. 點 Navbar「聯絡我們」。
2. 查看停留位置、網址與聯絡方式。
3. 捲至頁尾對照 email 入口。

## 實際觀察

Navbar 的 href 是 #form，點擊進入長表單；桌面表單位於文件約 y=9,397px，手機約 y=10,293px。頁尾已存在 mailto:contact@sitcon.org，可統一使用。沒有寄信或提交表單。

## 驗收條件

- [ ] 主要聯絡 CTA 改為 mailto:contact@sitcon.org，桌面與手機一致。
- [ ] 確認首頁中段 Contact／表單要移動、縮減或移除的位置，並更新其他指向 #form 的入口。
- [ ] 若保留感興趣清單資訊，明確決定是否帶入郵件草稿；開啟郵件程式不等於已寄送。

## 證據

- [desktop-contact.jpg](evidence/desktop-contact.jpg)
- [desktop-footer.jpg](evidence/desktop-footer.jpg)

## 相關

相關 #34；與 [精簡 Navbar 並調整導覽順序](nav.md)、[整併前後重複敘事並確認 section 排序](structure.md) 協調。
