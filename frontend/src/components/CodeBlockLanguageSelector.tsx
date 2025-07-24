import { Editor } from "@tiptap/react";

type Props = {
  editor: Editor;
};

const CodeBlockLanguageSelector = ({ editor }: Props) => {
  if (!editor) return null;

  const languages = [
    { name: "JavaScript", value: "javascript" },
    { name: "css", value: "css" },
    { name: "HTML", value: "html" },
    { name: "Typescript", value: "ts" },
    { name: "python", value: "python" },
    { name: "java", value: "java" },
    { name: "cpp", value: "cpp" },
    // { name: "Typescript", value: "ts" },

  ];

  const updateLanguage = (language: string) => {
    editor
      .chain()
      .focus()
      .updateAttributes("codeBlock", { language })
      .run();
  };

  const currentLanguage =
    editor.getAttributes("codeBlock").language || "javascript";

  return (
    <select
      value={currentLanguage}
      onChange={(e) => updateLanguage(e.target.value)}
      className="border p-1 rounded"
    >
      {languages.map((lang) => (
        <option key={lang.value} value={lang.value}>
          {lang.name}
        </option>
      ))}
    </select>
  );
};

export default CodeBlockLanguageSelector;
