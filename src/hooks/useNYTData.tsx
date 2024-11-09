import { useState } from "react";

export interface NYTData {
    sides: string[];
    ourSolution: string[];
    dictionary: string[];
    date?: string;
    id?: number;
    expiration?: number;
    par?: number;
}

const API_URL =
    import.meta.env.MODE === "production"
        ? "https://letterboxed-solver-backend-1.onrender.com"
        : "http://localhost:3000";

export function useNYTData() {
    const [nytData, setNYTData] = useState<NYTData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchNYTData = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/nyt`);
            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }

            const gameData = await response.json();
            if (!gameData.sides || !gameData.ourSolution) {
                throw new Error("Invalid data format");
            }

            setNYTData(gameData);
            return gameData;
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to fetch data"
            );
            console.error("Error fetching NYT data:", err);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const populateLetters = (data: NYTData | null = nytData) => {
        if (!data) return null;

        return [
            data.sides[3].split(""), // left side
            data.sides[0].split(""), // top side
            data.sides[1].split(""), // right side
            data.sides[2].split(""), // bottom side
        ];
    };

    return {
        data: nytData,
        isLoading,
        error,
        fetchNYTData,
        populateLetters,
    };
}
