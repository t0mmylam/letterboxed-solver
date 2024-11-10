import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SolutionList } from './SolutionList';

interface SolutionPanelProps {
    answers: string[][];
    hovered: string[];
    setHovered: (answer: string[]) => void;
    isSolving: boolean;
    hasNYTData: boolean;
    nytData: { ourSolution: string[] } | null;
}

export const SolutionPanel: React.FC<SolutionPanelProps> = ({
    answers,
    hovered,
    setHovered,
    isSolving,
    hasNYTData,
    nytData,
}) => (
    <div className="flex items-center flex-col gap-6">
        <ScrollArea className="h-[556px] w-[300px] rounded-md border bg-white border-black border-4">
            <div className="p-4">
                <h4 className="mb-1 text-xl font-medium leading-none">
                    Solutions
                </h4>
                {hasNYTData && nytData?.ourSolution && (
                    <p className="text-green-600 text-sm mb-2">
                        NYT's solution: {nytData.ourSolution.join(" — ")}
                    </p>
                )}
                <Separator className="my-2" />
                {!isSolving && (
                    <SolutionList
                        answers={answers}
                        hovered={hovered}
                        setHovered={setHovered}
                    />
                )}
            </div>
        </ScrollArea>
    </div>
);