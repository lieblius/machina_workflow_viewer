import prisma from "./prisma";
import { models, directories, RowData } from "./directoryStructure";

function buildQuery(path: string[]) {
  if (path.length === 0) return {};

  const query = { where: {} };
  let current: { [key: string]: any } = query.where;

  for (let i = path.length - 1; i >= 0; i--) {
    current[directories[i].child] = { uuid: path[i] };
    current = current[directories[i].child];
  }

  return query;
}

async function fetchDirectoryData(
  path: string[],
  query: { [key: string]: any }
) {
  let data =
    (await models[directories[path.length].child]?.findMany(query)) ?? [];

  data = data.map((obj: { uuid: string; name?: string }) => ({
    uuid: obj.uuid,
    name: obj.name || obj.uuid,
    file: false,
  }));

  return data;
}

async function fetchFileData(path: string[], query: { [key: string]: any }) {
  const frn = directories[path.length]?.fileRelationNodes ?? [];
  for (let i = 0; i < frn.length; i++) query.where = { [frn[i]]: query.where };

  const firstKey = Object.keys(query.where)[0];
  query.where[firstKey] = { some: query.where[firstKey] };

  let data = await prisma.file.findMany({
    select: { uuid: true, location: true },
    ...query,
  });

  data = data.map((obj: { [key: string]: any }) => ({
    uuid: obj.uuid,
    name: obj.location.split("/")?.pop() ?? "",
    file: true,
    location: obj.location,
  }));

  return data;
}

export default async function fetchData(path: string[]): Promise<RowData[]> {
  if (path.length >= directories.length) return [];

  let query: { [key: string]: any } = buildQuery(path);
  let data = await fetchDirectoryData(path, query);
  if (directories[path.length].hasFiles)
    data = [...data, ...(await fetchFileData(path, query))];

  return data;
}
