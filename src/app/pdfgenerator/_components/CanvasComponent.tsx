import React, { useEffect, useRef } from "react";
import { fabric } from "fabric";

interface CanvasComponentProps {
    fabricCanvas: React.MutableRefObject<fabric.Canvas | null>;
}

const CanvasComponent: React.FC<CanvasComponentProps> = ({ fabricCanvas }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (canvasRef.current) {
            const canvas = new fabric.Canvas(canvasRef.current, {
                width: 800,
                height: 500,
                backgroundColor: "#fff",
            });
            fabricCanvas.current = canvas;

            return () => {
                canvas.dispose();
            };
        }
    }, [fabricCanvas]);

    return <canvas ref={canvasRef} style={{ border: "1px solid #ccc", boxShadow: "2px 2px 10px rgba(0,0,0,0.1)" }} />;
};

export default CanvasComponent;