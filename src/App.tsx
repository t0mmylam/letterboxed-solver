import React, { useState, useEffect, useRef } from "react";
import { Board } from "./components/Board";
import { Button } from "@/components/ui/button";
import { useSolver } from "./lib/utils";
import DemoPage from "./components/solutions/page";
import { Solution } from "./components/solutions/solutions";

function convertAnswersToSolutions(answers?: string[][]): Solution[] {
    if (!answers || answers.length === 0) return [];
    
    return answers.map((answer, index) => {
        const word1 = answer[0] || "";
        const word2 = answer[1] || "";
        return {
            id: index + 1,
            word1,
            word2,
            length: word1.length + word2.length,
        };
    });
}



function App() {
    const [solveTrigger, setSolveTrigger] = useState(false);
    const [answers, setAnswers] = useState<string[][]>([[]]);
    const [solutions, setSolutions] = useState<Solution[]>([]);

    const lettersRef = useRef([
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
    ]);

    const getAnswers = useSolver(lettersRef.current, solveTrigger);

    useEffect(() => {
        if (solveTrigger) {
            setAnswers(getAnswers);
            setSolveTrigger(false);
        }
    }, [solveTrigger, getAnswers]);

    useEffect(() => {
        const newSolutions = convertAnswersToSolutions(answers);
        setSolutions(newSolutions);
    }, [answers]);

    const handleSolveClick = () => {
        setSolveTrigger(true);
    };
    return (
        <div>
            <h1 className="text-center font-bold text-6xl m-2">
                Letterboxed Solver
            </h1>
            <h3 className="text-center text-xl mb-16">
                An algorithmic solver for NYT's Letterboxed minigame.
            </h3>
            <div className="flex items-center gap-16">
                <div className="flex items-center flex-col gap-6">
                    <DemoPage answers={solutions} />
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
