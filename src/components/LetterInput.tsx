import { ChangeEvent, KeyboardEvent, FC, useState } from "react";

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
    letters: string[][]; // The 2D array of letters.
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
            letters[0][id] = upperCaseValue;
        }
        if (direction === "bottom") {
            letters[3][id] = upperCaseValue;
        }
        if (direction === "left") {
            letters[1][id] = upperCaseValue;
        }
        if (direction === "right") {
            letters[2][id] = upperCaseValue;
        }
    };

    return (
        <input
            type="text"
            value={value}
            onChange={handleChange}
            className="w-12 h-12 text-center text-2xl border-[3px] border-black rounded-md"
            maxLength={1}
            onKeyDown={handleKeyDown}
            placeholder="_"
        />
    );
};
