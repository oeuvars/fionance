'use client';

import { FC } from 'react';
import { Card, CardHeader, CardBody, CardFooter } from '@nextui-org/card';
import { Button } from '@nextui-org/button';
import { PlusIcon } from '@radix-ui/react-icons';
import { useNewAccount } from '../../../../features/accounts/hooks/use-new-account';
import { columns } from './columns';
import { DataTable } from '@/components/ui/data-table';
import { useGetAccounts } from '../../../../features/accounts/api/use-get-accounts';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';
import { useBulkDeleteAccounts } from '../../../../features/accounts/api/use-bulk-delete-accounts';

const AccountsPage: FC = () => {
    const newAccount = useNewAccount();
    const deleteAccounts = useBulkDeleteAccounts();
    const accountsQuery = useGetAccounts();
    const accounts = accountsQuery.data || [];

    const isDisabled = accountsQuery.isLoading || deleteAccounts.isPending;

    if (accountsQuery.isLoading) {
        return (
            <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
                <Card className="border-none rounded shadow-sm px-6 pt-3">
                    <CardHeader>
                        <Skeleton className="h-8 w-48" />
                    </CardHeader>
                    <CardBody>
                        <div className="h-[500px] w-full flex items-center justify-center">
                            <Loader2 className="animate-spin size-6 text-neutral-300" />
                        </div>
                    </CardBody>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
            <Card className="border-none rounded shadow-sm px-6 pt-3">
                <CardHeader className="w-full gap-y-2 phone:grid tablet:flex tablet:flex-row lg:items-center lg:justify-between">
                    <h1 className="text-2xl line-clamp-1 font-medium tracking-tight">
                        Accounts Page
                    </h1>
                    <Button
                        onClick={newAccount.onOpen}
                        className="bg-neutral-950 rounded text-white "
                    >
                        <PlusIcon className="size-4 mr-2 text-neutral-100" />
                        Add New
                    </Button>
                </CardHeader>
                <CardBody>
                    <DataTable
                        columns={columns}
                        data={accounts}
                        filterKey="name"
                        onDelete={(row) => {
                          const ids = row.map((r) => r.original.id);
                          deleteAccounts.mutate({ ids })
                        }}
                        disabled={isDisabled}
                    />
                </CardBody>
            </Card>
        </div>
    );
};

export default AccountsPage;
