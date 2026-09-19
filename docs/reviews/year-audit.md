# CFS 2027 年份與舊程式清理

## 清理範圍

新版以 `src/components/cfs/Experience.astro` 為全站入口。先確認頁面與新工具的 import，再刪除下列已被取代、沒有新架構引用的來源：

- `src/components/section/` 下全部 15 個舊區塊。
- `src/components/items/` 下兩個舊品項元件。
- 舊 `Popup.astro` 與 `FormInput.astro`。
- 舊購物流程工具：`add-to-cart-handler.ts`、`plan-helper.ts`、`local-storage.ts`、`item-status.ts`、`venue-linkify.ts`。
- 已無引用的 `src/data/shop_config.json`，包含舊啟售日期設定。
- 統計引用移除後，刪除 `src/i18n/zh-Hant.json`、`src/i18n/en.json`，並移除 TypeScript 的 `@i18n/*` alias。

共移除 27 個舊來源檔案。保留新版需要的 `items-loader.ts`、`proposal.ts`、資料來源與中英文路由。未改動 Git 歷史。

README 改為描述 SITCON 2027 資訊流與「未確認資料必須標示待確認」的內容原則，移除已過期的 OG 圖展示。GitHub Actions YAML 沒有舊活動年份需要替換。

## 資料原則與剩餘責任

活動標題與本版內容均以 SITCON 2027 為對象。查不到的新年度日期、場地、統計、權益與規格應使用明顯 placeholder，不能只替換年份便當作確認資訊。新版頁面、品項／方案 JSON、估價邏輯及測試資料由其負責代理同步處理；這份清理沒有代改價格或資料內容。

靜態圖資依任務保留，避免破壞仍使用的品項示意圖。保留圖資不代表內容已確認：新版使用時仍需顯示示意／待確認說明。歷史照片來源與授權記錄應保留原始出處，不能把照片年份偽裝成新活動。

`fetch-data` 會直接從試算表覆寫品項與方案。正式建置前必須檢查來源是否已整理，或加入內容驗證阻止舊年資料回流；fork preview 使用已提交資料，不會執行這項刷新。

## 驗證方法

1. 掃描剩餘來源 import，確認沒有引用已刪除的元件、工具或 i18n。
2. 執行 `npx --yes pnpm@10.15.1 test` 檢查 Astro／TypeScript。
3. 檢查 JSON、YAML、TypeScript 與頁面文案中的活動年份；注意四位數也可能是金額、數量或識別碼，需判讀，不能一律改為活動年份。
4. 新資料合併後，再執行 preview build 和中英文／品項／報價頁瀏覽器測試。

清理後首次 Astro check 已確認沒有遺失 import；當時新版 `Experience.astro` 的 `aria-pressed` 字串型別有一個錯誤，已回報整合者修正。

本文件記錄清理本身。最終年份掃描與完整 E2E 結果應以整合後的驗證紀錄為準。
