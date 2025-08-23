"use client"
import { useState, useCallback } from "react";
import Head from "next/head";
import CanvasArea from "./components/CanvasArea";
import Toolbar from "./components/Toolbar";
import ElementsPanel from "./components/ElementsPanel";
import PropertiesPanel from "./components/PropertiesPanel";
import { CanvasElement, CanvasSize, ElementType } from "./types";

export default function Home() {
  const [canvasElements, setCanvasElements] = useState<CanvasElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<number | null>(null);
  const [canvasSize, setCanvasSize] = useState<CanvasSize>({
    width: 800,
    height: 600,
  });

  const addElement = useCallback(
    (elementType: ElementType) => {
      const newElement: CanvasElement = {
        id: Date.now(),
        type: elementType,
        x: 100,
        y: 100,
        width: 100,
        height: 100,
        rotation: 0,
        content: elementType === "text" ? "Sample Text" : "",
        color: elementType === "text" ? "#000000" : "#3B82F6",
        fontSize: 16,
        zIndex: canvasElements.length,
      };
      setCanvasElements((prev) => [...prev, newElement]);
      setSelectedElement(newElement.id);
    },
    [canvasElements.length]
  );

  const updateElement = useCallback(
    (id: number, updates: Partial<CanvasElement>) => {
      setCanvasElements((prev) =>
        prev.map((el) => (el.id === id ? { ...el, ...updates } : el))
      );
    },
    []
  );

  const deleteElement = useCallback((id: number) => {
    setCanvasElements((prev) => prev.filter((el) => el.id !== id));
    setSelectedElement(null);
  }, []);

  const selectedElementData =
    canvasElements.find((el) => el.id === selectedElement) || null;

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Head>
        <title>Canva Clone</title>
        <meta
          name="description"
          content="A simple Canva clone built with Next.js and Tailwind CSS"
        />
      </Head>

      <Toolbar
        canvasSize={canvasSize}
        setCanvasSize={setCanvasSize}
        selectedElement={selectedElement}
        deleteElement={deleteElement}
      />

      <div className="flex flex-1 overflow-hidden">
        <ElementsPanel addElement={addElement} />

        <div className="flex-1 overflow-auto flex items-center justify-center p-4">
          <CanvasArea
            canvasElements={canvasElements}
            setCanvasElements={setCanvasElements}
            selectedElement={selectedElement}
            setSelectedElement={setSelectedElement}
            updateElement={updateElement}
            canvasSize={canvasSize}
          />
        </div>

        <PropertiesPanel
          selectedElement={selectedElementData}
          updateElement={updateElement}
          canvasSize={canvasSize}
          setCanvasSize={setCanvasSize}
        />
      </div>
    </div>
  );
}
