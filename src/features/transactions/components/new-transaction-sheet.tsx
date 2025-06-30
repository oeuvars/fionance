import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useNewTransaction } from '../hooks/use-new-transaction';
import { useCreateTransaction } from '../api/use-create-transaction';
import { insertTransactionsSchema } from '../../../database/schema';
import { z } from 'zod';
import { useCreateCategory } from '../../categories/api/use-create-category';
import { useGetCategories } from '../../categories/api/use-get-categories';
import { useGetAccounts } from '../../accounts/api/use-get-accounts';
import { useCreateAccount } from '../../accounts/api/use-create-account';
import { TransactionForm } from './transaction-form';
import { IconLoader } from '@tabler/icons-react';

const formSchema = insertTransactionsSchema.omit({
    id: true
})

type FormValues = z.input<typeof formSchema>;

export const NewTransactionSheet = () => {
    const { isOpen, onClose } = useNewTransaction();
    const createMutation = useCreateTransaction();

    const categoryQuery = useGetCategories();
    const categoryMutation = useCreateCategory();
    const onCreateCategory = (name: string) => categoryMutation.mutate({
        name
    })
    const categoryOptions = (categoryQuery.data ?? []).map((category) => ({
        label: category.name,
        value: category.id
    }))

    const accountQuery = useGetAccounts();
    const accountMutation = useCreateAccount();
    const onCreateAccount = (name: string) => accountMutation.mutate({
        name
    })
    const accountOptions = (accountQuery.data ?? []).map((account) => ({
        label: account.name,
        value: account.id
    }))
    const isPending =  createMutation.isPending || categoryMutation.isPending || accountMutation.isPending;
    const isLoading = categoryQuery.isLoading || accountQuery.isLoading;
    const onSubmit = (values: FormValues) => {
        createMutation.mutate(values, {
            onSuccess: () => {
                onClose();
            },
        });
    };
    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="space-y-4">
                <SheetHeader>
                    <SheetTitle>New Transaction</SheetTitle>
                    <SheetDescription>
                        Add a new transactions.
                    </SheetDescription>
                </SheetHeader>
                {isLoading ? (
                    <div className='absolute inset-0 flex items-center justify-center'>
                        <IconLoader className='animate-spin size-5'/>
                    </div>
                ) : (
                    <TransactionForm
                        onSubmit={onSubmit}
                        disabled={isPending}
                        categoryOptions={categoryOptions}
                        onCreateCategory={onCreateCategory}
                        accountOptions={accountOptions}
                        onCreateAccount={onCreateAccount}
                    />
                )}
            </SheetContent>
        </Sheet>
    );
};
