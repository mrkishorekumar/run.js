import { useEffect } from "react";

type Callback = () => Promise<any>;

const useComplieCode = (complieCode: Callback) => {
  useEffect(() => {
    const handleKeyDown = async (event: KeyboardEvent) => {
      const isCtrlOrCmd = event.ctrlKey || event.metaKey;
      const isS = event.key === "r" || event.key === "R";

      if (isCtrlOrCmd && isS) {
        event.preventDefault();
        await complieCode();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [complieCode]);
};

export default useComplieCode;
