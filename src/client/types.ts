export interface Folder {
  id: number;
  name: string;
}

export interface TodoList {
  id: number;
  title: string;
  folderId?: number | null;
  icon?: string;
  color?: string;
}

export interface Tag {
  id: number;
  name: string;
  color: string;
}

export interface Task {
  id: number;
  listId: number;
  title: string;
  completed: boolean;
  deadline?: string | null;
  order: number;
  tags?: Tag[];
}
