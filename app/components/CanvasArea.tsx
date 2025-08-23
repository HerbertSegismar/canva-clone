import { useCallback, forwardRef } from "react";
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

const CanvasArea = forwardRef<HTMLDivElement, CanvasAreaProps>(
  (
    {
      canvasElements,
      setCanvasElements,
      selectedElement,
      setSelectedElement,
      updateElement,
      canvasSize,
    },
    ref
  ) => {
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
        const element = canvasElements.find((el) => el.id === id);
        if (element && !element.locked) {
          updateElement(id, { x, y });
        }
      },
      [updateElement, canvasElements]
    );

    const resizeElement = useCallback(
      (id: number, width: number, height: number) => {
        const element = canvasElements.find((el) => el.id === id);
        if (element && !element.locked) {
          updateElement(id, { width, height });
        }
      },
      [updateElement, canvasElements]
    );

    const toggleElementVisibility = useCallback(
      (id: number) => {
        const element = canvasElements.find((el) => el.id === id);
        if (element) {
          updateElement(id, { visible: !element.visible });
        }
      },
      [updateElement, canvasElements]
    );

    const toggleElementLock = useCallback(
      (id: number) => {
        const element = canvasElements.find((el) => el.id === id);
        if (element) {
          updateElement(id, { locked: !element.locked });
          // Deselect when locking to prevent interaction with locked element
          if (selectedElement === id && !element.locked) {
            setSelectedElement(null);
          }
        }
      },
      [updateElement, canvasElements, selectedElement, setSelectedElement]
    );

    return (
      <div className="flex flex-col items-center p-4 bg-gray-100 rounded-lg">
        <div className="mb-4 flex space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm">Visible</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-sm">Locked</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            <span className="text-sm">Hidden</span>
          </div>
        </div>

        <div
          ref={ref}
          className="bg-white shadow-lg relative border border-gray-300"
          style={{ width: canvasSize.width, height: canvasSize.height }}
          onClick={handleCanvasClick}
        >
          {canvasElements.map((element) => (
            <CanvasElement
              key={element.id}
              element={element}
              isSelected={selectedElement === element.id}
              onSelect={() =>
                element.visible &&
                !element.locked &&
                setSelectedElement(element.id)
              }
              onMove={moveElement}
              onResize={resizeElement}
              visible={element.visible ?? true}
              locked={element.locked ?? false}
              // These props will need to be added to the CanvasElement component
              onToggleVisibility={() => toggleElementVisibility(element.id)}
              onToggleLock={() => toggleElementLock(element.id)}
            />
          ))}
        </div>

        <div className="mt-4 text-sm text-gray-600 text-center">
          <p>Click on an element to select it. Right-click for options.</p>
          <p>Drag to move, use handles to resize.</p>
        </div>
      </div>
    );
  }
);

CanvasArea.displayName = "CanvasArea";

export default CanvasArea;
