import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { useOpenAccount } from '../hooks/use-open-account';
import { useGetTransaction } from '../api/use-get-transaction';
import { Loader2 } from 'lucide-react';
import { useEditTransaction } from '../api/use-edit-transaction';
import { useDeleteTransaction } from '../api/use-delete-transaction';
import { useConfirm } from '../../../hooks/use-confirm';
import { insertTransactionsSchema } from '../../../database/schema';
import { z } from 'zod';

const formSchema = insertTransactionsSchema.omit({
    id: true
})

type FormValues = z.input<typeof formSchema>;

export const EditTransactionSheet = () => {
    const { isOpen, onClose, id } = useOpenAccount();

    const [ConfirmationDialog, confirm] = useConfirm(
        'Are you sure?',
        'You are about to delete this transaction',
    );
    const transactionQuery = useGetTransaction(id);
    const editMutation = useEditTransaction(id);
    const deleteMutation = useDeleteTransaction(id);

    const isPending = editMutation.isPending || deleteMutation.isPending;

    const isLoading = transactionQuery.isLoading;

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
                //TODO: fix this this was .name
              name: transactionQuery.data.id,
          }
        : {
              name: '',
          };
    return (
        <>
            <ConfirmationDialog />
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent className="space-y-4 bg-neutral-50/95">
                    <SheetHeader>
                        <SheetTitle>Edit Transaction</SheetTitle>
                        <SheetDescription>
                            Edit an existing transaction.
                        </SheetDescription>
                    </SheetHeader>
                    {isLoading ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="size-4 text-neutral-600 animate-spin" />
                        </div>
                    ) : (
                        <></>
                    )}
                </SheetContent>
            </Sheet>
        </>
    );
};
