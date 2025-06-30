'use client';

import { ColumnDef } from '@tanstack/react-table';
import { InferResponseType } from 'hono';
import { client } from '@/lib/hono';
import { Checkbox } from '@/components/ui/checkbox';
import { Actions } from './actions';
import { format } from 'date-fns';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { AccountColumn } from './account-column';
import { CategoryColumn } from './category-column';
import { Button } from '@/components/ui/button';
import { IconArrowsUpDown } from '@tabler/icons-react';

export type ResponseType = InferResponseType<typeof client.api.transactions.$get, 200>["data"][0]

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
        accessorKey: 'date',
        header: ({ column }) => {
            return (
                <Button
                    className="bg-transparent rounded -ml-4 text-neutral-600 font-medium"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Date
                    <IconArrowsUpDown className="size-3.5" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const date = row.getValue("date") as Date;
            return (
                <span>
                    {format(date, "dd MMMM, yyyy")}
                </span>
            )
        }
    },
    {
        accessorKey: 'category',
        header: ({ column }) => {
            return (
                <Button
                    className="bg-transparent rounded -ml-4 text-neutral-600 font-medium"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Category
                    <IconArrowsUpDown className="size-3.5" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return (
                <CategoryColumn id={row.original.id} category={row.original.category} categoryId={row.original.categoryId}></CategoryColumn>
            )
        }
    },
    {
        accessorKey: 'payee',
        header: ({ column }) => {
            return (
                <Button
                    className="bg-transparent rounded -ml-4 text-neutral-600 font-medium"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Payee
                    <IconArrowsUpDown className="size-3.5" />
                </Button>
            );
        },
    },
    {
        accessorKey: 'amount',
        header: ({ column }) => {
            return (
                <Button
                    className="bg-transparent rounded -ml-4 text-neutral-600 font-medium"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Amount
                    <IconArrowsUpDown className="size-3.5" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue('amount'));
            return (
                <Badge variant={amount < 0 ? "destructive" : "primary"} className='text-xs font-medium px-3.5 py-2.5'>
                    {formatCurrency(amount)}
                </Badge>
            )
        }
    },
    {
        accessorKey: 'account',
        header: ({ column }) => {
            return (
                <Button
                    className="bg-transparent rounded -ml-4 text-neutral-600 font-medium"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Account
                    <IconArrowsUpDown className="size-3.5" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return (
                <AccountColumn account={row.original.account} accountId={row.original.accountId}></AccountColumn>
            )
        }
    },
    {
        id: "actions",
        cell: ({ row }) => <Actions id={row.original.id} />
    }
];
