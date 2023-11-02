import { Separator } from "@/components/ui/separator";

export const Footer = () => {
    return (
        <div className="flex flex-col items-center">
            <div className="flex items-center">
                <a href="https://thomaslam.info">Thomas Lam</a>
                <Separator className="mx-2 h-6" orientation="vertical" />
                <a href="https://github.com/t0mmylam/letterboxed-solver">
                    GitHub
                </a>
            </div>
            <img src="/bmc-new-logo.png" alt="bmc" className="w-32" />
        </div>
    );
};
