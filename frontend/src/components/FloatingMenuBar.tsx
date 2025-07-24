import { Editor, FloatingMenu } from "@tiptap/react";
import { Button } from "./ui/button";
import { Bold, Code, WrapText } from "lucide-react";

type Props = {
  editor: Editor | null;
};
const FloatingMenuBar = ({ editor }: Props) => {
  if (!editor) return null;
  return (
    <FloatingMenu editor={editor} className="p-2 rounded space-x-2 bg-white">
      <Button
      
        type="button"
        variant="outline"
        size="icon"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={
          editor.isActive("bold")
            ? ""
            : " border-green-600 text-green-800 rounded-full"
        }
      >
        <Bold />
      </Button>

      <Button
      
        type="button"
        variant="outline"
        onClick={() => editor.chain().focus().setBlockquote().run()}
        className={
          editor.isActive("blockquote")
            ? "bg-green-100 border-green-600 text-green-800"
            : ""
        }
      >
        <WrapText />
      </Button>
      <Button
      
        type="button"
        variant="outline"
        onClick={() => editor.chain().focus().setCodeBlock().run()}
        disabled={editor.isActive("codeBlock")}
      >
        <Code />
      </Button>
    </FloatingMenu>
  );
};

export default FloatingMenuBar;
