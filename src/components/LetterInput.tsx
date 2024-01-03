import { ChangeEvent, KeyboardEvent, FC, useState, useEffect } from "react";

/**
 * The direction of the letter input.
 */
export type Direction = "top" | "bottom" | "left" | "right";

/**
 * The props for the LetterInput component.
 */
interface LetterInputProps {
    direction: Direction; // The direction of the letter input.
    id: number; // The id of the letter input.
    letters: React.MutableRefObject<string[][]>; // The ref for a 2D array of letters.
    reset: boolean; // Whether or not to reset the value of the input.
}

/**
 * The LetterInput component.
 * @param direction - The direction of the letter input.
 * @param id - The id of the letter input.
 * @param letters - The 2D array of letters.
 */
export const LetterInput: FC<LetterInputProps> = ({
    direction,
    id,
    letters,
    reset,
}) => {
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

    /**
     * Handles the change event of the input.
     * @param event - The change event.
     */
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const upperCaseValue = event.target.value.toUpperCase();
        setValue(upperCaseValue);
        if (direction === "top") {
            letters.current[0][id] = upperCaseValue;
        }
        if (direction === "left") {
            letters.current[1][id] = upperCaseValue;
        }
        if (direction === "right") {
            letters.current[2][id] = upperCaseValue;
        }
        if (direction === "bottom") {
            letters.current[3][id] = upperCaseValue;
        }
    };

    useEffect(() => {
        if (reset) {
            setValue("");
        }
    }, [reset]);

    return (
        <input
            type="text"
            value={value}
            onChange={handleChange}
            className="w-8 h-8 sm:w-12 sm:h-12 text-center text-2xl border-[3px] border-black rounded-md"
            maxLength={1}
            onKeyDown={handleKeyDown}
            placeholder="_"
        />
    );
};
