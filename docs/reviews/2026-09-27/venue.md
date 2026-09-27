# 將活動／場地詳情入口提前到方案選購之前

GitHub issue：[#45](https://github.com/skyhong2002/2027-cfs/issues/45)。

回饋：Yoru。狀態：已重現。

## 重現／查看步驟

1. 由首頁往下閱讀到方案與品項。
2. 尋找 #place-staff-popup 的「活動詳情與籌備團隊」入口。

## 實際觀察

目前主動線為 hero → intro → news → highlights → about → plans → items → opendream → form → sponsors → cycle → time。活動詳情入口在 time，桌面約 y=12,708px、手機約 y=13,875px，晚於方案與品項。

## 驗收條件

- [ ] 讓 #place-staff-popup 在評估品項之前即可找到，不必先捲過 Contact 與 SDGs。
- [ ] 保留 hash 深連結、返回與中英文操作。
- [ ] 搭配 Navbar 精簡決議，入口提前不等於把活動資訊加回 Navbar。

## 證據

- [desktop-time.jpg](evidence/desktop-time.jpg)
- [mobile-time.jpg](evidence/mobile-time.jpg)
- [desktop-venue.jpg](evidence/desktop-venue.jpg)

## 相關

與 [椅套品項就近說明 R0／R1／R2 容量與場地差異](chair.md)、[精簡 Navbar 並調整導覽順序](nav.md)、[整併前後重複敘事並確認 section 排序](structure.md) 相關。
