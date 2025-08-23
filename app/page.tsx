"use client";

import { useState, useCallback, useRef, useEffect } from "react";
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
  const [isElementsPanelOpen, setIsElementsPanelOpen] = useState(false);
  const [isPropertiesPanelOpen, setIsPropertiesPanelOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const colors = ["#f6be3b", "#3b3bf6", "#f63b3b", "#3bf676"];

  // Check if device is mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);

      // Adjust canvas size for mobile
      if (window.innerWidth < 768) {
        setCanvasSize({
          width: Math.min(800, window.innerWidth - 40),
          height: Math.min(500, window.innerHeight - 200),
        });
      }
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  const addElement = useCallback(
    (elementType: ElementType) => {
      const newElement: CanvasElement = {
        id: Date.now(),
        type: elementType,
        x: 50,
        y: 50,
        width: isMobile ? 80 : 100,
        height: isMobile ? 80 : 100,
        rotation: 0,
        content: elementType === "text" ? "Sample Text" : "",
        color:
          elementType === "text"
            ? "#000000"
            : colors[Math.floor(Math.random() * colors.length)],
        fontSize: isMobile ? 14 : 16,
        zIndex: canvasElements.length,
        visible: true,
        locked: false,
      };
      setCanvasElements((prev) => [...prev, newElement]);
      setSelectedElement(newElement.id);

      // Close the elements panel on mobile after adding an element
      if (isMobile) {
        setIsElementsPanelOpen(false);
      }
    },
    [canvasElements.length, colors, isMobile]
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
    <div className="h-screen flex flex-col bg-gray-100 overflow-hidden">
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
        isMobile={isMobile}
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
          md:relative md:flex w-64 md:w-48 lg:w-64
        `}
        >
          <ElementsPanel addElement={addElement} isMobile={isMobile} />
        </div>

        {/* Canvas Area - Made larger on mobile */}
        <div className="flex-1 overflow-auto flex items-center justify-center p-1 md:p-2">
          <CanvasArea
            ref={canvasRef}
            canvasElements={canvasElements}
            setCanvasElements={setCanvasElements}
            selectedElement={selectedElement}
            setSelectedElement={setSelectedElement}
            updateElement={updateElement}
            canvasSize={canvasSize}
            isMobile={isMobile}
          />
        </div>

        {/* Properties Panel */}
        <div
          className={`
          ${isPropertiesPanelOpen ? "translate-x-0" : "translate-x-full"} 
          md:translate-x-0 fixed md:static right-0 top-0 h-full z-50 
          transition-transform duration-300 ease-in-out
          md:relative md:flex w-64 md:w-48 lg:w-64
        `}
        >
          <PropertiesPanel
            selectedElement={selectedElementData}
            updateElement={updateElement}
            canvasSize={canvasSize}
            setCanvasSize={setCanvasSize}
            elements={canvasElements}
            setElements={setCanvasElements}
            isMobile={isMobile}
          />
        </div>
      </div>

      {/* Mobile bottom toolbar */}
      {isMobile && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2 flex justify-around z-30">
          <button
            className="p-2 rounded-lg bg-blue-500 text-white text-xs"
            onClick={() => {
              setIsElementsPanelOpen(true);
              setIsPropertiesPanelOpen(false);
            }}
          >
            Elements
          </button>
          <button
            className="p-2 rounded-lg bg-green-500 text-white text-xs"
            onClick={() => {
              setIsPropertiesPanelOpen(true);
              setIsElementsPanelOpen(false);
            }}
          >
            Properties
          </button>
        </div>
      )}
    </div>
  );
}
