# Cloudflare D1 Database Setup

This document provides instructions for setting up and using Cloudflare D1 database with this project.

## Prerequisites

- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) installed
- Cloudflare account with Workers enabled

## Installation

Install wrangler globally if you haven't already:

```bash
npm install -g wrangler
```

Login to your Cloudflare account:

```bash
wrangler login
```

## Database Setup

### 1. Create the D1 Database

Create a new D1 database named `akamoney-clicks`:

```bash
wrangler d1 create akamoney-clicks
```

This will output a database ID. Copy this ID and update it in `wrangler.toml` file under the `database_id` field.

### 2. Run Migrations

**Important**: Run migration commands from the project root directory.

Apply the initial migration to create the `clickinfo` table:

```bash
wrangler d1 execute akamoney-clicks --file=./migrations/0001_create_clickinfo.sql
```

**Note**: The correct path is `./migrations/` (not `../migrations/`) when running from the project root.

### 3. Verify Database

List all tables in your database:

```bash
wrangler d1 execute akamoney-clicks --command="SELECT name FROM sqlite_master WHERE type='table';"
```

## Database Schema

The `clickinfo` table stores click tracking information with the following structure:

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key (auto-increment) |
| timestamp | INTEGER | Unix timestamp of the click |
| user_id | TEXT | Optional user identifier |
| page_url | TEXT | URL where the click occurred |
| element_id | TEXT | HTML element ID that was clicked |
| element_class | TEXT | HTML element class that was clicked |
| created_at | DATETIME | Timestamp when record was created |

### Indexes

- `idx_clickinfo_timestamp`: Index on timestamp for efficient time-based queries
- `idx_clickinfo_user_id`: Index on user_id for user-specific queries

## Common Commands

### Query Data

```bash
# Get all records
wrangler d1 execute akamoney-clicks --command="SELECT * FROM clickinfo;"

# Get records with limit
wrangler d1 execute akamoney-clicks --command="SELECT * FROM clickinfo LIMIT 10;"

# Count records
wrangler d1 execute akamoney-clicks --command="SELECT COUNT(*) FROM clickinfo;"
```

### Insert Sample Data

```bash
wrangler d1 execute akamoney-clicks --command="INSERT INTO clickinfo (timestamp, page_url) VALUES (1702819200, 'https://example.com');"
```

### Backup Database

```bash
wrangler d1 export akamoney-clicks --output=backup.sql
```

## Deployment

### Deploying to Cloudflare Workers

If you're building a Cloudflare Workers application that uses the D1 database, you can deploy using wrangler:

```bash
# Deploy to production
wrangler deploy

# Deploy to a specific environment
wrangler deploy --env production
```

### Migration in Production

After deploying your Workers application, apply migrations to the production database:

```bash
# For production database
wrangler d1 execute akamoney-clicks --file=./migrations/0001_create_clickinfo.sql --remote

# Or if using environment-specific databases
wrangler d1 execute akamoney-clicks --file=./migrations/0001_create_clickinfo.sql --env production --remote
```

**Important**: Use the `--remote` flag to execute migrations against the production database instead of the local development database.

### CI/CD Integration

For automated deployments in CI/CD pipelines (like GitHub Actions), you'll need:

1. **Add Cloudflare API Token** to your repository secrets:
   - Generate a token at: https://dash.cloudflare.com/profile/api-tokens
   - Add as `CLOUDFLARE_API_TOKEN` in GitHub repository secrets

2. **Add Account ID** to repository secrets:
   - Find your Account ID in Cloudflare dashboard
   - Add as `CLOUDFLARE_ACCOUNT_ID` in GitHub repository secrets

3. **Create deployment workflow** (example `.github/workflows/deploy-workers.yml`):

```yaml
name: Deploy to Cloudflare Workers

on:
  push:
    tags:
      - 'v*'

jobs:
  deploy:
    runs-on: ubuntu-latest
    name: Deploy
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - name: Deploy to Cloudflare Workers
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
```

### Hybrid Deployment

This project is currently configured for GitHub Pages deployment (static site). If you want to use Cloudflare D1 with a backend:

1. **Option A: Static Site + API Worker**
   - Keep the Vue app deployed to GitHub Pages
   - Create a separate Cloudflare Worker for API endpoints
   - Configure CORS for cross-origin requests

2. **Option B: Full Cloudflare Deployment**
   - Update `wrangler.toml` to serve static assets
   - Deploy both frontend and backend to Cloudflare Workers
   - Use Cloudflare Pages for the frontend and Workers for API

## Troubleshooting

### Path Errors

If you encounter path-related errors, ensure you:

1. Are running commands from the project root directory
2. Use `./migrations/` prefix (with leading `./`)
3. Verify the migration file exists: `ls -la migrations/`

### Common Issues

**Issue**: `Error: No database with name 'akamoney-clicks' found`
**Solution**: Create the database first using `wrangler d1 create akamoney-clicks`

**Issue**: `Error: Could not find file ./migrations/0001_create_clickinfo.sql`
**Solution**: Verify you're in the project root directory and the migrations folder exists

## Additional Resources

- [Cloudflare D1 Documentation](https://developers.cloudflare.com/d1/)
- [Wrangler CLI Reference](https://developers.cloudflare.com/workers/wrangler/commands/)
- [D1 Client API](https://developers.cloudflare.com/d1/platform/client-api/)
