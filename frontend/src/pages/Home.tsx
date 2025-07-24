import {  EditorContent, generateHTML, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CustomEditor from "../components/CustomEditor";

const Home = () => {
  const extensions = [StarterKit];
  const content = "<p>Hello World!</p> <pre>system.out.println('hello world')</pre> ";

  const editor = useEditor({
    extensions,
    content,
 })

  const obj2={
  "type": "doc",
  "content": [
    {
      "type": "heading",
      "attrs": {
        "level": 2
      },
      "content": [
        {
          "type": "text",
          "text": "Getting Started with React"
        }
      ]
    },
    {
      "type": "paragraph",
      "content": [
        {
          "type": "text",
          "text": "React is a JavaScript library for building user interfaces. It allows developers to create reusable UI components."
        }
      ]
    },
    {
      "type": "codeBlock",
      "attrs": {
        "language": "javascript"
      },
      "content": [
        {
          "type": "text",
          "text": "const [count, setCount] = useState(0);"
        }
      ]
    },
    // {
    //   "type": "image",
    //   "attrs": {
    //     "src": "https://example.com/image.jpg",
    //     "alt": "React Hook Example",
    //     "title": "useState example"
    //   }
    // },
    {
      "type": "blockquote",
      "content": [
        {
          "type": "paragraph",
          "content": [
            {
              "type": "text",
              "text": "React makes it painless to create interactive UIs."
            }
          ]
        }
      ]
    }
  ]
}

  // const htmlContent=generateHTML(obj2,[StarterKit])
  // console.log(editor)
  // console.log(editor?.getJSON())
  // console.log(htmlContent)
  
  return (
    <div>
      {/* <h1>Home page</h1>
      <EditorContent editor={editor} />

       <div dangerouslySetInnerHTML={{ __html: htmlContent }} /> */}
       {/* <CustomEditor/> */}
      
       {/* <div dangerouslySetInnerHTML={{ __html: htmlContent }} /> */}
    </div>
  );
};

export default Home;
