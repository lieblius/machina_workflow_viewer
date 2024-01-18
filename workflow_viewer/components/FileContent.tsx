import { Center, Loader, Textarea, useMantineTheme } from "@mantine/core";
import { useState, useEffect } from "react";
import readFileContent from "../lib/server/actions/readFileContent";

export default function FileContent({ location }: any) {
  const theme = useMantineTheme();
  const [fileContent, setFileContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    (async () => {
      if (location) {
        setFileContent(await readFileContent(`public/files/${location}`));
        setLoading(false);
      }
    })();
  }, [location]);

  if (loading) {
    return (
      <Center>
        <Loader m="xl" color={theme.colors.dark[0]} />
      </Center>
    );
  }

  return (
    <Textarea
      defaultValue={fileContent}
      autosize
      minRows={10}
      maxRows={20}
      styles={{ input: { color: theme.colors.dark[0] } }}
      readOnly
    />
  );
}
