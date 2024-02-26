import { TokenIcon } from "@/_components/TokenIcon";
import {
  Combobox,
  ComboboxDropdownProps,
  ComboboxProps,
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

function SelectOption({ symbol, value }: Item) {
  return (
    <Group>
      <TokenIcon tokenId={value} size="xs" />
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
} & ComboboxProps;

export function SelectToken({
  value,
  onChange,
  data,
  dropdownProps = {},
  disabled,
  ...rest
}: SelectTokenProps) {
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
      disabled={disabled}
      {...rest}
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
          disabled={disabled}
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
