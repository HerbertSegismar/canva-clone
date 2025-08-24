// types/index.ts
export interface CanvasElement {
  id: number;
  type: "text" | "rectangle" | "triangle" | "circle" | "segment" | "tip" | "sector";
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  content: string;
  color: string;
  fontSize: number;
  zIndex: number;
  visible: boolean;
  locked: boolean;
  name: string;
}

export interface CanvasSize {
  width: number;
  height: number;
}

export type ElementType = "text" | "rectangle" | "circle" | "triangle";

export interface DesignData {
  elements: CanvasElement[];
  canvasSize: CanvasSize | null;
  exportDate: string;
}
