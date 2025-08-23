import { useCallback, useState } from "react";
import { toPng } from "html-to-image";
import { saveAs } from "file-saver";
import { CanvasSize, CanvasElement, DesignData } from "@/app/types";

interface ToolbarProps {
  canvasSize: CanvasSize;
  setCanvasSize: React.Dispatch<React.SetStateAction<CanvasSize>>;
  selectedElement: number | null;
  deleteElement: (id: number) => void;
  canvasElements: CanvasElement[];
  setCanvasElements: React.Dispatch<React.SetStateAction<CanvasElement[]>>;
  canvasRef: React.RefObject<HTMLDivElement | null>;

  isElementsPanelOpen: boolean;
  setIsElementsPanelOpen: (open: boolean) => void;
  isPropertiesPanelOpen: boolean;
  setIsPropertiesPanelOpen: (open: boolean) => void;
  isMobile: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({
  canvasSize,
  setCanvasSize,
  selectedElement,
  deleteElement,
  canvasElements,
  setCanvasElements,
  canvasRef,
}) => {

  const [isExporting, setIsExporting] = useState(false);
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
        backgroundColor: "rgba(255, 255, 255, 0)",
        pixelRatio: 2,
      });

      saveAs(dataUrl, "canva-design.png");
    } catch (error) {
      console.error("Error exporting image:", error);
      alert("Failed to export image. Please try again.");
    }
  }, [canvasRef]);


  const exportAsSvg = useCallback(async () => {
    if (canvasRef.current === null) {
      return;
    }

    setIsExporting(true);
    try {
      // Create SVG manually to ensure compatibility with vector applications
      const svgContent = generateSvgContent(canvasElements, canvasSize);
      const blob = new Blob([svgContent], { type: "image/svg+xml" });
      saveAs(blob, "canva-design.svg");
    } catch (error) {
      console.error("Error exporting SVG:", error);
      alert("Failed to export SVG. Please try again.");
    } finally {
      setIsExporting(false);
    }
  }, [canvasRef, canvasElements, canvasSize]);

  const generateSvgContent = (
    elements: CanvasElement[],
    size: CanvasSize
  ): string => {
    const svgHeader = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size.width}" height="${size.height}" viewBox="0 0 ${size.width} ${size.height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="white"/>`;

    const svgElements = elements
      .map((element) => {
        if (!element.visible) return "";

        const transform = element.rotation
          ? `transform="rotate(${element.rotation} ${
              element.x + element.width / 2
            } ${element.y + element.height / 2})"`
          : "";

        switch (element.type) {
          case "rectangle":
            return `  <rect x="${element.x}" y="${element.y}" width="${element.width}" height="${element.height}" fill="${element.color}" ${transform}/>`;
          case "circle":
            return `  <ellipse cx="${element.x + element.width / 2}" cy="${
              element.y + element.height / 2
            }" rx="${element.width / 2}" ry="${element.height / 2}" fill="${
              element.color
            }" ${transform}/>`;
          case "triangle":
            const points = `${element.x + element.width / 2},${element.y} ${
              element.x
            },${element.y + element.height} ${element.x + element.width},${
              element.y + element.height
            }`;
            return `  <polygon points="${points}" fill="${element.color}" ${transform}/>`;
          case "text":
            return `  <text x="${element.x + 10}" y="${
              element.y + element.height / 2 + 5
            }" font-family="Arial" font-size="${element.fontSize}" fill="${
              element.color
            }" ${transform}>${element.content}</text>`;
          default:
            return "";
        }
      })
      .filter(Boolean)
      .join("\n");

    return `${svgHeader}
${svgElements}
</svg>`;
  };

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

          if (designData.elements && designData.canvasSize) {
            // Update the state with the imported data
            setCanvasElements(designData.elements);
            setCanvasSize(designData.canvasSize);
            alert("Design imported successfully!");
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

      event.target.value = "";
    },
    [setCanvasElements, setCanvasSize]
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
            className="w-16 px-2 py-1 text-gray-200 rounded"
          />
          <span className="text-red-400">x</span>
          <input
            type="number"
            value={canvasSize.height}
            onChange={handleHeightChange}
            className="w-16 px-2 py-1 text-gray-200 rounded"
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
            onClick={exportAsSvg}
            disabled={isExporting}
            className="bg-blue-400 hover:bg-blue-500 px-3 py-1 rounded disabled:opacity-50"
            title="Export as SVG"
          >
            {isExporting ? "Exporting..." : "Export SVG"}
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
