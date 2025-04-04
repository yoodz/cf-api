// authors.ts
import { Hono } from 'hono'
import { desc } from 'drizzle-orm';
import { createDbClient } from './db/client';
import rss from './db/schema/rss'
import type { Rss, NewRss } from './db/schema/rss';

type Bindings = {
    DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get('/', async (c) => {
    const { page, page_size } = c.req.query()
    console.log(page, page_size, 'index-15')
    const currentPage = parseInt(page, 10) || 1;
    const pageSize = Math.min(parseInt(page_size, 10) || 20, 20);

    const db = createDbClient(c.env.DB);
    const allUsers = await db.select().from(rss)
        .limit(pageSize)
        .offset((currentPage - 1) * pageSize)
        .orderBy(desc(rss.updateAt)).all();
    console.log(allUsers, 'rss-25')
    return c.json(allUsers);
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

app.post('/update', async (c) => {
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

        // const newRss = await db.insert(rss).values(dataList.list).returning({ id: rss.id }).get();
        return c.json(results, 201);
    } catch (e) {
        console.log(e, 'rss-23')
        return c.json({ error: 'Failed to create rss' }, 400);
    }
});

app.get('/:id', (c) => c.json(`get ${c.req.param('id')}`))

export default app