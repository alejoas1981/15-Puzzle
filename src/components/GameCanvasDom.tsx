import React, {useEffect, useRef, useState, useCallback} from 'react';
import {GameState, Position} from '@/types/game';
import {getPosition, findEmptyTile} from '@/lib/gameLogic';

interface GameCanvasDomProps {
    gameState: GameState;
    onTileClick: (tileIndex: number) => void;
    className?: string;
}

export const GameCanvasDom: React.FC<GameCanvasDomProps> = ({
                                                                gameState,
                                                                onTileClick,
                                                                className = ''
                                                            }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerSize, setContainerSize] = useState(400);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [draggedTile, setDraggedTile] = useState<number | null>(null);
    
    // Responsive sizes depending on the field size
    const calculateSizes = (size: number, container: number) => {
        const minGap = 4;
        const maxGap = 8;
        const gap = size === 3 ? maxGap : size === 4 ? 6 : minGap;
        const tileSize = Math.floor((container - gap * (size - 1)) / size);
        return {tileSize, gap};
    };
    
    const {tileSize, gap} = calculateSizes(gameState.size, containerSize);
    
    // Updating the container size on changes
    useEffect(() => {
        const updateSize = () => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                const availableSize = Math.min(rect.width, window.innerHeight * 0.6);
                const newSize = Math.max(280, Math.min(500, availableSize));
                setContainerSize(newSize);
            }
        };
        
        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);
    
    // FLIP animation for moving a tile
    const animateTile = useCallback((tileElement: HTMLElement, fromIndex: number, toIndex: number) => {
        // FLIP Step 1: First - текущее положение в пикселях
        const fromPos = getPosition(fromIndex, gameState.size);
        const toPos = getPosition(toIndex, gameState.size);
        const fromX = fromPos.x * (tileSize + gap);
        const fromY = fromPos.y * (tileSize + gap);
        const toX = toPos.x * (tileSize + gap);
        const toY = toPos.y * (tileSize + gap);
        
        // Разность для инверсии
        const deltaX = fromX - toX;
        const deltaY = fromY - toY;
        
        tileElement.style.willChange = 'transform';
        tileElement.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        
        requestAnimationFrame(() => {
            tileElement.style.transition = 'transform 180ms cubic-bezier(0.2, 0.6, 0.2, 1)';
            tileElement.style.transform = 'translate(0, 0)';
            
            const handleTransitionEnd = () => {
                tileElement.style.transition = '';
                tileElement.style.transform = '';
                tileElement.style.willChange = '';
                tileElement.removeEventListener('transitionend', handleTransitionEnd);
            };
            
            tileElement.addEventListener('transitionend', handleTransitionEnd);
            
            // Fallback
            setTimeout(handleTransitionEnd, 200);
        });
    }, [gameState.size, tileSize, gap]);
    
    const handleTileClick = useCallback((value: number, currentIndex: number) => {
        if (isAnimating || isDragging) return;
        
        const tileElement = containerRef.current?.querySelector(`[data-tile-value="${value}"]`) as HTMLElement;
        const emptyIndex = findEmptyTile(gameState.board);
        
        if (tileElement) {
            // Анимируем перемещение
            animateTile(tileElement, currentIndex, emptyIndex);
        }
        
        onTileClick(currentIndex);
    }, [gameState.board, isAnimating, isDragging, animateTile, onTileClick]);
    
    // Drag handling
    const handleMouseDown = useCallback((e: React.MouseEvent, value: number, currentIndex: number) => {
        if (isAnimating || gameState.isPaused || gameState.isWon) return;
        
        e.preventDefault();
        setIsDragging(true);
        setDraggedTile(currentIndex);
        
        const tileElement = e.currentTarget as HTMLElement;
        const startX = e.clientX;
        const startY = e.clientY;
        
        const handleMouseMove = (moveE: MouseEvent) => {
            const deltaX = moveE.clientX - startX;
            const deltaY = moveE.clientY - startY;
            
            // Визуальное перетаскивание
            tileElement.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
            tileElement.style.zIndex = '1000';
        };
        
        const handleMouseUp = (upE: MouseEvent) => {
            const deltaX = upE.clientX - startX;
            const deltaY = upE.clientY - startY;
            const threshold = tileSize * 0.3; // 30% от размера плитки
            
            // Reset styles
            tileElement.style.transform = '';
            tileElement.style.zIndex = '';
            
            // Determine the movement direction
            if (Math.abs(deltaX) > threshold || Math.abs(deltaY) > threshold) {
                if (Math.abs(deltaX) > Math.abs(deltaY)) {
                    // Горизонтальное движение
                    if (deltaX > 0) {
                        // To the right – check if there is an empty cell on the right
                        const emptyIndex = findEmptyTile(gameState.board);
                        const currentPos = getPosition(currentIndex, gameState.size);
                        const emptyPos = getPosition(emptyIndex, gameState.size);
                        
                        if (emptyPos.x === currentPos.x + 1 && emptyPos.y === currentPos.y) {
                            handleTileClick(value, currentIndex);
                        }
                    } else {
                        // To the left – check if there is an empty cell on the left
                        const emptyIndex = findEmptyTile(gameState.board);
                        const currentPos = getPosition(currentIndex, gameState.size);
                        const emptyPos = getPosition(emptyIndex, gameState.size);
                        
                        if (emptyPos.x === currentPos.x - 1 && emptyPos.y === currentPos.y) {
                            handleTileClick(value, currentIndex);
                        }
                    }
                } else {
                    // Vertical movement
                    if (deltaY > 0) {
                        // Вниз - проверяем, есть ли пустая клетка снизу
                        const emptyIndex = findEmptyTile(gameState.board);
                        const currentPos = getPosition(currentIndex, gameState.size);
                        const emptyPos = getPosition(emptyIndex, gameState.size);
                        
                        if (emptyPos.x === currentPos.x && emptyPos.y === currentPos.y + 1) {
                            handleTileClick(value, currentIndex);
                        }
                    } else {
                        // Up – check if there is an empty cell above
                        const emptyIndex = findEmptyTile(gameState.board);
                        const currentPos = getPosition(currentIndex, gameState.size);
                        const emptyPos = getPosition(emptyIndex, gameState.size);
                        
                        if (emptyPos.x === currentPos.x && emptyPos.y === currentPos.y - 1) {
                            handleTileClick(value, currentIndex);
                        }
                    }
                }
            }
            
            setIsDragging(false);
            setDraggedTile(null);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
        
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }, [gameState.board, gameState.size, gameState.isPaused, gameState.isWon, isAnimating, tileSize, handleTileClick]);
    
    // Handling swipes on mobile devices
    useEffect(() => {
        if (!containerRef.current) return;
        
        let startX = 0;
        let startY = 0;
        let isDragging = false;
        
        const handleTouchStart = (e: TouchEvent) => {
            if (gameState.isPaused || gameState.isWon || isAnimating) return;
            
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            isDragging = true;
        };
        
        const handleTouchEnd = (e: TouchEvent) => {
            if (!isDragging || gameState.isPaused || gameState.isWon || isAnimating) return;
            
            const touch = e.changedTouches[0];
            const endX = touch.clientX;
            const endY = touch.clientY;
            
            const dx = endX - startX;
            const dy = endY - startY;
            const threshold = 30;
            
            if (Math.abs(dx) > threshold || Math.abs(dy) > threshold) {
                // Определяем направление свайпа
                if (Math.abs(dx) > Math.abs(dy)) {
                    // Горизонтальный свайп
                    const key = dx > 0 ? 'ArrowRight' : 'ArrowLeft';
                    window.dispatchEvent(new KeyboardEvent('keydown', {key}));
                } else {
                    // Вертикальный свайп
                    const key = dy > 0 ? 'ArrowDown' : 'ArrowUp';
                    window.dispatchEvent(new KeyboardEvent('keydown', {key}));
                }
            }
            
            isDragging = false;
        };
        
        const container = containerRef.current;
        container.addEventListener('touchstart', handleTouchStart, {passive: true});
        container.addEventListener('touchend', handleTouchEnd, {passive: true});
        
        let interval: NodeJS.Timeout | null = null,
            // API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            API_BASE = 'https://api-15-puzzle.onrender.com';
        
        if (!gameState.isPaused && !gameState.isWon) {
            
            (async () => {
                try {
                    await fetch(`${API_BASE}/ping`);
                    console.log('Ping sent (initial)');
                } catch (err) {
                    console.error('Initial ping failed:', err);
                }
            })();
            
            interval = setInterval(async () => {
                try {
                    await fetch(`${API_BASE}/ping`);
                    console.log('Ping sent');
                } catch (err) {
                    console.error('Ping failed:', err);
                }
            }, 45 * 1000); // 45000 ms
        }
        
        return () => {
            if (interval) clearInterval(interval);
            container.removeEventListener('touchstart', handleTouchStart);
            container.removeEventListener('touchend', handleTouchEnd);
        };
    }, [gameState.isPaused, gameState.isWon, isAnimating]);
    
    
    return (
        <div className={`inline-block ${className}`}>
            <div
                ref={containerRef}
                className="relative rounded-lg shadow-lg border border-border game-container '${className}`"
                style={{
                    width: containerSize,
                    height: containerSize,
                    touchAction: 'none'
                }}
            >
                {gameState.board.map((tileValue, index) => {
                    if (tileValue === null) return null;
                    
                    const position = getPosition(index, gameState.size);
                    const x = position.x * (tileSize + gap);
                    const y = position.y * (tileSize + gap);
                    
                    return (
                        <div
                            key={tileValue}
                            data-tile-value={tileValue}
                            className="absolute rounded-md shadow-sm cursor-pointer
                       flex items-center justify-center font-bold text-slate-700
                       hover:bg-slate-50 active:bg-slate-100 select-none transition-transform duration-[180ms] ease-[cubic-bezier(0.2,0.6,0.2,1)] tile"
                            style={{
                                left: x,
                                top: y,
                                width: tileSize,
                                height: tileSize,
                                fontSize: Math.max(12, tileSize / 2),
                                lineHeight: '1',
                            }}
                            onClick={() => handleTileClick(tileValue, index)}
                            onMouseDown={(e) => handleMouseDown(e, tileValue, index)}
                        >
                            {tileValue}
                        </div>
                    );
                })}
                
                {/* Empty cell – visual indication only */}
                {(() => {
                    const emptyIndex = findEmptyTile(gameState.board);
                    const position = getPosition(emptyIndex, gameState.size);
                    const x = position.x * (tileSize + gap);
                    const y = position.y * (tileSize + gap);
                    
                    return (
                        <div
                            className="absolute bg-slate-100 border-2 border-dashed border-slate-300 tile empty"
                            style={{
                                left: x,
                                top: y,
                                width: tileSize,
                                height: tileSize,
                            }}
                        />
                    );
                })()}
            </div>
        </div>
    );
};