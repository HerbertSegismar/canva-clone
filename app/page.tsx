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
    width: 1000,
    height: 800,
  });

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
      } else {
        setCanvasSize({
          width: Math.max(800, window.innerWidth - 40),
          height: Math.max(500, window.innerHeight - 200),
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
        x: canvasSize.width / 2 - 45,
        y: canvasSize.height / 2 - 45,
        width: isMobile ? 80 : 100,
        height: isMobile ? 80 : 100,
        rotation: 0,
        content: elementType === "text" ? "Sample Text" : "",
        color: elementType === "text"
          ? "#000000"
          : colors[Math.floor(Math.random() * colors.length)],
        fontSize: isMobile ? 14 : 16,
        zIndex: canvasElements.length,
        visible: true,
        locked: false,
        name: ""
      };
      setCanvasElements((prev) => [...prev, newElement]);
      setSelectedElement(newElement.id);
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
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Head>
        <title>CanviX.io</title>
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

      />

      <div className="flex flex-1 flex-col md:flex-row overflow-hidden relative">
        {/* Desktop Elements Panel */}
        <div className="hidden md:flex w-24">
          <ElementsPanel addElement={addElement} isMobile={isMobile} />
        </div>

        {/* Canvas Area */}
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

        {/* Desktop Properties Panel */}
        <div className="hidden md:flex md:w-48 lg:w-76">
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

        {/* Mobile Panels Below Canvas - Always Visible */}
        {isMobile && (
          <div className="w-full flex md:flex-row border-t border-gray-200">
            <div className="w-1/3 h-64 overflow-auto">
              <ElementsPanel addElement={addElement} isMobile={isMobile} />
            </div>
            <div className="w-full md:w-1/2 h-64 overflow-auto border-t md:border-t-0 md:border-l border-gray-200">
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
        )}
      </div>
    </div>
  );
}
