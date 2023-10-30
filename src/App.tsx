import { Canvas } from "./components/Canvas";
import { LetterInput } from "./components/LetterInput";
import { useSolver } from "./lib/utils";

function App() {
    const letters = new Array(4).fill("").map(() => new Array(3).fill(""));

    useSolver(letters);

    return (
        <div className="flex flex-col items-center">
            <div className="flex items-center gap-x-[3.25rem]">
                <LetterInput direction="top" id={0} letters={letters} />
                <LetterInput direction="top" id={1} letters={letters} />
                <LetterInput direction="top" id={2} letters={letters} />
            </div>
            <div>
                <div className="flex items-center">
                    <div className="flex flex-col items-center gap-y-[3.25rem]">
                        <LetterInput
                            direction="left"
                            id={0}
                            letters={letters}
                        />
                        <LetterInput
                            direction="left"
                            id={1}
                            letters={letters}
                        />
                        <LetterInput
                            direction="left"
                            id={2}
                            letters={letters}
                        />
                    </div>
                    <Canvas />
                    <div className="flex flex-col items-center gap-y-[3.25rem]">
                        <LetterInput
                            direction="right"
                            id={0}
                            letters={letters}
                        />
                        <LetterInput
                            direction="right"
                            id={1}
                            letters={letters}
                        />
                        <LetterInput
                            direction="right"
                            id={2}
                            letters={letters}
                        />
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-x-[3.25rem]">
                <LetterInput direction="bottom" id={0} letters={letters} />
                <LetterInput direction="bottom" id={1} letters={letters} />
                <LetterInput direction="bottom" id={2} letters={letters} />
            </div>
        </div>
    );
}

export default App;
