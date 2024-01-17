"use client";

import { useState } from "react";
import {
  Table,
  ScrollArea,
  UnstyledButton,
  Group,
  Text,
  Center,
  TextInput,
  rem,
  Flex,
  Anchor,
  useMantineTheme,
  Modal,
} from "@mantine/core";
import mime from "mime-types";
import {
  IconSelector,
  IconChevronDown,
  IconChevronUp,
  IconSearch,
  IconFolder,
  IconFileText,
  IconFile3d,
} from "@tabler/icons-react";
import classes from "./TableSort.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RowData } from "../../lib/directoryStructure";

interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort(): void;
}

function Th({ children, reversed, sorted, onSort }: ThProps) {
  const Icon = sorted
    ? reversed
      ? IconChevronUp
      : IconChevronDown
    : IconSelector;
  return (
    <Table.Th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group justify="space-between">
          <Text fw={500} fz="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}

function filterData(data: RowData[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter((item) => item.name.toLowerCase().includes(query));
}

function sortData(
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

function isTextFile(extension: string) {
  const mimeType = mime.lookup(extension);
  return mimeType && mimeType.startsWith("text/");
}

export function TableSort({ data }: { data: RowData[] }) {
  const theme = useMantineTheme();
  const path = ((p) => (p.endsWith("/") ? p.slice(0, -1) : p))(usePathname());
  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState<keyof RowData | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [openedModalId, setOpenedModalId] = useState<null | string>(null);

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

  const rows: any = sortedData.map((row: any) => (
    <Table.Tr key={row.name}>
      <Table.Td>
        <Flex justify="space-between">
          {row.file ? (
            isTextFile(row.name.split(".").pop()) ? (
              <>
                <Modal
                  opened={openedModalId === row.name}
                  onClose={() => setOpenedModalId(null)}
                  title={row.name}
                  scrollAreaComponent={ScrollArea.Autosize}
                ></Modal>
                <UnstyledButton onClick={() => setOpenedModalId(row.name)}>
                  {row.name}
                </UnstyledButton>
                <IconFileText />
              </>
            ) : (
              <>
                {row.name}
                <IconFile3d />
              </>
            )
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
