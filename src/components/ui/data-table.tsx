'use client';

import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    Row,
} from '@tanstack/react-table';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { TrashIcon } from '@radix-ui/react-icons';
import { useConfirm } from '../../hooks/use-confirm';
import { Button } from './button';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    filterKey: string;
    onDelete: (rows: Row<TData>[]) => void;
    disabled: boolean;
}

export function DataTable<TData, TValue>({ columns, data, filterKey, onDelete, disabled }: DataTableProps<TData, TValue>) {
    const [ConfirmDialog, confirm] = useConfirm(
        "Are you sure?",
        "You are about to perform a bulk delete."
    )
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [rowSelection, setRowSelection] = useState({});
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            rowSelection,
        },
    });

    return (
        <div>
            <ConfirmDialog />
            <div className="flex items-center pb-2">
                <Input
                    placeholder={`Filter ${filterKey}...`}
                    value={(table.getColumn(filterKey)?.getFilterValue() as string) ?? ''}
                    onChange={event =>
                        table.getColumn(filterKey)?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                {table.getFilteredSelectedRowModel().rows.length > 0 && (
                    <Button
                        size='sm'
                        disabled={disabled}
                        onClick={async () => {
                            const ok = await confirm();
                            if (ok) {
                                onDelete(table.getFilteredRowModel().rows);
                                table.resetRowSelection();
                            }
                        }}
                        className="ml-auto border-dashed bg-transparent font-normal text-sm rounded border border-neutral-500 py-2"
                    >
                        <TrashIcon className="size-4 mr-2" />
                        <span className="font-medium">Delete</span>(
                        {table.getFilteredSelectedRowModel().rows.length})
                    </Button>
                )}
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map(header => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder ? null : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext(),
                                            )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map(row => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                    {row.getVisibleCells().map(cell => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{' '}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <Button
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="rounded bg-neutral-950 text-white"
                >
                    Previous
                </Button>
                <Button
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="rounded bg-neutral-950 text-white"
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
