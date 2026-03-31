
// export class Helper {
//     static 
// }


// const { Editor } = require('@tiptap/core')
// const StarterKit = require('@tiptap/starter-kit').default
// const sanitizeHtml = require('sanitize-html')

// function convertTiptapJsonToHtml(json) {
//   const editor = new Editor({
//     extensions: [StarterKit],
//     content: json,
//   })

//   const rawHtml = editor.getHTML()
//   const safeHtml = sanitizeHtml(rawHtml, {
//     allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
//     allowedAttributes: {
//       ...sanitizeHtml.defaults.allowedAttributes,
//       img: ['src', 'alt'],
//     },
//   })

//   return safeHtml
// }

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};