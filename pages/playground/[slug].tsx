"use client";

import HelpModal from "@/components/HelpModal";
import PlaygroundHeader from "@/components/PlaygroundHeader";
import PlaygroundNavbar from "@/components/PlaygroundNavbar";
import { db } from "@/firebase";
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
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Split from "react-split";
import { Bounce, toast, ToastContainer } from "react-toastify";
import ts from "typescript";
import { UserCodeBase } from "../playground/index";
import { useAuth } from "@/components/AuthProvider";
import Loading from "@/components/Loading";

function Playground() {
  const router = useRouter();
  const { user } = useAuth();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [javascriptCode, setJavascriptCode] = useLocalStorageState(
    "jscode-db",
    ``,
  );
  const [typescriptCode, setTypescriptCode] = useLocalStorageState(
    "tscode-db",
    ``,
  );
  const [fontSize, setFontSize] = useLocalStorageState("font", 16);
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  const [logs, setLogs] = useState<Message[] | any[]>([]);
  const [fullScreen, setFullScreen] = useState(false);
  const [lang, setLang] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [consoleFilter, setConsoleFilter] = useState("");
  const [editable, setEditable] = useState(true);
  const [loading, setLoading] = useState(true);
  const [fileName, setFileName] = useState("");

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

  const getCodeFromDb = useCallback(async () => {
    const id = toast.loading("Connecting you to Cloud, hold tight...");
    try {
      const codeCollectionRef = doc(
        db,
        "codebase",
        router.query.slug as string,
      );
      /* eslint-disable  @typescript-eslint/no-explicit-any */
      const data: any = await getDoc(codeCollectionRef);
      if (data.exists()) {
        const result: UserCodeBase = data.data();
        setFileName(result.fileName);
        setLang(result.language === "js");
        if (result.userId === user?.uid) {
          toast.update(id, {
            render: "Playground Fetched successfully!",
            type: "success",
            isLoading: false,
            autoClose: 1000,
          });
          setEditable(false);
          if (result.language == "js") {
            setJavascriptCode(result.code);
          } else {
            setTypescriptCode(result.code);
          }
        } else if (result.share === 1) {
          toast.update(id, {
            render: "Playground Fetched successfully!",
            type: "success",
            isLoading: false,
            autoClose: 1000,
          });
          if (result.language == "js") {
            setJavascriptCode(result.code);
          } else {
            setTypescriptCode(result.code);
          }
        } else {
          router.replace("/404");
          return;
        }
      } else {
        router.replace("/404");
        return;
      }
    } catch {
      toast.update(id, {
        render: "Oops! Something went wrong. Please try again..",
        type: "error",
        isLoading: false,
        autoClose: 1000,
      });
    }
  }, [router, user, setJavascriptCode, setTypescriptCode]);

  useEffect(() => {
    async function loadData() {
      if (
        router.query.slug !== undefined &&
        typeof router.query.slug !== "object"
      ) {
        setLoading(true);
        await getCodeFromDb();
        setLoading(false);
      }
    }
    loadData();
  }, [router.query.slug, getCodeFromDb]);

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

  const updateCode = async () => {
    if (buttonRef.current) {
      buttonRef.current.disabled = true;
      const id = toast.loading("Connecting you to Cloud, hold tight...");
      try {
        const codeCollectionRef = doc(
          db,
          "codebase",
          router.query.slug as string,
        );
        await updateDoc(codeCollectionRef, {
          code: lang ? javascriptCode : typescriptCode,
          lastModifiedAt: serverTimestamp(),
        });
        toast.update(id, {
          render: "Playground Updated successfully!",
          type: "success",
          isLoading: false,
          autoClose: 1000,
        });
      } catch {
        toast.update(id, {
          render: "Oops! Something went wrong. Please try again..",
          type: "error",
          isLoading: false,
          autoClose: 1000,
        });
      }
      buttonRef.current.disabled = false;
    }
  };

  useAdjustFontSize(increaseFontSize, decreaseFontSize);
  useSaveFileShortcut(javascriptCode);
  useComplieCode(handleRunClick);

  if (loading)
    return (
      <Loading
        randomMessage={
          "We're working on it! Your content will be here shortly."
        }
      />
    );

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
            fullScreen={fullScreen}
            increaseFontSize={increaseFontSize}
            decreaseFontSize={decreaseFontSize}
            codeOption={true}
            handleRunClick={handleRunClick}
            formatCodeFunction={formatCodeFunction}
            toggleFullScreen={toggleFullScreen}
            updateCode={updateCode}
            showUpload={!editable}
            updatebuttonRef={buttonRef}
            fileName={fileName}
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
                readOnly: editable,
              }}
            />
          </section>
        </section>
        <section className="bg-outputBg select-none">
          <PlaygroundNavbar
            fullScreen={fullScreen}
            codeOption={false}
            clearAllConsoleLogs={clearAllConsoleLogs}
            openHelpModal={() => setIsModalOpen(true)}
          />
          <div
            className={`${fullScreen ? "h-86vh" : "h-81vh"} w-full p-2 bg-outputBg`}
          >
            <div className="relative mb-1">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="20px"
                  viewBox="0 -960 960 960"
                  width="20px"
                  fill="#FFFFFF"
                >
                  <path d="M440-160q-17 0-28.5-11.5T400-200v-240L168-736q-15-20-4.5-42t36.5-22h560q26 0 36.5 22t-4.5 42L560-440v240q0 17-11.5 28.5T520-160h-80Zm40-308 198-252H282l198 252Zm0 0Z" />
                </svg>
              </div>
              <input
                autoComplete="off"
                value={consoleFilter}
                onChange={(e) =>
                  setConsoleFilter(e.target.value.replace(/[^A-Za-z]/gi, ""))
                }
                type="text"
                className="text-white block w-full p-2 ps-10 text-sm bg-navbarBg rounded-xl focus:outline-none focus:border-transparent"
                placeholder="Filter"
              />
              <button
                onClick={() => setConsoleFilter("")}
                type="submit"
                className="absolute end-2.5 bottom-1 font-medium rounded-lg p-1.5"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="20px"
                  viewBox="0 -960 960 960"
                  width="20px"
                  fill="#FFFFFF"
                >
                  <path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                </svg>
              </button>
            </div>
            <div className="overflow-auto w-full h-92p">
              <Console
                logs={logs}
                variant="dark"
                styles={{ BASE_FONT_SIZE: fontSize, ...consoleTheme }}
                searchKeywords={consoleFilter}
                filter={consoleFilter.length === 0 ? ["log"] : []}
              />
            </div>
          </div>
        </section>
      </Split>
      <HelpModal
        isModalOpen={isModalOpen}
        close={() => setIsModalOpen(false)}
      />
      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
    </>
  );
}

export default Playground;
