export interface ITableData {
  createdAt: string;
  cat: string;
  name: string;
  city: string;
  loremText: string;
  avatar: string;
  id: string;
}

export interface ITableColumn {
  isCheckbox?: boolean;
  header?: string;
  slotName?: string;
  widthFraction?: number;
  field?: string;
}

export interface ITasksCount {
  tasksCount: number;
}
