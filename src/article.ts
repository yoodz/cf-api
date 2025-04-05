import { Hono } from 'hono'

import { eq, asc, desc, sql } from 'drizzle-orm';
import { createDbClient } from './db/client';
import article from './db/schema/article';
import rss from './db/schema/rss'
import config from './db/schema/config'

import type { Article, NewArticle } from './db/schema/article'

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
    const allUsers = await db.select().from(article)
        .limit(pageSize)
        .offset((currentPage - 1) * pageSize)
        .orderBy(desc(article.pubDate)).all();

    const totalCount = await db
        .select({ count: sql<number>`count(*)` })
        .from(article)
        .get();

    let totalRss;
    let configRes;
    if (+page === 1) {
        // 获取config配置
        configRes = await db
            .select()
            .from(config)
            .where(eq(config.key, 'update_at'))
            .get();

        totalRss = await db
            .select({ count: sql<number>`count(*)` })
            .from(rss)
            .get();
        // 拿总的收录数据，成功的收录数据
    }
    return c.json({ result: allUsers, total: totalCount?.count || 0, page, pageSize, config: configRes, totalRss: totalRss?.count || 0 });
})

// pv + 1
app.get('/pv', async (c) => {
    const { id } = c.req.query()
    const db = createDbClient(c.env.DB);
    const result = await db.update(article)
        .set({ pv: sql`pv + 1` })
        .where(eq(article.id, +id))
        .returning({ id: article.id })
        .get();
    return c.json(result, 201);

})

app.post('/', async (c) => {
    const db = createDbClient(c.env.DB);
    const data = await c.req.json<NewArticle>();
    console.log(data, 'rss-18')
    try {
        const newArticle = await db.insert(article).values(data).returning({ id: article.id }).get();
        return c.json(newArticle, 201);
    } catch (e) {
        console.log(e, 'rss-23')
        return c.json({ error: 'Failed to create rss' }, 400);
    }
});

app.post('/addMany', async (c) => {
    const db = createDbClient(c.env.DB);
    const dataList = await c.req.json();
    try {
        const promises = dataList.list.map((chunk: Article) => {
            chunk.createdAt = Math.ceil(Date.now() / 1000)
            chunk.updateAt = Math.ceil(Date.now() / 1000)
            db.insert(article).values(chunk).returning({ id: rss.id }).all()
        }
        );
        const results = await Promise.all(promises);

        // const newRss = await db.insert(article).values(dataList.list).returning({ id: article.id }).get();
        return c.json(results, 201);
    } catch (e) {
        console.log(e, 'rss-23')
        return c.json({ error: 'Failed to create article' }, 400);
    }
});


app.get('/:id', (c) => c.json(`get ${c.req.param('id')}`))

export default app