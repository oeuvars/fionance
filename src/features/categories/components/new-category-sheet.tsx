import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { useNewCategory } from '../hooks/use-new-category';
import { CategoryForm, FormValues, MultiCategoryFormValues } from './category-form';
import { useCreateCategory } from '../api/use-create-category';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export const NewCategorySheet = () => {
    const { isOpen, onClose } = useNewCategory();
    const mutation = useCreateCategory();
    const [key, setKey] = useState<number>(0);

    const handleClose = () => {
        onClose();
        setKey(prev => prev + 1);
    };

    const { showToast } = useToast()

    const onSubmit = async (values: FormValues | MultiCategoryFormValues) => {
        if ('categories' in values) {
            try {
                for (const name of values.categories) {
                    await new Promise<void>((resolve, reject) => {
                        mutation.mutate({ name }, {
                            onSuccess: () => resolve(),
                            onError: (error) => reject(error),
                        });
                    });
                }
                handleClose();
            } catch (error) {
                showToast({
                    message: "Some error occured",
                    type: "error"
                })
            }
        } else {
            mutation.mutate(values, {
                onSuccess: () => {
                    handleClose();
                },
            });
        }
    };
    return (
        <Sheet open={isOpen} onOpenChange={handleClose}>
            <SheetContent className="space-y-4">
                <SheetHeader>
                    <SheetTitle>New Categories</SheetTitle>
                    <SheetDescription>
                        Create categories to organise your transactions.
                    </SheetDescription>
                </SheetHeader>
                <CategoryForm
                    key={key}
                    onSubmit={onSubmit}
                    disabled={mutation.isPending}
                    defaultValues={{
                        name: '',
                    }}
                    allowMultiple
                />
            </SheetContent>
        </Sheet>
    );
};
