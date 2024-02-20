import { Autocomplete } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";

export function SearchBar() {
  return (
    <Autocomplete disabled leftSection={<IconSearch />} placeholder="Search funds (Coming soon)" />
  );
}
