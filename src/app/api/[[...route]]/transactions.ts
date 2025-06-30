import { Hono } from 'hono';
import { transactions, insertTransactionsSchema, categories, bankAccount } from '../../../database/schema';
import { and, desc, eq, gte, inArray, lte, sql } from 'drizzle-orm';
import { zValidator } from '@hono/zod-validator';
import { createId } from '@paralleldrive/cuid2';
import { db } from '../../../database/drizzle';
import { z } from 'zod';
import { parse, subDays } from 'date-fns';
import { auth } from "../../../lib/auth-server";

const app = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  }
}>()
    .get(
        '/',
        zValidator(
            'query',
            z.object({
                from: z.string().optional(),
                to: z.string().optional(),
                accountId: z.string().optional(),
            }),
        ),
                async c => {
            const user = c.get("user");
            const { from, to, accountId } = c.req.valid('query');
            if (!user) {
                return c.json({ error: 'Unauthorised' }, 401);
            }
            const defaultTo = new Date();
            const defaultFrom = subDays(defaultTo, 30);
            const startDate = from ? parse(from, 'yyyy-MM-dd', new Date()) : defaultFrom;
            const endDate = to ? parse(to, 'yyyy-MM-dd', new Date()) : defaultTo;
            const data = await db
                .select({
                    id: transactions.id,
                    date: transactions.date,
                    category: categories.name,
                    categoryId: transactions.categoryId,
                    payee: transactions.payee,
                    amount: transactions.amount,
                    notes: transactions.notes,
                    account: bankAccount.name,
                    accountId: transactions.accountId,
                })
                .from(transactions)
                .innerJoin(bankAccount, eq(transactions.accountId, bankAccount.id))
                .leftJoin(categories, eq(transactions.categoryId, categories.id))
                .where(
                    and(
                        accountId ? eq(transactions.accountId, accountId) : undefined,
                        eq(bankAccount.userId, user.id),
                        gte(transactions.date, startDate),
                        lte(transactions.date, endDate),
                    ),
                )
                .orderBy(desc(transactions.date));
            return c.json({ data });
        },
    )
    .get(
        '/:id',
        zValidator('param', z.object({ id: z.string().optional() })),
                async c => {
            const user = c.get("user");
            const { id } = c.req.valid('param');

            if (!id) {
                return c.json({ error: 'Missing id' }, 400);
            }
            if (!user) {
                return c.json({ error: 'Unauthorised' }, 401);
            }
            const [data] = await db
                .select({
                    id: transactions.id,
                    date: transactions.date,
                    categoryId: transactions.categoryId,
                    payee: transactions.payee,
                    amount: transactions.amount,
                    notes: transactions.notes,
                    accountId: transactions.accountId,
                })
                .from(transactions)
                .innerJoin(bankAccount, eq(transactions.accountId, bankAccount.id))
                .where(and(eq(transactions.id, id), eq(bankAccount.userId, user.id)));
            if (!data) {
                return c.json({ error: 'Not forund' }, 404);
            }
            return c.json({ data });
        },
    )
    .post(
        '/',
                zValidator('json', insertTransactionsSchema.omit({ id: true })),
        async c => {
            const user = c.get("user");
            const values = c.req.valid('json');
            if (!user) {
                return c.json({ error: 'Unauthorised' }, 401);
            }
            const [data] = await db
                .insert(transactions)
                .values({ id: createId(), ...values })
                .returning();

            return c.json({ data });
        },
    )
    .post(
      "/bulk-create",
            zValidator(
         "json",
         z.array(
            insertTransactionsSchema.omit({
               id: true,
            })
         )
      ),
      async (c) => {
         const user = c.get("user");
         const values = c.req.valid("json");

         if (!user) {
            return c.json({ error: "Unauthorised" }, 401)
         }

         const data = await db
            .insert(transactions)
            .values(
               values.map((value) => ({
                  id: createId(),
                  ...value,
               }))
            ).returning();

         return c.json({ data })
      }
    )
    .post(
        '/bulk-delete',
                zValidator('json', z.object({ ids: z.array(z.string()) })),
        async c => {
            const user = c.get("user");
            const values = c.req.valid('json');

            if (!user) {
                return c.json({ error: 'Unauthorised' }, 401);
            }
            const transactionsToDelete = db.$with('transactions_to_delete').as(
                db.select({ id: transactions.id })
                  .from(transactions)
                  .innerJoin(bankAccount, eq(transactions.accountId, bankAccount.id))
                  .where(
                     and(inArray(transactions.id, values.ids), eq(bankAccount.userId, user.id)),
                  ),
            );
            const data = await db
                .with(transactionsToDelete)
                .delete(transactions)
                .where(inArray(transactions.id, sql`(select id from ${transactionsToDelete})`))
                .returning({ id: transactions.id });

            return c.json({ data });
        },
    )
    .patch(
        '/:id',
                zValidator('param', z.object({ id: z.string().optional() })),
        zValidator('json', insertTransactionsSchema.omit({ id: true })),
        async c => {
            const user = c.get("user");
            const { id } = c.req.valid('param');
            const values = c.req.valid('json');
            if (!id) {
                return c.json({ error: 'Missing id' }, 400);
            }
            if (!user) {
                return c.json({ error: 'Unauthorised' }, 401);
            }
            const transactionsToUpdate = db.$with('transactions_to_update').as(
                db.select({ id: transactions.id })
                  .from(transactions)
                  .innerJoin(bankAccount, eq(transactions.accountId, bankAccount.id))
                  .where(and(eq(transactions.id, id), eq(bankAccount.userId, user.id))),
            );
            const [data] = await db
                .with(transactionsToUpdate)
                .update(transactions)
                .set(values)
                .where(inArray(transactions.id, sql`(select id from ${transactionsToUpdate})`))
                .returning();
            if (!data) {
                return c.json({ error: 'Not found' }, 404);
            }
            return c.json({ data });
        },
    )
    .delete(
        '/:id',
                zValidator('param', z.object({ id: z.string().optional() })),
        async c => {
            const user = c.get("user");
            const { id } = c.req.valid('param');

            if (!id) {
                return c.json({ error: 'Missing id' }, 400);
            }
            if (!user) {
                return c.json({ error: 'Unauthorised' }, 401);
            }
            const transactionsToDelete = db.$with('transactions_to_delete').as(
                db.select({ id: transactions.id })
                  .from(transactions)
                  .innerJoin(bankAccount, eq(transactions.accountId, bankAccount.id))
                  .where(and(eq(transactions.id, id), eq(bankAccount.userId, user.id))),
            );
            const [data] = await db
                .with(transactionsToDelete)
                .delete(transactions)
                .where(inArray(transactions.id, sql`(select id from ${transactionsToDelete})`))
                .returning({ id: transactions.id });
            if (!data) {
                return c.json({ error: 'Not found' }, 404);
            }
            return c.json({ data });
        },
    );

export default app;
