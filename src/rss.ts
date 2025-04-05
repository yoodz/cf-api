import { Hono } from 'hono'
import { eq, and } from 'drizzle-orm';
import { createDbClient } from './db/client';
import rss from './db/schema/rss'
import type { Rss, NewRss } from './db/schema/rss';

type Bindings = {
    DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get('/', async (c) => {
    const { init } = c.req.query()
    const db = createDbClient(c.env.DB);
    const allRss = await db.select().from(rss).where(and(eq(rss.isDeleted, 0), eq(rss.auditStatus, 1), eq(rss.init, +init))).all();
    console.log(allRss, 'rss-25')
    return c.json({ result: allRss });
})

app.post('/', async (c) => {
    const db = createDbClient(c.env.DB);
    const data = await c.req.json<NewRss>();
    console.log(data, 'rss-18')
    try {
        const newRss = await db.insert(rss).values(data).returning().get();
        return c.json(newRss, 201);
    } catch (e) {
        console.log(e, 'rss-23')
        return c.json({ error: 'Failed to create rss' }, 400);
    }
});

// 更新rss 出错次数，更新时间
app.post('/update', async (c) => {
    const db = createDbClient(c.env.DB);
    const data = await c.req.json<NewRss>();
    const { rssUrl, errorCount, updateAt, init } = data
    try {
        const result = await db.update(rss)
            .set({ errorCount, init, updateAt })
            .where(eq(rss.rssUrl, rssUrl))
            .returning({ id: rss.id })
            .get();
        return c.json(result, 201);
    } catch (e) {
        console.log(e, 'rss-23')
        return c.json({ error: 'Failed to create rss' }, 400);
    }
});


app.post('/addMany', async (c) => {
    const db = createDbClient(c.env.DB);
    const dataList = await c.req.json();
    try {
        const promises = dataList.list.map((chunk: Rss) => {
            chunk.createdAt = Math.ceil(Date.now() / 1000)
            chunk.updateAt = Math.ceil(Date.now() / 1000)
            chunk.isDeleted = 0
            db.insert(rss).values(chunk).returning({ id: rss.id }).all()
        }
        );
        const results = await Promise.all(promises);

        return c.json({ results }, 201);
    } catch (e) {
        console.log(e, 'rss-23')
        return c.json({ error: 'Failed to create rss' }, 400);
    }
});

app.get('/:id', (c) => c.json(`get ${c.req.param('id')}`))

export default app