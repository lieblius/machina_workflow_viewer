"use client";

import { useState } from "react";
import {
  Table,
  ScrollArea,
  UnstyledButton,
  Text,
  Center,
  TextInput,
  rem,
  Flex,
  Anchor,
  useMantineTheme,
  Modal,
  Textarea,
  Button,
} from "@mantine/core";
import {
  IconSearch,
  IconFolder,
  IconFileText,
  IconFile3d,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RowData } from "../../lib/interfaces";
import React from "react";

import { Th } from "./Th";
import { downloadFile, isTextFile, sortData } from "../../lib/client/utils";
import { lastSegment } from "../../lib/shared/utils";
import FileContent from "../FileContent";

export function FileExplorer({ data }: { data: RowData[] }) {
  const theme = useMantineTheme();
  const path = ((p) => (p.endsWith("/") ? p.slice(0, -1) : p))(usePathname()); // no slashes at root
  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState<keyof RowData | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [openedModalId, setOpenedModalId] = useState<null | string>(null);
  const [location, setLocation] = useState("");

  const setSorting = (field: keyof RowData) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(data, { sortBy: field, reversed, search }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(
      sortData(data, { sortBy, reversed: reverseSortDirection, search: value })
    );
  };

  const handleDownload = () => {
    downloadFile(`/files/${location}`);
  };

  const rows: any = sortedData.map((row: any) => (
    <React.Fragment key={row.name}>
      <Modal
        opened={openedModalId === row.name}
        onClose={() => {
          setOpenedModalId(null);
          setLocation("");
        }}
        title={row.name}
        size="xl"
      >
        {isTextFile(lastSegment(row.name, ".")) ? (
          <FileContent location={location} />
        ) : (
          <Textarea
            defaultValue="Preview not available."
            autosize
            minRows={10}
            maxRows={20}
            styles={{ input: { color: theme.colors.dark[0] } }}
            readOnly
          />
        )}
        <Center>
          <Button onClick={handleDownload} mt="md">
            Download
          </Button>
        </Center>
      </Modal>
      <Table.Tr>
        <Table.Td>
          <Flex justify="space-between">
            {row.file ? (
              <>
                <UnstyledButton
                  onClick={() => {
                    setOpenedModalId(row.name);
                    setLocation(row.location);
                  }}
                >
                  {row.name}
                </UnstyledButton>
                {isTextFile(lastSegment(row.name, ".")) ? (
                  <IconFileText />
                ) : (
                  <IconFile3d />
                )}
              </>
            ) : (
              <>
                <Anchor
                  component={Link}
                  href={`${path}/${row.uuid}`}
                  underline="never"
                  c={theme.colors.dark[0]}
                >
                  {row.name}
                </Anchor>
                <IconFolder />
              </>
            )}
          </Flex>
        </Table.Td>
      </Table.Tr>
    </React.Fragment>
  ));

  return (
    <>
      <ScrollArea>
        <TextInput
          placeholder="Search by any field"
          mb="md"
          leftSection={
            <IconSearch
              style={{ width: rem(16), height: rem(16) }}
              stroke={1.5}
            />
          }
          value={search}
          onChange={handleSearchChange}
        />
        <Table horizontalSpacing="md" verticalSpacing="xs" layout="fixed">
          <Table.Tbody>
            <Table.Tr>
              <Th
                sorted={sortBy === "name"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("name")}
              >
                Name
              </Th>
            </Table.Tr>
          </Table.Tbody>
          <Table.Tbody>
            {rows.length > 0 ? (
              rows
            ) : (
              <Table.Tr>
                <Table.Td>
                  <Text fw={500} ta="center">
                    Nothing found
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </>
  );
}
