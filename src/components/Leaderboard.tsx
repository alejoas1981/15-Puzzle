import React, {useState, useEffect} from 'react';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import {Skeleton} from '@/components/ui/skeleton';
import {Trophy, Medal, Award, Clock, MousePointer, Calendar} from 'lucide-react';
import {Score, LeaderboardFilters} from '@/types/game';
import {useI18n} from '@/hooks/useI18n';

interface LeaderboardProps {
    isOpen: boolean;
    onClose: () => void;
    scores: Score[];
    isLoading: boolean;
    filters: LeaderboardFilters;
    onFiltersChange: (filters: LeaderboardFilters) => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
                                                            isOpen,
                                                            onClose,
                                                            scores,
                                                            isLoading,
                                                            filters,
                                                            onFiltersChange,
                                                        }) => {
    const {t} = useI18n();

    const formatTime = (ms: number) => {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        const centiseconds = Math.floor((ms % 1000) / 10);

        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
            .toString()
            .padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
    };

    const formatDate = (date: Date) => {
        const locale = t('language') === 'ru' ? 'ru-RU' :
            t('language') === 'uk' ? 'uk-UA' :
                t('language') === 'es' ? 'es-ES' :
                    t('language') === 'fr' ? 'fr-FR' : 'en-US';

        return new Intl.DateTimeFormat(locale, {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(new Date(date));
    };

    const getRankIcon = (position: number) => {
        switch (position) {
            case 1:
                return <Trophy className="h-5 w-5 text-yellow-500"/>;
            case 2:
                return <Medal className="h-5 w-5 text-gray-400"/>;
            case 3:
                return <Award className="h-5 w-5 text-amber-600"/>;
            default:
                return <span className="text-lg font-bold text-muted-foreground">#{position}</span>;
        }
    };

    const getRankBadgeVariant = (position: number): "default" | "secondary" | "destructive" | "outline" => {
        switch (position) {
            case 1:
                return "default";
            case 2:
            case 3:
                return "secondary";
            default:
                return "outline";
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Trophy className="h-6 w-6 text-yellow-500"/>
                        {t('leaderboardTitle')}
                    </DialogTitle>
                    <DialogDescription>
                        {t('gameSubtitle')}
                    </DialogDescription>
                </DialogHeader>

                {/* Фильтры */}
                <div className="flex flex-col sm:flex-row gap-3 py-4">
                    <div className="flex-1">
                        <label className="text-sm font-medium mb-2 block">{t('filterBySize')}:</label>
                        <Select
                            value={filters.size?.toString() || 'all'}
                            onValueChange={(value) =>
                                onFiltersChange({
                                    ...filters,
                                    size: value === 'all' ? undefined : parseInt(value),
                                })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={t('allSizes')}/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{t('allSizes')}</SelectItem>
                                <SelectItem value="3">3×3</SelectItem>
                                <SelectItem value="4">4×4</SelectItem>
                                <SelectItem value="5">5×5</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex-1">
                        <label className="text-sm font-medium mb-2 block">{t('filterByPeriod')}:</label>
                        <Select
                            value={filters.period || 'all'}
                            onValueChange={(value) =>
                                onFiltersChange({
                                    ...filters,
                                    period: value === 'all' ? undefined : (value as 'week' | 'month'),
                                })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={t('allTime')}/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{t('allTime')}</SelectItem>
                                <SelectItem value="week">{t('thisWeek')}</SelectItem>
                                <SelectItem value="month">{t('thisMonth')}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Leaderboard */}
                <div className="flex-1 overflow-auto">
                    {isLoading ? (
                        <div className="space-y-3">
                            {Array.from({length: 10}, (_, i) => (
                                <Skeleton key={i} className="h-16 w-full"/>
                            ))}
                        </div>
                    ) : scores.length === 0 ? (
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-center text-muted-foreground">
                                    <Trophy className="h-12 w-12 mx-auto mb-3 opacity-50"/>
                                    <p>{t('noResults')}</p>
                                    <p className="text-sm mt-1">{t('playFirst')}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-16">{t('rank')}</TableHead>
                                    <TableHead>{t('name')}</TableHead>
                                    <TableHead className="text-center">{t('size')}</TableHead>
                                    <TableHead className="text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <Clock className="h-4 w-4"/>
                                            {t('time')}
                                        </div>
                                    </TableHead>
                                    <TableHead className="text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <MousePointer className="h-4 w-4"/>
                                            {t('moves')}
                                        </div>
                                    </TableHead>
                                    <TableHead className="text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <Trophy className="h-4 w-4"/>
                                            {t('score')}
                                        </div>
                                    </TableHead>
                                    <TableHead className="text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <Calendar className="h-4 w-4"/>
                                            {t('period')}
                                        </div>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {scores.map((score, index) => (
                                    <TableRow key={score.id} className={index < 3 ? 'bg-secondary/30' : ''}>
                                        <TableCell>
                                            <div className="flex items-center justify-center">
                                                {getRankIcon(index + 1)}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">{score.name}</span>
                                                {index < 3 && (
                                                    <Badge variant={getRankBadgeVariant(index + 1)}>
                                                        {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                                                    </Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant="outline">{score.size}×{score.size}</Badge>
                                        </TableCell>
                                        <TableCell className="text-center font-mono">
                                            {formatTime(score.timeMs)}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {score.moves}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant="secondary" className="font-bold">
                                                {score.score}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center text-sm text-muted-foreground">
                                            {formatDate(score.createdAt)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>

                <div className="flex justify-end pt-4 border-t">
                    <Button onClick={onClose}>{t('close')}</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};