'use client';

import { ColumnDef } from '@tanstack/react-table';
import { InferResponseType } from 'hono';
import { client } from '@/lib/hono';
import { Checkbox } from '@/components/ui/checkbox';
import { Actions } from './actions';
import { Button } from '@/components/ui/button';
import { IconArrowsUpDown } from '@tabler/icons-react';

export type ResponseType = InferResponseType<typeof client.api.categories.$get, 200>["data"][0]

export const columns: ColumnDef<ResponseType>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && 'indeterminate')
                }
                onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={value => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'name',
        header: ({ column }) => {
            return (
                <Button
                    className='px-0 py-0 hover:bg-transparent'
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    variant="ghost"
                >
                    Name
                    <IconArrowsUpDown className="size-3.5" />
                </Button>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <Actions id={row.original.id} />
    }
];
