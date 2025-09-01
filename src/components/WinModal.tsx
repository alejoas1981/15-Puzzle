import React, {useState, useEffect} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {Badge} from '@/components/ui/badge';
import {Trophy, Clock, MousePointer, Star} from 'lucide-react';
import {toast} from 'sonner';
import {useI18n} from '@/hooks/useI18n';

interface WinModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (name: string) => Promise<boolean>;
    timeMs: number;
    moves: number;
    score: number;
    size: number;
}

const PLAYER_NAME_KEY = 'puzzle_player_name';

export const WinModal: React.FC<WinModalProps> = ({
                                                      isOpen,
                                                      onClose,
                                                      onSubmit,
                                                      timeMs,
                                                      moves,
                                                      score,
                                                      size,
                                                  }) => {
    const {t} = useI18n();
    const [name, setName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Загрузка имени из localStorage при открытии модального окна
    useEffect(() => {
        if (isOpen) {
            const savedName = localStorage.getItem(PLAYER_NAME_KEY) || '';
            setName(savedName);
        }
    }, [isOpen]);

    const formatTime = (ms: number) => {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        const centiseconds = Math.floor((ms % 1000) / 10);

        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
            .toString()
            .padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
    };

    const handleSubmit = async () => {
        if (!name.trim()) {
            toast.error(t('enterName'));
            return;
        }

        if (name.length > 32) {
            toast.error('Name must not exceed 32 characters');
            return;
        }

        setIsSubmitting(true);

        try {
            const success = await onSubmit(name.trim());
            if (success) {
                localStorage.setItem(PLAYER_NAME_KEY, name.trim());
                toast.success('Score saved to the leaderboard!');
                onClose();
            } else {
                toast.error('Error saving the score');
            }
        } catch (error) {
            console.error('Error submitting score:', error);
            toast.error('Error saving the score');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !isSubmitting) {
            handleSubmit();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-2xl">
                        <Trophy className="h-6 w-6 text-yellow-500"/>
                        {t('congratulations')}
                    </DialogTitle>
                    <DialogDescription>
                        {t('youWon')} {size}×{size}!
                    </DialogDescription>
                </DialogHeader>

                {/* Results */}
                <div className="grid grid-cols-2 gap-4 my-4">
                    <div className="text-center p-3 bg-secondary rounded-lg">
                        <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-1">
                            <Clock className="h-4 w-4"/>
                            {t('time')}
                        </div>
                        <div className="text-lg font-bold">{formatTime(timeMs)}</div>
                    </div>

                    <div className="text-center p-3 bg-secondary rounded-lg">
                        <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-1">
                            <MousePointer className="h-4 w-4"/>
                            {t('moves')}
                        </div>
                        <div className="text-lg font-bold">{moves}</div>
                    </div>
                </div>

                {/* Scores */}
                <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Star className="h-5 w-5 text-yellow-500"/>
                        <span className="text-sm text-muted-foreground">{t('yourScore')}</span>
                    </div>
                    <Badge variant="secondary" className="text-2xl px-4 py-2 font-bold">
                        {score}
                    </Badge>
                </div>

                {/* Name input form */}
                <div className="space-y-2">
                    <Label htmlFor="player-name">{t('enterName')}:</Label>
                    <Input
                        id="player-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={t('name')}
                        maxLength={32}
                        disabled={isSubmitting}
                        autoFocus
                    />
                </div>

                <DialogFooter className="gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        {t('playAgain')}
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting || !name.trim()}
                        className="flex items-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <div
                                    className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full"/>
                                Сохранение...
                            </>
                        ) : (
                            <>
                                <Trophy className="h-4 w-4"/>
                                {t('saveScore')}
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};