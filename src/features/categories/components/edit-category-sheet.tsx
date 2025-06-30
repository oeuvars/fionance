import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { CategoryForm, FormValues, MultiCategoryFormValues } from './category-form';
import { useOpenCategory } from '../hooks/use-open-category';
import { useGetCategory } from '../api/use-get-category';
import { useEditCategory } from '../api/use-edit-category';
import { useDeleteCategory } from '../api/use-delete-category';
import { useConfirm } from '../../../hooks/use-confirm';
import { IconLoader } from '@tabler/icons-react';

export const EditCategorySheet = () => {
    const { isOpen, onClose, id } = useOpenCategory();

    const [ConfirmationDialog, confirm] = useConfirm(
        'Are you sure?',
        'You are about to delete this category',
    );
    const accountQuery = useGetCategory(id);
    const editMutation = useEditCategory(id);
    const deleteMutation = useDeleteCategory(id);

    const isPending = editMutation.isPending || deleteMutation.isPending;

    const isLoading = accountQuery.isLoading;

    const onSubmit = (values: FormValues | MultiCategoryFormValues) => {
        if ('name' in values) {
            editMutation.mutate(values, {
                onSuccess: () => {
                    onClose();
                },
            });
        }
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
    const defaultValues = accountQuery.data
        ? {
              name: accountQuery.data.name,
          }
        : {
              name: '',
          };
    return (
        <>
            <ConfirmationDialog />
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent className="space-y-4">
                    <SheetHeader>
                        <SheetTitle>Edit Category</SheetTitle>
                        <SheetDescription>
                            Edit an existing category
                        </SheetDescription>
                    </SheetHeader>
                    {isLoading ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <IconLoader className="size-4 text-neutral-600 animate-spin" />
                        </div>
                    ) : (
                        <CategoryForm
                            id={id}
                            onSubmit={onSubmit}
                            disabled={isPending}
                            defaultValues={defaultValues}
                            onDelete={onDelete}
                        />
                    )}
                </SheetContent>
            </Sheet>
        </>
    );
};
