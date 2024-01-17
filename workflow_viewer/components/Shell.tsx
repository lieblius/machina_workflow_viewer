"use client";

import { AppShell, Center, Container, Title } from "@mantine/core";

export default function Shell({ children }: { children: any }) {
  return (
    <AppShell header={{ height: "5em" }} padding="xl">
      <AppShell.Header withBorder={true}>
        <Container p="1em">
          <Center>
            <Title>Workflow Viewer</Title>
          </Center>
        </Container>
      </AppShell.Header>
      <AppShell.Main>
        <Container size="xs" pt="2em">{children}</Container>
      </AppShell.Main>
      <AppShell.Footer></AppShell.Footer>
    </AppShell>
  );
}
