import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { insertTransactionsSchema } from '../../../database/schema';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { TrashIcon } from '@radix-ui/react-icons';
import { Textarea } from '@/components/ui/textarea';
import { convertAmountToMiliunits } from '@/lib/utils';
import { Select } from '@/components/global/select';
import { DatePicker } from '@/components/global/date-picker';
import { AmountInput } from '@/components/global/amount-input';
import { Button } from '@/components/ui/button';

const formSchema = z.object({
   date: z.coerce.date(),
   accountId: z.string(),
   categoryId: z.string().nullable().optional(),
   payee: z.string(),
   amount: z.string(),
   notes: z.string().nullable().optional()
})

const apiSchema = insertTransactionsSchema.omit({
   id: true
})

type FormValues = z.input<typeof formSchema>;
type ApiFormValues = z.input<typeof apiSchema>;

type Props = {
    id?: string;
    defaultValues?: FormValues;
    onSubmit: (values: ApiFormValues) => void;
    onDelete?: () => void;
    disabled?: boolean;
    accountOptions: { label: string; value: string }[];
    categoryOptions: { label: string; value: string }[];
    onCreateAccount: (name: string) => void;
    onCreateCategory: (name: string) => void;
};

export const TransactionForm = ({ id, defaultValues, onSubmit, onDelete, disabled, accountOptions, categoryOptions, onCreateAccount, onCreateCategory }: Props) => {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues,
    });
    const handleSubmit = (values: FormValues) => {
      const amount = parseFloat(values.amount);
      const amountInMiliunits = convertAmountToMiliunits(amount);
      onSubmit({
         ...values,
         amount: amountInMiliunits,
      })
    };
    const handleDelete = () => {
        onDelete?.();
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-2 pt-4'>
               <FormField
                  name='date'
                  control={form.control}
                  render={({ field }) => (
                     <FormItem>
                        <FormControl>
                           <DatePicker
                              value={field.value}
                              onChange={field.onChange}
                              disabled={disabled}
                           />
                        </FormControl>
                     </FormItem>
                  )}
               />
               <FormField
                  name='accountId'
                  control={form.control}
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>
                           Account
                        </FormLabel>
                        <FormControl>
                           <Select
                              placeholder='Select an account'
                              options={accountOptions}
                              onCreate={onCreateAccount}
                              value={field.value}
                              onChange={field.onChange}
                              disabled={disabled}
                           />
                        </FormControl>
                     </FormItem>
                  )}
               />
               <FormField
                  name='categoryId'
                  control={form.control}
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>
                           Category
                        </FormLabel>
                        <FormControl>
                           <Select
                              placeholder='Select an account'
                              options={categoryOptions}
                              onCreate={onCreateCategory}
                              value={field.value}
                              onChange={field.onChange}
                              disabled={disabled}
                           />
                        </FormControl>
                     </FormItem>
                  )}
               />
               <FormField
                  name='payee'
                  control={form.control}
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>
                           Payee
                        </FormLabel>
                        <FormControl>
                           <Input
                              disabled={disabled}
                              placeholder='Add a payee'
                              {...field}
                           />
                        </FormControl>
                     </FormItem>
                  )}
               />
               <FormField
                  name='amount'
                  control={form.control}
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>
                           Amount
                        </FormLabel>
                        <FormControl>
                           <AmountInput
                              disabled={disabled}
                              placeholder='0.00'
                              {...field}
                           />
                        </FormControl>
                     </FormItem>
                  )}
               />
               <FormField
                  name='notes'
                  control={form.control}
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>
                           Notes
                        </FormLabel>
                        <FormControl>
                           <Textarea
                              {...field}
                              value={field.value ?? ""}
                              disabled={disabled}
                              placeholder='Optional notes'
                           />
                        </FormControl>
                     </FormItem>
                  )}
               />
               <Button type='submit' className='w-full bg-neutral-950 text-white rounded-md' disabled={disabled}>
                  {id ? "Save Changes" : "Create Transaction"}
               </Button>
               {!!id && <Button type='button' disabled={disabled} onClick={handleDelete} className='w-full border rounded-md border-neutral-900 shadow-inner' variant='outline'>
                  <TrashIcon className='size-5 mr-2'/>
                  Delete Transaction
               </Button>}
            </form>
        </Form>
    );
};
