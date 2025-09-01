import React from 'react';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {Grid3X3, Grid2X2, LayoutGrid} from 'lucide-react';
import {useI18n} from '@/hooks/useI18n';

interface SizeSelectorProps {
    currentSize: number;
    onSizeChange: (size: number) => void;
    disabled?: boolean;
}

export const SizeSelector: React.FC<SizeSelectorProps> = ({
                                                              currentSize,
                                                              onSizeChange,
                                                              disabled = false,
                                                          }) => {
    const {t} = useI18n();

    const sizes = [
        {
            size: 3,
            name: '3×3',
            description: t('easy'),
            icon: Grid2X2,
            difficulty: t('sizeDescription.3'),
            color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        },
        {
            size: 4,
            name: '4×4',
            description: t('medium'),
            icon: Grid3X3,
            difficulty: t('sizeDescription.4'),
            color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
        },
        {
            size: 5,
            name: '5×5',
            description: t('hard'),
            icon: LayoutGrid,
            difficulty: t('sizeDescription.5'),
            color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-center">{t('chooseSize')}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {sizes.map(({size, name, description, icon: Icon, difficulty, color}) => (
                        <Button
                            key={size}
                            variant={currentSize === size ? 'default' : 'outline'}
                            className="h-auto p-4 flex flex-col items-center gap-3"
                            onClick={() => onSizeChange(size)}
                            disabled={disabled}
                        >
                            <Icon className="h-8 w-8"/>
                            <div className="text-center">
                                <div className="font-bold text-lg">{name}</div>
                                <div className="text-sm opacity-80">{description}</div>
                                <Badge
                                    variant="secondary"
                                    className={`mt-2 text-xs ${currentSize === size ? 'bg-white/20 text-white' : color}`}
                                >
                                    {difficulty}
                                </Badge>
                            </div>
                        </Button>
                    ))}
                </div>

                <div className="mt-4 text-center text-sm text-muted-foreground">
                    <p>{t('chooseSizeDescription')}</p>
                </div>
            </CardContent>
        </Card>
    );
};