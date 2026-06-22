import type { IActiveDocument, IDocumentState } from "@/models/IDocument";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState: IDocumentState = {
  activeDocument: null,
  saveStatus: "idle",
};

const documentSlice = createSlice({
  name: "document",
  initialState,
  reducers: {
    setActiveDocument(state, action: PayloadAction<IActiveDocument>) {
      state.activeDocument = action.payload;
      state.saveStatus = "idle";
    },
    updateTitle(state, action: PayloadAction<string>) {
      if (!state.activeDocument) return;
      state.activeDocument.title = action.payload;
      state.activeDocument.isDirty = true;
    },
    updateTextContent(state, action: PayloadAction<object>) {
      if (!state.activeDocument) return;
      state.activeDocument.content.text = action.payload;
      state.activeDocument.isDirty = true;
    },
    // updateDiagramContent(
    //   state,
    //   action: PayloadAction<{ elements: readonly any[]; appState: any }>,
    // ) {
    //   if (!state.activeDocument) return;
    //   state.activeDocument.content.diagram = {
    //     elements: [...action.payload.elements], // spread to convert readonly to mutable
    //     appState: action.payload.appState,
    //   };
    //   state.activeDocument.isDirty = true;
    // },
    updateDiagramContent(
      state,
      action: PayloadAction<{ elements: readonly any[]; files?: any }>,
    ) {
      if (!state.activeDocument) return;

      state.activeDocument.content.diagram = {
        elements: [...action.payload.elements],
        files: action.payload.files ?? {},
      };

      state.activeDocument.isDirty = true;
    },
    setMode(state, action: PayloadAction<"text" | "diagram">) {
      if (!state.activeDocument) return;
      state.activeDocument.content.mode = action.payload;
    },
    markClean(state, action: PayloadAction<number>) {
      if (!state.activeDocument) return;
      state.activeDocument.isDirty = false;
      state.activeDocument.version = action.payload;
    },
    setSaveStatus(state, action: PayloadAction<IDocumentState["saveStatus"]>) {
      state.saveStatus = action.payload;
    },
    clearActiveDocument(state) {
      state.activeDocument = null;
      state.saveStatus = "idle";
    },
  },
});

export const documentActions = documentSlice.actions;
const documentReducer = documentSlice.reducer;
export default documentReducer;
