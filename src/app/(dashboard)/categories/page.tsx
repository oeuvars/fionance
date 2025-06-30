'use client';

import { FC } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { PlusIcon } from '@radix-ui/react-icons';
import { columns } from './columns';
import { DataTable } from '@/components/ui/data-table';
import { Skeleton } from '@/components/ui/skeleton';
import { useNewCategory } from '../../../features/categories/hooks/use-new-category';
import { useBulkDeleteCategories } from '../../../features/categories/api/use-bulk-delete-categories';
import { useGetCategories } from '../../../features/categories/api/use-get-categories';
import { IconLoader } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';

const CategoriesPage: FC = () => {
    const newCategory = useNewCategory();
    const deleteCategories = useBulkDeleteCategories();
    const categoriesQuery = useGetCategories();
    const categories = categoriesQuery.data || [];

    const isDisabled = categoriesQuery.isLoading || deleteCategories.isPending;

    if (categoriesQuery.isLoading) {
        return (
            <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
                <Card className="border-none rounded shadow-sm px-6 pt-3">
                    <CardHeader>
                        <Skeleton className="h-8 w-48" />
                    </CardHeader>
                    <CardContent>
                        <div className="h-[500px] w-full flex items-center justify-center">
                            <IconLoader className="animate-spin size-6 text-neutral-300" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
            <Card className="border-none rounded shadow-sm px-6 pt-3">
                <CardHeader className="w-full gap-y-2 phone:grid tablet:flex tablet:flex-row lg:items-center lg:justify-between">
                    <h1 className="text-2xl line-clamp-1 font-semibold tracking-tight">
                        Categories
                    </h1>
                    <Button
                        onClick={newCategory.onOpen}
                        className="bg-neutral-800 text-white rounded-md"
                    >
                        <PlusIcon className="size-4 mr-2 text-neutral-100" />
                        Add New
                    </Button>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={categories}
                        filterKey="name"
                        onDelete={(row) => {
                          const ids = row.map((r) => r.original.id);
                          deleteCategories.mutate({ ids })
                        }}
                        disabled={isDisabled}
                    />
                </CardContent>
            </Card>
        </div>
    );
};

export default CategoriesPage;
