import { EditorContent, generateHTML, useEditor, type JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Blockquote from "@tiptap/extension-blockquote";
import Italic from "@tiptap/extension-italic";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Underline from "@tiptap/extension-underline";

import FloatingMenuBar from "./FloatingMenuBar";
import { createLowlight } from "lowlight";
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import python from "highlight.js/lib/languages/python";
import java from "highlight.js/lib/languages/java";
// import cpp from "highlight.js/lib/languages/cpp";
import BubbleMenuBar from "./BubbleMenuBar";

type EditorProps = {
  content:string,
  onChange: (content: JSONContent) => void;
};

const CustomEditor = ({ content,onChange }: EditorProps) => {

  console.log("props",content)
  const lowlight = createLowlight();
  lowlight.register("html", html);
  lowlight.register("css", css);
  lowlight.register("js", js);
  lowlight.register("ts", ts);
  lowlight.register("python", python);
  lowlight.register("java", java);

  const json = content ? JSON.parse(content) : { type: 'doc', content: [] }


  const htmlContent=generateHTML(json,[
    StarterKit,
    Underline
  ])

  console.log("html content",htmlContent!)
  // const htmlContent=''


  const editor = useEditor({

    
    extensions: [
      StarterKit.configure({ blockquote: false, codeBlock: false }),
      Document,
      Paragraph,
      Italic,
      Text,
      Underline,
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class:
            "!bg-gray-900 !text-gray-100 font-mono rounded-md px-4 py-3 my-4 whitespace-pre",
        },
        defaultLanguage: "plaintext",
        // languageClassPrefix: "language-",
      }),
      Blockquote.configure({
        HTMLAttributes: {
          class: "pl-4 border-l-2 border-green-600 bg-gray-200 rounded-xs",
        },
      }),
      Placeholder.configure({
        placeholder: "Write something...",
        emptyEditorClass: "is-editor-empty",
        showOnlyWhenEditable: true,
        showOnlyCurrent: false,
      }),
    ],
    content:`${htmlContent}`,
    onUpdate({ editor }) {
      const content = editor.getJSON();
      // console.log(content)
      onChange(content);
    },
  });


  if (!editor) return null;

  return (
    <div className="h-full overflow-">
      {/* 🧠 BubbleMenu: Appears when text is selected */}
      {/* <BubbleMenu
        editor={editor}
        className="bg-white border p-2 rounded shadow-sm space-x-2"
      >
        <Button
          variant="outline"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "is-active" : ""}
        >
          <Bold />
        </Button>
        <Button
          variant="outline"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive("blockquote") ? "is-active" : ""}
        >
          <TextQuote />
        </Button>
        <Button
          color=""
          variant="outline"
          onClick={() => editor.chain().focus().setBlockquote().run()}
          className={editor.isActive("blockquote") ? "is-active" : ""}
        >
          <WrapText />
        </Button>

        {editor.isActive("codeBlock") && (
          <CodeBlockLanguageSelector editor={editor} />
        )}
      </BubbleMenu> */}
      <BubbleMenuBar editor={editor} />

      {/* 🚀 FloatingMenu: Appears when cursor is on empty line or start of block */}
      {/* <FloatingMenu
        editor={editor}
        className="bg-white border p-2 rounded shadow-sm space-x-2"
      >
        <Button
          variant="outline"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "bg-muted font-bold" : ""}
        >
          Bold
        </Button>
        <Button
          variant="outline"
          onClick={() => editor.chain().focus().setBlockquote().run()}
          className={editor.isActive("blockquote") ? "is-active" : ""}
        >
          Blockquote
        </Button>
        <Button
          variant="outline"
          onClick={() => editor.chain().focus().setCodeBlock().run()}
          disabled={editor.isActive("codeBlock")}
        >
          Code Block
        </Button>
      </FloatingMenu> */}

      <FloatingMenuBar editor={editor} />
      {/* ✍️ Editor Content */}
      <EditorContent
        editor={editor}
        className="tiptap caret-orange-500 py-2 ProseMirror border p rounded-md h-full  font-serif"
      />
    </div>
  );
};
export default CustomEditor;
