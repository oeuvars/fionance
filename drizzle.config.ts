import type { Config } from 'drizzle-kit';
import 'dotenv/config';

export default {
    schema: './database/schema.ts',
    dialect: 'postgresql',
    verbose: true,
    out: './drizzle',
    dbCredentials: {
        url: process.env.POSTGRES_URL!
    },
} satisfies Config;
