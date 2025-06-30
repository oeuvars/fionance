import { db } from '@/database/drizzle';
import { userBalance } from '@/database/schema';
import { eq } from 'drizzle-orm';
import { isFirstDayOfMonth, isAfter } from 'date-fns';

export async function processMonthlyCredits() {
    const today = new Date();
    
    // Only run on the 1st of the month
    if (!isFirstDayOfMonth(today)) {
        return;
    }

    try {
        // Get all users with monthly income setup who haven't been credited this month
        const usersToCredit = await db.query.userBalance.findMany({
            where: (balance, { and, isNotNull, or, isNull }) => and(
                isNotNull(balance.monthlyIncomeAmount),
                isNotNull(balance.monthlyIncomeSource),
                or(
                    isNull(balance.lastCredited),
                    // Check if last credited was before this month
                    // This is a simplified check - in production you'd want more robust date comparison
                )
            ),
        });

        for (const user of usersToCredit) {
            const lastCredited = user.lastCredited;
            const shouldCredit = !lastCredited || 
                isAfter(today, new Date(lastCredited.getFullYear(), lastCredited.getMonth() + 1, 1));

            if (shouldCredit && user.monthlyIncomeAmount) {
                await db.update(userBalance)
                    .set({
                        balance: user.balance + user.monthlyIncomeAmount,
                        lastCredited: today,
                        updatedAt: today,
                    })
                    .where(eq(userBalance.id, user.id));

                console.log(`Credited ${user.monthlyIncomeAmount} to user ${user.userId}`);
            }
        }
    } catch (error) {
        console.error('Error processing monthly credits:', error);
    }
}