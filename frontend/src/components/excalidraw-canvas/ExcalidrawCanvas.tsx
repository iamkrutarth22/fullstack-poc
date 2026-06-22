import { Excalidraw, MainMenu } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import { useRef, useMemo, useEffect, useCallback } from "react";

interface InitialData {
  elements?: readonly any[];
  files?: Record<string, any>;
}

type Props = {
  onChange?: (elements: readonly any[], files: Record<string, any>) => void;
  initialData?: InitialData;
};

const ExcalidrawCanvas = ({ onChange, initialData }: Props) => {
  const timeoutRef = useRef<any>(null);
  const prevVersionRef = useRef<number>(0);

  // ✅ Stable initial data (ONLY used on mount)
  const safeInitialData = useMemo(() => {
    return {
      elements: initialData?.elements ?? [],
      files: initialData?.files ?? {},
      appState: {
        collaborators: new Map(),
      },
    };
    }, []);

  const handleChange = useCallback(
    (elements: readonly any[], _appState: any, files: any) => {
      if (!elements.length) return;

      const version = elements.reduce(
        (acc, el: any) => acc + (el.version || 0),
        0
      );

      if (version === prevVersionRef.current) return;

      prevVersionRef.current = version;

      // debounce
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        onChange?.(elements, files);
      }, 500);
    },
    [onChange]
  );

  // ✅ cleanup
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div style={{ width: "100%", height: "450px" }}>
      <Excalidraw
        initialData={safeInitialData}
        onChange={handleChange}
        UIOptions={{
          canvasActions: {
            changeViewBackgroundColor: false,
            clearCanvas: false,
            export: false,
            loadScene: false,
            saveToActiveFile: false,
            saveAsImage: false,
            toggleTheme: false,
          },
          tools: { image: true },
        }}
      >
        <MainMenu />
      </Excalidraw>
    </div>
  );
};

export default ExcalidrawCanvas;