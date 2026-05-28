export interface Document {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export type ViewMode = 'connect' | 'workspace';
export type EditorMode = 'wysiwyg' | 'source';
export type AuthTab = 'connect' | 'initialize';
