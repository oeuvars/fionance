import { FC, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { IconBell, IconLoader } from '@tabler/icons-react';
import { SettingsCard } from './settings-card';
import { useGetNotifications } from '../api/use-get-notifications';
import { useUpdateNotifications } from '../api/use-update-notifications';

interface NotificationPreferences {
    transactionAlerts: boolean;
    budgetWarnings: boolean;
    weeklyReports: boolean;
    securityAlerts: boolean;
}

export const NotificationSection: FC = () => {
    const { data: notificationsData, isLoading: notificationsLoading } = useGetNotifications();
    const updateNotificationsMutation = useUpdateNotifications();

    const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);

    useEffect(() => {
        if (notificationsData) {
            setPreferences({
                transactionAlerts: notificationsData.transactionAlerts ?? true,
                budgetWarnings: notificationsData.budgetWarnings ?? true,
                weeklyReports: notificationsData.weeklyReports ?? false,
                securityAlerts: notificationsData.securityAlerts ?? true,
            });
        }
    }, [notificationsData]);

    const handlePreferenceChange = (key: keyof NotificationPreferences, value: boolean) => {
        if (preferences) {
            setPreferences(prev => (prev ? { ...prev, [key]: value } : null));
        }
    };

    const handleSaveNotifications = async () => {
        if (preferences) {
            updateNotificationsMutation.mutate(preferences);
        }
    };

    return (
        <SettingsCard icon={<IconBell className="size-5" />} title="Notifications">
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <Label className="text-sm font-medium">Transaction Alerts</Label>
                        <p className="text-xs text-muted-foreground">
                            Get notified when new transactions are added
                        </p>
                    </div>
                    {notificationsLoading || !preferences ? (
                        <Skeleton className="size-5" />
                    ) : (
                        <Checkbox
                            checked={preferences.transactionAlerts}
                            onCheckedChange={checked =>
                                handlePreferenceChange('transactionAlerts', checked as boolean)
                            }
                        />
                    )}
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <Label className="text-sm font-medium">Budget Warnings</Label>
                        <p className="text-xs text-muted-foreground">
                            Alerts when approaching budget limits
                        </p>
                    </div>
                    {notificationsLoading || !preferences ? (
                        <Skeleton className="size-5" />
                    ) : (
                        <Checkbox
                            checked={preferences.budgetWarnings}
                            onCheckedChange={checked =>
                                handlePreferenceChange('budgetWarnings', checked as boolean)
                            }
                        />
                    )}
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <Label className="text-sm font-medium">Weekly Reports</Label>
                        <p className="text-xs text-muted-foreground">
                            Weekly financial summary emails
                        </p>
                    </div>
                    {notificationsLoading || !preferences ? (
                        <Skeleton className="size-5" />
                    ) : (
                        <Checkbox
                            checked={preferences.weeklyReports}
                            onCheckedChange={checked =>
                                handlePreferenceChange('weeklyReports', checked as boolean)
                            }
                        />
                    )}
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <Label className="text-sm font-medium">Security Alerts</Label>
                        <p className="text-xs text-muted-foreground">
                            Login and security notifications
                        </p>
                    </div>
                    {notificationsLoading || !preferences ? (
                        <Skeleton className="size-5" />
                    ) : (
                        <Checkbox
                            checked={preferences.securityAlerts}
                            onCheckedChange={checked =>
                                handlePreferenceChange('securityAlerts', checked as boolean)
                            }
                        />
                    )}
                </div>
            </div>

            <Button
                onClick={handleSaveNotifications}
                className="bg-neutral-800 text-white"
                disabled={updateNotificationsMutation.isPending}
            >
                {updateNotificationsMutation.isPending && (
                    <IconLoader className="mr-2 h-4 w-4 animate-spin" />
                )}
                {updateNotificationsMutation.isPending ? 'Saving...' : 'Save Notifications'}
            </Button>
        </SettingsCard>
    );
};
