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

export const NewCategorySheet = () => {
    const { isOpen, onClose } = useNewCategory();
    const mutation = useCreateCategory();

    const onSubmit = (values: FormValues | MultiCategoryFormValues) => {
        if ('categories' in values) {
            const promises = values.categories.map(name => 
                new Promise((resolve, reject) => {
                    mutation.mutate({ name }, {
                        onSuccess: resolve,
                        onError: reject,
                    });
                })
            );
            
            Promise.all(promises)
                .then(() => onClose())
                .catch(() => {});
        } else {
            mutation.mutate(values, {
                onSuccess: () => {
                    onClose();
                },
            });
        }
    };
    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="space-y-4">
                <SheetHeader>
                    <SheetTitle>New Categories</SheetTitle>
                    <SheetDescription>
                        Create categories to organise your transactions.
                    </SheetDescription>
                </SheetHeader>
                <CategoryForm
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
