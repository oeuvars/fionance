import { useCSVReader } from 'react-papaparse';
import { Button } from '@/components/ui/button';
import { IconUpload } from '@tabler/icons-react';
import { INITIAL_IMPORT_RESULTS } from './page';

interface CSVReaderRenderProps {
    getRootProps: () => Record<string, unknown>;
}

export const UploadButton = ({ onUpload }: { onUpload: (results: typeof INITIAL_IMPORT_RESULTS) => void }) => {
    const { CSVReader } = useCSVReader();

    // Todo: Add a paywall
    return (
        <CSVReader onUploadAccepted={onUpload}>
            {({ getRootProps }: CSVReaderRenderProps) => (
                <Button
                    className="w-full h-auto font-normal text-sm lg:w-auto bg-neutral-800 rounded-md text-white"
                    {...getRootProps()}
                >
                    <IconUpload className="size-4 mr-2 text-neutral-100" />
                    Import
                </Button>
            )}
        </CSVReader>
    );
};
