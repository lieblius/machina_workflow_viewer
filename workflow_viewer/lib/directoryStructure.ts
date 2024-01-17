import prisma from "./prisma";

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

export const models: { [key: string]: any } = {
  customer: prisma.customer,
  part: prisma.part,
  part_revision: prisma.part_revision,
  trial: prisma.trial,
  process_run: prisma.process_run,
  process_run_file_artifact: prisma.process_run_file_artifact,
  file: prisma.file,
};

export const directories: Directory[] = [
  { name: "root", child: "customer", hasFiles: false },
  { name: "customer", child: "part", hasFiles: false },
  { name: "part", child: "part_revision", hasFiles: false },
  { name: "part_revision", child: "trial", hasFiles: true },
  {
    name: "trial",
    child: "",
    hasFiles: true,
    fileRelationNodes: ["process_run", "process_run_file_artifact"],
  },
];
