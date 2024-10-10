"use client";

import PlaygroundHeader from "@/components/PlaygroundHeader";
import PlaygroundNavbar from "@/components/PlaygroundNavbar";
import useLocalStorageState from "@/hooks/useLocalStorageState";
import { consoleTheme } from "@/utils/consoleTheme";
import { onFormatClick } from "@/utils/onFormatClick";
import { Editor } from "@monaco-editor/react";
import { Console, Hook, Unhook } from "console-feed";
import { Message } from "console-feed/lib/definitions/Component";
import { emmetJSX } from "emmet-monaco-es";
import React, { useEffect, useState } from "react";
import Split from "react-split";

function Home() {
  const [javascriptCode, setJavascriptCode] = useLocalStorageState(
    "jscode",
    `
// Free Online Javascript Complier
// Write, Edit and Run your Javascript code using JS Online Compiler

console.log("Try RunJs.in");
    `,
  );
  const [fontSize, setFontSize] = useLocalStorageState("font", 16);
  {/* "@ts-expect-error" */ }
  const [logs, setLogs] = useState<Message[] | any[]>([]);
  const [fullScreen, setFullScreen] = useState(false);

  function toggleFullScreen() {
    setFullScreen((prev) => !prev);
  }

  function captureConsoleFunction() {
    const hookedConsole = Hook(
      window.console,
      (log) => setLogs((currLogs) => [...currLogs, log]),
      false,
    );
    return () => Unhook(hookedConsole);
  }

  useEffect(() => {
    const cleanup = captureConsoleFunction();
    return () => {
      cleanup();
    };
  }, []);

  async function formatCodeFunction() {
    const code = await onFormatClick(javascriptCode);
    setJavascriptCode(code);
    return code;
  }

  function clearAllConsoleLogs() {
    setLogs([]);
  }

  const handleRunClick = async () => {
    clearAllConsoleLogs();
    const code = await formatCodeFunction();
    try {
      const func = new Function(code);
      return func();
    } catch (error) {
      console.log(error);
    }
  };

  const increaseFontSize = () => {
    setFontSize(parseInt(fontSize) + 1);
  };

  const decreaseFontSize = () => {
    setFontSize(parseInt(fontSize) - 2);
  };

  return (
    <>
      <PlaygroundHeader fullScreen={fullScreen} />
      <Split
        className={`split h-${fullScreen ? "93" : "88"}vh w-full flex flex-row`}
        minSize={550}
      >
        <section className="bg-ideBg w-full">
          <PlaygroundNavbar
            fullScreen={fullScreen}
            increaseFontSize={increaseFontSize}
            decreaseFontSize={decreaseFontSize}
            codeOption={true}
            handleRunClick={handleRunClick}
            formatCodeFunction={formatCodeFunction}
            toggleFullScreen={toggleFullScreen}
          />
          <section className={`${fullScreen ? "h-86vh" : "h-81vh"} w-full`}>
            <Editor
              height="100%"
              theme={"vs-dark"}
              language={"javascript"}
              value={javascriptCode}
              beforeMount={(monaco) => emmetJSX(monaco, ["javascript"])}
              onChange={(value) => setJavascriptCode(value)}
              options={{ fontSize: fontSize }}
            />
          </section>
        </section>
        <section className="bg-outputBg">
          <PlaygroundNavbar
            fullScreen={fullScreen}
            codeOption={false}
            clearAllConsoleLogs={clearAllConsoleLogs}
          />
          <div
            className={`${fullScreen ? "h-86vh" : "h-81vh"} w-full p-2 bg-outputBg overflow-auto`}
          >
            <Console
              logs={logs}
              variant="dark"
              styles={{ BASE_FONT_SIZE: fontSize, ...consoleTheme }}
            />
          </div>
        </section>
      </Split>
    </>
  );
}

export default Home;
