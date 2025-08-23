// components/Toolbar.tsx
import { CanvasSize } from "@/app/types";

interface ToolbarProps {
  canvasSize: CanvasSize;
  setCanvasSize: React.Dispatch<React.SetStateAction<CanvasSize>>;
  selectedElement: number | null;
  deleteElement: (id: number) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  canvasSize,
  setCanvasSize,
  selectedElement,
  deleteElement,
}) => {
  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const width = parseInt(e.target.value) || 100;
    setCanvasSize((prev) => ({ ...prev, width }));
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const height = parseInt(e.target.value) || 100;
    setCanvasSize((prev) => ({ ...prev, height }));
  };

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
