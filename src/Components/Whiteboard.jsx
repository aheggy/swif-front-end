import React, { useState, useEffect, useRef } from 'react';
import './Whiteboard.css';  // If you have specific styles for the whiteboard

const Whiteboard = () => {
    const [isDrawing, setIsDrawing] = useState(false);
    const canvasRef = useRef(null);

    const setupCanvas = () => {
        const canvas = canvasRef.current;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const context = canvas.getContext('2d');
        context.strokeStyle = 'black';
        context.lineWidth = 2;
    };

    useEffect(() => {
        window.addEventListener('resize', setupCanvas);
        setupCanvas();
        return () => window.removeEventListener('resize', setupCanvas);
    }, []);

    const startDrawing = ({ nativeEvent }) => {
        const { offsetX, offsetY } = nativeEvent;
        const context = canvasRef.current.getContext('2d');
        context.beginPath();
        context.moveTo(offsetX, offsetY);
        setIsDrawing(true);
    };

    const draw = ({ nativeEvent }) => {
        if (!isDrawing) return;
        const { offsetX, offsetY } = nativeEvent;
        const context = canvasRef.current.getContext('2d');
        context.lineTo(offsetX, offsetY);
        context.stroke();
    };

    const endDrawing = () => {
        const context = canvasRef.current.getContext('2d');
        context.closePath();
        setIsDrawing(false);
    };

    return (
        <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseUp={endDrawing}
            onMouseMove={draw}
            onMouseOut={endDrawing}
            className="background-canvas"
        />
    );
};

export default Whiteboard;
