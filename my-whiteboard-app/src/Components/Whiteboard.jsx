import React, { useRef, useState, useEffect } from "react";
import { db } from "../firebaseConfig"; // ✅ Firebase config import
import { doc, setDoc, getDoc, onSnapshot } from "firebase/firestore";

const Whiteboard = () => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(5);
  const [history, setHistory] = useState([]); // Stores previous states for undo
  const [redoStack, setRedoStack] = useState([]); // Stores undone actions for redo

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth * 0.9;
    canvas.height = window.innerHeight * 0.7;
    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctxRef.current = ctx;

    const docRef = doc(db, "whiteboard", "q9YIBkvXvVgLkg3tn4wy"); // Use your document ID
    onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      restoreCanvas(docSnap.data().drawing);
    } else {
      console.log("No drawing found");
    }
    });
  }, []);

  const startDrawing = (e) => {
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    ctxRef.current.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctxRef.current.strokeStyle = color;
    ctxRef.current.lineWidth = lineWidth;
    ctxRef.current.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    ctxRef.current.closePath();
    setIsDrawing(false);

    const canvas = canvasRef.current;
    const newHistory = [...history, canvas.toDataURL()];
    setHistory(newHistory);
    setRedoStack([]);
    updateDrawing(canvas.toDataURL());
  };

  // ✅ Save Canvas State to Firebase
  const updateDrawing = () => {
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL();
    const docRef = doc(db, "whiteboard", "q9YIBkvXvVgLkg3tn4wy"); // Use your document ID
    setDoc(docRef, { drawing: dataUrl });
  };
  

  // ✅ Restore Canvas from Firebase
  const restoreCanvas = (dataUrl) => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    const img = new Image();
    img.src = dataUrl;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
  };

  // ✅ Clear Canvas
  const clearCanvas = () => {
    ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    set(ref(db, "drawing"), null);
    setHistory([]);
    setRedoStack([]);
  };

  // ✅ Undo Feature
  const handleUndo = () => {
    if (history.length === 0) return;
    const newHistory = [...history];
    const lastState = newHistory.pop();
    setRedoStack([...redoStack, canvasRef.current.toDataURL()]);
    setHistory(newHistory);
    restoreCanvas(lastState || "");
  };

  // ✅ Redo Feature
  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const newRedoStack = [...redoStack];
    const nextState = newRedoStack.pop();
    setHistory([...history, canvasRef.current.toDataURL()]);
    setRedoStack(newRedoStack);
    restoreCanvas(nextState || "");
  };

  // ✅ Save Image to Local
  const saveAsImage = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = "whiteboard_drawing.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="flex flex-col items-center p-4">
      <div className="mb-4 flex gap-4">
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        <input type="range" min="1" max="20" value={lineWidth} onChange={(e) => setLineWidth(e.target.value)} />
        <button onClick={clearCanvas} className="p-2 bg-red-500 text-white rounded">Clear</button>
        <button onClick={handleUndo} className="p-2 bg-yellow-500 text-white rounded">Undo</button>
        <button onClick={handleRedo} className="p-2 bg-green-500 text-white rounded">Redo</button>
        <button onClick={saveAsImage} className="p-2 bg-blue-500 text-white rounded">Save</button>
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
