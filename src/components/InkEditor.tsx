import React, { useEffect, useState } from "react";
import Editor, { type Monaco } from "@monaco-editor/react";
import { Input, Loading } from "@nextui-org/react";
import type { editor } from "monaco-editor";

import { inkDecl } from "@/lib/ink-decl";
import { debouncer } from "@/utils/debounce";

const loadingTexts = [
  "Downloading more RAM...💾",
  "Mining bitcoin",
  "Loading awesomeness",
  "Computing 6 x 9",
  "Proving P = NP",
];

function Loader() {
  const [text, setText] = useState("");

  useEffect(
    () =>
      setText(loadingTexts[Math.floor(Math.random() * loadingTexts.length)]),
    []
  );

  return <Loading>{text}</Loading>;
}

interface Props {
  initialCode: string;
  canEdit: boolean;
  id: number;
  name: string;
  onRun: (source: string) => void;
}

export default function InkEditor(props: Props) {
  const [editor, setEditor] = useState<editor.IStandaloneCodeEditor | null>(
    null
  );
  const [name, setName] = useState(props.name);

  useEffect(() => {
    setName(props.name);
  }, [props.name]);

  const scheduleRequest = debouncer(500, 10000);

  useEffect(() => {
    if (editor) editor.getModel()?.setValue(props.initialCode);
  }, [props.initialCode]);

  useEffect(() => {
    const resizeListener = () => {
      editor?.layout();
    };
    window.addEventListener("resize", resizeListener);

    return () => {
      window.removeEventListener("resize", resizeListener);
    };
  }, [editor]);

  function onChange(value: string | undefined) {
    window.onbeforeunload = () => "Saving...";

    scheduleRequest(async () => {
      await fetch(`/api/ink/${props.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: value }),
      });
      window.onbeforeunload = null;
    });
  }

  function editorMount(editor: editor.IStandaloneCodeEditor, monaco: Monaco) {
    setEditor(editor);

    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
    });

    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      allowJs: true,
      checkJs: true,
      target: monaco.languages.typescript.ScriptTarget.ESNext,
      allowNonTsExtensions: true,
    });

    monaco.editor.defineTheme("gh", githubLightTheme);
    monaco.editor.setTheme("gh");

    const libUri = "ts:filename/ink.d.ts";

    if (monaco.editor.getModel(monaco.Uri.parse(libUri)) === null) {
      monaco.languages.typescript.javascriptDefaults.addExtraLib(
        inkDecl,
        libUri
      );
      monaco.editor.createModel(
        inkDecl,
        "typescript",
        monaco.Uri.parse(libUri)
      );
    }

    editor.addAction({
      id: "run-ink",
      label: "Run this Ink",
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
      precondition: undefined,
      keybindingContext: undefined,
      contextMenuGroupId: "navigation",
      contextMenuOrder: 100, // Top?
      run(editor: editor.ICodeEditor, ...args: any): void | Promise<void> {
        const source = editor.getModel()!.getValue();
        // editor.getModel()?.setValue(source)
        props.onRun(source);
      },
    });
  }

  return (
    <div className="editor-parent">
      <Editor
        defaultLanguage="javascript"
        defaultValue={props.initialCode}
        height="100%"
        loading={<Loader />}
        theme="vs-dark"
        className={"editor-parent"}
        options={{
          minimap: { enabled: false },
          matchBrackets: "always",
          autoIndent: "full",
          cursorSmoothCaretAnimation: "on",
          cursorBlinking: "smooth",
          fontLigatures: true,
          fontFamily: "monospace",
          smoothScrolling: true,
          tabSize: 2,
          tabCompletion: "on",
          lineNumbers: "off",
          links: true,
          "semanticHighlighting.enabled": true,
          lightbulb: { enabled: true },
          folding: false,
          glyphMargin: false,
          padding: { top: 8, bottom: 8 },
          scrollBeyondLastLine: false,
          scrollbar: { alwaysConsumeMouseWheel: false },
          readOnly: !props.canEdit,
          hideCursorInOverviewRuler: true,
          overviewRulerBorder: false,
          automaticLayout: true,
        }}
        onMount={editorMount}
        onChange={onChange}
      />
      <Input
        underlined
        value={name}
        style={{ fontWeight: "bold" }}
        readOnly={!props.canEdit}
        onChange={(e) => {
          setName(e.target.value);
          scheduleRequest(async () => {
            await fetch(`/api/ink/${props.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name: e.target.value }),
            });
            window.onbeforeunload = null;
          });
        }}
      />
    </div>
  );
}

const githubLightTheme: editor.IStandaloneThemeData = {
  base: "vs",
  inherit: true,
  rules: [
    { token: "keyword", foreground: "#d73a49" },
    { token: "constant", foreground: "#005cc5" },
    { token: "number", foreground: "#005cc5" },
    { token: "string", foreground: "#005cc5" },
    { token: "identifier", foreground: "#6f42c1" },
    { token: "", background: "#ffffff" },
    { token: "", foreground: "#444d56" },
  ],
  colors: {
    "editor.background": "#ffffff",
    "editor.lineHighlightBackground": "#ffffff",
    "editorLineNumber.foreground": "#1b1f234d",
    "editorLineNumber.activeForeground": "#24292e",
    "editorWidget.background": "#f6f8fa",
    "editorSuggestWidget.selectedBackground": "#2f363d",
  },
};
