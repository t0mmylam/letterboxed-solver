import React, { useState, useEffect, useRef } from "react";
import { Board } from "./components/Board";
import { Button } from "@/components/ui/button";
import { useSolver } from "./lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Footer } from "./components/Footer";

function App() {
    const [answers, setAnswers] = useState<string[][]>([[]]);
    const lettersRef = useRef([
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
    ]);

    const [solverAnswers, solve] = useSolver(lettersRef.current);

    useEffect(() => {
        setAnswers(solverAnswers);
    }, [solverAnswers]);

    const handleSolveClick = () => {
        solve();
    };
    return (
        <div className="flex flex-col items-center">
            <h1 className="text-center font-bold text-4xl m-2">
                Letterboxed Solver
            </h1>
            <h3 className="text-center text-xl mb-8">
                An algorithmic solver for <br />
                NYT's Letterboxed
            </h3>
            <div className="flex flex-col sm:flex-row items-center gap-16 mb-6">
                <div className="flex flex-col items-center gap-6">
                    <Board {...lettersRef} />
                    <Button
                        variant="secondary"
                        onClick={handleSolveClick}
                        size="lg"
                    >
                        Solve
                    </Button>
                </div>
                <div className="flex items-center flex-col gap-6">
                    <ScrollArea className="h-[556px] w-[300px] rounded-md border bg-white border-black border-4">
                        <div className="p-4">
                            <h4 className="mb-4 text-xl font-medium leading-none">
                                Solutions
                            </h4>
                            <Separator className="my-2" />
                            {JSON.stringify(answers) !== JSON.stringify([[]]) &&
                                answers.map((answer, index) => (
                                    <React.Fragment key={index}>
                                        <div className="text-sm flex items-center">
                                            {answer[0]}
                                            <span>&#8212;</span>
                                            {answer[1]}
                                        </div>
                                        <Separator className="my-2" />
                                    </React.Fragment>
                                ))}
                        </div>
                    </ScrollArea>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default App;
