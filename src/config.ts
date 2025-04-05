import { Hono } from 'hono'

import { eq, asc, desc, sql } from 'drizzle-orm';
import { createDbClient } from './db/client';
import config from './db/schema/config'

import type { NewConfig } from './db/schema/config'

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get('/', async (c) => {
  const { page, page_size } = c.req.query()
  const db = createDbClient(c.env.DB);
  const result = await db.select().from(config).all();
  return c.json({ result });
})

/** 新增配置 */
app.post('/', async (c) => {
  const db = createDbClient(c.env.DB);
  const data = await c.req.json<NewConfig>();
  console.log(data, 'rss-18')
  try {
    const newConfig = await db.insert(config).values(data).returning().get();
    return c.json(newConfig, 201);
  } catch (e) {
    console.log(e, 'config-32')
    return c.json({ error: 'Failed to create rss' }, 400);
  }
});

/** 根据 key 更新设置 */
app.post('/:key', async (c) => {
  const db = createDbClient(c.env.DB);
  const key = c.req.param('key');
  console.log(key, 'config-40')
  const data = await c.req.json<Partial<NewConfig>>();

  try {
    const updateResult = await db.update(config)
      .set(data)
      .where(eq(config.key, key))
      .returning()
      .get();

    return c.json({ updateResult });
  } catch (e) {
    console.log(e, 'config-52')
    return c.json({ error: 'Failed to update config' }, 400);
  }
});

export default app