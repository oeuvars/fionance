import { format } from 'date-fns';
import { Calendar } from '../ui/calendar';
import { SelectSingleEventHandler } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '../ui/button';
import { IconCalendar } from '@tabler/icons-react';

export const DatePicker = ({
    value,
    onChange,
    disabled,
}: {
    value?: Date;
    onChange?: SelectSingleEventHandler;
    disabled?: boolean;
}) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    disabled={disabled}
                    className='w-full bg-transparent border shadow-none text-primary hover:bg-neutral-50 flex'
                >
                    <IconCalendar className="size-4 mr-2" />
                    {value ? format(value, 'PPP') : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <Calendar
                    mode="single"
                    selected={value}
                    onSelect={onChange}
                    disabled={disabled}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    );
};
