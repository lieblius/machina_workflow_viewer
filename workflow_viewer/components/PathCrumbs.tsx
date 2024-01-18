"use client";

import React, { useEffect, useState } from "react";
import { Breadcrumbs, Anchor, useMantineTheme, Text } from "@mantine/core";
import Link from "next/link";

interface PathCrumbsProps {
  uuidToNames: { [key: string]: string };
}

export default function PathCrumbs({ uuidToNames = {} }: PathCrumbsProps) {
  const theme = useMantineTheme();
  const [items, setItems] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    const path = window.location.pathname.split("/").filter((x) => x);

    const breadcrumbItems = path.map((uuid, index) => {
      const routeTo = `/${path.slice(0, index + 1).join("/")}`;
      return (
        <Anchor component={Link} href={routeTo} key={index}>
          {uuid in uuidToNames ? uuidToNames[uuid] : "..."}
        </Anchor>
      );
    });

    setItems(breadcrumbItems);
  }, [uuidToNames]);

  return (
    <>
      {items.length ? <Text c={theme.colors.dark[2]}>/&nbsp;&nbsp;</Text> : ""}
      <Breadcrumbs
        mih="2rem"
        styles={{ breadcrumb: { color: theme.colors.dark[2] } }}
      >
        {items}
      </Breadcrumbs>
    </>
  );
}
