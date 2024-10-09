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
  const [logs, setLogs] = useState<Message[] | any[]>([]);

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

  const handleRunClick = async () => {
    const code = await onFormatClick(javascriptCode);
    setLogs([]);
    setJavascriptCode(code);
    try {
      const func = new Function(code);
      return func();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <PlaygroundHeader />
      <Split className="split h-88vh w-full flex flex-row" minSize={500}>
        <section className="bg-ideBg 88vh w-full">
          <PlaygroundNavbar codeOption={true} handleRunClick={handleRunClick} />
          <section className="h-81vh w-full">
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
          <PlaygroundNavbar codeOption={false} />
          <div className="h-81vh w-full p-2 bg-outputBg overflow-auto">
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
