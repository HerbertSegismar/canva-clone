// components/PropertiesPanel.tsx
import { CanvasElement, CanvasSize } from "@/app/types";

interface PropertiesPanelProps {
  selectedElement: CanvasElement | null;
  updateElement: (id: number, updates: Partial<CanvasElement>) => void;
  canvasSize: CanvasSize;
  setCanvasSize: React.Dispatch<React.SetStateAction<CanvasSize>>;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedElement,
  updateElement,
  canvasSize,
  setCanvasSize,
}) => {
  if (!selectedElement) {
    return (
      <div className="w-64 bg-gray-200 p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Properties</h2>
        <p className="text-gray-500">
          Select an element to edit its properties
        </p>
      </div>
    );
  }

  const handlePositionChange = (axis: "x" | "y", value: string) => {
    const numValue = parseInt(value) || 0;
    updateElement(selectedElement.id, { [axis]: numValue });
  };

  const handleSizeChange = (dimension: "width" | "height", value: string) => {
    const numValue = parseInt(value) || 0;
    updateElement(selectedElement.id, { [dimension]: numValue });
  };

  const handleRotationChange = (value: string) => {
    const rotation = parseInt(value) || 0;
    updateElement(selectedElement.id, { rotation });
  };

  const handleTextChange = (value: string) => {
    updateElement(selectedElement.id, { content: value });
  };

  const handleFontSizeChange = (value: string) => {
    const fontSize = parseInt(value) || 12;
    updateElement(selectedElement.id, { fontSize });
  };

  const handleColorChange = (value: string) => {
    updateElement(selectedElement.id, { color: value });
  };

  return (
    <div className="w-64 bg-gray-200 p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Properties</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Position</label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-xs">X</span>
              <input
                type="number"
                value={selectedElement.x}
                onChange={(e) => handlePositionChange("x", e.target.value)}
                className="w-full px-2 py-1 rounded border"
              />
            </div>
            <div>
              <span className="text-xs">Y</span>
              <input
                type="number"
                value={selectedElement.y}
                onChange={(e) => handlePositionChange("y", e.target.value)}
                className="w-full px-2 py-1 rounded border"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Size</label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-xs">Width</span>
              <input
                type="number"
                value={selectedElement.width}
                onChange={(e) => handleSizeChange("width", e.target.value)}
                className="w-full px-2 py-1 rounded border"
              />
            </div>
            <div>
              <span className="text-xs">Height</span>
              <input
                type="number"
                value={selectedElement.height}
                onChange={(e) => handleSizeChange("height", e.target.value)}
                className="w-full px-2 py-1 rounded border"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Rotation</label>
          <input
            type="range"
            min="0"
            max="360"
            value={selectedElement.rotation}
            onChange={(e) => handleRotationChange(e.target.value)}
            className="w-full"
          />
          <div className="text-right text-xs">{selectedElement.rotation}°</div>
        </div>

        {selectedElement.type === "text" && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">
                Text Content
              </label>
              <input
                type="text"
                value={selectedElement.content}
                onChange={(e) => handleTextChange(e.target.value)}
                className="w-full px-2 py-1 rounded border"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Font Size
              </label>
              <input
                type="number"
                value={selectedElement.fontSize}
                onChange={(e) => handleFontSizeChange(e.target.value)}
                className="w-full px-2 py-1 rounded border"
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Color</label>
          <input
            type="color"
            value={selectedElement.color}
            onChange={(e) => handleColorChange(e.target.value)}
            className="w-full h-8 rounded border"
          />
        </div>
      </div>
    </div>
  );
};

export default PropertiesPanel;
