import React, { useState, useEffect, useRef, createRef } from "react";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
} from "@/components/ui/alertdialog";
import { LetterInput } from "./components/LetterInput";
import { Canvas } from "./components/Canvas";
import { Button } from "@/components/ui/button";
import { useSolver } from "./lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Footer } from "./components/Footer";
import { useNYTData } from "./hooks/useNYTData";

function App() {
    const [answers, setAnswers] = useState<string[][]>([[]]);
    const [hovered, setHovered] = useState<string[]>([""]);
    const [letters, setLetters] = useState<string[]>([""]);
    const [showEmptyFieldsAlert, setShowEmptyFieldsAlert] = useState(false);
    const [isSolving, setIsSolving] = useState(false);
    const shouldSolveRef = useRef(false);
    const lettersRef = useRef([
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
    ]);
    const [reset, setReset] = useState(false);
    const [solverAnswers, solve, isDictionaryLoading] = useSolver(
        lettersRef.current
    );
    const [hasNYTData, setHasNYTData] = useState(false);
    const inputRefs = useRef<Array<React.RefObject<HTMLInputElement>>>([]);
    const [nytDictionary, setNYTDictionary] = useState<string[]>([]);
    inputRefs.current = new Array(12)
        .fill(null)
        .map(
            (_, index) =>
                inputRefs.current[index] || createRef<HTMLInputElement>()
        );

    const {
        data: nytData,
        isLoading,
        error,
        fetchNYTData,
        populateLetters,
    } = useNYTData();

    useEffect(() => {
        // If we should solve and we have letters populated
        if (shouldSolveRef.current && letters.some(letter => letter !== "")) {
            shouldSolveRef.current = false; // Reset the flag
            solve(nytDictionary); // Solve with the dictionary
        }
    }, [letters, nytDictionary, solve]);

    const handleNYTClick = async () => {
        try {
            setIsSolving(true);
            const data = await fetchNYTData();

            if (data) {
                const nytLetters = await populateLetters(data);
                if (nytLetters) {
                    // Set solve flag before updating state
                    shouldSolveRef.current = true;
                    
                    // Update dictionary first
                    setNYTDictionary(data.dictionary);
                    
                    // Batch these updates together
                    setLetters(nytLetters.flat());
                    setReset(false);
                    setHasNYTData(true);
                    
                    // Update ref and input fields
                    lettersRef.current = nytLetters;
                    nytLetters.forEach((side, sideIndex) => {
                        side.forEach((letter, letterIndex) => {
                            const inputRef = inputRefs.current[sideIndex * 3 + letterIndex];
                            if (inputRef.current) {
                                inputRef.current.value = letter;
                            }
                        });
                    });
                }
            }
        } catch (err) {
            console.error("Error populating letters:", err);
            shouldSolveRef.current = false; // Reset flag on error
        } finally {
            setIsSolving(false);
        }
    };

    const focusNext = (currentId: number) => {
        if (currentId < inputRefs.current.length - 1) {
            const nextInput = inputRefs.current[currentId + 1];
            if (nextInput && nextInput.current) {
                nextInput.current.focus();
            }
        }
    };

    const focusPrev = (currentId: number) => {
        if (currentId > 0) {
            const prevInput = inputRefs.current[currentId - 1];
            if (prevInput && prevInput.current) {
                prevInput.current.focus();
            }
        }
    };

    useEffect(() => {
        if (solverAnswers) {
            setAnswers(solverAnswers);
        }
    }, [solverAnswers]);

    const handleSolveClick = async () => {
        const hasEmptyFields = lettersRef.current.some((side) =>
            side.some((letter) => !letter.trim())
        );

        if (hasEmptyFields) {
            setShowEmptyFieldsAlert(true);
            setTimeout(() => setShowEmptyFieldsAlert(false), 2000);
            return;
        }

        setIsSolving(true);
        solve();
        setTimeout(() => setIsSolving(false), 500);
    };

    const handleResetClick = () => {
        shouldSolveRef.current = false; // Reset solve flag
        setAnswers([[]]);
        setReset(true);
        setHovered([""]);
        setHasNYTData(false);
        setNYTDictionary([]);
        setLetters([""]); // Reset letters state
        lettersRef.current = [
            ["", "", ""],
            ["", "", ""],
            ["", "", ""],
            ["", "", ""],
        ];
        inputRefs.current.forEach((ref) => {
            if (ref.current) {
                ref.current.value = "";
            }
        });
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

            {error && <div className="text-red-500 mb-4">{error}</div>}

            <div className="flex flex-col sm:flex-row items-center gap-16 mb-6">
                <div className="flex flex-col items-center gap-6">
                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-x-[3.25rem]">
                            <LetterInput
                                direction="top"
                                id={0}
                                letters={lettersRef}
                                reset={reset}
                                focusNext={() => focusNext(0)}
                                focusPrev={() => focusPrev(0)}
                                ref={inputRefs.current[0]}
                            />
                            <LetterInput
                                direction="top"
                                id={1}
                                letters={lettersRef}
                                reset={reset}
                                focusNext={() => focusNext(1)}
                                focusPrev={() => focusPrev(1)}
                                ref={inputRefs.current[1]}
                            />
                            <LetterInput
                                direction="top"
                                id={2}
                                letters={lettersRef}
                                reset={reset}
                                focusNext={() => focusNext(2)}
                                focusPrev={() => focusPrev(2)}
                                ref={inputRefs.current[2]}
                            />
                        </div>
                        <div>
                            <div className="flex items-center">
                                <div className="flex flex-col items-center gap-y-[3.25rem]">
                                    <LetterInput
                                        direction="left"
                                        id={0}
                                        letters={lettersRef}
                                        reset={reset}
                                        focusNext={() => focusNext(3)}
                                        focusPrev={() => focusPrev(3)}
                                        ref={inputRefs.current[3]}
                                    />
                                    <LetterInput
                                        direction="left"
                                        id={1}
                                        letters={lettersRef}
                                        reset={reset}
                                        focusNext={() => focusNext(4)}
                                        focusPrev={() => focusPrev(4)}
                                        ref={inputRefs.current[4]}
                                    />
                                    <LetterInput
                                        direction="left"
                                        id={2}
                                        letters={lettersRef}
                                        reset={reset}
                                        focusNext={() => focusNext(5)}
                                        focusPrev={() => focusPrev(5)}
                                        ref={inputRefs.current[5]}
                                    />
                                </div>
                                <Canvas hovered={hovered} letters={letters} />
                                <div className="flex flex-col items-center gap-y-[3.25rem]">
                                    <LetterInput
                                        direction="right"
                                        id={0}
                                        letters={lettersRef}
                                        reset={reset}
                                        focusNext={() => focusNext(6)}
                                        focusPrev={() => focusPrev(6)}
                                        ref={inputRefs.current[6]}
                                    />
                                    <LetterInput
                                        direction="right"
                                        id={1}
                                        letters={lettersRef}
                                        reset={reset}
                                        focusNext={() => focusNext(7)}
                                        focusPrev={() => focusPrev(7)}
                                        ref={inputRefs.current[7]}
                                    />
                                    <LetterInput
                                        direction="right"
                                        id={2}
                                        letters={lettersRef}
                                        reset={reset}
                                        focusNext={() => focusNext(8)}
                                        focusPrev={() => focusPrev(8)}
                                        ref={inputRefs.current[8]}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-x-[3.25rem]">
                            <LetterInput
                                direction="bottom"
                                id={0}
                                letters={lettersRef}
                                reset={reset}
                                focusNext={() => focusNext(9)}
                                focusPrev={() => focusPrev(9)}
                                ref={inputRefs.current[9]}
                            />
                            <LetterInput
                                direction="bottom"
                                id={1}
                                letters={lettersRef}
                                reset={reset}
                                focusNext={() => focusNext(10)}
                                focusPrev={() => focusPrev(10)}
                                ref={inputRefs.current[10]}
                            />
                            <LetterInput
                                direction="bottom"
                                id={2}
                                letters={lettersRef}
                                reset={reset}
                                focusNext={() => focusNext(11)}
                                focusPrev={() => focusPrev(11)}
                                ref={inputRefs.current[11]}
                            />
                        </div>
                    </div>
                    <div className="flex flex-row gap-4">
                        <Button
                            variant="secondary"
                            onClick={handleSolveClick}
                            size="lg"
                            disabled={isSolving}
                        >
                            {isSolving ? (
                                <>
                                    <svg
                                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Solving...
                                </>
                            ) : (
                                "Solve"
                            )}
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleResetClick}
                            size="lg"
                        >
                            Reset
                        </Button>
                        <Button
                            variant="default"
                            onClick={handleNYTClick}
                            disabled={isLoading || isDictionaryLoading}
                            size="lg"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                            {isLoading || isDictionaryLoading ? (
                                <>
                                    <svg
                                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Loading...
                                </>
                            ) : (
                                "Use NYT"
                            )}
                        </Button>
                    </div>
                </div>

                {/* Right side - Solutions */}
                <div className="flex items-center flex-col gap-6">
                    <ScrollArea className="h-[556px] w-[300px] rounded-md border bg-white border-black border-4">
                        <div className="p-4">
                            <h4 className="mb-1 text-xl font-medium leading-none">
                                Solutions
                            </h4>
                            {hasNYTData && nytData?.ourSolution && (
                                <p className="text-green-600 text-sm mb-2">
                                    NYT's solution:{" "}
                                    {nytData.ourSolution.join(" — ")}
                                </p>
                            )}
                            <Separator className="my-2" />
                            {!isSolving && (
                                <>
                                    {answers &&
                                    answers.length > 0 &&
                                    answers[0].length > 0 ? (
                                        answers.map((answer, index) => (
                                            <React.Fragment key={index}>
                                                <div
                                                    className={`text-sm flex items-center answer ${
                                                        hovered.join("") ===
                                                        answer.join("")
                                                            ? "font-bold"
                                                            : ""
                                                    }`}
                                                    onMouseEnter={() =>
                                                        setHovered(answer)
                                                    }
                                                >
                                                    {answer[0]}
                                                    <span>&#8212;</span>
                                                    {answer[1]}
                                                </div>
                                                <Separator className="my-2" />
                                            </React.Fragment>
                                        ))
                                    ) : (
                                        <div className="text-gray-500 text-sm text-center py-4">
                                            No Solutions Found
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </ScrollArea>
                </div>
            </div>

            <AlertDialog
                open={showEmptyFieldsAlert}
                onOpenChange={setShowEmptyFieldsAlert}
            >
                <AlertDialogContent className="bg-red-50 border-red-200">
                    <AlertDialogTitle className="text-red-700">
                        Empty Fields Detected
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-red-600">
                        Please fill in all letter fields before solving.
                    </AlertDialogDescription>
                </AlertDialogContent>
            </AlertDialog>

            <Footer />
        </div>
    );
}

export default App;
