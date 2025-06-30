import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { useGetTransaction } from '../api/use-get-transaction';
import { useEditTransaction } from '../api/use-edit-transaction';
import { useDeleteTransaction } from '../api/use-delete-transaction';
import { useConfirm } from '../../../hooks/use-confirm';
import { insertTransactionsSchema } from '../../../database/schema';
import { z } from 'zod';
import { useOpenTransaction } from '../hooks/use-open-transactions';
import { TransactionForm } from './transaction-form';
import { useGetCategories } from '../../categories/api/use-get-categories';
import { useCreateCategory } from '../../categories/api/use-create-category';
import { useGetAccounts } from '../../accounts/api/use-get-accounts';
import { useCreateAccount } from '../../accounts/api/use-create-account';
import { IconLoader } from '@tabler/icons-react';

const formSchema = insertTransactionsSchema.omit({
    id: true
})

type FormValues = z.input<typeof formSchema>;

export const EditTransactionSheet = () => {
    const { isOpen, onClose, id } = useOpenTransaction();

    const [ConfirmationDialog, confirm] = useConfirm(
        'Are you sure?',
        'You are about to delete this transaction',
    );
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
    const transactionQuery = useGetTransaction(id);
    const editMutation = useEditTransaction(id);
    const deleteMutation = useDeleteTransaction(id);

    const isPending = editMutation.isPending || deleteMutation.isPending || transactionQuery.isLoading || categoryMutation.isPending || accountMutation.isPending;

    const isLoading = transactionQuery.isLoading || categoryQuery.isLoading || accountQuery.isLoading;

    const onSubmit = (values: FormValues) => {
        editMutation.mutate(values, {
            onSuccess: () => {
                onClose();
            },
        });
    };

    const onDelete = async () => {
      const ok = await confirm();

      if (ok) {
         deleteMutation.mutate(undefined, {
            onSuccess: () => {
               onClose();
            }
         })
      }
    }
    const defaultValues = transactionQuery.data
        ? {
            accountId: transactionQuery.data.accountId,
            categoryId: transactionQuery.data.categoryId,
            amount: transactionQuery.data.amount.toString(),
            date: transactionQuery.data.date ? new Date(transactionQuery.data.date) : new Date(),
            payee: transactionQuery.data.payee,
            notes: transactionQuery.data.notes
          }
        : {
            accountId: '',
            categoryId: '',
            amount: '',
            date: new Date(),
            payee: '',
            notes: ''
          };
    return (
        <>
            <ConfirmationDialog />
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent className="space-y-4">
                    <SheetHeader>
                        <SheetTitle>Edit Transaction</SheetTitle>
                        <SheetDescription>
                            Edit an existing transaction.
                        </SheetDescription>
                    </SheetHeader>
                    {isLoading ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <IconLoader className="size-4 text-neutral-600 animate-spin" />
                        </div>
                    ) : (
                        <TransactionForm
                            id={id}
                            defaultValues={defaultValues}
                            onSubmit={onSubmit}
                            onDelete={onDelete}
                            disabled={isPending}
                            categoryOptions={categoryOptions}
                            onCreateCategory={onCreateCategory}
                            accountOptions={accountOptions}
                            onCreateAccount={onCreateAccount}
                        />
                    )}
                </SheetContent>
            </Sheet>
        </>
    );
};
