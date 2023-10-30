import React, { useState, useEffect, useRef } from "react";
import { Board } from "./components/Board";
import { Button } from "@/components/ui/button";
import { useSolver } from "./lib/utils";

function App() {
    const [solveTrigger, setSolveTrigger] = useState(false);
    const [answers, setAnswers] = useState<string[][]>([]);

    const lettersRef = useRef([
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
    ]);

    const getAnswers = useSolver(lettersRef.current, solveTrigger);

    useEffect(() => {
        if (solveTrigger) {
            const newAnswers = getAnswers;
            setAnswers(newAnswers);
            setSolveTrigger(false);
        }
    }, [solveTrigger, getAnswers]);

    const handleSolveClick = () => {
        setSolveTrigger(true);
    };

    return (
        <div>
            <h1 className="font-bold text-6xl mb-20">Letterboxed Solver</h1>
            <div className="flex items-center">
                <div>
                    <Button variant="secondary" onClick={handleSolveClick}>
                        Solve
                    </Button>
                </div>
                <Board {...lettersRef} />
            </div>
        </div>
    );
}

export default App;
