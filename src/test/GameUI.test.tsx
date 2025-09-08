import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { GameUI } from '@/components/GameUI';
import { GameState } from '@/types/game';

// Mock for i18n
vi.mock('@/hooks/useI18n', () => ({
    useI18n: () => ({
        t: (key: string) => key,
        language: 'en' as const,
        setLanguage: vi.fn(),
    }),
}));

const mockGameState: GameState = {
    board: [1, 2, 3, 4, 5, 6, 7, 8, null],
    size: 3,
    moves: 15,
    timeMs: 125000,
    isWon: false,
    isPaused: false,
    startTime: Date.now(),
};

const mockCallbacks = {
    onNewGame: vi.fn(),
    onPause: vi.fn(),
    onShowLeaderboard: vi.fn(),
    score: 1000,
};

describe('GameUI', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    
    describe('game info display', () => {
        it('shows the number of moves', () => {
            render(<GameUI gameState={mockGameState} {...mockCallbacks} />);
            expect(screen.getByText('15')).toBeInTheDocument();
        });
        
        it('shows the score', () => {
            render(<GameUI gameState={mockGameState} {...mockCallbacks} />);
            expect(screen.getByText('1000')).toBeInTheDocument();
        });
    });
    
    describe('buttons and interactions', () => {
        it('renders the new game button', () => {
            render(<GameUI gameState={mockGameState} {...mockCallbacks} />);
            const newGameButton = screen.getByRole('button', { name: /newGame/i });
            expect(newGameButton).toBeInTheDocument();
        });
        
        it('calls onNewGame when clicked', async () => {
            render(<GameUI gameState={mockGameState} {...mockCallbacks} />);
            const newGameButton = screen.getByRole('button', { name: /newGame/i });
            await userEvent.click(newGameButton);
            expect(mockCallbacks.onNewGame).toHaveBeenCalledTimes(1);
        });
        
        it('renders text according to i18n key', () => {
            render(<GameUI gameState={mockGameState} {...mockCallbacks} />);
            expect(screen.getByText('newGame')).toBeInTheDocument();
        });
        
        it('matches snapshot', () => {
            const { container } = render(<GameUI gameState={mockGameState} {...mockCallbacks} />);
            expect(container).toMatchSnapshot();
        });
    });
});
