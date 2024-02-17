import {
  Avatar,
  Combobox,
  ComboboxDropdownProps,
  Group,
  InputBase,
  Text,
  useCombobox,
} from "@mantine/core";

interface Item {
  symbol: string;
  value: string;
  imageSrc?: string;
}

function SelectOption({ symbol, imageSrc }: Item) {
  return (
    <Group>
      <Avatar size="xs" src={imageSrc} />
      <Text fz="sm" fw={500}>
        {symbol}
      </Text>
    </Group>
  );
}

export type SelectTokenProps = {
  data: Item[];
  value?: string;
  onChange: (value: string) => void;
  dropdownProps?: ComboboxDropdownProps;
};

export function SelectToken({ value, onChange, data, dropdownProps = {} }: SelectTokenProps) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });
  const selectedOption = data.find((i) => i.value === value)!;
  const options = data.map((item) => (
    <Combobox.Option value={item.value} key={item.value}>
      <SelectOption {...item} />
    </Combobox.Option>
  ));

  return (
    <Combobox
      store={combobox}
      withinPortal={false}
      onOptionSubmit={(val) => {
        onChange(val);
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <InputBase
          component="button"
          type="button"
          pointer
          rightSection={<Combobox.Chevron />}
          onClick={() => combobox.toggleDropdown()}
          rightSectionPointerEvents="none"
          multiline
        >
          <SelectOption {...selectedOption} />
        </InputBase>
      </Combobox.Target>

      <Combobox.Dropdown {...dropdownProps}>
        <Combobox.Options>{options}</Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
