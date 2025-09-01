import React, {useState, useEffect, useCallback} from 'react';
import {GameCanvasDom} from '@/components/GameCanvasDom';
import {GameUI} from '@/components/GameUI';
import {WinModal} from '@/components/WinModal';
import {Leaderboard} from '@/components/Leaderboard';
import {SizeSelector} from '@/components/SizeSelector';
import {useGame} from '@/hooks/useGame';
import {useLeaderboard} from '@/hooks/useLeaderboard';
import {useI18n} from '@/hooks/useI18n';
import {canMoveTile} from '@/lib/gameLogic';
import {toast} from 'sonner';

const Index = () => {
    const {t} = useI18n();
    const [gameSize, setGameSize] = useState(4);
    const [showWinModal, setShowWinModal] = useState(false);
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [showSizeSelector, setShowSizeSelector] = useState(true);

    const {
        gameState,
        newGame,
        pauseGame,
        handleMove,
        getScore,
        getClientId,
    } = useGame(gameSize);

    const {
        scores,
        isLoading,
        filters,
        saveScore,
        updateFilters,
    } = useLeaderboard();

    // Show victory modal on win
    useEffect(() => {
        if (gameState.isWon && !showWinModal) {
            // Short delay to show victory animation
            setTimeout(() => {
                setShowWinModal(true);
            }, 1000);
        }
    }, [gameState.isWon, showWinModal]);

    // Tile click handling
    const handleTileClick = useCallback((tileIndex: number) => {
        // Check game state
        if (gameState.isWon || gameState.isPaused) return;

        if (!canMoveTile(tileIndex, gameState.board, gameState.size)) {
            // Simply ignore clicks on non-adjacent tiles, no messages
            return;
        }

        handleMove(tileIndex);
    }, [gameState.board, gameState.size, gameState.isWon, gameState.isPaused, handleMove]);

    // Save result after victory
    const handleSaveScore = async (name: string): Promise<boolean> => {
        try {
            return await saveScore({
                name,
                timeMs: gameState.timeMs,
                moves: gameState.moves,
                score: getScore(),
                size: gameState.size,
                clientId: getClientId(),
            });
        } catch (error) {
            console.error('Error saving score:', error);
            return false;
        }
    };

    // Start a new game with the selected size
    const handleStartNewGame = (size: number) => {
        setGameSize(size);
        setShowSizeSelector(false);
        // The game will be created automatically via useGame
        setTimeout(newGame, 100);
    };

    // Show size selector
    const handleShowSizeSelector = () => {
        setShowSizeSelector(true);
    };

    const isGameActive = !gameState.isPaused && !gameState.isWon;

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b bg-card">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-primary">{t('gameTitle')}</h1>
                            <p className="text-muted-foreground">{t('gameSubtitle')}</p>
                        </div>
                        {!showSizeSelector && (
                            <div className="text-right text-sm text-muted-foreground">
                                <div>{t('size')}: {gameSize}×{gameSize}</div>
                                <button
                                    onClick={handleShowSizeSelector}
                                    className="
                                    bg-[hsl(25,45%,50%)]
                                    text-[hsl(30,60%,90%)]
                                    font-medium
                                    rounded-md
                                    px-4 py-2
                                    hover:bg-[hsl(25,45%,45%)]
                                    focus:outline-none focus:ring-2 focus:ring-[hsl(30,60%,90%)] focus:ring-offset-2
                                    transition-colors
                                  "
                                >
                                    {t('mainMenu')}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                {showSizeSelector ? (
                    <div className="max-w-2xl mx-auto">
                        <SizeSelector
                            currentSize={gameSize}
                            onSizeChange={handleStartNewGame}
                        />
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
                        {/* Game board */}
                        <div className="flex-1 flex justify-center">
                            <div className="flex flex-col items-center gap-6">
                                <GameCanvasDom
                                    gameState={gameState}
                                    onTileClick={handleTileClick}
                                    className="mx-auto"
                                />

                                {/* Mobile instructions */}
                                <div className="block sm:hidden text-center text-sm text-muted-foreground">
                                    <p>{t('mobileInstructions')}</p>
                                </div>
                            </div>
                        </div>

                        {/* Control panel */}
                        <div className="w-full lg:w-80">
                            <GameUI
                                gameState={gameState}
                                score={getScore()}
                                gameSize={gameSize}
                                onNewGame={newGame}
                                onPause={pauseGame}
                                onShowLeaderboard={() => setShowLeaderboard(true)}
                            />
                        </div>
                    </div>
                )}
            </main>

            {/* Modal windows */}
            <WinModal
                isOpen={showWinModal}
                onClose={() => setShowWinModal(false)}
                onSubmit={handleSaveScore}
                timeMs={gameState.timeMs}
                moves={gameState.moves}
                score={getScore()}
                size={gameState.size}
            />

            <Leaderboard
                isOpen={showLeaderboard}
                onClose={() => setShowLeaderboard(false)}
                scores={scores}
                isLoading={isLoading}
                filters={filters}
                onFiltersChange={updateFilters}
            />

            {/* Footer */}
            <footer className="border-t mt-16">
                <div className="container mx-auto px-4 py-6">
                    <div className="text-center text-sm text-muted-foreground">
                        <p>{t('footerText')} {gameSize * gameSize - 1} {t('footerInOrder')}</p>
                        <p className="mt-1">{t('instructions')}</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Index;
