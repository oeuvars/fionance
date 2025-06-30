'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { convertAmountToMiliunits } from '@/lib/utils';

const formSchema = z.object({
    source: z.string().min(1, 'Income source is required'),
    amount: z.string().min(1, 'Monthly income amount is required'),
});

type FormValues = z.input<typeof formSchema>;

type Props = {
    onSubmit: (values: { source: string; amount: number }) => void;
    disabled?: boolean;
};

export const IncomeSetup = ({ onSubmit, disabled }: Props) => {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            source: '',
            amount: '',
        },
    });

    const handleSubmit = (values: FormValues) => {
        const amount = parseFloat(values.amount);
        if (isNaN(amount)) return;
        
        onSubmit({
            source: values.source,
            amount: convertAmountToMiliunits(amount),
        });
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-sm">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Fionance!</h2>
                <p className="text-gray-600">Let&apos;s set up your monthly income to get started.</p>
            </div>
            
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                    <FormField
                        name="source"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Income Source</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={disabled}
                                        placeholder="e.g. Salary, Freelance, Business"
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    
                    <FormField
                        name="amount"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Monthly Income (INR)</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={disabled}
                                        type="number"
                                        step="0.01"
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    
                    <Button 
                        type="submit" 
                        className="w-full bg-neutral-950 text-white rounded-md" 
                        disabled={disabled}
                    >
                        Continue
                    </Button>
                </form>
            </Form>
        </div>
    );
};