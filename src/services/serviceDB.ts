// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const API_URL = 'https://api-15-puzzle.onrender.com';

export interface ScoreData {
    name: string;
    timeMs: number;
    moves: number;
    score: number;
    size: number;
    clientId: string;
}

export async function saveScore(scoreData: ScoreData): Promise<{ insertedId: string }> {
    const res = await fetch(`${API_URL}/leaderboard`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scoreData)
    });
    if (!res.ok) throw new Error("Failed to save score");
    return res.json();
}

export async function getScores(filters: { size?: number; period?: "week" | "month" } = {}): Promise<ScoreData[]> {
    const params = new URLSearchParams(filters as any).toString();
    const res = await fetch(`${API_URL}/leaderboard?${params}`);
    if (!res.ok) throw new Error("Failed to load scores");
    return res.json();
}
