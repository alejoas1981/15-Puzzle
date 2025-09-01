import {useState, useCallback, useEffect, useRef} from 'react';
import {GameState} from '@/types/game';
import {
    generateShuffledBoard,
    moveTile,
    isWon as checkWon,
    calculateScore,
    handleArrowKey
} from '@/lib/gameLogic';
import {v4 as uuidv4} from 'uuid';

const CLIENT_ID_KEY = 'puzzle_client_id';

export const useGame = (size: number = 4) => {
    const [gameState, setGameState] = useState<GameState>(() => ({
        board: generateShuffledBoard(size),
        size,
        moves: 0,
        timeMs: 0,
        isWon: false,
        isPaused: false,
        startTime: null,
    }));

    // Update the game size when the size parameter changes
    useEffect(() => {
        setGameState(prev => ({
            board: generateShuffledBoard(size),
            size,
            moves: 0,
            timeMs: 0,
            isWon: false,
            isPaused: false,
            startTime: null,
        }));
    }, [size]);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const getOrCreateClientId = () => {
        let clientId = localStorage.getItem(CLIENT_ID_KEY);
        if (!clientId) {
            clientId = uuidv4();
            localStorage.setItem(CLIENT_ID_KEY, clientId);
        }
        return clientId;
    };

    const clientIdRef = useRef<string>(getOrCreateClientId());

    // Timer update
    useEffect(() => {
        if (gameState.startTime && !gameState.isPaused && !gameState.isWon) {
            intervalRef.current = setInterval(() => {
                setGameState(prev => ({
                    ...prev,
                    timeMs: Date.now() - (prev.startTime || 0),
                }));
            }, 100);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [gameState.startTime, gameState.isPaused, gameState.isWon]);

    const handleMove = useCallback((tileIndex: number | null, newBoard?: (number | null)[]) => {
        if (gameState.isWon || gameState.isPaused) return null;

        let resultBoard = newBoard;
        if (!resultBoard && tileIndex !== null) {
            resultBoard = moveTile(tileIndex, gameState.board, gameState.size);
        }

        if (!resultBoard) return null;

        const newMoves = gameState.moves + 1;
        const won = checkWon(resultBoard, gameState.size);
        const newStartTime = gameState.startTime || Date.now();
        const newTimeMs = gameState.startTime ? gameState.timeMs : 0;

        setGameState(prev => ({
            ...prev,
            board: resultBoard!,
            moves: newMoves,
            isWon: won,
            startTime: newStartTime,
            timeMs: won ? Date.now() - newStartTime : newTimeMs,
        }));

        return {
            board: resultBoard,
            moves: newMoves,
            isWon: won,
            timeMs: won ? Date.now() - newStartTime : newTimeMs,
        };
    }, [gameState]);

    // Key handling
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (gameState.isPaused || gameState.isWon) return;

            const newBoard = handleArrowKey(e.key, gameState.board, gameState.size);
            if (newBoard) {
                e.preventDefault();
                handleMove(null, newBoard);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [gameState.board, gameState.size, gameState.isPaused, gameState.isWon, handleMove]);

    const startGame = useCallback(() => {
        setGameState(prev => ({
            ...prev,
            startTime: Date.now(),
            timeMs: 0,
        }));
    }, []);

    const newGame = useCallback(() => {
        setGameState(prev => ({
            board: generateShuffledBoard(prev.size),
            size: prev.size,
            moves: 0,
            timeMs: 0,
            isWon: false,
            isPaused: false,
            startTime: null,
        }));
    }, []);

    const pauseGame = useCallback(() => {
        setGameState(prev => ({
            ...prev,
            isPaused: !prev.isPaused,
        }));
    }, []);

    const getScore = useCallback(() => {
        return calculateScore(gameState.timeMs, gameState.moves, gameState.size);
    }, [gameState.timeMs, gameState.moves, gameState.size]);

    const getClientId = useCallback(() => {
        return clientIdRef.current;
    }, []);

    return {
        gameState,
        startGame,
        newGame,
        pauseGame,
        handleMove,
        getScore,
        getClientId,
    };
};