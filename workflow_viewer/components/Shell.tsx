"use client";

import {
  Anchor,
  AppShell,
  Center,
  Container,
  Title,
  useMantineTheme,
} from "@mantine/core";

export default function Shell({ children }: { children: any }) {
  const theme = useMantineTheme();

  return (
    <AppShell header={{ height: "5em" }} padding="xl">
      <AppShell.Header withBorder={true}>
        <Container p="1em">
          <Center>
            <Anchor href="/" underline="never" c={theme.colors.dark[0]}>
              <Title>Workflow Viewer</Title>
            </Anchor>
          </Center>
        </Container>
      </AppShell.Header>
      <AppShell.Main>
        <Container size="xs" pt="2em">
          {children}
        </Container>
      </AppShell.Main>
      <AppShell.Footer></AppShell.Footer>
    </AppShell>
  );
}
