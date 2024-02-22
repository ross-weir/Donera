"use client";
import { TextInput } from "@mantine/core";
import { useDebouncedState } from "@mantine/hooks";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ExtractProps } from "@/_lib/types";
import { IconSearch } from "@tabler/icons-react";
import classes from "./SearchInput.module.css";

export function SearchInput(
  props: Omit<ExtractProps<typeof TextInput>, "defaultValue" | "onChange">
) {
  const [value, setValue] = useDebouncedState("", 750);
  const router = useRouter();

  useEffect(() => {
    const path = value ? `/browse?s=${value}` : "/browse";
    router.push(path);
  }, [value, router]);

  return (
    <TextInput
      {...props}
      className={classes.root}
      autoFocus
      placeholder="Search fundraisers"
      leftSection={<IconSearch size={14} />}
      defaultValue={value}
      onChange={(event) => setValue(event.currentTarget.value)}
    />
  );
}
