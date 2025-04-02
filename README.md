```
pnpm install
pnpm run dev
```

```
pnpm run deploy
```


npx wrangler d1 migrations apply hono-d1-db --local  # 本地测试
npx wrangler d1 migrations apply hono-d1-db  # 生产环境



## 生成数据库迁移文件
npx drizzle-kit generate
该命令读取 drizzle.config.ts 配置

## 本地开发
npx wrangler d1 migrations apply blog --local

# 线上操作
## 同步到线上
npx wrangler d1 migrations apply blog --remote


## 读取线上数据
npx wrangler d1 execute blog --remote --command "SELECT * FROM users"

## 回滚到上一版本 Worker
npx wrangler deployments rollback --env production

## 数据一致性检查
npx wrangler d1 execute blog --remote --command "PRAGMA integrity_check"