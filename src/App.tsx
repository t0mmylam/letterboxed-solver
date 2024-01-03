import React, { useState, useEffect, useRef, createRef } from "react";
import { LetterInput } from "./components/LetterInput";
import { Canvas } from "./components/Canvas";
import { Button } from "@/components/ui/button";
import { useSolver } from "./lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Footer } from "./components/Footer";

function App() {
  const [answers, setAnswers] = useState<string[][]>([[]]);
  const [hovered, setHovered] = useState<string[]>([""]);
  const [letters, setLetters] = useState<string[]>([""]);
  const lettersRef = useRef([
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ]);
  const [reset, setReset] = useState(false);
  const [solverAnswers, solve] = useSolver(lettersRef.current);
  const inputRefs = useRef<Array<React.RefObject<HTMLInputElement>>>([]);
  inputRefs.current = new Array(12).fill(null).map(
    (index) => inputRefs.current[index] || createRef<HTMLInputElement>()
  );


  const focusNext = (currentId: number) => {
    if (currentId < inputRefs.current.length - 1) {
      const nextInput = inputRefs.current[currentId + 1];
      if (nextInput && nextInput.current) {
        nextInput.current.focus();
      }
    }
  };

  // Function to focus the previous input
  const focusPrev = (currentId: number) => {
    if (currentId > 0) {
      const prevInput = inputRefs.current[currentId - 1];
      if (prevInput && prevInput.current) {
        prevInput.current.focus();
      }
    }
  }

  useEffect(() => {
    setAnswers(solverAnswers);
    setLetters(lettersRef.current.flat());
  }, [solverAnswers]);

  const handleSolveClick = () => {
    solve();
  };

  const handleResetClick = () => {
    setAnswers([[]]);
    setReset(true);
    setHovered([""]);
    lettersRef.current = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ];
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-center font-bold text-4xl m-2">Letterboxed Solver</h1>
      <h3 className="text-center text-xl mb-8">
        An algorithmic solver for <br />
        NYT's Letterboxed
      </h3>
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
          <div className="flex flex-row gap-6">
            <Button variant="secondary" onClick={handleSolveClick} size="lg">
              Solve
            </Button>
            <Button variant="destructive" onClick={handleResetClick} size="lg">
              Reset
            </Button>
          </div>
        </div>
        <div className="flex items-center flex-col gap-6">
          <ScrollArea className="h-[556px] w-[300px] rounded-md border bg-white border-black border-4">
            <div className="p-4">
              <h4 className="mb-1 text-xl font-medium leading-none">
                Solutions
              </h4>
              <p className="text-red-200 text-xs">
                *Not completely accurate as the word list is not identical to
                NYT's.
              </p>
              <Separator className="my-2" />
              {JSON.stringify(answers) !== JSON.stringify([[]]) &&
                answers.map((answer, index) => (
                  <React.Fragment key={index}>
                    <div
                      className={`text-sm flex items-center answer ${
                        hovered.join("") === answer.join("") ? "font-bold" : ""
                      }`}
                      onMouseEnter={() => setHovered(answer)}
                    >
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
