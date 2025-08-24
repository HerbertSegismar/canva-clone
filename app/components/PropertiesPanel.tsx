import { CanvasElement, CanvasSize } from "@/app/types";
import { useState } from "react";
import { Eye, EyeSlash, Pencil, Check, X } from "../Icons/EyeIcons";

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
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState<string>("");

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

  // Function to start editing an element's name
  const startEditing = (id: number, currentName: string) => {
    setEditingId(id);
    setEditName(currentName);
  };

  // Function to save the edited name
  const saveEdit = (id: number) => {
    if (editName.trim() === "") return; // Don't save empty names

    updateElement(id, { name: editName.trim() });
    setEditingId(null);
    setEditName("");
  };

  // Function to cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
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
    // Ensure rotation is between 0-360 degrees
    let rotation = parseInt(value) || 0;
    rotation = Math.max(0, Math.min(360, rotation)); // Clamp between 0-360
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
                    <label
                      className="block text-sm font-medium mb-1"
                      aria-labelledby="CanvasSizeX"
                    >
                      Width
                    </label>
                    <input
                      type="number"
                      name="CanvasSizeX"
                      value={canvasSize.width}
                      onChange={(e) =>
                        setCanvasSize({
                          ...canvasSize,
                          width: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-2 py-1 rounded border"
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      aria-labelledby="CanvasSizeY"
                    >
                      Height
                    </label>
                    <input
                      type="number"
                      name="CanvasSizeY"
                      value={canvasSize.height}
                      onChange={(e) =>
                        setCanvasSize({
                          ...canvasSize,
                          height: parseInt(e.target.value) || 0,
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
                  {selectedElement.visible ? <Eye /> : <EyeSlash />}
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
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={selectedElement.rotation || 0}
                    onChange={(e) => handleRotationChange(e.target.value)}
                    className="flex-1"
                    disabled={selectedElement.locked}
                  />
                  <input
                    type="number"
                    min="0"
                    max="360"
                    value={selectedElement.rotation || 0}
                    onChange={(e) => handleRotationChange(e.target.value)}
                    className="w-16 px-2 py-1 rounded border"
                    disabled={selectedElement.locked}
                  />
                  <span className="text-xs">°</span>
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
                  className={`group p-2 rounded flex items-center justify-between ${
                    selectedElement?.id === element.id
                      ? "bg-slate-700 border-blue-300"
                      : "bg-slate-900"
                  }`}
                >
                  <div className="flex items-center flex-1">
                    <div
                      className="size-2 rounded-xs mr-2"
                      style={{ backgroundColor: element.color || "#000000" }}
                    ></div>

                    {editingId === element.id ? (
                      <div className="flex items-center flex-1">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="flex-1 px-1 py-0.5 text-sm rounded border bg-slate-800 text-white"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveEdit(element.id);
                            if (e.key === "Escape") cancelEdit();
                          }}
                        />
                        <button
                          onClick={() => saveEdit(element.id)}
                          className="ml-1 text-green-500 hover:text-green-400"
                          title="Save"
                        >
                          <Check size={14} />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="ml-1 text-red-500 hover:text-red-400"
                          title="Cancel"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center flex-1">
                        <span className="text-sm truncate flex-1">
                          {element.name || element.type}
                        </span>
                        <button
                          onClick={() =>
                            startEditing(
                              element.id,
                              element.name || element.type
                            )
                          }
                          className="ml-1 opacity-200 group-hover:opacity-300 text-gray-500 hover:text-gray-400 px-2"
                          title="Rename"
                        >
                          <Pencil size={16} />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-1">
                    <button
                      onClick={() => moveElement(element.id, "up")}
                      disabled={index === 0}
                      className="text-gray-200 hover:text-gray-400 disabled:opacity-30 text-xl px-1"
                      title="Move Up"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveElement(element.id, "down")}
                      disabled={index === elements.length - 1}
                      className="text-gray-200 hover:text-gray-400 disabled:opacity-30 text-xl px-1"
                      title="Move Down"
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => toggleVisibility(element.id)}
                      className="text-gray-200 hover:text-gray-400"
                      title={element.visible ? "Hide" : "Show"}
                    >
                      {element.visible ? <Eye /> : <EyeSlash />}
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
