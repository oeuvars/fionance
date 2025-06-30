import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { createId } from '@paralleldrive/cuid2';
import { db } from '../../../database/drizzle';
import { 
    userSettings, 
    userNotificationSettings, 
    user
} from '../../../database/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth-server';

const app = new Hono<{
    Variables: { 
      user: typeof auth.$Infer.Session.user | null;
      session: typeof auth.$Infer.Session.session | null;
    }
  }>()
    .get('/profile', async c => {
        const currentUser = c.get("user");
        if (!currentUser) {
            return c.json({ error: 'Unauthorised' }, 401);
        }
        const [data] = await db
            .select({ 
                id: user.id,
                name: user.name,
                email: user.email,
                image: user.image 
            })
            .from(user)
            .where(eq(user.id, currentUser.id));
        if (!data) {
            return c.json({ error: 'Not found' }, 404);
        }
        return c.json({ data });
    })
    .patch(
        '/profile',
        zValidator('json', z.object({
            name: z.string().min(1, 'Name is required'),
            email: z.string().email('Invalid email address'),
        })),
        async c => {
            const currentUser = c.get("user");
            const values = c.req.valid('json');
            if (!currentUser) {
                return c.json({ error: 'Unauthorised' }, 401);
            }
            const [data] = await db
                .update(user)
                .set({ ...values, updatedAt: new Date() })
                .where(eq(user.id, currentUser.id))
                .returning();
            if (!data) {
                return c.json({ error: 'Not found' }, 404);
            }
            return c.json({ data });
        },
    )
    .get('/preferences', async c => {
        const currentUser = c.get("user");
        if (!currentUser) {
            return c.json({ error: 'Unauthorised' }, 401);
        }
        let data = await db.query.userSettings.findFirst({
            where: eq(userSettings.userId, currentUser.id),
        });

        if (!data) {
            const [newSettings] = await db
                .insert(userSettings)
                .values({
                    id: createId(),
                    userId: currentUser.id,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                })
                .returning();
            
            data = newSettings;
        }

        return c.json({ data });
    })
    .patch(
        '/preferences',
        zValidator('json', z.object({
            currency: z.string().optional(),
            theme: z.string().optional(),
            dateFormat: z.string().optional(),
            language: z.string().optional(),
        })),
        async c => {
            const currentUser = c.get("user");
            const values = c.req.valid('json');
            if (!currentUser) {
                return c.json({ error: 'Unauthorised' }, 401);
            }
            
            let existingSettings = await db.query.userSettings.findFirst({
                where: eq(userSettings.userId, currentUser.id),
            });

            if (!existingSettings) {
                const [data] = await db
                    .insert(userSettings)
                    .values({
                        id: createId(),
                        userId: currentUser.id,
                        ...values,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    })
                    .returning();
                
                return c.json({ data });
            }

            const [data] = await db
                .update(userSettings)
                .set({ 
                    ...values,
                    updatedAt: new Date()
                })
                .where(eq(userSettings.userId, currentUser.id))
                .returning();
            if (!data) {
                return c.json({ error: 'Not found' }, 404);
            }
            return c.json({ data });
        },
    )
    .get('/notifications', async c => {
        const currentUser = c.get("user");
        if (!currentUser) {
            return c.json({ error: 'Unauthorised' }, 401);
        }
        
        let data = await db.query.userNotificationSettings.findFirst({
            where: eq(userNotificationSettings.userId, currentUser.id),
        });

        if (!data) {
            const [newNotifications] = await db
                .insert(userNotificationSettings)
                .values({
                    id: createId(),
                    userId: currentUser.id,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                })
                .returning();
            
            data = newNotifications;
        }

        return c.json({ data });
    })
    .patch(
        '/notifications',
        zValidator('json', z.object({
            transactionAlerts: z.boolean().optional(),
            budgetWarnings: z.boolean().optional(),
            weeklyReports: z.boolean().optional(),
            securityAlerts: z.boolean().optional(),
        })),
        async c => {
            const currentUser = c.get("user");
            const values = c.req.valid('json');
            if (!currentUser) {
                return c.json({ error: 'Unauthorised' }, 401);
            }
            
            let existingNotifications = await db.query.userNotificationSettings.findFirst({
                where: eq(userNotificationSettings.userId, currentUser.id),
            });

            if (!existingNotifications) {
                const [data] = await db
                    .insert(userNotificationSettings)
                    .values({
                        id: createId(),
                        userId: currentUser.id,
                        ...values,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    })
                    .returning();
                
                return c.json({ data });
            }

            const [data] = await db
                .update(userNotificationSettings)
                .set({ 
                    ...values,
                    updatedAt: new Date()
                })
                .where(eq(userNotificationSettings.userId, currentUser.id))
                .returning();
            if (!data) {
                return c.json({ error: 'Not found' }, 404);
            }
            return c.json({ data });
        },
    )
    .patch(
        '/password',
        zValidator('json', z.object({
            currentPassword: z.string().min(1, 'Current password is required'),
            newPassword: z.string().min(8, 'New password must be at least 8 characters'),
        })),
        async c => {
            const currentUser = c.get("user");
            if (!currentUser) {
                return c.json({ error: 'Unauthorised' }, 401);
            }
            return c.json({ error: 'Password change not implemented yet' }, 501);
        },
    )
    .post('/export', async c => {
        const currentUser = c.get("user");
        if (!currentUser) {
            return c.json({ error: 'Unauthorised' }, 401);
        }
        
        const userData = await db.query.user.findFirst({
            where: eq(user.id, currentUser.id),
            with: {
                bankAccounts: {
                    with: {
                        transactions: {
                            with: {
                                categories: true,
                                bankAccount: true
                            },
                        },
                    },
                },
            },
        });

        if (!userData) {
            return c.json({ error: 'Not found' }, 404);
        }

        const transactions = userData.bankAccounts.flatMap(account => 
            account.transactions.map(transaction => ({
                id: transaction.id,
                date: transaction.date,
                amount: transaction.amount,
                payee: transaction.payee,
                notes: transaction.notes,
                category: transaction.categories?.name || 'Uncategorized',
                account: transaction.bankAccount?.name || account.name,
                createdAt: transaction.date,
            }))
        );

        transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        return c.json({ data: transactions });
    });

export default app;