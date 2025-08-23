"use client";

import { useState, useCallback, useRef, SetStateAction } from "react";
import Head from "next/head";
import CanvasArea from "./components/CanvasArea";
import Toolbar from "./components/Toolbar";
import ElementsPanel from "./components/ElementsPanel";
import PropertiesPanel from "./components/PropertiesPanel";
import { CanvasElement, CanvasSize, ElementType, DesignData } from "./types";

export default function Home() {
  const [canvasElements, setCanvasElements] = useState<CanvasElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<number | null>(null);
  const [canvasSize, setCanvasSize] = useState<CanvasSize>({
    width: 800,
    height: 600,
  });
  const [isElementsPanelOpen, setIsElementsPanelOpen] = useState(false);
  const [isPropertiesPanelOpen, setIsPropertiesPanelOpen] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const colors = ["#f6be3b", "#3b3bf6", "#f63b3b", "#3bf676"];

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
        color:
          elementType === "text"
            ? "#000000"
            : colors[Math.floor(Math.random() * colors.length)],
        fontSize: 16,
        zIndex: canvasElements.length,
        visible: true,
        locked: false,
      };
      setCanvasElements((prev) => [...prev, newElement]);
      setSelectedElement(newElement.id);

      // Close the elements panel on mobile after adding an element
      if (window.innerWidth < 768) {
        setIsElementsPanelOpen(false);
      }
    },
    [canvasElements.length, colors]
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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Toolbar
        canvasSize={canvasSize}
        setCanvasSize={setCanvasSize}
        selectedElement={selectedElement}
        deleteElement={deleteElement}
        canvasElements={canvasElements}
        setCanvasElements={setCanvasElements}
        canvasRef={canvasRef}
        isElementsPanelOpen={isElementsPanelOpen}
        setIsElementsPanelOpen={setIsElementsPanelOpen}
        isPropertiesPanelOpen={isPropertiesPanelOpen}
        setIsPropertiesPanelOpen={setIsPropertiesPanelOpen}
      />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile overlay for panels */}
        {(isElementsPanelOpen || isPropertiesPanelOpen) && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => {
              setIsElementsPanelOpen(false);
              setIsPropertiesPanelOpen(false);
            }}
          />
        )}

        {/* Elements Panel */}
        <div
          className={`
          ${isElementsPanelOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 fixed md:static left-0 top-0 h-full z-50 
          transition-transform duration-300 ease-in-out
          md:relative md:flex
        `}
        >
          <ElementsPanel addElement={addElement} />
        </div>

        {/* Canvas Area */}
        <div className="flex-1 overflow-auto flex items-center justify-center p-2 md:p-4">
          <CanvasArea
            ref={canvasRef}
            canvasElements={canvasElements}
            setCanvasElements={setCanvasElements}
            selectedElement={selectedElement}
            setSelectedElement={setSelectedElement}
            updateElement={updateElement}
            canvasSize={canvasSize}
          />
        </div>

        {/* Properties Panel */}
        <div
          className={`
          ${isPropertiesPanelOpen ? "translate-x-0" : "translate-x-full"} 
          md:translate-x-0 fixed md:static right-0 top-0 h-full z-50 
          transition-transform duration-300 ease-in-out
          md:relative md:flex
        `}
        >
          <PropertiesPanel
            selectedElement={selectedElementData}
            updateElement={updateElement}
            canvasSize={canvasSize}
            setCanvasSize={setCanvasSize}
            elements={canvasElements}
            setElements={setCanvasElements}
          />
        </div>
      </div>

      {/* Mobile bottom toolbar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2 flex justify-around z-30">
        <button
          className="p-2 rounded-lg bg-blue-500 text-white"
          onClick={() => {
            setIsElementsPanelOpen(true);
            setIsPropertiesPanelOpen(false);
          }}
        >
          Elements
        </button>
        <button
          className="p-2 rounded-lg bg-green-500 text-white"
          onClick={() => {
            setIsPropertiesPanelOpen(true);
            setIsElementsPanelOpen(false);
          }}
        >
          Properties
        </button>
      </div>
    </div>
  );
}
