// components/CanvasElement.tsx
import { useCallback } from "react";
import { CanvasElement as CanvasElementType } from "@/app/types";

interface CanvasElementProps {
  element: CanvasElementType;
  isSelected: boolean;
  onSelect: () => void;
  onMove: (id: number, x: number, y: number) => void;
  onResize: (id: number, width: number, height: number) => void;
  visible: boolean;
  locked: boolean;
  onToggleVisibility: () => void;
  onToggleLock: () => void;
}

const CanvasElement: React.FC<CanvasElementProps> = ({
  element,
  isSelected,
  onSelect,
  onMove,
  onResize,
  visible,
  locked,
}) => {
  const handleDrag = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (locked || e.buttons !== 1) return; // Prevent drag if locked

      const startX = e.clientX;
      const startY = e.clientY;
      const startElX = element.x;
      const startElY = element.y;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const dx = moveEvent.clientX - startX;
        const dy = moveEvent.clientY - startY;
        onMove(element.id, startElX + dx, startElY + dy);
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [element.id, element.x, element.y, onMove, locked] // Add locked dependency
  );

  const renderElement = () => {
    if (!visible) return null; // Hide element if not visible

    switch (element.type) {
      case "text":
        return (
          <div
            className="h-full w-full outline-none flex items-center justify-center p-2"
            style={{
              color: element.color,
              fontSize: `${element.fontSize}px`,
              fontFamily: "Arial, sans-serif",
            }}
          >
            {element.content}
          </div>
        );
      case "rectangle":
        return (
          <div
            className="h-full w-full"
            style={{ backgroundColor: element.color }}
          />
        );
      case "triangle":
        return (
          <div
            className="h-full w-full"
            style={{
              backgroundColor: element.color,
              clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
            }}
          />
        );
      case "circle":
        return (
          <div
            className="h-full w-full rounded-full"
            style={{ backgroundColor: element.color }}
          />
        );
      default:
        return null;
    }
  };

  const handleResize = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (locked) return; // Prevent resize if locked

      const startX = e.clientX;
      const startY = e.clientY;
      const startWidth = element.width;
      const startHeight = element.height;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const dx = moveEvent.clientX - startX;
        const dy = moveEvent.clientY - startY;
        onResize(
          element.id,
          Math.max(20, startWidth + dx),
          Math.max(20, startHeight + dy)
        );
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [element.id, element.width, element.height, onResize, locked] // Add locked dependency
  );

  // Return null if element is not visible
  if (!visible) return null;

  return (
    <div
      className={`absolute cursor-move ${
        isSelected ? "ring-2 ring-blue-500" : ""
      } ${locked ? "cursor-default" : ""}`} // Change cursor for locked elements
      style={{
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        transform: `rotate(${element.rotation}deg)`,
        zIndex: element.zIndex,
        pointerEvents: locked ? "none" : "auto", // Disable mouse events when locked
      }}
      onMouseDown={(e) => {
        onSelect();
        if (!locked) {
          handleDrag(e);
        }
      }}
    >
      {renderElement()}
      {isSelected &&
        !locked && ( // Only show resize handle if selected and not locked
          <div
            className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full cursor-se-resize"
            onMouseDown={handleResize}
          />
        )}
    </div>
  );
};

export default CanvasElement;
