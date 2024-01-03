import {
    ChangeEvent,
    KeyboardEvent,
    FC,
    useState,
    useEffect,
    forwardRef,
} from "react";

export type Direction = "top" | "bottom" | "left" | "right";

interface LetterInputProps {
    direction: Direction;
    id: number;
    letters: React.MutableRefObject<string[][]>;
    reset: boolean;
    focusNext: () => void;
    focusPrev: () => void;
    ref: React.Ref<HTMLInputElement>;
}

export const LetterInput: FC<LetterInputProps> = forwardRef<
    HTMLInputElement,
    LetterInputProps
>(({ direction, id, letters, reset, focusNext, focusPrev }, ref) => {
    const [value, setValue] = useState("");

    /**
     * Handles the key down event of the input.
     * @param event - The keyboard event.
     */
    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (!/[a-zA-Z]/i.test(event.key)) {
            event.preventDefault();
        }
    };

    const handleKeyUp = (event: KeyboardEvent<HTMLInputElement>) => {
        // When a character is entered move to the next input
        if (event.key.length === 1 && /[a-zA-Z]/i.test(event.key)) {
            focusNext();
        } else if (event.key === "Backspace" && !value) {
            // If backspace is pressed and the input is already empty, focus the previous input
            focusPrev();
        }
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const upperCaseValue = event.target.value.toUpperCase();
        setValue(upperCaseValue);
        updateLetters(upperCaseValue); // Simplified method to update the letters ref
    };

    useEffect(() => {
        if (reset) {
            setValue("");
        }
    }, [reset]);

    const updateLetters = (value: string) => {
        if (direction === "top") {
            letters.current[0][id] = value;
        } else if (direction === "left") {
            letters.current[1][id] = value;
        } else if (direction === "right") {
            letters.current[2][id] = value;
        } else if (direction === "bottom") {
            letters.current[3][id] = value;
        }
    };

    return (
        <input
            ref={ref}
            type="text"
            value={value}
            onChange={handleChange}
            onKeyUp={handleKeyUp}
            onKeyDown={handleKeyDown}
            className="w-8 h-8 sm:w-12 sm:h-12 text-center text-2xl border-[3px] border-black rounded-md"
            maxLength={1}
            placeholder="_"
        />
    );
});
