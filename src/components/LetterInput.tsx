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
    // Get the initial value from letterRef based on direction and id
    const getLetterValue = () => {
        switch (direction) {
            case "top":
                return letters.current[0][id] || "";
            case "left":
                return letters.current[1][id] || "";
            case "right":
                return letters.current[2][id] || "";
            case "bottom":
                return letters.current[3][id] || "";
            default:
                return "";
        }
    };

    const [value, setValue] = useState(getLetterValue());

    // Update the value when letterRef changes
    useEffect(() => {
        const newValue = getLetterValue();
        if (newValue !== value) {
            setValue(newValue);
        }
    }, [letters.current]);

    // Reset handler
    useEffect(() => {
        if (reset) {
            setValue("");
            updateLetters("");
        }
    }, [reset]);

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (!/[a-zA-Z]/i.test(event.key)) {
            event.preventDefault();
        }
    };

    const handleKeyUp = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key.length === 1 && /[a-zA-Z]/i.test(event.key)) {
            focusNext();
        } else if (event.key === "Backspace" && !value) {
            focusPrev();
        }
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const upperCaseValue = event.target.value.toUpperCase();
        setValue(upperCaseValue);
        updateLetters(upperCaseValue);
    };

    const updateLetters = (newValue: string) => {
        switch (direction) {
            case "top":
                letters.current[0][id] = newValue;
                break;
            case "left":
                letters.current[1][id] = newValue;
                break;
            case "right":
                letters.current[2][id] = newValue;
                break;
            case "bottom":
                letters.current[3][id] = newValue;
                break;
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

// Add display name for development tools
LetterInput.displayName = "LetterInput";