import type { Config } from "drizzle-kit";
export default {
  schema: "./src/db/schema/*",
  out: "./migrations",
  driver: "d1-http",
  dialect: "sqlite",
  dbCredentials: {
    wranglerConfigPath: "./wrangler.jsonc",
    dbName: "blog"
  },
  verbose: true,
  strict: true
} satisfies Config;