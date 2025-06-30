import { FC, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { IconPalette, IconLoader } from '@tabler/icons-react';
import { SettingsCard } from './settings-card';
import { useGetPreferences } from '../api/use-get-preferences';
import { useUpdatePreferences } from '../api/use-update-preferences';

export const PreferencesSection: FC = () => {
    const { data: preferencesData, isLoading: preferencesLoading } = useGetPreferences();
    const updatePreferencesMutation = useUpdatePreferences();
    
    const [preferences, setPreferences] = useState<{
        currency: string;
        theme: string;
        dateFormat: string;
        language: string;
    } | null>(null);

    useEffect(() => {
        if (preferencesData) {
            setPreferences({
                currency: preferencesData.currency || 'USD',
                theme: preferencesData.theme || 'system',
                dateFormat: preferencesData.dateFormat || 'MM/dd/yyyy',
                language: preferencesData.language || 'en'
            });
        }
    }, [preferencesData]);

    const handlePreferenceChange = (key: string, value: string) => {
        if (preferences) {
            setPreferences(prev => prev ? { ...prev, [key]: value } : null);
        }
    };

    const handleSavePreferences = () => {
        if (preferences) {
            updatePreferencesMutation.mutate(preferences);
        }
    };

    return (
        <SettingsCard
            icon={<IconPalette className="size-5" />}
            title="Preferences"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className='space-y-1'>
                    <Label htmlFor="currency">Default Currency</Label>
                    {preferencesLoading || !preferences ? (
                        <Skeleton className="h-9 w-full" />
                    ) : (
                        <Select value={preferences.currency} onValueChange={(value) => handlePreferenceChange('currency', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="USD">USD ($)</SelectItem>
                                <SelectItem value="EUR">EUR (€)</SelectItem>
                                <SelectItem value="GBP">GBP (£)</SelectItem>
                                <SelectItem value="CAD">CAD (C$)</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                </div>
                <div className='space-y-1'>
                    <Label htmlFor="theme">Theme</Label>
                    {preferencesLoading || !preferences ? (
                        <Skeleton className="h-9 w-full" />
                    ) : (
                        <Select value={preferences.theme} onValueChange={(value) => handlePreferenceChange('theme', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select theme" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="light">Light</SelectItem>
                                <SelectItem value="dark">Dark</SelectItem>
                                <SelectItem value="system">System</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                </div>
                <div className='space-y-1'>
                    <Label htmlFor="dateFormat">Date Format</Label>
                    {preferencesLoading || !preferences ? (
                        <Skeleton className="h-9 w-full" />
                    ) : (
                        <Select value={preferences.dateFormat} onValueChange={(value) => handlePreferenceChange('dateFormat', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select date format" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="MM/dd/yyyy">MM/DD/YYYY</SelectItem>
                                <SelectItem value="dd/MM/yyyy">DD/MM/YYYY</SelectItem>
                                <SelectItem value="yyyy-MM-dd">YYYY-MM-DD</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                </div>
                <div className='space-y-1'>
                    <Label htmlFor="language">Language</Label>
                    {preferencesLoading || !preferences ? (
                        <Skeleton className="h-9 w-full" />
                    ) : (
                        <Select value={preferences.language} onValueChange={(value) => handlePreferenceChange('language', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="en">English</SelectItem>
                                <SelectItem value="es">Spanish</SelectItem>
                                <SelectItem value="fr">French</SelectItem>
                                <SelectItem value="de">German</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                </div>
            </div>

            <Button 
                onClick={handleSavePreferences} 
                className="bg-neutral-800 text-white"
                disabled={updatePreferencesMutation.isPending || preferencesLoading || !preferences}
            >
                {updatePreferencesMutation.isPending && <IconLoader className="mr-2 h-4 w-4 animate-spin" />}
                {updatePreferencesMutation.isPending ? 'Saving...' : 'Save Preferences'}
            </Button>
        </SettingsCard>
    );
};