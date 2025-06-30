import { FC } from 'react';
import { Button } from '@/components/ui/button';
import { IconDownload, IconLoader } from '@tabler/icons-react';
import { SettingsCard } from './settings-card';
import { useExportData } from '../api/use-export-data';

export const DataPrivacySection: FC = () => {
    const exportDataMutation = useExportData();

    const handleExportData = () => {
        exportDataMutation.mutate();
    };

    return (
        <SettingsCard
            icon={<IconDownload className="size-5" />}
            title="Data & Privacy"
        >
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-medium">Export Data</h3>
                    <p className="text-sm text-muted-foreground">
                        Download a copy of your financial data
                    </p>
                </div>
                <Button 
                    variant="outline" 
                    onClick={handleExportData}
                    disabled={exportDataMutation.isPending}
                >
                    {exportDataMutation.isPending ? (
                        <IconLoader className="size-4 mr-2 animate-spin" />
                    ) : (
                        <IconDownload className="size-4 mr-2" />
                    )}
                    {exportDataMutation.isPending ? 'Exporting...' : 'Export'}
                </Button>
            </div>
        </SettingsCard>
    );
};