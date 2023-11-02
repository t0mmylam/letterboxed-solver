import { useState, useEffect, useRef } from "react";
import { Board } from "./components/Board";
import { Button } from "@/components/ui/button";
import { useSolver } from "./lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Footer } from "./components/Footer"

function App() {
    const [solveTrigger, setSolveTrigger] = useState(false);
    const [answers, setAnswers] = useState<string[][]>([[]]);

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

    const handleSolveClick = () => {
        setSolveTrigger(true);
    };
    return (
        <div className="flex flex-col items-center">
            <h1 className="text-center font-bold text-6xl m-2">
                Letterboxed Solver
            </h1>
            <h3 className="text-center text-xl mb-8">
                An algorithmic solver for NYT's Letterboxed minigame
            </h3>
            <div className="flex items-center gap-16 mb-6">
                <div className="flex items-center flex-col gap-6">
                    <ScrollArea className="h-[556px] w-[300px] rounded-md border bg-white border-black border-4">
                        <div className="p-4">
                            <h4 className="mb-4 text-sm font-medium leading-none">
                                Solutions
                            </h4>
                            {answers.map((answer, index) => (
                                <>
                                    <div key={index} className="text-sm">
                                        {answer[0]} --- {answer[1]}
                                    </div>
                                    <Separator className="my-2" />
                                </>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
                <div className="flex flex-col items-center gap-6">
                    <Board {...lettersRef} />
                    <Button variant="secondary" onClick={handleSolveClick} size="lg">
                        Solve
                    </Button>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default App;
