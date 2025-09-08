import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { GameCanvasDom } from '@/components/GameCanvasDom.tsx';
import { GameState } from '@/types/game.ts';

const mockGameState: GameState = {
    board: [1, 2, 3, 4, 5, 6, 7, 8, null],
    size: 3,
    moves: 0,
    timeMs: 0,
    isWon: false,
    isPaused: false,
    startTime: null,
};

const mockOnTileClick = vi.fn();

describe('GameCanvasDom', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    
    describe('component rendering', () => {
        it('renders correctly', () => {
            render(<GameCanvasDom gameState={mockGameState} onTileClick={mockOnTileClick} />);
            expect(document.querySelector('.relative')).toBeInTheDocument();
        });
        
        it('displays all tiles except one empty for 3x3', () => {
            render(<GameCanvasDom gameState={mockGameState} onTileClick={mockOnTileClick} />);
            
            for (let i = 1; i <= 8; i++) {
                expect(screen.getByText(i.toString())).toBeInTheDocument();
            }
        });
        
        it('tiles have correct CSS classes', () => {
            render(<GameCanvasDom gameState={mockGameState} onTileClick={mockOnTileClick} />);
            
            const firstTile = screen.getByText('1');
            expect(firstTile).toHaveClass('rounded-md', 'flex', 'items-center', 'justify-center');
        });
    });
    
    describe('tile interaction', () => {
        it('calls onTileClick when a tile is clicked', async () => {
            render(<GameCanvasDom gameState={mockGameState} onTileClick={mockOnTileClick} />);
            
            const firstTile = screen.getByText('1');
            await userEvent.click(firstTile);
            
            expect(mockOnTileClick).toHaveBeenCalledWith(0);
        });
    });
    
    describe('grid for different sizes', () => {
        it('renders correctly for 4x4', () => {
            const gameState4x4: GameState = {
                board: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, null],
                size: 4,
                moves: 0,
                timeMs: 0,
                isWon: false,
                isPaused: false,
                startTime: null,
            };
            
            render(<GameCanvasDom gameState={gameState4x4} onTileClick={mockOnTileClick} />);
            
            for (let i = 1; i <= 15; i++) {
                expect(screen.getByText(i.toString())).toBeInTheDocument();
            }
        });
        
        it('disables tiles when game is paused', () => {
            const pausedState = { ...mockGameState, isPaused: true };
            render(<GameCanvasDom gameState={pausedState} onTileClick={mockOnTileClick} />);
            const tile = screen.getByText('1');
            userEvent.click(tile);
            expect(mockOnTileClick).not.toHaveBeenCalled();
        });
        
        
    });
});
