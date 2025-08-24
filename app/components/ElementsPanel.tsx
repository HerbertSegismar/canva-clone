import { ElementType } from "@/app/types";
import { Ellipse, Rect, Tris, T, Segment, Tip, Sector } from "../Icons/Icons";

interface ElementsPanelProps {
  addElement: (elementType: ElementType) => void;
  isMobile: boolean;
}

const ElementsPanel: React.FC<ElementsPanelProps> = ({ addElement }) => {
  const elementTypes = [
    { type: "text" as ElementType, label: "Text", icon: <T /> },
    { type: "rectangle" as ElementType, label: "Rect", icon: <Rect /> },
    { type: "circle" as ElementType, label: "Ellipse", icon: <Ellipse /> },
    { type: "triangle" as ElementType, label: "Tris", icon: <Tris /> },
    { type: "tip" as ElementType, label: "Tip", icon: <Tip /> },
    { type: "segment" as ElementType, label: "Seg", icon: <Segment /> },
    { type: "sector" as ElementType, label: "Sect", icon: <Sector /> },
  ];

  return (
    <div className="w-24 bg-black/95 p-4 overflow-y-auto">
      <h2 className="text-lg text-slate-200 font-semibold mb-4">Elements</h2>
      <div className="grid grid-cols-1 gap-2">
        {elementTypes.map((item) => (
          <button
            key={item.type}
            onClick={() => addElement(item.type)}
            className="flex flex-col items-center justify-center p-1 text-slate-100 text-xs font-light bg-slate-600 rounded-sm shadow hover:bg-slate-800 transition-colors"
          >
            <div className="text-2xl mb-1 w-1/2">{item.icon}</div>
            <span className="text-sm">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ElementsPanel;
