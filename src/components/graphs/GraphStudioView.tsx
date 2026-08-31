import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Move, 
  Sparkles, 
  Info, 
  Sliders, 
  Layers,
  Edit2,
  Check,
  X,
  Target,
  Maximize2
} from 'lucide-react';
import { GraphFunction } from '../../types';
import { 
  GRAPH_COLORS, 
  createFunctionEvaluator, 
  analyzeGraphFunction,
  validateFunctionExpression
} from '../../utils/graphParser';

export const GraphStudioView: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Graph viewport parameters
  const [gridScale, setGridScale] = useState<number>(1); // 0.1, 0.2, 0.5, 1, 2, 5, 10
  const [zoom, setZoom] = useState<number>(40); // Pixels per unit
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [mouseCoord, setMouseCoord] = useState<{ x: number; y: number } | null>(null);

  // Editable Viewport Bounds (X Min, X Max, Y Min, Y Max)
  const [xMinInput, setXMinInput] = useState<string>('-10');
  const [xMaxInput, setXMaxInput] = useState<string>('10');
  const [yMinInput, setYMinInput] = useState<string>('-10');
  const [yMaxInput, setYMaxInput] = useState<string>('10');

  // Function list
  const [functions, setFunctions] = useState<GraphFunction[]>([
    {
      id: 'fn-1',
      ...analyzeGraphFunction('y = x^2'),
      color: GRAPH_COLORS[0],
      isVisible: true,
    }
  ]);

  const [inputExpression, setInputExpression] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedFunctionId, setSelectedFunctionId] = useState<string>('fn-1');
  const [editingFunctionId, setEditingFunctionId] = useState<string | null>(null);
  const [editingInputText, setEditingInputText] = useState<string>('');

  // Preset functions
  const presets = [
    { label: 'y = x²', expr: 'y = x^2' },
    { label: 'y = 2x + 5', expr: 'y = 2x + 5' },
    { label: 'y = 3x² + 2x - 5', expr: 'y = 3x^2 + 2x - 5' },
    { label: 'y = sin(x)', expr: 'y = sin(x)' },
    { label: 'y = cos(x)', expr: 'y = cos(x)' },
    { label: 'y = tan(x)', expr: 'y = tan(x)' },
    { label: 'y = √x', expr: 'y = sqrt(x)' },
    { label: 'y = ln(x)', expr: 'y = ln(x)' },
    { label: 'y = eˣ', expr: 'y = e^x' },
    { label: 'y = 1/x', expr: 'y = 1/x' },
    { label: 'y = |x|', expr: 'y = |x|' },
    { label: 'x² + y² = 25', expr: 'x^2 + y^2 = 25' },
  ];

  const scaleOptions = [0.1, 0.2, 0.5, 1, 2, 5, 10];

  const selectedFunction = functions.find((f) => f.id === selectedFunctionId) || functions[0];

  // Calculate current bounds based on canvas size, panOffset and zoom
  const updateBoundsFromViewport = useCallback((width: number, height: number, pX: number, pY: number, z: number) => {
    const originX = width / 2 + pX;
    const originY = height / 2 + pY;

    const xMin = -originX / z;
    const xMax = (width - originX) / z;
    const yMax = originY / z;
    const yMin = (originY - height) / z;

    setXMinInput(xMin.toFixed(1));
    setXMaxInput(xMax.toFixed(1));
    setYMinInput(yMin.toFixed(1));
    setYMaxInput(yMax.toFixed(1));
  }, []);

  // Apply explicit numeric range bounds to viewport
  const handleApplyBounds = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width || 600;
    const height = rect.height || 460;

    const xMin = parseFloat(xMinInput);
    const xMax = parseFloat(xMaxInput);
    const yMin = parseFloat(yMinInput);
    const yMax = parseFloat(yMaxInput);

    if (isNaN(xMin) || isNaN(xMax) || isNaN(yMin) || isNaN(yMax) || xMax <= xMin || yMax <= yMin) {
      return;
    }

    const xSpan = xMax - xMin;
    const ySpan = yMax - yMin;

    const newZoomX = width / xSpan;
    const newZoomY = height / ySpan;
    const newZoom = Math.min(newZoomX, newZoomY);

    const centerX = (xMin + xMax) / 2;
    const centerY = (yMin + yMax) / 2;

    const newPanX = -centerX * newZoom;
    const newPanY = centerY * newZoom;

    setZoom(Math.min(Math.max(newZoom, 5), 400));
    setPanOffset({ x: newPanX, y: newPanY });
  };

  // Draw Graph Canvas
  const drawGraph = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    const originX = width / 2 + panOffset.x;
    const originY = height / 2 + panOffset.y;

    const isDarkMode = document.documentElement.classList.contains('dark');

    // Background fill
    ctx.fillStyle = isDarkMode ? '#090d16' : '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // --- 1. Draw Grid Lines ---
    const stepInPixels = gridScale * zoom;
    if (stepInPixels > 5) {
      ctx.lineWidth = 1;
      ctx.strokeStyle = isDarkMode ? '#1e293b' : '#f1f5f9';

      // Vertical sub-grid
      const startX = originX % stepInPixels;
      for (let x = startX; x < width; x += stepInPixels) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Horizontal sub-grid
      const startY = originY % stepInPixels;
      for (let y = startY; y < height; y += stepInPixels) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    }

    // --- 2. Draw Major Axes (X & Y) ---
    ctx.lineWidth = 1.75;
    ctx.strokeStyle = isDarkMode ? '#475569' : '#94a3b8';

    // X-Axis
    ctx.beginPath();
    ctx.moveTo(0, originY);
    ctx.lineTo(width, originY);
    ctx.stroke();

    // Y-Axis
    ctx.beginPath();
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, height);
    ctx.stroke();

    // Axis Arrows
    ctx.fillStyle = isDarkMode ? '#475569' : '#94a3b8';
    // X arrow
    ctx.beginPath();
    ctx.moveTo(width - 8, originY - 4);
    ctx.lineTo(width, originY);
    ctx.lineTo(width - 8, originY + 4);
    ctx.fill();
    // Y arrow
    ctx.beginPath();
    ctx.moveTo(originX - 4, 8);
    ctx.lineTo(originX, 0);
    ctx.lineTo(originX + 4, 8);
    ctx.fill();

    // Axis Labels
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText('x', width - 12, originY + 14);
    ctx.fillText('y', originX + 10, 14);

    // --- 3. Draw Axis Numbers & Ticks ---
    ctx.fillStyle = isDarkMode ? '#94a3b8' : '#64748b';
    ctx.font = '10px "Fira Code", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    const numStep = stepInPixels;
    if (numStep >= 20) {
      // X-axis numbers
      for (let x = originX + numStep; x < width - 15; x += numStep) {
        const mathVal = ((x - originX) / zoom);
        ctx.beginPath();
        ctx.moveTo(x, originY - 3);
        ctx.lineTo(x, originY + 3);
        ctx.stroke();
        ctx.fillText(Number(mathVal.toFixed(2)).toString(), x, originY + 6);
      }
      for (let x = originX - numStep; x > 15; x -= numStep) {
        const mathVal = ((x - originX) / zoom);
        ctx.beginPath();
        ctx.moveTo(x, originY - 3);
        ctx.lineTo(x, originY + 3);
        ctx.stroke();
        ctx.fillText(Number(mathVal.toFixed(2)).toString(), x, originY + 6);
      }

      // Y-axis numbers
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      for (let y = originY - numStep; y > 15; y -= numStep) {
        const mathVal = ((originY - y) / zoom);
        ctx.beginPath();
        ctx.moveTo(originX - 3, y);
        ctx.lineTo(originX + 3, y);
        ctx.stroke();
        ctx.fillText(Number(mathVal.toFixed(2)).toString(), originX - 6, y);
      }
      for (let y = originY + numStep; y < height - 15; y += numStep) {
        const mathVal = ((originY - y) / zoom);
        ctx.beginPath();
        ctx.moveTo(originX - 3, y);
        ctx.lineTo(originX + 3, y);
        ctx.stroke();
        ctx.fillText(Number(mathVal.toFixed(2)).toString(), originX - 6, y);
      }
    }

    // Origin (0,0) indicator
    ctx.fillStyle = isDarkMode ? '#64748b' : '#94a3b8';
    ctx.fillText('0', originX - 6, originY + 6);

    // --- 4. Plot Mathematical Functions ---
    functions.forEach((fnObj) => {
      if (!fnObj.isVisible) return;

      ctx.lineWidth = 2.5;
      ctx.strokeStyle = fnObj.color;
      ctx.beginPath();

      // Check if it's a circle: x^2 + y^2 = r^2
      if (fnObj.rawInput.includes('x^2 + y^2') || fnObj.rawInput.includes('x² + y²') || fnObj.rawInput.includes('x^2+y^2')) {
        const match = fnObj.rawInput.match(/=\s*(\d+(?:\.\d+)?)/);
        const r2 = match ? parseFloat(match[1]) : 25;
        const r = Math.sqrt(r2);
        const radiusPx = r * zoom;
        ctx.arc(originX, originY, radiusPx, 0, Math.PI * 2);
        ctx.stroke();
        return;
      }

      const evaluator = createFunctionEvaluator(fnObj.expression);
      let started = false;

      // Plot point by point across pixels
      const step = 1; // 1px sampling
      for (let px = 0; px <= width; px += step) {
        const mathX = (px - originX) / zoom;
        const mathY = evaluator(mathX);

        if (isNaN(mathY) || !isFinite(mathY)) {
          started = false;
          continue;
        }

        const py = originY - mathY * zoom;

        // Discontinuity clipping
        if (py < -height * 2 || py > height * 3) {
          started = false;
          continue;
        }

        if (!started) {
          ctx.moveTo(px, py);
          started = true;
        } else {
          ctx.lineTo(px, py);
        }
      }

      ctx.stroke();
    });

    // --- 5. Draw Crosshair on Mouse Hover ---
    if (mouseCoord) {
      const mathX = (mouseCoord.x - originX) / zoom;
      const mathY = (originY - mouseCoord.y) / zoom;

      // Crosshair lines
      ctx.lineWidth = 0.75;
      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = isDarkMode ? '#60a5fa' : '#3b82f6';

      ctx.beginPath();
      ctx.moveTo(mouseCoord.x, 0);
      ctx.lineTo(mouseCoord.x, height);
      ctx.moveTo(0, mouseCoord.y);
      ctx.lineTo(width, mouseCoord.y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Coordinate Tag
      const label = `(${mathX.toFixed(2)}, ${mathY.toFixed(2)})`;
      ctx.font = '11px "Fira Code", monospace';
      const textWidth = ctx.measureText(label).width;

      const badgeX = Math.min(Math.max(mouseCoord.x + 8, 4), width - textWidth - 16);
      const badgeY = Math.min(Math.max(mouseCoord.y - 20, 16), height - 24);

      ctx.fillStyle = isDarkMode ? '#1e293b' : '#0f172a';
      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY - 12, textWidth + 12, 20, 4);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, badgeX + 6, badgeY - 2);
    }
  }, [gridScale, zoom, panOffset, functions, mouseCoord]);

  // Redraw when viewport or functions change
  useEffect(() => {
    drawGraph();
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      updateBoundsFromViewport(rect.width || 600, rect.height || 460, panOffset.x, panOffset.y, zoom);
    }
  }, [drawGraph, panOffset, zoom, updateBoundsFromViewport]);

  // Window resize observer
  useEffect(() => {
    const handleResize = () => {
      drawGraph();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawGraph]);

  // Canvas Mouse Controls
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setMouseCoord({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }

    if (isDragging) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
    setZoom((prev) => Math.min(Math.max(prev * zoomFactor, 8), 350));
  };

  const handleResetView = () => {
    setPanOffset({ x: 0, y: 0 });
    setZoom(40);
    setGridScale(1);
    setXMinInput('-10');
    setXMaxInput('10');
    setYMinInput('-10');
    setYMaxInput('10');
  };

  // Add / Plot new custom function
  const handleAddFunction = () => {
    const trimmed = inputExpression.trim();
    if (!trimmed) {
      setErrorMessage('Please enter a function to plot (e.g. y = x^2).');
      return;
    }

    const validation = validateFunctionExpression(trimmed);
    if (!validation.isValid) {
      setErrorMessage(validation.errorMessage || 'Invalid function. Please check your expression.');
      return;
    }

    setErrorMessage(null);
    const analysis = analyzeGraphFunction(trimmed);
    const newFn: GraphFunction = {
      id: `fn-${Date.now()}`,
      ...analysis,
      color: GRAPH_COLORS[functions.length % GRAPH_COLORS.length],
      isVisible: true,
    };
    setFunctions((prev) => [...prev, newFn]);
    setSelectedFunctionId(newFn.id);
    setInputExpression('');
  };

  // Start inline editing of an existing function
  const handleStartEdit = (fn: GraphFunction) => {
    setEditingFunctionId(fn.id);
    setEditingInputText(fn.rawInput);
  };

  // Save inline edit of an existing function
  const handleSaveEdit = (id: string) => {
    const trimmed = editingInputText.trim();
    if (!trimmed) return;

    const validation = validateFunctionExpression(trimmed);
    if (!validation.isValid) {
      setErrorMessage(validation.errorMessage || 'Invalid function. Please check your expression.');
      return;
    }

    setErrorMessage(null);
    const analysis = analyzeGraphFunction(trimmed);
    setFunctions((prev) =>
      prev.map((f) =>
        f.id === id
          ? {
              ...f,
              ...analysis,
              rawInput: trimmed,
            }
          : f
      )
    );
    setEditingFunctionId(null);
    setSelectedFunctionId(id);
  };

  // Selecting preset puts into the editable input text box
  const handleSelectPreset = (presetExpr: string) => {
    setInputExpression(presetExpr);
    setErrorMessage(null);
  };

  const handleToggleVisibility = (id: string) => {
    setFunctions((prev) =>
      prev.map((f) => (f.id === id ? { ...f, isVisible: !f.isVisible } : f))
    );
  };

  const handleDeleteFunction = (id: string) => {
    setFunctions((prev) => prev.filter((f) => f.id !== id));
    if (selectedFunctionId === id) {
      const remaining = functions.filter((f) => f.id !== id);
      if (remaining.length > 0) {
        setSelectedFunctionId(remaining[0].id);
      }
    }
  };

  const handleClearAllFunctions = () => {
    setFunctions([]);
  };

  return (
    <div className="flex-1 h-full overflow-y-auto p-4 lg:p-6 flex flex-col max-w-7xl mx-auto space-y-5">
      
      {/* Studio Header & Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-1 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400">
              <Sliders className="w-5 h-5" />
            </span>
            <span>Graph Studio</span>
          </h2>
          <p className="text-xs text-slate-500">
            Interactive mathematical coordinate plane with free-form user equations, real-time plotting & complete mathematical analysis.
          </p>
        </div>

        {/* Viewport Control Tools */}
        <div className="flex items-center gap-2">
          {/* Grid Scale Dropdown */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs shadow-xs">
            <span className="text-slate-400 font-medium">Grid Scale:</span>
            <select
              value={gridScale}
              onChange={(e) => setGridScale(parseFloat(e.target.value))}
              className="bg-transparent font-mono font-semibold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              {scaleOptions.map((s) => (
                <option key={s} value={s} className="dark:bg-slate-900">
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Zoom & Reset Buttons */}
          <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-0.5 shadow-xs">
            <button
              onClick={() => setZoom((prev) => Math.min(prev * 1.2, 350))}
              className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
              title="Zoom In (+)"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoom((prev) => Math.max(prev * 0.8, 8))}
              className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
              title="Zoom Out (-)"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetView}
              className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
              title="Reset View & Center Origin (0,0)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Graph Grid: Interactive Plane + Side Control & Explanation Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left / Center Area: Canvas Coordinate Plane (Cols 1-8) */}
        <div className="lg:col-span-8 space-y-3.5">
          
          {/* Function Input Bar (Fully Editable User Custom Functions) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
              <span>Enter Any Mathematical Function (Editable Input Area)</span>
              <span className="text-[11px] text-cyan-600 dark:text-cyan-400 font-mono">
                Supports: y = x², 2x+5, sin(x), √x, ln(x), eˣ, 1/x, |x|, x²+y²=25
              </span>
            </div>

            {errorMessage && (
              <div className="flex items-center justify-between p-2 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs">
                <div className="flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
                <button
                  onClick={() => setErrorMessage(null)}
                  className="p-0.5 hover:bg-red-100 dark:hover:bg-red-900/50 rounded"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm text-cyan-600 dark:text-cyan-400 pl-1">f(x) =</span>
              <input
                type="text"
                value={inputExpression}
                onChange={(e) => setInputExpression(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddFunction();
                }}
                placeholder='Type any equation e.g. "y = x^2", "y = 3x^2 + 2x - 5", "y = sqrt(x)"'
                className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 font-mono text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <button
                onClick={handleAddFunction}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Plot Function</span>
              </button>
            </div>
          </div>

          {/* Quick Presets Bar (Clicking fills editable input) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Examples / Presets:</span>
            {presets.map((p) => (
              <button
                key={p.label}
                onClick={() => handleSelectPreset(p.expr)}
                className="px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-cyan-400 hover:text-cyan-600 dark:hover:border-cyan-500 text-slate-700 dark:text-slate-300 font-mono text-xs whitespace-nowrap transition-colors"
                title={`Load "${p.expr}" into editable input`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Coordinate Plane Range Controls (X Min, X Max, Y Min, Y Max) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 shadow-xs flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <Target className="w-3.5 h-3.5 text-cyan-500" />
              <span className="font-semibold text-slate-700 dark:text-slate-300">Axis Range Bounds:</span>
            </div>
            
            <div className="flex items-center gap-2 font-mono">
              <div className="flex items-center gap-1">
                <span className="text-slate-400">X:</span>
                <input
                  type="text"
                  value={xMinInput}
                  onChange={(e) => setXMinInput(e.target.value)}
                  className="w-12 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-center"
                  placeholder="Min"
                />
                <span className="text-slate-400">to</span>
                <input
                  type="text"
                  value={xMaxInput}
                  onChange={(e) => setXMaxInput(e.target.value)}
                  className="w-12 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-center"
                  placeholder="Max"
                />
              </div>

              <div className="flex items-center gap-1 ml-2">
                <span className="text-slate-400">Y:</span>
                <input
                  type="text"
                  value={yMinInput}
                  onChange={(e) => setYMinInput(e.target.value)}
                  className="w-12 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-center"
                  placeholder="Min"
                />
                <span className="text-slate-400">to</span>
                <input
                  type="text"
                  value={yMaxInput}
                  onChange={(e) => setYMaxInput(e.target.value)}
                  className="w-12 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-center"
                  placeholder="Max"
                />
              </div>

              <button
                onClick={handleApplyBounds}
                className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-cyan-500 hover:text-white dark:hover:bg-cyan-600 rounded text-[11px] font-semibold transition-colors cursor-pointer"
              >
                Apply Range
              </button>
            </div>
          </div>

          {/* Canvas Coordinate Plane Wrapper */}
          <div className="relative w-full h-[460px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 shadow-inner group">
            <canvas
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={() => {
                setIsDragging(false);
                setMouseCoord(null);
              }}
              onWheel={handleWheel}
              className="w-full h-full cursor-crosshair"
            />

            {/* Canvas floating helper badge */}
            <div className="absolute bottom-3 left-3 bg-slate-900/85 backdrop-blur-md text-white px-3 py-1.5 rounded-lg border border-slate-700/60 text-[11px] font-mono flex items-center gap-2 pointer-events-none">
              <Move className="w-3.5 h-3.5 text-cyan-400" />
              <span>Drag canvas to Pan • Scroll wheel to Zoom • Hover for (x,y) crosshair</span>
            </div>
          </div>

          {/* Active Curves List with Direct Edit, Delete, Toggle & Analyze */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-cyan-500" />
                Active Plotted Functions ({functions.length})
              </span>
              {functions.length > 0 && (
                <button
                  onClick={handleClearAllFunctions}
                  className="text-xs text-red-500 hover:underline cursor-pointer"
                >
                  Clear All Functions
                </button>
              )}
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {functions.map((fn) => {
                const isSelected = fn.id === selectedFunctionId;
                const isEditing = fn.id === editingFunctionId;

                return (
                  <div
                    key={fn.id}
                    onClick={() => setSelectedFunctionId(fn.id)}
                    className={`p-2.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? 'border-cyan-400 dark:border-cyan-600 bg-cyan-50/40 dark:bg-cyan-950/40'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    {isEditing ? (
                      /* Inline Edit Mode */
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: fn.color }} />
                        <input
                          type="text"
                          value={editingInputText}
                          onChange={(e) => setEditingInputText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveEdit(fn.id);
                            if (e.key === 'Escape') setEditingFunctionId(null);
                          }}
                          className="flex-1 px-2 py-1 font-mono text-xs rounded border border-cyan-400 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveEdit(fn.id)}
                          className="p-1 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 rounded"
                          title="Save & Replot"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingFunctionId(null)}
                          className="p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                          title="Cancel"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      /* Standard Row Display */
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
                            style={{ backgroundColor: fn.color }}
                          />
                          <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                            {fn.rawInput}
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium hidden sm:inline">
                            ({fn.type})
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {/* Edit button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartEdit(fn);
                            }}
                            className="p-1 text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                            title="Edit function equation"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Visibility button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleVisibility(fn.id);
                            }}
                            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                            title={fn.isVisible ? 'Hide function' : 'Show function'}
                          >
                            {fn.isVisible ? <Eye className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" /> : <EyeOff className="w-3.5 h-3.5" />}
                          </button>

                          {/* Delete button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteFunction(fn.id);
                            }}
                            className="p-1 text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                            title="Delete function"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Col: Mathematical Explanation & Analysis (Cols 9-12) */}
        <div className="lg:col-span-4 space-y-4">
          
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-md space-y-4">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
                <Sparkles className="w-4 h-4 text-cyan-500" />
                <span>Function Analysis</span>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-cyan-50 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-300">
                Mathematical Breakdown
              </span>
            </div>

            {selectedFunction ? (
              <div className="space-y-4 animate-in fade-in duration-200">
                {/* Active function banner */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-sm font-mono font-bold text-slate-900 dark:text-white">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedFunction.color }} />
                    <span>{selectedFunction.rawInput}</span>
                  </div>
                  <div className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 mt-1">
                    {selectedFunction.type}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {selectedFunction.description}
                  </p>
                </div>

                {/* Mathematical Properties Grid */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Core Mathematical Properties
                  </span>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-semibold">Domain</span>
                      <span className="font-mono font-medium text-slate-800 dark:text-slate-200">{selectedFunction.domain || 'ℝ'}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-semibold">Range</span>
                      <span className="font-mono font-medium text-slate-800 dark:text-slate-200">{selectedFunction.range || 'ℝ'}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-semibold">Roots (x-intercepts)</span>
                      <span className="font-mono font-medium text-slate-800 dark:text-slate-200 break-words">{selectedFunction.roots || 'None'}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-semibold">y-Intercept</span>
                      <span className="font-mono font-medium text-slate-800 dark:text-slate-200">{selectedFunction.yIntercept || 'y = 0'}</span>
                    </div>
                  </div>

                  {/* Vertex / Extrema & Axis of Symmetry */}
                  {selectedFunction.vertex && (
                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs">
                      <span className="text-[10px] text-slate-400 block font-semibold">Vertex / Extrema Point</span>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{selectedFunction.vertex}</span>
                    </div>
                  )}

                  {selectedFunction.axisOfSymmetry && (
                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs">
                      <span className="text-[10px] text-slate-400 block font-semibold">Axis of Symmetry & Opening</span>
                      <span className="font-mono text-slate-800 dark:text-slate-200">
                        {selectedFunction.axisOfSymmetry} {selectedFunction.opening ? `(${selectedFunction.opening})` : ''}
                      </span>
                    </div>
                  )}

                  {/* Derivative */}
                  {selectedFunction.derivative && (
                    <div className="p-2.5 rounded-lg bg-cyan-50/80 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800 text-xs">
                      <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-semibold block">Calculus First Derivative f'(x)</span>
                      <span className="font-mono font-bold text-cyan-800 dark:text-cyan-200">{selectedFunction.derivative}</span>
                    </div>
                  )}
                </div>

                {/* Characteristics bullet points */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Geometric Characteristics
                  </span>
                  <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                    {selectedFunction.characteristics.map((ch, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-cyan-500 font-bold">•</span>
                        <span>{ch}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-slate-400 space-y-2">
                <Info className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700 stroke-[1.5]" />
                <p className="text-xs font-medium text-slate-500">
                  Plot or select a mathematical function to view its full analytical characteristics and derivative.
                </p>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

