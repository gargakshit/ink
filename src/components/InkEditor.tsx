import React, { useEffect, useState } from "react";
import Editor, { type Monaco } from "@monaco-editor/react";
import { Input, Loading, Spacer } from "@nextui-org/react";
import type { editor } from "monaco-editor";

import { inkDecl } from "@/lib/ink-decl";
import { debouncer } from "@/utils/debounce";
import AddToCollection from "@/components/AddToCollection";

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

    monaco.editor.defineTheme("ink-dark", inkDarkTheme);
    monaco.editor.setTheme("ink-dark");

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
      <div className="flex">
        <Input
          underlined
          value={name}
          style={{ fontWeight: "bold" }}
          css={{ width: "100%" }}
          readOnly={!props.canEdit}
          onChange={(e) => {
            setName(e.target.value);
            scheduleRequest(async () => {
              await fetch(`/api/ink/${props.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: e.target.value.trim() }),
              });
              window.onbeforeunload = null;
            });
          }}
        />
        {props.canEdit && <Spacer />}
        {props.canEdit && <AddToCollection inkId={props.id} />}
      </div>
    </div>
  );
}

export const inkDarkTheme: editor.IStandaloneThemeData = {
  base: "vs-dark",
  inherit: true,
  rules: [
    {
      background: "282a36",
      token: "",
    },
    {
      foreground: "6272a4",
      token: "comment",
    },
    {
      foreground: "f1fa8c",
      token: "string",
    },
    {
      foreground: "bd93f9",
      token: "constant.numeric",
    },
    {
      foreground: "bd93f9",
      token: "constant.language",
    },
    {
      foreground: "bd93f9",
      token: "constant.character",
    },
    {
      foreground: "bd93f9",
      token: "constant.other",
    },
    {
      foreground: "ffb86c",
      token: "variable.other.readwrite.instance",
    },
    {
      foreground: "ff79c6",
      token: "constant.character.escaped",
    },
    {
      foreground: "ff79c6",
      token: "constant.character.escape",
    },
    {
      foreground: "ff79c6",
      token: "string source",
    },
    {
      foreground: "ff79c6",
      token: "string source.ruby",
    },
    {
      foreground: "ff79c6",
      token: "keyword",
    },
    {
      foreground: "ff79c6",
      token: "storage",
    },
    {
      foreground: "8be9fd",
      fontStyle: "italic",
      token: "storage.type",
    },
    {
      foreground: "50fa7b",
      fontStyle: "underline",
      token: "entity.name.class",
    },
    {
      foreground: "50fa7b",
      fontStyle: "italic underline",
      token: "entity.other.inherited-class",
    },
    {
      foreground: "50fa7b",
      token: "entity.name.function",
    },
    {
      foreground: "ffb86c",
      fontStyle: "italic",
      token: "variable.parameter",
    },
    {
      foreground: "ff79c6",
      token: "entity.name.tag",
    },
    {
      foreground: "50fa7b",
      token: "entity.other.attribute-name",
    },
    {
      foreground: "8be9fd",
      token: "support.function",
    },
    {
      foreground: "6be5fd",
      token: "support.constant",
    },
    {
      foreground: "66d9ef",
      fontStyle: " italic",
      token: "support.type",
    },
    {
      foreground: "66d9ef",
      fontStyle: " italic",
      token: "support.class",
    },
    {
      foreground: "f8f8f0",
      background: "ff79c6",
      token: "invalid",
    },
    {
      foreground: "f8f8f0",
      background: "bd93f9",
      token: "invalid.deprecated",
    },
    {
      foreground: "cfcfc2",
      token: "meta.structure.dictionary.json string.quoted.double.json",
    },
    {
      foreground: "6272a4",
      token: "meta.diff",
    },
    {
      foreground: "6272a4",
      token: "meta.diff.header",
    },
    {
      foreground: "ff79c6",
      token: "markup.deleted",
    },
    {
      foreground: "50fa7b",
      token: "markup.inserted",
    },
    {
      foreground: "e6db74",
      token: "markup.changed",
    },
    {
      foreground: "bd93f9",
      token: "constant.numeric.line-number.find-in-files - match",
    },
    {
      foreground: "e6db74",
      token: "entity.name.filename",
    },
    {
      foreground: "f83333",
      token: "message.error",
    },
    {
      foreground: "eeeeee",
      token:
        "punctuation.definition.string.begin.json - meta.structure.dictionary.value.json",
    },
    {
      foreground: "eeeeee",
      token:
        "punctuation.definition.string.end.json - meta.structure.dictionary.value.json",
    },
    {
      foreground: "8be9fd",
      token: "meta.structure.dictionary.json string.quoted.double.json",
    },
    {
      foreground: "f1fa8c",
      token: "meta.structure.dictionary.value.json string.quoted.double.json",
    },
    {
      foreground: "50fa7b",
      token:
        "meta meta meta meta meta meta meta.structure.dictionary.value string",
    },
    {
      foreground: "ffb86c",
      token: "meta meta meta meta meta meta.structure.dictionary.value string",
    },
    {
      foreground: "ff79c6",
      token: "meta meta meta meta meta.structure.dictionary.value string",
    },
    {
      foreground: "bd93f9",
      token: "meta meta meta meta.structure.dictionary.value string",
    },
    {
      foreground: "50fa7b",
      token: "meta meta meta.structure.dictionary.value string",
    },
    {
      foreground: "ffb86c",
      token: "meta meta.structure.dictionary.value string",
    },
  ],
  colors: {
    "editor.foreground": "#f8f8f2",
    "editor.background": "#121212",
    "editor.selectionBackground": "#44475a",
    "editor.lineHighlightBackground": "#121212",
    "editorCursor.foreground": "#f8f8f0",
    "editorWhitespace.foreground": "#3B3A32",
    "editorIndentGuide.activeBackground": "#9D550FB0",
    "editor.selectionHighlightBorder": "#222218",
  },
};
