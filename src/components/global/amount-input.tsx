import React from 'react';
import CurrencyInput from 'react-currency-input-field';
import { Info, MinusCircle, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@nextui-org/button';

type Props = {
    value: string;
    onChange: (value: string | undefined) => void;
    placeholder?: string;
    disabled?: boolean;
};

export const AmountInput = ({ value, onChange, placeholder, disabled }: Props) => {
    const parsedValue = parseFloat(value);
    const isIncome = parsedValue > 0;
    const isExpense = parsedValue < 0;

    const onReverseValue = () => {
        if (!value) return;
        const newValue = parseFloat(value) * -1;
        onChange(newValue.toString());
    };
    return (
        <div className="relative">
            <TooltipProvider>
                <Tooltip delayDuration={100}>
                  <TooltipTrigger asChild>
                     <button type='button' onClick={onReverseValue} className={cn("bg-neutral-400 hover:bg-neutral-500 absolute top-1 left-1 rounded-md p-1.5 flex items-center justify-center transition", isIncome && "bg-emerald-500 hover:bg-emerald-600", isExpense && 'bg-rose-500 hover:bg-rose-600')}>
                        {!parsedValue && <Info className='size-4 text-white'/>}
                        {isIncome && <PlusCircle className='size-4 text-white'/>}
                        {isExpense && <MinusCircle className='size-4 text-white'/>}
                     </button>
                  </TooltipTrigger>
                  <TooltipContent>
                     Use [+] for income and [-] for expenses
                  </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <CurrencyInput
               prefix='$'
               placeholder={placeholder}
               value={value}
               decimalsLimit={2}
               decimalScale={2}
               onValueChange={onChange}
               disabled={disabled}
               className='pl-10 flex h-9 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300'
            />
            <p className='text-sm text-neutral-400 pt-1'>
               {isIncome && "This will count as income"}
               {isExpense && "This will count as an expense"}
            </p>
        </div>
    );
};
