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

## Troubleshooting

### Path Errors

If you encounter path errors like "路徑錯誤" (Path error), ensure you:

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
