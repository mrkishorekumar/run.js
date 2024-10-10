import { useEffect } from "react";

type Callback = () => void;

const useAdjustFontSize = (onZoomIn: Callback, onZoomOut: Callback) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isCtrl = event.ctrlKey || event.metaKey;
      const isPlus = event.key === "+" || event.key === "=";
      const isMinus = event.key === "-";

      if (isCtrl && isPlus) {
        event.preventDefault();
        onZoomIn();
      }

      if (isCtrl && isMinus) {
        event.preventDefault();
        onZoomOut();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onZoomIn, onZoomOut]);
};

export default useAdjustFontSize;
