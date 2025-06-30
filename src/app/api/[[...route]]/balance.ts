import { Hono } from 'hono';
import { db } from '@/database/drizzle';
import { userBalance, bankAccount } from '@/database/schema';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { createId } from '@paralleldrive/cuid2';
import { auth } from '@/lib/auth-server';

const app = new Hono<{
    Variables: { 
      user: typeof auth.$Infer.Session.user | null;
      session: typeof auth.$Infer.Session.session | null;
    }
  }>()
    .get('/', async c => {
        const user = c.get('user');
        if (!user) {
            return c.json({ error: 'Unauthorized' }, 401);
        }

        const balance = await db.query.userBalance.findFirst({
            where: eq(userBalance.userId, user.id),
        });

        if (!balance) {
            // Create initial balance record
            const newBalance = await db
                .insert(userBalance)
                .values({
                    id: createId(),
                    userId: user.id,
                    balance: 0,
                    monthlyIncomeSource: null,
                    monthlyIncomeAmount: 0,
                    lastCredited: null,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                })
                .returning();

            return c.json({ data: newBalance[0] });
        }

        return c.json({ data: balance });
    })
    .post(
        '/setup',
        zValidator(
            'json',
            z.object({
                source: z.string().min(1),
                amount: z.number().min(0),
            }),
        ),
        async c => {
            const user = c.get('user');
            if (!user) {
                return c.json({ error: 'Unauthorized' }, 401);
            }

            const { source, amount } = c.req.valid('json');

            // Check if balance record exists
            const existingBalance = await db.query.userBalance.findFirst({
                where: eq(userBalance.userId, user.id),
            });

            if (existingBalance) {
                // Update existing record
                const updatedBalance = await db
                    .update(userBalance)
                    .set({
                        monthlyIncomeSource: source,
                        monthlyIncomeAmount: amount,
                        balance: existingBalance.balance + amount, // Add initial income
                        lastCredited: new Date(),
                        updatedAt: new Date(),
                    })
                    .where(eq(userBalance.id, existingBalance.id))
                    .returning();

                return c.json({ data: updatedBalance[0] });
            } else {
                // Create new balance record and default Savings Account
                const [newBalance] = await db
                    .insert(userBalance)
                    .values({
                        id: createId(),
                        userId: user.id,
                        balance: amount, // Set initial balance to income amount
                        monthlyIncomeSource: source,
                        monthlyIncomeAmount: amount,
                        lastCredited: new Date(),
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    })
                    .returning();

                // Create default Savings Account
                await db
                    .insert(bankAccount)
                    .values({
                        id: createId(),
                        userId: user.id,
                        name: 'Savings Account',
                    });

                return c.json({ data: newBalance });
            }
        },
    )
    .post('/credit', async c => {
        const user = c.get('user');
        if (!user) {
            return c.json({ error: 'Unauthorized' }, 401);
        }

        const balance = await db.query.userBalance.findFirst({
            where: eq(userBalance.userId, user.id),
        });

        if (!balance || !balance.monthlyIncomeAmount) {
            return c.json({ error: 'No monthly income configured' }, 400);
        }

        const updatedBalance = await db
            .update(userBalance)
            .set({
                balance: balance.balance + balance.monthlyIncomeAmount,
                lastCredited: new Date(),
                updatedAt: new Date(),
            })
            .where(eq(userBalance.id, balance.id))
            .returning();

        return c.json({ data: updatedBalance[0] });
    });

export default app;
