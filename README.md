# msnodesqlv8-vite

A **Vite + Express + TypeScript** todo app demonstrating how to use [msnodesqlv8](https://github.com/TimelordUK/node-sqlserver-v8) with Vite.

## Key Architecture Point

`msnodesqlv8` is a native Node.js addon (`.node` binary) and **cannot be bundled by Vite**. The solution is simple: only import it in your **server-side** code. The React frontend communicates with the Express API via `fetch` and never imports the driver.

```
Client (Vite/React)  --fetch-->  Express API  --msnodesqlv8-->  SQL Server
```

## Prerequisites

- Node.js (v20+)
- SQL Server on `127.0.0.1:1433`
- ODBC Driver 18 for SQL Server

## Setup

```bash
npm install
```

Create the table in your database:

```sql
CREATE TABLE Task (
    _id INT IDENTITY(1,1) NOT NULL,
    completed INT NOT NULL,
    task VARCHAR(200) NOT NULL
)
```

Update the connection string in `server/db.ts` to match your SQL Server instance.

## Run

```bash
# Development (Express + Vite HMR)
npm run dev

# Production
npm run build
npm start
```

Open http://localhost:3000

## Troubleshooting

**"Cannot find module '../build/Release/sqlserver.node'"**

This means Vite is trying to bundle the native addon. Make sure `msnodesqlv8` is only imported in `server/` files, never in `src/` (the Vite-bundled frontend).

If you are using Vite SSR and need to import it in SSR code that Vite processes, add it to your `vite.config.ts`:

```ts
export default defineConfig({
  ssr: {
    external: ['msnodesqlv8']
  }
})
```
