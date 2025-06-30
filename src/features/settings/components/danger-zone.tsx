import { FC } from 'react';
import { Button } from '@/components/ui/button';
import { IconTrash, IconLogout } from '@tabler/icons-react';
import { SettingsCard } from './settings-card';
import { toast } from 'sonner';

interface DangerZoneSectionProps {
    onSignOut: () => void;
}

export const DangerZoneSection: FC<DangerZoneSectionProps> = ({ onSignOut }) => {
    const handleDeleteAccount = () => {
        toast.error('Account deletion is not available. Please contact support.');
    };

    return (
        <SettingsCard
            icon={<IconTrash className="size-5 text-red-600" />}
            title="Danger Zone"
            className="border-red-200"
        >
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-medium">Sign Out</h3>
                    <p className="text-sm text-muted-foreground">
                        Sign out of your account
                    </p>
                </div>
                <Button variant="outline" onClick={onSignOut}>
                    <IconLogout className="size-4 mr-2" />
                    Sign Out
                </Button>
            </div>
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-medium text-red-600">Delete Account</h3>
                    <p className="text-sm text-muted-foreground">
                        Permanently delete your account and all data
                    </p>
                </div>
                <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50" onClick={handleDeleteAccount}>
                    <IconTrash className="size-4 mr-2" />
                    Delete Account
                </Button>
            </div>
        </SettingsCard>
    );
};