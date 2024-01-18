import mime from "mime-types";
import { RowData } from "../interfaces";

export function isTextFile(extension: string) {
  const mimeType = mime.lookup(extension);
  return (
    mimeType && (mimeType.startsWith("text/") || mimeType.endsWith("/json"))
  );
}

export function filterData(data: RowData[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter((item) => item.name.toLowerCase().includes(query));
}

export function sortData(
  data: RowData[],
  payload: { sortBy: keyof RowData | null; reversed: boolean; search: string }
) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      if (payload.reversed) {
        return b[sortBy].localeCompare(a[sortBy]);
      }

      return a[sortBy].localeCompare(b[sortBy]);
    }),
    payload.search
  );
}

export function downloadFile(filePath: string) {
  const link = document.createElement("a");
  link.href = filePath;
  link.download = "";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
