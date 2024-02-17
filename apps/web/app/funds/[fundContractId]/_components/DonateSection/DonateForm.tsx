import { Button, Grid, NumberInput, Space, Title } from "@mantine/core";
import { SelectToken } from "./SelectToken";
import { useState } from "react";
import { ALPH_TOKEN_ID } from "@alephium/web3";
import { mainnetTokensMetadata } from "@alephium/token-list";
import { isInRange, useForm } from "@mantine/form";

const otherTokens = mainnetTokensMetadata.tokens.map((t) => ({
  symbol: t.symbol,
  value: t.id,
  imageSrc: t.logoURI,
}));
const tokens = [
  {
    symbol: "ALPH",
    value: ALPH_TOKEN_ID,
    imageSrc:
      "https://raw.githubusercontent.com/alephium/alephium-brand-guide/master/logos/grey/Logo-Icon-Grey.png",
  },
  ...otherTokens,
];

type FormSchema = {
  tokenId: string;
  amount: number;
};

export function DonateForm() {
  const form = useForm<FormSchema>({
    initialValues: { tokenId: ALPH_TOKEN_ID, amount: 0 },
    validate: { amount: isInRange({ min: 1 }, "Donation value must be supplied") },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = (form: FormSchema) => {
    setIsSubmitting(true);
    console.log(form);

    setIsSubmitting(false);
  };
  /** "donate" (or connect wallet) button, should be disabled if unconfirmed */
  /** message that cant donate until confirmed */
  // TODO:need to convert the value based on the tokens decimals

  return (
    <>
      <Title order={4}>Make a donation</Title>
      <Space h="md" />
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Grid>
          <Grid.Col span={7} pr={0}>
            <NumberInput required hideControls decimalScale={2} {...form.getInputProps("amount")} />
          </Grid.Col>
          <Grid.Col span={5} pl={0}>
            <SelectToken
              data={tokens}
              dropdownProps={{ mah: 200, style: { overflowY: "auto" } }}
              {...form.getInputProps("tokenId")}
            />
          </Grid.Col>
        </Grid>
        <Button type="submit" mt="lg" fullWidth loading={isSubmitting}>
          Donate
        </Button>
      </form>
    </>
  );
}
