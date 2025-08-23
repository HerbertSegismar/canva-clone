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
    (
      clientX: number,
      clientY: number,
      startX: number,
      startY: number,
      startElX: number,
      startElY: number
    ) => {
      if (locked) return;

      const dx = clientX - startX;
      const dy = clientY - startY;
      onMove(element.id, startElX + dx, startElY + dy);
    },
    [element.id, onMove, locked]
  );

  const handleDragStart = useCallback(
    (clientX: number, clientY: number) => {
      if (locked) return;

      const startX = clientX;
      const startY = clientY;
      const startElX = element.x;
      const startElY = element.y;

      const handleMove = (moveEvent: MouseEvent | TouchEvent) => {
        let moveX, moveY;

        if (moveEvent instanceof MouseEvent) {
          moveX = moveEvent.clientX;
          moveY = moveEvent.clientY;
        } else {
          moveX = moveEvent.touches[0].clientX;
          moveY = moveEvent.touches[0].clientY;
        }

        handleDrag(moveX, moveY, startX, startY, startElX, startElY);
      };

      const handleEnd = () => {
        document.removeEventListener("mousemove", handleMove);
        document.removeEventListener("touchmove", handleMove);
        document.removeEventListener("mouseup", handleEnd);
        document.removeEventListener("touchend", handleEnd);
      };

      document.addEventListener("mousemove", handleMove);
      document.addEventListener("touchmove", handleMove, { passive: false });
      document.addEventListener("mouseup", handleEnd);
      document.addEventListener("touchend", handleEnd);
    },
    [element.x, element.y, handleDrag, locked]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      onSelect();
      handleDragStart(e.clientX, e.clientY);
    },
    [onSelect, handleDragStart]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      onSelect();
      handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
    },
    [onSelect, handleDragStart]
  );

  const renderElement = () => {
    if (!visible) return null;

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
    (
      clientX: number,
      clientY: number,
      startX: number,
      startY: number,
      startWidth: number,
      startHeight: number
    ) => {
      if (locked) return;

      const dx = clientX - startX;
      const dy = clientY - startY;
      onResize(
        element.id,
        Math.max(20, startWidth + dx),
        Math.max(20, startHeight + dy)
      );
    },
    [element.id, onResize, locked]
  );

  const handleResizeStart = useCallback(
    (clientX: number, clientY: number) => {
      if (locked) return;

      const startX = clientX;
      const startY = clientY;
      const startWidth = element.width;
      const startHeight = element.height;

      const handleMove = (moveEvent: MouseEvent | TouchEvent) => {
        let moveX, moveY;

        if (moveEvent instanceof MouseEvent) {
          moveX = moveEvent.clientX;
          moveY = moveEvent.clientY;
        } else {
          moveX = moveEvent.touches[0].clientX;
          moveY = moveEvent.touches[0].clientY;
          moveEvent.preventDefault(); // Prevent scrolling on touch devices
        }

        handleResize(moveX, moveY, startX, startY, startWidth, startHeight);
      };

      const handleEnd = () => {
        document.removeEventListener("mousemove", handleMove);
        document.removeEventListener("touchmove", handleMove);
        document.removeEventListener("mouseup", handleEnd);
        document.removeEventListener("touchend", handleEnd);
      };

      document.addEventListener("mousemove", handleMove);
      document.addEventListener("touchmove", handleMove, { passive: false });
      document.addEventListener("mouseup", handleEnd);
      document.addEventListener("touchend", handleEnd);
    },
    [element.width, element.height, handleResize, locked]
  );

  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      handleResizeStart(e.clientX, e.clientY);
    },
    [handleResizeStart]
  );

  const handleResizeTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.stopPropagation();
      handleResizeStart(e.touches[0].clientX, e.touches[0].clientY);
    },
    [handleResizeStart]
  );

  if (!visible) return null;

  return (
    <div
      className={`absolute cursor-move ${
        isSelected ? "ring-2 ring-blue-500" : ""
      } ${locked ? "cursor-default" : ""}`}
      style={{
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        transform: `rotate(${element.rotation}deg)`,
        zIndex: element.zIndex,
        pointerEvents: locked ? "none" : "auto",
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {renderElement()}
      {isSelected && !locked && (
        <div
          className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full cursor-se-resize"
          onMouseDown={handleResizeMouseDown}
          onTouchStart={handleResizeTouchStart}
        />
      )}
    </div>
  );
};

export default CanvasElement;
