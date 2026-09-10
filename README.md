<div align=center>

# SITCON 2027 贊助徵求書

![Astro](https://img.shields.io/badge/Astro-5f3cbe?logo=astro)  
<https://sitcon.org/2027/cfs>

![](src/assets/img/og.webp)

</div>

## 開發

請先安裝 [Node.js](https://nodejs.org/) 及 [pnpm](https://pnpm.io/installation)，接著執行：

```bash
pnpm i
pnpm dev
```

## 建置與發布

網站設計與靜態內容沿用 2026 年版本，贊助資料來自 [2027 年 Google 試算表](https://docs.google.com/spreadsheets/d/1VCkTOO8Jb1EilClyu3acL9NXixV0-euB1kSoPPod2Bk/edit)。

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
