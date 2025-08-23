// types/index.ts
export interface CanvasElement {
  id: number;
  type: "text" | "rectangle" | "circle";
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  content: string;
  color: string;
  fontSize: number;
  zIndex: number;
}

export interface CanvasSize {
  width: number;
  height: number;
}

export type ElementType = "text" | "rectangle" | "circle";

export interface DesignData {
  elements: CanvasElement[];
  canvasSize: CanvasSize;
  exportDate: string;
}
