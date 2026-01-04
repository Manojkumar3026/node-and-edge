import React, { useState } from 'react';
import { Sparkles, Download, Boxes, Loader2, Plus } from 'lucide-react';
import { generateDiagramFromPrompt } from '../services/geminiService';
import { Node, Edge } from 'reactflow';

interface HeaderProps {
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
}

export const Header: React.FC<HeaderProps> = ({ setNodes, setEdges }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      const data = await generateDiagramFromPrompt(prompt);
      
      // Convert API response to React Flow format
      const newNodes: Node[] = data.nodes.map(n => ({
        id: n.id,
        type: n.type,
        position: { x: n.x, y: n.y },
        data: { label: n.label },
        style: { backgroundColor: '#ffffff', border: '1px solid #94a3b8', borderRadius: '4px', padding: '10px', width: 150 }
      }));

      const newEdges: Edge[] = data.edges.map(e => ({
        id: e.id,
        source: e.source,
        target: e.target,
        label: e.label,
        type: 'smoothstep',
        animated: true,
      }));

      setNodes(newNodes);
      setEdges(newEdges);
      setIsModalOpen(false);
      setPrompt('');
    } catch (error) {
      alert('Failed to generate diagram. Please check your API key and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 shadow-sm z-20 relative">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <Boxes className="w-5 h-5 text-white" />
          </div>
          <h1 className="font-bold text-slate-800 text-lg tracking-tight">FlowGenius</h1>
          <span className="bg-slate-100 text-slate-500 text-xs px-2 py-0.5 rounded-full font-medium border border-slate-200">Visio Clone</span>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-md text-sm font-medium hover:from-violet-700 hover:to-indigo-700 transition-all shadow-sm hover:shadow"
          >
            <Sparkles className="w-4 h-4" />
            AI Generator
          </button>
          
          <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-md border border-transparent hover:border-slate-200 transition-all">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* AI Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 border border-slate-100 transform transition-all scale-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                Generate Diagram with AI
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">What would you like to build?</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="E.g., A flowchart for a user registration process including email verification..."
                  className="w-full h-32 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none text-sm"
                />
              </div>

              <div className="bg-indigo-50 p-3 rounded-md border border-indigo-100">
                <p className="text-xs text-indigo-700">
                  <strong>Note:</strong> Gemini will generate a node structure and attempt to auto-layout the diagram on your canvas. Previous work will be replaced.
                </p>
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="w-full py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Create Diagram'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
