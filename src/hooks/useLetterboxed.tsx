import { useState, useEffect, useRef, createRef } from "react";
import { useSolver } from "../lib/utils";
import { useNYTData } from "./useNYTData";

export const useLetterboxed = () => {
    const [answers, setAnswers] = useState<string[][]>([[]]);
    const [hovered, setHovered] = useState<string[]>([""]);
    const [letters, setLetters] = useState<string[]>([""]);
    const [showEmptyFieldsAlert, setShowEmptyFieldsAlert] = useState(false);
    const [isSolving, setIsSolving] = useState(false);
    const [hasNYTData, setHasNYTData] = useState(false);
    const [nytDictionary, setNYTDictionary] = useState<string[]>([]);
    const shouldSolveRef = useRef(false);
    
    const lettersRef = useRef([
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
    ]);

    const inputRefs = useRef<Array<React.RefObject<HTMLInputElement>>>([]);
    inputRefs.current = new Array(12)
        .fill(null)
        .map((_, index) => inputRefs.current[index] || createRef<HTMLInputElement>());

    const [reset, setReset] = useState(false);
    const [solverAnswers, solve, isDictionaryLoading] = useSolver(lettersRef.current);
    
    const {
        data: nytData,
        isLoading,
        error,
        fetchNYTData,
        populateLetters,
    } = useNYTData();

    // Effect for solving when letters are populated
    useEffect(() => {
        if (shouldSolveRef.current && letters.some(letter => letter !== "")) {
            shouldSolveRef.current = false;
            solve(nytDictionary);
        }
    }, [letters, nytDictionary, solve]);

    // Effect for updating answers
    useEffect(() => {
        if (solverAnswers) {
            setAnswers(solverAnswers);
        }
    }, [solverAnswers]);

    const handleNYTClick = async () => {
        try {
            setIsSolving(true);
            const data = await fetchNYTData();

            if (data) {
                const nytLetters = await populateLetters(data);
                if (nytLetters) {
                    shouldSolveRef.current = true;
                    setNYTDictionary(data.dictionary);
                    setLetters(nytLetters.flat());
                    setReset(false);
                    setHasNYTData(true);
                    
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
            shouldSolveRef.current = false;
        } finally {
            setIsSolving(false);
        }
    };

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
        shouldSolveRef.current = false;
        setAnswers([[]]);
        setReset(true);
        setHovered([""]);
        setHasNYTData(false);
        setNYTDictionary([]);
        setLetters([""]);
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

    return {
        answers,
        hovered,
        letters,
        showEmptyFieldsAlert,
        isSolving,
        hasNYTData,
        nytData,
        isLoading,
        isDictionaryLoading,
        error,
        lettersRef,
        inputRefs,
        reset,
        handleNYTClick,
        handleSolveClick,
        handleResetClick,
        setHovered,
        setShowEmptyFieldsAlert,
        focusNext,
        focusPrev,
    };
};