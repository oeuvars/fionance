'use client';

import { Button } from '@nextui-org/button';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { InferResponseType } from 'hono';
import { client } from '@/lib/hono';
import { Checkbox } from '@/components/ui/checkbox';
import { Actions } from './actions';

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
                    className="bg-transparent rounded -ml-4 text-neutral-600 font-medium"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Name
                    <ArrowUpDown className="size-3.5" />
                </Button>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <Actions id={row.original.id} />
    }
];
