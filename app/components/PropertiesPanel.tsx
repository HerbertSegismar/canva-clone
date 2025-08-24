import { CanvasElement, CanvasSize } from "@/app/types";
import { useState } from "react";
import { Eye, EyeSlash } from "../Icons/EyeIcons";

interface PropertiesPanelProps {
  selectedElement:
    | (CanvasElement & { visible?: boolean; locked?: boolean })
    | null;
  updateElement: (id: number, updates: Partial<CanvasElement>) => void;
  canvasSize: CanvasSize;
  setCanvasSize: React.Dispatch<React.SetStateAction<CanvasSize>>;
  elements: CanvasElement[];
  setElements: React.Dispatch<React.SetStateAction<CanvasElement[]>>;
  isMobile: boolean;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedElement,
  updateElement,
  canvasSize,
  setCanvasSize,
  elements = [], // Default to empty array
  setElements,
}) => {
  const [activeTab, setActiveTab] = useState<"properties" | "layers">(
    "properties"
  );

  // Function to reorder elements in the layers panel
  const moveElement = (id: number, direction: "up" | "down") => {
    if (!elements || elements.length === 0) return; // Add null check

    const index = elements.findIndex((el) => el.id === id);
    if (index === -1) return;

    if (direction === "up" && index > 0) {
      const newElements = [...elements];
      [newElements[index - 1], newElements[index]] = [
        newElements[index],
        newElements[index - 1],
      ];
      setElements(newElements);
    } else if (direction === "down" && index < elements.length - 1) {
      const newElements = [...elements];
      [newElements[index], newElements[index + 1]] = [
        newElements[index + 1],
        newElements[index],
      ];
      setElements(newElements);
    }
  };

  // Function to toggle element visibility
  const toggleVisibility = (id: number) => {
    if (!elements || elements.length === 0) return; // Add null check

    const element = elements.find((el) => el.id === id);
    if (element) {
      updateElement(id, { visible: !element.visible });
    }
  };

  // Function to toggle element lock status
  const toggleLock = (id: number) => {
    if (!elements || elements.length === 0) return; // Add null check

    const element = elements.find((el) => el.id === id);
    if (element) {
      updateElement(id, { locked: !element.locked });
    }
  };

  const handlePositionChange = (axis: "x" | "y", value: string) => {
    if (!selectedElement) return;
    const numValue = parseInt(value) || 0;
    updateElement(selectedElement.id, { [axis]: numValue });
  };

  const handleSizeChange = (dimension: "width" | "height", value: string) => {
    if (!selectedElement) return;
    const numValue = parseInt(value) || 0;
    updateElement(selectedElement.id, { [dimension]: numValue });
  };

  const handleRotationChange = (value: string) => {
    if (!selectedElement) return;
    const rotation = parseInt(value) || 0;
    updateElement(selectedElement.id, { rotation });
  };

  const handleTextChange = (value: string) => {
    if (!selectedElement) return;
    updateElement(selectedElement.id, { content: value });
  };

  const handleFontSizeChange = (value: string) => {
    if (!selectedElement) return;
    const fontSize = parseInt(value) || 12;
    updateElement(selectedElement.id, { fontSize });
  };

  const handleColorChange = (value: string) => {
    if (!selectedElement) return;
    updateElement(selectedElement.id, { color: value });
  };

  const handleVisibilityChange = () => {
    if (!selectedElement) return;
    updateElement(selectedElement.id, {
      visible: !(selectedElement.visible ?? true),
    });
  };

  const handleLockChange = () => {
    if (!selectedElement) return;
    updateElement(selectedElement.id, {
      locked: !(selectedElement.locked ?? false),
    });
  };

  return (
    <div className="w-76 bg-black/95 p-4 overflow-y-auto text-slate-200">
      <div className="flex border-b mb-4">
        <button
          className={`flex-1 py-2 text-center ${
            activeTab === "properties"
              ? "border-b-2 border-blue-500 font-medium"
              : ""
          }`}
          onClick={() => setActiveTab("properties")}
        >
          Properties
        </button>
        <button
          className={`flex-1 py-2 text-center ${
            activeTab === "layers"
              ? "border-b-2 border-blue-500 font-medium"
              : ""
          }`}
          onClick={() => setActiveTab("layers")}
        >
          Layers
        </button>
      </div>

      {activeTab === "properties" ? (
        <>
          <h2 className="text-lg font-semibold mb-4">Properties</h2>

          {!selectedElement ? (
            <>
              <p className="text-gray-200">
                Select an element to edit its properties
              </p>

              <div className="mt-6">
                <h3 className="text-md font-semibold mb-2">
                  Canvas Properties
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Width
                    </label>
                    <input
                      type="number"
                      value={canvasSize.width}
                      onChange={(e) =>
                        setCanvasSize({
                          ...canvasSize,
                          width: parseInt(e.target.value) || 100,
                        })
                      }
                      className="w-full px-2 py-1 rounded border"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Height
                    </label>
                    <input
                      type="number"
                      value={canvasSize.height}
                      onChange={(e) =>
                        setCanvasSize({
                          ...canvasSize,
                          height: parseInt(e.target.value) || 100,
                        })
                      }
                      className="w-full px-2 py-1 rounded border"
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Visibility</span>
                <button
                  onClick={handleVisibilityChange}
                  className="p-1 text-gray-200"
                  title={selectedElement.visible ? "Hide" : "Show"}
                >
                  {selectedElement.visible ? (
                    <Eye/>
                  ) : (
                    <EyeSlash/>
                  )}
                </button>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Lock</span>
                <button
                  onClick={handleLockChange}
                  className="p-1 text-gray-700"
                  title={selectedElement.locked ? "Unlock" : "Lock"}
                >
                  {selectedElement.locked ? "🔒" : "🔓"}
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Position
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-xs">X</span>
                    <input
                      type="number"
                      value={selectedElement.x}
                      onChange={(e) =>
                        handlePositionChange("x", e.target.value)
                      }
                      className="w-full px-2 py-1 rounded border"
                      disabled={selectedElement.locked}
                    />
                  </div>
                  <div>
                    <span className="text-xs">Y</span>
                    <input
                      type="number"
                      value={selectedElement.y}
                      onChange={(e) =>
                        handlePositionChange("y", e.target.value)
                      }
                      className="w-full px-2 py-1 rounded border"
                      disabled={selectedElement.locked}
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
                      onChange={(e) =>
                        handleSizeChange("width", e.target.value)
                      }
                      className="w-full px-2 py-1 rounded border"
                      disabled={selectedElement.locked}
                    />
                  </div>
                  <div>
                    <span className="text-xs">Height</span>
                    <input
                      type="number"
                      value={selectedElement.height}
                      onChange={(e) =>
                        handleSizeChange("height", e.target.value)
                      }
                      className="w-full px-2 py-1 rounded border"
                      disabled={selectedElement.locked}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Rotation
                </label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={selectedElement.rotation || 0}
                  onChange={(e) => handleRotationChange(e.target.value)}
                  className="w-full"
                  disabled={selectedElement.locked}
                />
                <div className="text-right text-xs">
                  {selectedElement.rotation || 0}°
                </div>
              </div>

              {selectedElement.type === "text" && (
                <div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Text Content
                    </label>
                    <input
                      type="text"
                      value={selectedElement.content || ""}
                      onChange={(e) => handleTextChange(e.target.value)}
                      className="w-full px-2 py-1 rounded border"
                      disabled={selectedElement.locked}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Font Size
                    </label>
                    <input
                      type="number"
                      value={selectedElement.fontSize || 16}
                      onChange={(e) => handleFontSizeChange(e.target.value)}
                      className="w-full px-2 py-1 rounded border"
                      disabled={selectedElement.locked}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">Color</label>
                <input
                  type="color"
                  value={selectedElement.color || "#000000"}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="w-full h-8 rounded border"
                  disabled={selectedElement.locked}
                />
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <h2 className="text-lg font-semibold mb-4">Layers</h2>
          {!elements || elements.length === 0 ? (
            <p className="text-gray-500">No elements on canvas</p>
          ) : (
            <div className="space-y-2">
              {elements.map((element, index) => (
                <div
                  key={element.id}
                  className={`p-2 rounded flex items-center justify-between ${
                    selectedElement?.id === element.id
                      ? "bg-slate-700 border-blue-300"
                      : "bg-slate-900"
                  }`}
                >
                  <div className="flex items-center">
                    <div
                      className="w-4 h-4 rounded-sm mr-2"
                      style={{ backgroundColor: element.color || "#000000" }}
                    ></div>
                    <span className="text-sm truncate">{element.type}</span>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => moveElement(element.id, "up")}
                      disabled={index === 0}
                      className="text-gray-500 hover:text-gray-700 disabled:opacity-30"
                      title="Move Up"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveElement(element.id, "down")}
                      disabled={index === elements.length - 1}
                      className="text-gray-500 hover:text-gray-700 disabled:opacity-30"
                      title="Move Down"
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => toggleVisibility(element.id)}
                      className="text-gray-200 hover:text-gray-400"
                      title={element.visible ? "Hide" : "Show"}
                    >
                      {element.visible ? <Eye/> : <EyeSlash/>}
                    </button>
                    <button
                      onClick={() => toggleLock(element.id)}
                      className="text-gray-200 hover:text-gray-400"
                      title={element.locked ? "Unlock" : "Lock"}
                    >
                      {element.locked ? "🔒" : "🔓"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PropertiesPanel;
