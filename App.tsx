import React, { useState, useRef, useCallback } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  Connection,
  Edge,
  Node,
  ConnectionMode,
} from 'reactflow';
import { Sidebar } from './components/Sidebar';
import { PropertiesPanel } from './components/PropertiesPanel';
import { Header } from './components/Header';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Start Project' },
    position: { x: 250, y: 50 },
    style: { backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '6px', width: 150, padding: 10 },
  },
];

let id = 0;
const getId = () => `dndnode_${id++}`;

const Flow = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, type: 'smoothstep', animated: true }, eds)),
    [setEdges],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow/type');
      const label = event.dataTransfer.getData('application/reactflow/label');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: getId(),
        type,
        position,
        data: { label: label },
        style: { backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', width: 150, padding: 10 },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes],
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  return (
    <div className="flex flex-col h-screen font-sans">
      <Header setNodes={setNodes} setEdges={setEdges} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <div className="flex-1 h-full relative bg-slate-50" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            connectionMode={ConnectionMode.Loose}
            fitView
          >
            <Controls className="bg-white border border-slate-200 shadow-sm p-1" />
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} color="#cbd5e1" />
          </ReactFlow>
        </div>

        <PropertiesPanel selectedNode={selectedNode} setNodes={setNodes} />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}
