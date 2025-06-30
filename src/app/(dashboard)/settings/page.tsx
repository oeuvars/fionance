'use client';

import { FC } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { useSession, signOut } from '@/lib/auth-client';
import { IconLoader } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { ProfileSection } from '../../../features/settings/components/profile-section';
import { SecuritySection } from '../../../features/settings/components/security-section';
import { DataPrivacySection } from '../../../features/settings/components/data-privacy-section';
import { Separator } from '@/components/ui/separator';
import { NotificationSection } from '../../../features/settings/components/notifications-section';
import { PreferencesSection } from '../../../features/settings/components/preferences-section';
import { DangerZoneSection } from '../../../features/settings/components/danger-zone';

const SettingsPage: FC = () => {
    const { data: session, isPending } = useSession();
    const router = useRouter();
    const { showToast } = useToast();

    const handleSignOut = async () => {
        try {
            await signOut({
                fetchOptions: {
                    onSuccess: () => {
                        router.push('/sign-in');
                    }
                }
            });
        } catch (error) {
            showToast({
                message: 'Failed to sign out',
                type: 'error'
            });
        }
    };


    if (isPending) {
        return (
            <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
                <Card className="border-none rounded shadow-sm px-6 pt-3">
                    <CardContent>
                        <div className="h-[500px] w-full flex items-center justify-center">
                            <IconLoader className='animate-spin'/>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
            {/* Header */}
            <Card className="border-none rounded shadow-sm px-6 pt-3">
                <CardHeader>
                    <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
                    <p className="text-sm text-muted-foreground">
                        Manage your account settings and preferences
                    </p>
                </CardHeader>
            </Card>

            <ProfileSection user={session?.user ?? null} />
            <Separator />
            <NotificationSection />
            <Separator />
            <PreferencesSection />  
            <Separator />
            <SecuritySection />
            <Separator />
            <DataPrivacySection />
            <Separator />
            <DangerZoneSection onSignOut={handleSignOut} />
        </div>
    );
};

export default SettingsPage;