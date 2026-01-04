import { Node, Edge } from 'reactflow';

export enum NodeType {
  INPUT = 'input',
  DEFAULT = 'default',
  OUTPUT = 'output',
}

// Represents the structure expected from Gemini AI
export interface GeneratedDiagramData {
  nodes: {
    id: string;
    type: string;
    label: string; // We map this to data.label
    x: number;
    y: number;
    description?: string;
  }[];
  edges: {
    id: string;
    source: string;
    target: string;
    label?: string;
  }[];
}

export interface AppState {
  nodes: Node[];
  edges: Edge[];
}
