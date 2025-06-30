import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// Better-auth tables
export const user = pgTable('user', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    emailVerified: boolean('email_verified').notNull(),
    image: text('image'),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull(),
});

export const session = pgTable('session', {
    id: text('id').primaryKey(),
    expiresAt: timestamp('expires_at').notNull(),
    token: text('token').notNull().unique(),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
});

export const account = pgTable('account', {
    id: text('id').primaryKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull(),
});

export const verification = pgTable('verification', {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at'),
    updatedAt: timestamp('updated_at'),
});

// Better-auth relations
export const userRelations = relations(user, ({ many, one }) => ({
    sessions: many(session),
    authAccounts: many(account),
    bankAccounts: many(bankAccount),
    categories: many(categories),
    settings: one(userSettings),
    notificationSettings: one(userNotificationSettings),
    balance: one(userBalance),
}));

export const sessionRelations = relations(session, ({ one }) => ({
    user: one(user, {
        fields: [session.userId],
        references: [user.id],
    }),
}));

export const accountRelations = relations(account, ({ one }) => ({
    user: one(user, {
        fields: [account.userId],
        references: [user.id],
    }),
}));

// Financial tables
export const bankAccount = pgTable('bank_account', {
    id: text('id').primaryKey(),
    plaidId: text('plaid_id'),
    name: text('name').notNull(),
    userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
});

export const bankAccountRelations = relations(bankAccount, ({ one, many }) => ({
    user: one(user, {
        fields: [bankAccount.userId],
        references: [user.id],
    }),
    transactions: many(transactions),
}));

export const insertBankAccountSchema = createInsertSchema(bankAccount);

export const categories = pgTable('categories', {
    id: text('id').primaryKey(),
    plaidId: text('plaid_id'),
    name: text('name').notNull(),
    userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
});

export const categoriesRelations = relations(categories, ({ one, many }) => ({
    user: one(user, {
        fields: [categories.userId],
        references: [user.id],
    }),
    transactions: many(transactions),
}));

export const insertCategorySchema = createInsertSchema(categories);

export const transactions = pgTable('transactions', {
    id: text('id').primaryKey(),
    amount: integer('amount').notNull(),
    payee: text('payee').notNull(),
    notes: text('notes'),
    date: timestamp('date', { mode: 'date' }).notNull(),
    accountId: text('account_id')
        .references(() => bankAccount.id, {
            onDelete: 'cascade',
        })
        .notNull(),
    categoryId: text('category_id').references(() => categories.id, {
        onDelete: 'set null',
    }),
});

export const transactionsRelations = relations(transactions, ({ one }) => ({
    bankAccount: one(bankAccount, {
        fields: [transactions.accountId],
        references: [bankAccount.id],
    }),
    categories: one(categories, {
        fields: [transactions.categoryId],
        references: [categories.id],
    }),
}));

export const insertTransactionsSchema = createInsertSchema(transactions, {
    date: z.coerce.date(),
});

// User Settings tables
export const userSettings = pgTable('user_settings', {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
    currency: text('currency').notNull().default('USD'),
    theme: text('theme').notNull().default('system'),
    dateFormat: text('date_format').notNull().default('MM/dd/yyyy'),
    language: text('language').notNull().default('en'),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull(),
});

export const userNotificationSettings = pgTable('user_notification_settings', {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
    transactionAlerts: boolean('transaction_alerts').notNull().default(true),
    budgetWarnings: boolean('budget_warnings').notNull().default(true),
    weeklyReports: boolean('weekly_reports').notNull().default(false),
    securityAlerts: boolean('security_alerts').notNull().default(true),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull(),
});

export const userSettingsRelations = relations(userSettings, ({ one }) => ({
    user: one(user, {
        fields: [userSettings.userId],
        references: [user.id],
    }),
}));

export const userNotificationSettingsRelations = relations(userNotificationSettings, ({ one }) => ({
    user: one(user, {
        fields: [userNotificationSettings.userId],
        references: [user.id],
    }),
}));

// User Balance table
export const userBalance = pgTable('user_balance', {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
    balance: integer('balance').notNull().default(0), // stored in miliunits
    monthlyIncomeSource: text('monthly_income_source'),
    monthlyIncomeAmount: integer('monthly_income_amount').default(0), // stored in miliunits
    lastCredited: timestamp('last_credited'),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull(),
});

export const userBalanceRelations = relations(userBalance, ({ one }) => ({
    user: one(user, {
        fields: [userBalance.userId],
        references: [user.id],
    }),
}));

export const insertUserBalanceSchema = createInsertSchema(userBalance);

export const insertUserSettingsSchema = createInsertSchema(userSettings);
export const insertUserNotificationSettingsSchema = createInsertSchema(userNotificationSettings);
