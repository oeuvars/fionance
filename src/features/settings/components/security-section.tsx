import { FC } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { IconShield } from '@tabler/icons-react';
import { SettingsCard } from './settings-card';

export const SecuritySection: FC = () => {
    return (
        <SettingsCard
            icon={<IconShield className="size-5" />}
            title="Security"
        >
            <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" placeholder="Enter current password" />
            </div>
            <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" placeholder="Enter new password" />
            </div>
            <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" placeholder="Confirm new password" />
            </div>

            <Button variant="outline">
                Change Password
            </Button>
        </SettingsCard>
    );
};