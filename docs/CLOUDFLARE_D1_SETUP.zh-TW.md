# Cloudflare D1 資料庫設定

本文件提供如何在此專案中設定和使用 Cloudflare D1 資料庫的說明。

## 前置需求

- 已安裝 [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)
- 已啟用 Workers 的 Cloudflare 帳戶

## 安裝

如果尚未安裝，請全域安裝 wrangler：

```bash
npm install -g wrangler
```

登入您的 Cloudflare 帳戶：

```bash
wrangler login
```

## 資料庫設定

### 1. 建立 D1 資料庫

建立名為 `akamoney-clicks` 的新 D1 資料庫：

```bash
wrangler d1 create akamoney-clicks
```

此命令會輸出資料庫 ID。複製此 ID 並更新 `wrangler.toml` 檔案中的 `database_id` 欄位。

### 2. 執行遷移

**重要**：從專案根目錄執行遷移命令。

套用初始遷移以建立 `clickinfo` 資料表：

```bash
wrangler d1 execute akamoney-clicks --file=./migrations/0001_create_clickinfo.sql
```

**注意**：從專案根目錄執行時，正確的路徑是 `./migrations/`（不是 `../migrations/`）。

### 3. 驗證資料庫

列出資料庫中的所有資料表：

```bash
wrangler d1 execute akamoney-clicks --command="SELECT name FROM sqlite_master WHERE type='table';"
```

## 資料庫結構

`clickinfo` 資料表儲存點擊追蹤資訊，結構如下：

| 欄位 | 類型 | 說明 |
|--------|------|-------------|
| id | INTEGER | 主鍵（自動遞增） |
| timestamp | INTEGER | 點擊的 Unix 時間戳記 |
| user_id | TEXT | 選用的使用者識別碼 |
| page_url | TEXT | 發生點擊的 URL |
| element_id | TEXT | 被點擊的 HTML 元素 ID |
| element_class | TEXT | 被點擊的 HTML 元素類別 |
| created_at | DATETIME | 記錄建立時的時間戳記 |

### 索引

- `idx_clickinfo_timestamp`：timestamp 的索引，用於高效的時間範圍查詢
- `idx_clickinfo_user_id`：user_id 的索引，用於使用者特定的查詢

## 常用命令

### 查詢資料

```bash
# 取得所有記錄
wrangler d1 execute akamoney-clicks --command="SELECT * FROM clickinfo;"

# 取得限制數量的記錄
wrangler d1 execute akamoney-clicks --command="SELECT * FROM clickinfo LIMIT 10;"

# 計算記錄數量
wrangler d1 execute akamoney-clicks --command="SELECT COUNT(*) FROM clickinfo;"
```

### 插入範例資料

```bash
wrangler d1 execute akamoney-clicks --command="INSERT INTO clickinfo (timestamp, page_url) VALUES (1702819200, 'https://example.com');"
```

### 備份資料庫

```bash
wrangler d1 export akamoney-clicks --output=backup.sql
```

## 疑難排解

### 路徑錯誤

如果遇到路徑錯誤「路徑錯誤」，請確保：

1. 從專案根目錄執行命令
2. 使用 `./migrations/` 前綴（以 `./` 開頭）
3. 驗證遷移檔案存在：`ls -la migrations/`

### 常見問題

**問題**：`Error: No database with name 'akamoney-clicks' found`
**解決方案**：先使用 `wrangler d1 create akamoney-clicks` 建立資料庫

**問題**：`Error: Could not find file ./migrations/0001_create_clickinfo.sql`
**解決方案**：驗證您在專案根目錄中，且 migrations 資料夾存在

## 其他資源

- [Cloudflare D1 文件](https://developers.cloudflare.com/d1/)
- [Wrangler CLI 參考](https://developers.cloudflare.com/workers/wrangler/commands/)
- [D1 Client API](https://developers.cloudflare.com/d1/platform/client-api/)
