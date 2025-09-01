import {GameConfig, Position} from '@/types/game';

export const DEFAULT_CONFIG: GameConfig = {
    size: 4,
    basScore: 10000,
    timePenalty: 1,
    movePenalty: 10,
    sizeMultiplier: {
        3: 0.7,
        4: 1.0,
        5: 1.6,
    },
};

// Creating a solved cell
export const createSolvedBoard = (size: number): (number | null)[] => {
    const board = Array.from({length: size * size}, (_, i) => i + 1);
    board[size * size - 1] = null; // Последняя клетка пустая
    return board;
};

// Generating a random but solvable grid
export const generateShuffledBoard = (size: number): (number | null)[] => {
    let board = createSolvedBoard(size);

    // Fisher-Yates shuffle с проверкой на решаемость
    for (let i = board.length - 2; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [board[i], board[j]] = [board[j], board[i]];
    }

    // Check solvability and adjust if necessary
    if (!isSolvable(board, size)) {
        // Меняем первые две плитки местами, чтобы сделать решаемым
        if (board[0] !== null && board[1] !== null) {
            [board[0], board[1]] = [board[1], board[0]];
        }
    }

    return board;
};

// Puzzle solvability check
export const isSolvable = (board: (number | null)[], size: number): boolean => {
    let inversions = 0;
    const flatBoard = board.filter(tile => tile !== null) as number[];

    for (let i = 0; i < flatBoard.length - 1; i++) {
        for (let j = i + 1; j < flatBoard.length; j++) {
            if (flatBoard[i] > flatBoard[j]) {
                inversions++;
            }
        }
    }

    const emptyRowFromBottom = size - Math.floor(board.indexOf(null) / size);

    if (size % 2 === 1) {
        return inversions % 2 === 0;
    } else {
        if (emptyRowFromBottom % 2 === 0) {
            return inversions % 2 === 1;
        } else {
            return inversions % 2 === 0;
        }
    }
};

// Getting tile position
export const getPosition = (index: number, size: number): Position => ({
    x: index % size,
    y: Math.floor(index / size),
});

// Getting index by position
export const getIndex = (x: number, y: number, size: number): number => y * size + x;

// Finding the empty cell
export const findEmptyTile = (board: (number | null)[]): number => {
    return board.findIndex(tile => tile === null);
};

// Check if a tile can be moved
export const canMoveTile = (tileIndex: number, board: (number | null)[], size: number): boolean => {
    const emptyIndex = findEmptyTile(board);
    const tilePos = getPosition(tileIndex, size);
    const emptyPos = getPosition(emptyIndex, size);

    const dx = Math.abs(tilePos.x - emptyPos.x);
    const dy = Math.abs(tilePos.y - emptyPos.y);

    return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
};

// Moving a tile
export const moveTile = (tileIndex: number, board: (number | null)[], size: number): (number | null)[] | null => {
    if (!canMoveTile(tileIndex, board, size)) {
        return null;
    }

    const newBoard = [...board];
    const emptyIndex = findEmptyTile(board);

    [newBoard[tileIndex], newBoard[emptyIndex]] = [newBoard[emptyIndex], newBoard[tileIndex]];

    return newBoard;
};

// Check for victory
export const isWon = (board: (number | null)[], size: number): boolean => {
    for (let i = 0; i < size * size - 1; i++) {
        if (board[i] !== i + 1) {
            return false;
        }
    }
    return board[size * size - 1] === null;
};

// Score calculation
export const calculateScore = (timeMs: number, moves: number, size: number, config = DEFAULT_CONFIG): number => {
    const sizeMultiplier = config.sizeMultiplier[size] || 1.0;
    const timePenalty = Math.floor(timeMs / 1000) * config.timePenalty;
    const movePenalty = moves * config.movePenalty;

    return Math.max(0, Math.floor((config.basScore - timePenalty - movePenalty) * sizeMultiplier));
};

// Arrow key handling
export const handleArrowKey = (key: string, board: (number | null)[], size: number): (number | null)[] | null => {
    const emptyIndex = findEmptyTile(board);
    const emptyPos = getPosition(emptyIndex, size);

    let targetPos: Position;

    switch (key) {
        case 'ArrowUp':
            targetPos = {x: emptyPos.x, y: emptyPos.y + 1};
            break;
        case 'ArrowDown':
            targetPos = {x: emptyPos.x, y: emptyPos.y - 1};
            break;
        case 'ArrowLeft':
            targetPos = {x: emptyPos.x + 1, y: emptyPos.y};
            break;
        case 'ArrowRight':
            targetPos = {x: emptyPos.x - 1, y: emptyPos.y};
            break;
        default:
            return null;
    }

    if (targetPos.x < 0 || targetPos.x >= size || targetPos.y < 0 || targetPos.y >= size) {
        return null;
    }

    const targetIndex = getIndex(targetPos.x, targetPos.y, size);
    return moveTile(targetIndex, board, size);
};