// src/index.ts
import { Hono } from 'hono';
import { users } from './db/schema/users';
import { createDbClient } from './db/client';
import type { User, NewUser } from './db/schema/users';

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

// 获取所有用户
app.get('/users', async (c) => {
  console.log(c.env, 'index-15')
  const db = createDbClient(c.env.DB);
  const allUsers = await db.select().from(users).all();
  return c.json(allUsers);
});

// 创建新用户
app.post('/users', async (c) => {
  const db = createDbClient(c.env.DB);
  const data = await c.req.json<NewUser>();
  
  try {
    const newUser = await db.insert(users).values(data).returning().get();
    return c.json(newUser, 201);
  } catch (e) {
    return c.json({ error: 'Failed to create user' }, 400);
  }
});

// 获取单个用户
// app.get('/users/:id', async (c) => {
//   const db = createDbClient(c.env.DB);
//   const id = Number(c.req.param('id'));
  
//   const user = await db.select().from(users).where(eq(users.id, id)).get();
  
//   if (!user) {
//     return c.json({ error: 'User not found' }, 404);
//   }
  
//   return c.json(user);
// });

// 更新用户
// app.put('/users/:id', async (c) => {
//   const db = createDbClient(c.env.DB);
//   const id = Number(c.req.param('id'));
//   const data = await c.req.json<Partial<NewUser>>();
  
//   try {
//     const updatedUser = await db.update(users)
//       .set(data)
//       .where(eq(users.id, id))
//       .returning()
//       .get();
    
//     return c.json(updatedUser);
//   } catch (e) {
//     return c.json({ error: 'Failed to update user' }, 400);
//   }
// });

// 删除用户
// app.delete('/users/:id', async (c) => {
//   const db = createDbClient(c.env.DB);
//   const id = Number(c.req.param('id'));
  
//   await db.delete(users).where(eq(users.id, id)).run();
  
//   return c.json({ message: 'User deleted' });
// });

export default app;