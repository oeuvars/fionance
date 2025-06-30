import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { insertCategorySchema } from '../../../database/schema';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { TrashIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';

const formSchema = insertCategorySchema.pick({
    name: true,
});

export type FormValues = z.input<typeof formSchema>;

type Props = {
    id?: string;
    defaultValues?: FormValues;
    onSubmit: (values: FormValues) => void;
    onDelete?: () => void;
    disabled?: boolean;
};

export const CategoryForm = ({ id, defaultValues, onSubmit, onDelete, disabled }: Props) => {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues,
    });
    const handleSubmit = (values: FormValues) => {
        onSubmit(values)
    };
    const handleDelete = () => {
        onDelete?.();
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-2 pt-4'>
               <FormField
                  name='name'
                  control={form.control}
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>
                           Name
                        </FormLabel>
                        <FormControl>
                           <Input
                              disabled={disabled}
                              placeholder='e.g. Food, Travel, Clothes'
                              {...field}
                           />
                        </FormControl>
                     </FormItem>
                  )}
               />
               <Button type='submit' className='w-full bg-neutral-950 text-white rounded-md' disabled={disabled}>
                  {id ? "Save Changes" : "Create Category"}
               </Button>
               {!!id && <Button type='button' disabled={disabled} onClick={handleDelete} className='w-full border rounded-md border-neutral-900 shadow-inner' variant='outline'>
                  <TrashIcon className='size-5 mr-2'/>
                  Delete Category
               </Button>}
            </form>
        </Form>
    );
};
