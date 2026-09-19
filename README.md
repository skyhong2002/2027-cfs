<div align=center>

# SITCON 2027 贊助徵求書

![Astro](https://img.shields.io/badge/Astro-5f3cbe?logo=astro)  
<https://sitcon.org/2027/cfs>

</div>

## 開發

請先安裝 [Node.js](https://nodejs.org/) 及 [pnpm](https://pnpm.io/installation)，接著執行：

```bash
pnpm i
pnpm dev
```

## 建置與發布

### 個人 fork 預覽站

預覽網址：<https://skyhong2002.github.io/2027-cfs/>

此 fork 推送至 `main` 或手動執行 **Deploy preview to GitHub Pages** 時，會使用儲存庫內的資料建置並自動部署至 GitHub Pages。Pages 的 Source 需設為 **GitHub Actions**。

預覽流程透過 `CFS_PREVIEW=1` 顯示完整網站，並依 Pages 設定指定 `SITE_URL` 與 `BASE_PATH`。未設定預覽模式時，正式建置仍會導向 WIP 頁面。原有 **Build CFS site** 僅在 `sitcon-tw/2027-cfs` 執行。

若要在本機重現預覽建置：

```bash
SITE_URL=https://skyhong2002.github.io BASE_PATH=/2027-cfs CFS_PREVIEW=1 pnpm build
BASE_PATH=/2027-cfs pnpm preview
```

本機 `origin` 指向個人 fork，`upstream` 指向 `sitcon-tw/2027-cfs`；後續開發可直接 `git push origin main` 發布預覽。

### 正式站流程

本版依 SITCON 2027 的合作資訊流重新整理。尚未確認的日期、場地、統計與合作權益須以明顯的「待確認」標示；不得把舊資料直接改年後視為定案。贊助資料來源為 [2027 年 Google 試算表](https://docs.google.com/spreadsheets/d/1VCkTOO8Jb1EilClyu3acL9NXixV0-euB1kSoPPod2Bk/edit)。

推送至 `main` 或手動執行 **Build CFS site**，會下載試算表資料與圖片、檢查專案，並將建置結果發布至 `build` 分支。建置失敗時會保留上次成功的結果。

資料不會回寫至 `main`，也不會定時更新。此流程沒有其他儲存庫的寫入權限。

只修改試算表時，請手動發布：

1. 在 `main` 執行 **Build CFS site**，等待成功。
2. 在 `sitcon-tw/2027` 的 `main` 執行 **Deploy website**。

主網站每次部署都會下載最新建置至 `dist/cfs/`，一併發布。此儲存庫不單獨發布 GitHub Pages。

### 本機建置

使用 Node.js 22，執行：

```bash
pnpm install --frozen-lockfile
pnpm fetch-data
pnpm test
pnpm build
```

`pnpm fetch-data` 會更新本機 JSON 與圖片。一般建置與 PR 檢查可使用儲存庫內的資料，省略此步驟。

## 資料確認與防止舊資料回流

執行 `pnpm validate-data` 可檢查活動年度、截止日期與來源佐證。`pnpm fetch-data` 會先在記憶體組合完整品項與方案，通過驗證後才下載圖片或覆寫 JSON；若試算表仍含舊年資料、未佐證價格或未確認權益，指令會失敗並保留目前的 JSON 與圖片。

`src/data/provenance.json` 使用以下結構。`claims` 的 key 是欄位路徑，`value` 必須與資料完全一致，避免來源確認後又被試算表悄悄改成另一個價格。placeholder 不需要填造來源：

```json
{
	"year": 2027,
	"sources": {},
	"claims": {}
}
```

確認價格或具體方案權益後，先在 `sources` 建立有 `title`、`reference` 的來源，再在 `claims` 記錄 `status: "confirmed"`、`source`（來源 ID）與 `value`。例如欄位路徑為 `plan.navigator.price`、`plan.navigator.benefits.0.quantity`、`item.1.sub.0.price`。此檢查能確保來源紀錄存在且對應資料，來源是否足以支持承諾仍需負責人審核。

CI 與預覽發布會執行資料驗證、驗證器測試、估價邏輯測試及 Astro 檢查。可在本機執行：

```bash
pnpm validate-data
pnpm test:data
pnpm test:proposal
pnpm test
pnpm format:check
```

`format:check` 只檢查格式；需要改寫排版時才執行 `pnpm format`。

## 第一版範圍與待確認事項

本版提供中文／英文的活動摘要、合作方向、開源築夢、品項搜尋與分類、合作清單、列印／PDF、可檢查的聯絡信件草稿。草稿需由使用者開啟自己的郵件程式確認寄出；網站不會向舊表單送資料，也不會宣稱已寄達。

- [待確認清單與本版假設](docs/pending-confirmations.md)
- [2027 官方來源查核](docs/2027-source-audit.md)
- [逐項 issue 與驗證對照](docs/issue-tracker.md)
- [用第一版帶資訊流討論](docs/meeting-guide.md)
- [照片來源](docs/photo-sources.md)

`src/data/plan.json` 的 A–D 為討論代號，不是正式級別。未確認金額與權益以待確認呈現，頁面不會把缺價項目當免費。

## 瀏覽器回歸

```bash
pnpm exec playwright install chromium
SITE_URL=https://skyhong2002.github.io BASE_PATH=/2027-cfs CFS_PREVIEW=1 pnpm build
BASE_PATH=/2027-cfs pnpm preview --host 127.0.0.1 --port 4321
# 另一個 terminal：
CFS_TEST_URL=http://127.0.0.1:4321/2027-cfs/ pnpm test:e2e
```

測試涵蓋桌面／手機、中英路由、清單、築夢意願、信件草稿、列印與儲存；不寄出郵件或提交外部表單。預覽部署會在上傳 Pages artifact 前執行此測試。也可將 `CFS_TEST_URL` 指到已部署站點執行相同檢查。
