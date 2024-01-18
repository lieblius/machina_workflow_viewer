export interface RowData {
  name: string;
  uuid: string;
  file: any;
  location?: string;
}

export interface Directory {
  name: string;
  child: string;
  hasFiles: boolean;
  fileRelationNodes?: string[];
}
