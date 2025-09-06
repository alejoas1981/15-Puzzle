import React from 'react';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {GameState} from '@/types/game';
import {Play, Pause, RotateCcw, Trophy, Clock, MousePointer} from 'lucide-react';
import {useI18n} from '@/hooks/useI18n';

interface GameUIProps {
    gameState: GameState;
    score: number;
    onNewGame: () => void;
    onPause: () => void;
    onShowLeaderboard: () => void;
    gameSize?: number;
}

export const GameUI: React.FC<GameUIProps> = ({
                                                  gameState,
                                                  score,
                                                  onNewGame,
                                                  onPause,
                                                  onShowLeaderboard,
                                                  gameSize = gameState.size,
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

    return (
        <div className="space-y-4">
            {/* Game statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4"/>
                            {t('time')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">
                            {formatTime(gameState.timeMs)}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-sm">
                            <MousePointer className="h-4 w-4"/>
                            {t('moves')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">
                            {gameState.moves}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-sm">
                            <Trophy className="h-4 w-4"/>
                            {t('score')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">
                            {score}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Control the game */}
            <div className="flex flex-wrap gap-3 justify-center">
                <Button
                    onClick={onNewGame}
                    variant="default"
                    className="flex items-center gap-2"
                >
                    <RotateCcw className="h-4 w-4"/>
                    {t('newGame')}
                </Button>

                <Button
                    onClick={onPause}
                    variant="outline"
                    disabled={!gameState.startTime || gameState.isWon}
                    className="flex items-center gap-2"
                >
                    {gameState.isPaused ? (
                        <Play className="h-4 w-4"/>
                    ) : (
                        <Pause className="h-4 w-4"/>
                    )}
                    {gameState.isPaused ? t('resume') : t('pause')}
                </Button>

                <Button
                    onClick={onShowLeaderboard}
                    variant="secondary"
                    className="flex items-center gap-2"
                >
                    <Trophy className="h-4 w-4"/>
                    {t('leaderboard')}
                </Button>
            </div>

            {/* Game status */}
            {gameState.isWon && (
                <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-700 dark:text-green-300 mb-2">
                                🎉 {t('congratulations')} 🎉
                            </div>
                            <p className="text-green-600 dark:text-green-400">
                                {t('youWon')} {formatTime(gameState.timeMs)} и {gameState.moves} ходов!
                            </p>
                            <div className="mt-2">
                                <Badge variant="secondary" className="text-lg px-3 py-1">
                                    {t('yourScore')}: {score}
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {gameState.isPaused && !gameState.isWon && (
                <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <div className="text-xl font-semibold text-yellow-700 dark:text-yellow-300 mb-2">
                                {t('pausedMessage')}
                            </div>
                            <p className="text-yellow-600 dark:text-yellow-400">
                                {t('pausedDescription')}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Instructions for new players */}
            {gameState.moves === 0 && !gameState.startTime && (
                <div className="space-y-4">
                    <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
                        <CardHeader>
                            <CardTitle className="text-blue-700 dark:text-blue-300">
                                {t('howToPlay')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-blue-600 dark:text-blue-400">
                            <ul className="space-y-2 text-sm">
                                {t('gameInstructions').split('•').filter(Boolean).map((instruction, index) => (
                                    <li key={index}>• {instruction.trim()}{index === 3 ? ` ${gameSize * gameSize - 1}` : ''}</li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
                        <CardHeader>
                            <CardTitle className="text-orange-700 dark:text-orange-300">
                                💾 {t('demoMode')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-orange-600 dark:text-orange-400 text-sm">
                            <p>{t('demoDescription')}</p>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};