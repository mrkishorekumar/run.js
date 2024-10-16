import { useEffect } from "react";

const saveFile = (javascriptCode: string) => {
  const fileName = "runjs.js";
  const fileContent = javascriptCode;
  const blob = new Blob([fileContent], { type: "text/javascript" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(link.href);
};

const useSaveFileShortcut = (callbackFunction: () => Promise<void>) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isCtrlOrCmd = event.ctrlKey || event.metaKey;
      const isS = event.key === "s" || event.key === "S";

      if (isCtrlOrCmd && isS) {
        event.preventDefault();
        callbackFunction();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [callbackFunction]);
};

export default useSaveFileShortcut;
