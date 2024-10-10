"use client";

import HelpModal from "@/components/HelpModal";
import PlaygroundHeader from "@/components/PlaygroundHeader";
import PlaygroundNavbar from "@/components/PlaygroundNavbar";
import useAdjustFontSize from "@/hooks/useAdjustFontSize";
import useComplieCode from "@/hooks/useComplieCode";
import useLocalStorageState from "@/hooks/useLocalStorageState";
import useSaveFileShortcut from "@/hooks/useSaveFileShortcut";
import { consoleTheme } from "@/utils/consoleTheme";
import { onFormatClick } from "@/utils/onFormatClick";
import { Editor } from "@monaco-editor/react";
import { Console, Hook, Unhook } from "console-feed";
import { Message } from "console-feed/lib/definitions/Component";
import { emmetJSX } from "emmet-monaco-es";
import React, { useEffect, useState } from "react";
import Split from "react-split";
import * as ts from "typescript";

function Home() {
  const [javascriptCode, setJavascriptCode] = useLocalStorageState(
    "jscode",
    `
// Free Online Javascript Complier
// Write, Edit and Run your Javascript code using JS Online Compiler

console.log("Try RunJs.in");
    `,
  );
  const [typescriptCode, setTypescriptCode] = useLocalStorageState(
    "tscode",
    `
// Free Online Typescript Complier
// Write, Edit and Run your Typescript code using TS Online Compiler

const message:string = "Try RunJs.in";
console.log(message);
    `,
  );
  const [fontSize, setFontSize] = useLocalStorageState("font", 16);
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  const [logs, setLogs] = useState<Message[] | any[]>([]);
  const [fullScreen, setFullScreen] = useState(false);
  const [lang, setLang] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  function toggleLangFunction() {
    setLang((prev) => !prev);
  }

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
      const func = new Function(lang ? code : compileCode());
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

  const compileCode = () => {
    const result = ts.transpileModule(typescriptCode, {
      compilerOptions: { module: ts.ModuleKind.CommonJS },
    });
    return result.outputText;
  };

  useAdjustFontSize(increaseFontSize, decreaseFontSize);
  useSaveFileShortcut(javascriptCode);
  useComplieCode(handleRunClick);

  return (
    <>
      <PlaygroundHeader fullScreen={fullScreen} />
      <Split
        className={`split h-${fullScreen ? "93" : "88"}vh w-full flex flex-row`}
        minSize={550}
      >
        <section className="bg-ideBg w-full">
          <PlaygroundNavbar
            lang={lang}
            toggleLangFunction={toggleLangFunction}
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
              language={lang ? "javascript" : "typescript"}
              value={lang ? javascriptCode : typescriptCode}
              beforeMount={(monaco) => {
                emmetJSX(monaco, lang ? ["javascript"] : ["typescript"]);
                monaco.languages.typescript.javascriptDefaults.setEagerModelSync(
                  true,
                );
              }}
              onChange={(value) => {
                if (value) {
                  if (lang) {
                    setJavascriptCode(value);
                  } else {
                    setTypescriptCode(value);
                  }
                }
              }}
              options={{
                fontSize: fontSize,
                cursorStyle: "block",
                language: lang ? "javascript" : "typescript",
              }}
            />
          </section>
        </section>
        <section className="bg-outputBg">
          <PlaygroundNavbar
            fullScreen={fullScreen}
            codeOption={false}
            clearAllConsoleLogs={clearAllConsoleLogs}
            openHelpModal={() => setIsModalOpen(true)}
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
      <HelpModal
        isModalOpen={isModalOpen}
        close={() => setIsModalOpen(false)}
      />
    </>
  );
}

export default Home;
