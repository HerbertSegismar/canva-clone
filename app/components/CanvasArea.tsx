// components/CanvasArea.tsx
import { useCallback } from "react";
import CanvasElement from "./CanvasElement";
import { CanvasElement as CanvasElementType, CanvasSize } from "@/app/types";

interface CanvasAreaProps {
  canvasElements: CanvasElementType[];
  setCanvasElements: React.Dispatch<React.SetStateAction<CanvasElementType[]>>;
  selectedElement: number | null;
  setSelectedElement: React.Dispatch<React.SetStateAction<number | null>>;
  updateElement: (id: number, updates: Partial<CanvasElementType>) => void;
  canvasSize: CanvasSize;
}

const CanvasArea: React.FC<CanvasAreaProps> = ({
  canvasElements,
  selectedElement,
  setSelectedElement,
  updateElement,
  canvasSize,
}) => {
  const handleCanvasClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        setSelectedElement(null);
      }
    },
    [setSelectedElement]
  );

  const moveElement = useCallback(
    (id: number, x: number, y: number) => {
      updateElement(id, { x, y });
    },
    [updateElement]
  );

  const resizeElement = useCallback(
    (id: number, width: number, height: number) => {
      updateElement(id, { width, height });
    },
    [updateElement]
  );

  return (
    <div
      className="bg-white shadow-lg relative"
      style={{ width: canvasSize.width, height: canvasSize.height }}
      onClick={handleCanvasClick}
    >
      {canvasElements.map((element) => (
        <CanvasElement
          key={element.id}
          element={element}
          isSelected={selectedElement === element.id}
          onSelect={() => setSelectedElement(element.id)}
          onMove={moveElement}
          onResize={resizeElement}
        />
      ))}
    </div>
  );
};

export default CanvasArea;
