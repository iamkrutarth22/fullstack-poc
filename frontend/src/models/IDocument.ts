export type DocumentMode = "text" | "diagram";

export interface IDocumentContent {
  mode: DocumentMode;
  text: object;
  diagram: {
    elements: any[];
    files: Record<string, any>;
  };
}

export interface IDocument {
  id: string;
  title: string;
  content: IDocumentContent;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export type IActiveDocument = {
  id: string;
  title: string;
  content: IDocumentContent;
  version: number;
  isDirty: boolean;
};

export type IDocumentState = {
  activeDocument: IActiveDocument | null;
  saveStatus: "idle" | "saving" | "saved" | "error" | "conflict";
};
