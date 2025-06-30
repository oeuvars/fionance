'use client';

import { FC, useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { PlusIcon } from '@radix-ui/react-icons';
import { columns } from './columns';
import { DataTable } from '@/components/ui/data-table';
import { Skeleton } from '@/components/ui/skeleton';
import { useNewTransaction } from '../../../features/transactions/hooks/use-new-transaction';
import { useBulkDeleteTransactions } from '../../../features/transactions/api/use-bulk-delete-transactions';
import { useGetTransactions } from '../../../features/transactions/api/use-get-transactions';
import { UploadButton } from './upload-button';
import { ImportCard } from './import-card';
import { IconLoader } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';

enum VARIANTS {
    LIST = "LIST",
    IMPORT = "IMPORT"
};
export const INITIAL_IMPORT_RESULTS = {
    data: [],
    errors: [],
    meta: {}
};

const TransactionsPage: FC = () => {
    const [variant, setVariants] = useState<VARIANTS>(VARIANTS.LIST)
    const [importResults, setImportResults] = useState(INITIAL_IMPORT_RESULTS);
    const onUpload = (results: typeof INITIAL_IMPORT_RESULTS) => {
        setImportResults(results);
        setVariants(VARIANTS.IMPORT)
    };
    const onCancelImport = () => {
        setImportResults(INITIAL_IMPORT_RESULTS);
        setVariants(VARIANTS.LIST)
    };
    const newTransaction = useNewTransaction();
    const deleteTransactions = useBulkDeleteTransactions();
    const transactionsQuery = useGetTransactions();
    const transactions = transactionsQuery.data || [];

    const isDisabled = transactionsQuery.isLoading || deleteTransactions.isPending;

    if (transactionsQuery.isLoading) {
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

    if(variant === VARIANTS.IMPORT) {
        return (
            <>
                <ImportCard data={importResults.data} onCancel={onCancelImport} onSubmit={() => {}} />
            </>
        )
    }

    return (
        <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
            <Card className="border-none rounded shadow-sm px-6 pt-3">
                <CardHeader className="w-full gap-y-2 phone:grid tablet:flex tablet:flex-row lg:items-center lg:justify-between">
                    <h1 className="text-2xl line-clamp-1 font-medium tracking-tight">
                        Transactions Page
                    </h1>
                    <div className='flex gap-3'>
                        <Button
                            onClick={newTransaction.onOpen}
                            className="bg-neutral-950 rounded text-white"
                        >
                            <PlusIcon className="size-4 mr-2 text-neutral-100" />
                            Add New
                        </Button>
                        <UploadButton onUpload={onUpload} />
                    </div>

                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={transactions}
                        filterKey="payee"
                        onDelete={(row) => {
                          const ids = row.map((r) => r.original.id);
                          deleteTransactions.mutate({ ids })
                        }}
                        disabled={isDisabled}
                    />
                </CardContent>
            </Card>
        </div>
    );
};

export default TransactionsPage;
