import sql from 'msnodesqlv8'

// Connection string - update this to match your SQL Server instance
const connStr = 'Driver={ODBC Driver 18 for SQL Server};Server=127.0.0.1,1433;Database=node;UID=sa;PWD=Password_123#;TrustServerCertificate=yes;'

// Cache the driver globally to survive hot reloads in dev
const globalForSql = globalThis as typeof globalThis & {
  sqlDriver?: typeof sql
}

if (!globalForSql.sqlDriver) {
  globalForSql.sqlDriver = sql
}

export function getDriver() {
  return globalForSql.sqlDriver!
}

export function getConnectionString() {
  return connStr
}

export async function getConnection() {
  const driver = getDriver()
  const con = await driver.promises.open(connStr)
  return con
}
