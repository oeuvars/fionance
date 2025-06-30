import type { Config } from 'drizzle-kit';
import { config } from 'dotenv';

config({ path: '.env.local' });

export default {
    schema: './src/database/schema.ts',
    dialect: 'postgresql',
    verbose: true,
    out: './drizzle',
    dbCredentials: {
        url: process.env.POSTGRES_URL!
    },
} satisfies Config;
