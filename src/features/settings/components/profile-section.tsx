import { FC, useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { IconUser, IconLoader } from '@tabler/icons-react';
import { SettingsCard } from './settings-card';
import { useGetProfile } from '../api/use-get-profile';
import { useUpdateProfile } from '../api/use-update-profile';
import { useToast } from '@/hooks/use-toast';

interface ProfileSectionProps {
    user: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
    } | null;
}

export const ProfileSection: FC<ProfileSectionProps> = ({ user }) => {
    const { data: profileData, isLoading: profileLoading } = useGetProfile();
    const updateProfileMutation = useUpdateProfile();
    const { showToast } = useToast();
    
    const [formData, setFormData] = useState({
        name: '',
        email: ''
    });
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (profileData) {
            setFormData({
                name: profileData.name || '',
                email: profileData.email || ''
            });
        } else if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || ''
            });
        }
    }, [profileData, user]);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                showToast({
                    message: 'File size must be less than 2MB',
                    type: 'error'
                });
                return;
            }
            
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            if (!validTypes.includes(file.type)) {
                showToast({
                    message: 'Please select a valid image file (JPG, PNG, GIF)',
                    type: 'error'
                });
                return;
            }

            setAvatarFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleSaveProfile = async () => {
        if (!formData.name.trim() || !formData.email.trim()) {
            showToast({
                message: 'Please fill in all required fields',
                type: 'error'
            });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            showToast({
                message: 'Please enter a valid email address',
                type: 'error'
            });
            return;
        }

        updateProfileMutation.mutate({
            name: formData.name,
            email: formData.email
        });
    };

    return (
        <SettingsCard
            icon={<IconUser className="size-5" />}
            title="Profile"
        >
            <div className="flex items-center gap-4">
                <Avatar className="rounded-full">
                    <AvatarImage src={previewUrl || user?.image || ''} />
                    <AvatarFallback className="text-lg">
                        {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                    </AvatarFallback>
                </Avatar>
                <div className='space-y-1'>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                    />
                    <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        Change Avatar
                    </Button>
                    <p className="text-xs font-medium text-muted mt-1">
                        JPG, GIF or PNG. Max size 2MB.
                    </p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input 
                        id="name" 
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter your full name"
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input 
                        id="email" 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="Enter your email"
                        required
                    />
                </div>
            </div>

            <Button 
                onClick={handleSaveProfile} 
                className="bg-neutral-800 text-white"
                disabled={updateProfileMutation.isPending || profileLoading}
            >
                {updateProfileMutation.isPending && <IconLoader className="mr-2 h-4 w-4 animate-spin" />}
                {updateProfileMutation.isPending ? 'Updating...' : 'Save Profile'}
            </Button>
        </SettingsCard>
    );
};