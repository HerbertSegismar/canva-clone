// components/Toolbar.tsx
import { useCallback } from "react";
import { toPng } from "html-to-image";
import { saveAs } from "file-saver";
import { CanvasSize, CanvasElement, DesignData } from "@/app/types";

interface ToolbarProps {
  canvasSize: CanvasSize;
  setCanvasSize: React.Dispatch<React.SetStateAction<CanvasSize>>;
  selectedElement: number | null;
  deleteElement: (id: number) => void;
  canvasElements: CanvasElement[];
  canvasRef: React.RefObject<HTMLDivElement>;
}

const Toolbar: React.FC<ToolbarProps> = ({
  canvasSize,
  setCanvasSize,
  selectedElement,
  deleteElement,
  canvasElements,
  canvasRef,
}) => {
  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const width = parseInt(e.target.value) || 100;
    setCanvasSize((prev) => ({ ...prev, width }));
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const height = parseInt(e.target.value) || 100;
    setCanvasSize((prev) => ({ ...prev, height }));
  };

  const exportAsImage = useCallback(async () => {
    if (canvasRef.current === null) {
      return;
    }

    try {
      const dataUrl = await toPng(canvasRef.current, {
        backgroundColor: "#ffffff",
        pixelRatio: 2, // Higher quality
      });

      saveAs(dataUrl, "canva-design.png");
    } catch (error) {
      console.error("Error exporting image:", error);
      alert("Failed to export image. Please try again.");
    }
  }, [canvasRef]);

  const exportAsJSON = useCallback(() => {
    const designData: DesignData = {
      elements: canvasElements,
      canvasSize,
      exportDate: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(designData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });

    saveAs(dataBlob, "canva-design.json");
  }, [canvasElements, canvasSize]);

  const importFromJSON = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const designData = JSON.parse(
            e.target?.result as string
          ) as DesignData;

          // Validate the imported data
          if (designData.elements && designData.canvasSize) {
            // You might want to add more validation here
            // For now, we'll just set the state
            // @ts-ignore - We'll need to update the parent state
            // This would require adding a setCanvasElements prop
            console.log("Importing design:", designData);
            alert(
              "Import functionality would be implemented here. Check the console for the imported data."
            );
          } else {
            throw new Error("Invalid design file format");
          }
        } catch (error) {
          console.error("Error parsing design file:", error);
          alert(
            "Failed to import design. The file may be corrupted or in an invalid format."
          );
        }
      };
      reader.readAsText(file);

      // Reset the input to allow importing the same file again
      event.target.value = "";
    },
    []
  );

  return (
    <div className="bg-gray-800 text-white p-2 flex justify-between items-center">
      <div className="text-xl font-bold">Canva Clone</div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <span>Canvas Size:</span>
          <input
            type="number"
            value={canvasSize.width}
            onChange={handleWidthChange}
            className="w-16 px-2 py-1 text-gray-800 rounded"
          />
          <span>x</span>
          <input
            type="number"
            value={canvasSize.height}
            onChange={handleHeightChange}
            className="w-16 px-2 py-1 text-gray-800 rounded"
          />
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={exportAsImage}
            className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded"
            title="Export as PNG"
          >
            Export PNG
          </button>

          <button
            onClick={exportAsJSON}
            className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded"
            title="Export as JSON"
          >
            Export JSON
          </button>

          <label className="bg-purple-500 hover:bg-purple-600 px-3 py-1 rounded cursor-pointer">
            Import JSON
            <input
              type="file"
              accept=".json"
              onChange={importFromJSON}
              className="hidden"
            />
          </label>
        </div>

        {selectedElement !== null && (
          <button
            onClick={() => deleteElement(selectedElement)}
            className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
          >
            Delete Selected
          </button>
        )}
      </div>
    </div>
  );
};

export default Toolbar;
