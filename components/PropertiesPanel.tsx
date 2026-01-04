import React, { useEffect, useState } from 'react';
import { Node } from 'reactflow';
import { Settings, Trash2, Type } from 'lucide-react';

interface PropertiesPanelProps {
  selectedNode: Node | null;
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ selectedNode, setNodes }) => {
  const [label, setLabel] = useState('');
  const [bgColor, setBgColor] = useState('#ffffff');

  useEffect(() => {
    if (selectedNode) {
      setLabel(selectedNode.data.label);
      setBgColor(selectedNode.style?.backgroundColor as string || '#ffffff');
    }
  }, [selectedNode]);

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLabel = e.target.value;
    setLabel(newLabel);
    if (selectedNode) {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === selectedNode.id) {
            return {
              ...node,
              data: { ...node.data, label: newLabel },
            };
          }
          return node;
        })
      );
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setBgColor(newColor);
    if (selectedNode) {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === selectedNode.id) {
            return {
              ...node,
              style: { ...node.style, backgroundColor: newColor },
            };
          }
          return node;
        })
      );
    }
  };

  const handleDelete = () => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
    }
  };

  if (!selectedNode) {
    return (
      <div className="w-64 bg-white border-l border-slate-200 p-6 flex flex-col items-center justify-center text-center text-slate-400 h-full">
        <Settings className="w-12 h-12 mb-3 opacity-20" />
        <p className="text-sm">Select a shape to edit its properties.</p>
      </div>
    );
  }

  return (
    <div className="w-64 bg-white border-l border-slate-200 flex flex-col h-full shadow-sm z-10">
      <div className="p-4 border-b border-slate-200 bg-slate-50">
        <h2 className="font-semibold text-slate-700 flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Properties
        </h2>
      </div>

      <div className="p-4 flex flex-col gap-6">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1">
            <Type className="w-3 h-3" /> Label
          </label>
          <input
            type="text"
            value={label}
            onChange={handleLabelChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="Enter label..."
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Background Color</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={bgColor}
              onChange={handleColorChange}
              className="h-10 w-10 p-1 rounded border border-slate-300 cursor-pointer"
            />
            <span className="text-xs text-slate-500 font-mono uppercase">{bgColor}</span>
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-slate-100">
           <button
            onClick={handleDelete}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-md hover:bg-red-100 transition-colors text-sm font-medium"
          >
            <Trash2 className="w-4 h-4" />
            Delete Shape
          </button>
        </div>
      </div>
    </div>
  );
};
