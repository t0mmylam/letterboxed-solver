import { useEffect, useRef } from "react";

export const Canvas = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (canvasRef.current) {
            const ctx: CanvasRenderingContext2D | null =
                canvasRef.current.getContext("2d");
            if (ctx) {
                // deal w aspect ratio and blurriness
                const devicePixelRatio = window.devicePixelRatio || 1;
                canvasRef.current.width = 400 * devicePixelRatio;
                canvasRef.current.height = 400 * devicePixelRatio;
                ctx.scale(devicePixelRatio, devicePixelRatio);

                ctx.imageSmoothingEnabled = false; // set to false for crisp edges

                // border and background
                ctx.fillStyle = "black";
                ctx.fillRect(36, 36, 328, 328);
                ctx.fillStyle = "white";
                ctx.fillRect(40, 40, 320, 320);

                const coords: { x: number; y: number }[] = [
                    // top circles
                    { x: 100, y: 36 },
                    { x: 200, y: 36 },
                    { x: 300, y: 36 },

                    // left circles
                    { x: 36, y: 100 },
                    { x: 36, y: 200 },
                    { x: 36, y: 300 },

                    // right circles
                    { x: 364, y: 100 },
                    { x: 364, y: 200 },
                    { x: 364, y: 300 },

                    // bottom circles
                    { x: 100, y: 364 },
                    { x: 200, y: 364 },
                    { x: 300, y: 364 },
                ];

                for (let i = 0; i < coords.length; i++) {
                    const x = coords[i].x;
                    const y = coords[i].y;
                    // outer black circle
                    ctx.beginPath();
                    ctx.fillStyle = "black";
                    ctx.arc(x, y, 11, 0, 2 * Math.PI);
                    ctx.fill();

                    // inner colored circle
                    ctx.beginPath();
                    ctx.fillStyle = "white";
                    ctx.arc(x, y, 8, 0, 2 * Math.PI);
                    ctx.fill();
                }
            }
        }
    }, []);

    return (
        <canvas
            ref={canvasRef}
            width="400"
            height="400"
            className="w-[270px] h-[270px] sm:w-[400px] sm:h-[400px]"
        />
    );
};
