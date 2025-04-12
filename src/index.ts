// src/index.ts
import { Hono } from 'hono';
import { cors } from 'hono/cors'

import article from './article'
import rss from './rss'
import config from './config'

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();
app.use('*', cors()) // 允许跨域

app.route('article', article)
app.route('rss', rss)
app.route('config', config)

export default app;
