import React from 'react';
import { Square, Circle, ArrowRightCircle, LayoutTemplate } from 'lucide-react';

export const Sidebar = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string, label: string) => {
    event.dataTransfer.setData('application/reactflow/type', nodeType);
    event.dataTransfer.setData('application/reactflow/label', label);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-full shadow-sm z-10">
      <div className="p-4 border-b border-slate-200 bg-slate-50">
        <h2 className="font-semibold text-slate-700 flex items-center gap-2">
          <LayoutTemplate className="w-4 h-4" />
          Shapes Library
        </h2>
      </div>
      
      <div className="p-4 flex flex-col gap-3 overflow-y-auto">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Basic Shapes</div>
        
        <div 
          className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-grab hover:bg-blue-50 hover:border-blue-200 transition-colors shadow-sm active:cursor-grabbing bg-white"
          onDragStart={(event) => onDragStart(event, 'input', 'Start / Input')}
          draggable
        >
          <ArrowRightCircle className="w-5 h-5 text-green-600" />
          <span className="text-sm font-medium text-slate-700">Start / Input</span>
        </div>

        <div 
          className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-grab hover:bg-blue-50 hover:border-blue-200 transition-colors shadow-sm active:cursor-grabbing bg-white"
          onDragStart={(event) => onDragStart(event, 'default', 'Process Step')}
          draggable
        >
          <Square className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium text-slate-700">Process Node</span>
        </div>

        <div 
          className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-grab hover:bg-blue-50 hover:border-blue-200 transition-colors shadow-sm active:cursor-grabbing bg-white"
          onDragStart={(event) => onDragStart(event, 'output', 'End / Output')}
          draggable
        >
          <Circle className="w-5 h-5 text-red-600" />
          <span className="text-sm font-medium text-slate-700">End / Output</span>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-xs text-blue-800 leading-relaxed">
            <strong>Tip:</strong> Drag these shapes onto the canvas. Connect them by dragging from the handles (dots) on the edges.
          </p>
        </div>
      </div>
    </aside>
  );
};
