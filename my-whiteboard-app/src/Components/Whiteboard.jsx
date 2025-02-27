import React, { useRef, useState, useEffect } from "react";

const Whiteboard = () => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000"); // Default black
  const [lineWidth, setLineWidth] = useState(5); // Default stroke size

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth * 0.9;
    canvas.height = window.innerHeight * 0.7;
    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round"; // Smooth line edges
    ctxRef.current = ctx;
  }, []);

  const startDrawing = (e) => {
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(
      e.nativeEvent.offsetX,
      e.nativeEvent.offsetY
    );
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    ctxRef.current.lineTo(
      e.nativeEvent.offsetX,
      e.nativeEvent.offsetY
    );
    ctxRef.current.strokeStyle = color;
    ctxRef.current.lineWidth = lineWidth;
    ctxRef.current.stroke();
  };

  const stopDrawing = () => {
    ctxRef.current.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  return (
    <div className="flex flex-col items-center p-4">
      <div className="mb-4 flex gap-4">
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
        <input
          type="range"
          min="1"
          max="20"
          value={lineWidth}
          onChange={(e) => setLineWidth(e.target.value)}
        />
        <button onClick={clearCanvas} className="p-2 bg-red-500 text-white rounded">
          Clear
        </button>
      </div>
      <canvas
        ref={canvasRef}
        className="border shadow-lg bg-white"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
    </div>
  );
};

export default Whiteboard;
