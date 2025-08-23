// components/ElementsPanel.tsx
import { ElementType } from "@/app/types";

interface ElementsPanelProps {
  addElement: (elementType: ElementType) => void;
}

const ElementsPanel: React.FC<ElementsPanelProps> = ({ addElement }) => {
  const elementTypes = [
    { type: "text" as ElementType, label: "Text", icon: "T" },
    { type: "rectangle" as ElementType, label: "Rectangle", icon: "□" },
    { type: "circle" as ElementType, label: "Circle", icon: "○" },
  ];

  return (
    <div className="w-64 bg-gray-200 p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Elements</h2>
      <div className="grid grid-cols-2 gap-3">
        {elementTypes.map((item) => (
          <button
            key={item.type}
            onClick={() => addElement(item.type)}
            className="flex flex-col items-center justify-center p-3 bg-white rounded-lg shadow hover:bg-gray-50"
          >
            <span className="text-2xl mb-1">{item.icon}</span>
            <span className="text-sm">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ElementsPanel;
