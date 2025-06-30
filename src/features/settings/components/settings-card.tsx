import { FC, ReactNode } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

interface SettingsCardProps {
    icon: ReactNode;
    title: string;
    children: ReactNode;
    className?: string;
}

export const SettingsCard: FC<SettingsCardProps> = ({ icon, title, children, className = "" }) => {
    return (
        <Card className={`rounded-lg border-none shadow-none px-6 py-4 ${className}`}>
            <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                    {icon}
                    <h2 className="text-lg font-medium">{title}</h2>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {children}
            </CardContent>
        </Card>
    );
};