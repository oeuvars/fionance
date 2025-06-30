import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { IconPlus, IconTrash, IconX } from '@tabler/icons-react';

const formSchema = z.object({
    name: z.string().min(1, 'Category name is required'),
});

const multiCategoryFormSchema = z.object({
    name: z.string().optional(),
});

const multiCategorySchema = z.object({
    categories: z.array(z.string()).min(1, 'At least one category is required'),
});

export type FormValues = z.input<typeof formSchema>;
export type MultiCategoryFormValues = z.input<typeof multiCategorySchema>;

type Props = {
    id?: string;
    defaultValues?: FormValues;
    onSubmit: (values: FormValues | MultiCategoryFormValues) => void;
    onDelete?: () => void;
    disabled?: boolean;
    allowMultiple?: boolean;
};

export const CategoryForm = ({ id, defaultValues, onSubmit, onDelete, disabled, allowMultiple = false }: Props) => {
    const [categories, setCategories] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState('');
    const form = useForm<FormValues>({
        resolver: zodResolver(allowMultiple ? multiCategoryFormSchema : formSchema),
        defaultValues: defaultValues,
    });

    useEffect(() => {
        if (allowMultiple) {
            form.setValue('name', 'placeholder');
            form.clearErrors('name');
        }
    }, [allowMultiple, form]);
    
    const handleSubmit = (values: FormValues) => {
        if (allowMultiple && categories.length > 0) {
            onSubmit({ categories });
        } else {
            onSubmit(values);
        }
    };

    const addCategory = () => {
        if (inputValue.trim() && !categories.includes(inputValue.trim())) {
            setCategories([...categories, inputValue.trim()]);
            setInputValue('');
        }
    };

    const removeCategory = (categoryToRemove: string) => {
        setCategories(categories.filter(cat => cat !== categoryToRemove));
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
                           {allowMultiple ? (
                              <div className='flex items-center border border-neutral-200 rounded-md bg-transparent shadow-sm transition-colors focus-within:ring-1 focus-within:ring-neutral-950'>
                                 <input
                                    disabled={disabled}
                                    placeholder='e.g. Food, Travel, Clothes'
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => {
                                       if (e.key === 'Enter') {
                                          e.preventDefault();
                                          addCategory();
                                       }
                                    }}
                                    className='flex-1 h-9 px-3 py-1 text-sm bg-transparent placeholder:text-neutral-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50'
                                 />
                                 <button
                                    type='button'
                                    onClick={addCategory}
                                    disabled={!inputValue.trim() || disabled}
                                    className='flex items-center justify-center p-1 mr-2 rounded hover:bg-neutral-100 disabled:opacity-50'
                                 >
                                    <IconPlus className='size-4' />
                                 </button>
                              </div>
                           ) : (
                              <Input
                                 disabled={disabled}
                                 placeholder='e.g. Food, Travel, Clothes'
                                 {...field}
                              />
                           )}
                        </FormControl>
                     </FormItem>
                  )}
               />
               {allowMultiple && categories.length > 0 && (
                  <div className='flex flex-wrap gap-2 mt-2'>
                     {categories.map((category) => (
                        <Badge
                           key={category}
                           variant='indigo'
                           className='flex items-center gap-1'
                           size="lg"
                        >
                           <span>{category}</span>
                           <Button
                              type='button'
                              size='sm'
                              variant='ghost'
                              className='h-4 w-4 p-0 hover:bg-transparent'
                              onClick={() => removeCategory(category)}
                              disabled={disabled}
                           >
                              <IconX className='size-3.5 hover:text-white text-white' />
                           </Button>
                        </Badge>
                     ))}
                  </div>
               )}
               <Button type='submit' className='w-full bg-neutral-950 text-white rounded-md' disabled={disabled || (allowMultiple && categories.length === 0)}>
                  {id ? "Save Changes" : allowMultiple ? `Create ${categories.length > 1 ? 'Categories' : 'Category'}` : "Create Category"}
               </Button>
               {!!id && <Button type='button' disabled={disabled} onClick={handleDelete} className='w-full border rounded-md border-neutral-900 shadow-inner' variant='outline'>
                  <IconTrash className='size-5 mr-2'/>
                  Delete Category
               </Button>}
            </form>
        </Form>
    );
};
