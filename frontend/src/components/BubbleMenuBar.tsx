import { BubbleMenu, type Editor } from "@tiptap/react";
// import CodeBlockLanguageSelector from "./CodeBlockLanguageSelector";
import { Bold, Italic, TextQuote, WrapText, Strikethrough, Underline } from "lucide-react";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";

const BubbleMenuBar = ({ editor }: { editor: Editor }) => {
  return (
    <BubbleMenu
      editor={editor}
      className="bg-white border rounded flex justify-center items-center shadow-sm p-2 "
    >
      <Button
        type="button"
        variant="ghost"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "is-active" : ""}
      >
        <Bold />
      </Button>

      <Separator orientation="vertical" className="bg-gray-200 mx-2 " />

      <Button
      
        type="button"
        variant="ghost"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive("blockquote") ? "is-active" : ""}
      >
        <TextQuote />
      </Button>

      <Separator orientation="vertical" className="bg-gray-200 mx-2" />

      <Button
      
        type="button"
        variant="ghost"
        onClick={() => editor.chain().focus().setBlockquote().run()}
        className={editor.isActive("blockquote") ? "is-active" : ""}
      >
        <WrapText />
      </Button>

      <Separator orientation="vertical" className="bg-gray-200 mx-2" />

      <Button
      
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? "is-active" : ""}
      >
        <Italic />
      </Button>

      <Separator orientation="vertical" className="bg-gray-200 mx-2" />

      <button
      
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive("strike") ? "is-active" : ""}
      >
       <Strikethrough />
      </button>
      
      <Separator orientation="vertical" className="bg-gray-200 mx-2" />

      <button
      
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={editor.isActive("underline") ? "is-active" : ""}
      >
        <Underline />
      </button>
{/* 
      {editor.isActive("codeBlock") && (
        <CodeBlockLanguageSelector editor={editor} />
      )} */}
    </BubbleMenu>
  );
};

export default BubbleMenuBar