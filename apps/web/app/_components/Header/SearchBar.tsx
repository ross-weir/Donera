import { Autocomplete } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";

export function SearchBar() {
  return (
    <Autocomplete
      disabled
      leftSection={<IconSearch size={16} />}
      placeholder="Search funds (Coming soon)"
    />
  );
}
