export const dynamic = "force-dynamic";

import fetchData from "../../lib/server/fetchData";
import FileExplorer from "../../components/FileExplorer/FileExplorer";
import Shell from "../../components/Shell";
import PathCrumbs from "../../components/PathCrumbs";
import { Center, Stack } from "@mantine/core";

const uuidToNames: { [key: string]: string } = {};

export default async function PathPage({ params }: any) {
  const data = await fetchData(params.path ?? []);

  data.forEach((obj) => {
    uuidToNames[obj.uuid] = obj.name;
  });

  return (
    <Shell>
      <Stack>
        <Center>
          <PathCrumbs uuidToNames={uuidToNames}></PathCrumbs>
        </Center>
        <FileExplorer data={data} />
      </Stack>
    </Shell>
  );
}
