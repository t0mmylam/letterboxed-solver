import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "./LoadingSpinner";

interface ControlPanelProps {
    onSolve: () => void;
    onReset: () => void;
    onNYTClick: () => void;
    isSolving: boolean;
    isLoading: boolean;
    isDictionaryLoading: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
    onSolve,
    onReset,
    onNYTClick,
    isSolving,
    isLoading,
    isDictionaryLoading,
}) => (
    <div className="flex flex-row gap-4">
        <Button
            variant="secondary"
            onClick={onSolve}
            size="lg"
            disabled={isSolving}
        >
            {isSolving ? (
                <>
                    <LoadingSpinner className="text-gray-700" />
                    Solving...
                </>
            ) : (
                "Solve"
            )}
        </Button>
        <Button variant="destructive" onClick={onReset} size="lg">
            Reset
        </Button>
        <Button
            variant="default"
            onClick={onNYTClick}
            disabled={isLoading || isDictionaryLoading}
            size="lg"
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
            {isLoading || isDictionaryLoading ? (
                <>
                    <LoadingSpinner className="text-white" />
                    Loading...
                </>
            ) : (
                "Use NYT"
            )}
        </Button>
    </div>
);