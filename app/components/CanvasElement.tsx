// components/CanvasElement.tsx
import { useCallback } from "react";
import { CanvasElement as CanvasElementType } from "@/app/types";

interface CanvasElementProps {
  element: CanvasElementType;
  isSelected: boolean;
  onSelect: () => void;
  onMove: (id: number, x: number, y: number) => void;
  onResize: (id: number, width: number, height: number) => void;
}

const CanvasElement: React.FC<CanvasElementProps> = ({
  element,
  isSelected,
  onSelect,
  onMove,
  onResize,
}) => {
  const handleDrag = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (e.buttons !== 1) return; // Only if left mouse button is pressed

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
    [element.id, element.x, element.y, onMove]
  );

  const renderElement = () => {
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
    [element.id, element.width, element.height, onResize]
  );

  return (
    <div
      className={`absolute cursor-move ${
        isSelected ? "ring-2 ring-blue-500" : ""
      }`}
      style={{
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        transform: `rotate(${element.rotation}deg)`,
        zIndex: element.zIndex,
      }}
      onMouseDown={(e) => {
        onSelect();
        handleDrag(e);
      }}
    >
      {renderElement()}
      {isSelected && (
        <div
          className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full cursor-se-resize"
          onMouseDown={handleResize}
        />
      )}
    </div>
  );
};

export default CanvasElement;
