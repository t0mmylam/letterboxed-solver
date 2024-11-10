import React from 'react';
import { Separator } from "@/components/ui/separator";

interface SolutionListProps {
    answers: string[][];
    hovered: string[];
    setHovered: (answer: string[]) => void;
}

export const SolutionList: React.FC<SolutionListProps> = ({
    answers,
    hovered,
    setHovered,
}) => {
    if (!answers || answers.length === 0 || answers[0].length === 0) {
        return (
            <div className="text-gray-500 text-sm text-center py-4">
                No Solutions Found
            </div>
        );
    }

    return (
        <>
            {answers.map((answer, index) => (
                <React.Fragment key={index}>
                    <div
                        className={`text-sm flex items-center answer ${
                            hovered.join("") === answer.join("")
                                ? "font-bold"
                                : ""
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
        </>
    );
};