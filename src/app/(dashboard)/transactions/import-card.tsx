import React, { useState } from 'react';
import { Card, CardHeader, CardBody, CardFooter } from '@nextui-org/card';
import { Button } from '@nextui-org/button';
import { Button as ContinueButton } from '@/components/ui/button';
import { ImportTable } from './import-table';
import { cn } from '@/lib/utils';

const dateFormat = 'yyyy-MM-dd HH:mm:ss';
const outputFormat = 'yyyy-MM-dd';

const requiredOptions = ['amount', 'date', 'payee'];

interface SelectedColumnState {
    [key: string]: string | null;
}

type Props = {
    data: string[][];
    onCancel: () => void;
    onSubmit: (data: any) => void;
};

export const ImportCard = ({ data, onCancel, onSubmit }: Props) => {
   const [selectedColumns, setSelectedColumns] = useState<SelectedColumnState>({});
   const headers = data[0];
   const body = data.slice(1);
   const onTableHeadSelectChange = (columnIndex: number, value: string | null) => {
      setSelectedColumns((prev) => {
         const newSelectedColumns = {...prev};
         for (const key in newSelectedColumns) {
            if (newSelectedColumns[key] === value) {
               newSelectedColumns[key] = null;
            }
         }
         if (value === "skip") {
            value = null;
         }
         newSelectedColumns[`column_${columnIndex}`] = value;
         return newSelectedColumns;
      });
   };
   const progress = Object.values(selectedColumns).filter(Boolean).length;

    return (
        <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
            <Card className="border-none rounded shadow-sm px-6 pt-3">
                <CardHeader className="w-full gap-y-2 phone:grid tablet:flex tablet:flex-row lg:items-center lg:justify-between">
                    <h1 className="text-2xl line-clamp-1 font-medium tracking-tight">
                        Import Transaction
                    </h1>
                    <div className="flex gap-3">
                        <Button onClick={onCancel} className="bg-neutral-950 rounded text-white">
                            Cancel
                        </Button>
                        <ContinueButton disabled={progress < requiredOptions.length} onClick={() => {}} className={cn("bg-neutral-950 rounded h-auto text-sm text-white")}>
                            Continue ({progress} / {requiredOptions.length})
                        </ContinueButton>
                    </div>
                </CardHeader>
                <CardBody>
                  <ImportTable
                     headers={headers}
                     body={body}
                     selectedColumns={selectedColumns}
                     onTableHeadSelectChange={onTableHeadSelectChange}
                  />
                </CardBody>
            </Card>
        </div>
    );
};
