import { Button, Grid, NumberInput } from "@mantine/core";
import { SelectToken } from "./SelectToken";
import { useState } from "react";
import { ALPH_TOKEN_ID } from "@alephium/web3";
import { ALPH } from "@alephium/token-list";
import { isInRange, useForm } from "@mantine/form";
import { getDoneraDapp, getNetwork } from "../../../../_lib/donera";
import { getTokensForNetwork } from "@donera/dapp";
import { useWallet } from "@alephium/web3-react";

const tokens = [
  {
    ...ALPH,
    logoURI:
      "https://raw.githubusercontent.com/alephium/alephium-brand-guide/master/logos/grey/Logo-Icon-Grey.png",
  },
  ...getTokensForNetwork(getNetwork()),
].map((t) => ({
  symbol: t.symbol,
  value: t.id,
  decimals: t.decimals,
  imageSrc: t.logoURI,
}));

type FormSchema = {
  tokenId: string;
  amount: number;
};

export type DonateFormProps = {
  fundContractId: string;
};

export function DonateForm({ fundContractId }: DonateFormProps) {
  const { signer } = useWallet();
  const form = useForm<FormSchema>({
    initialValues: { tokenId: ALPH_TOKEN_ID, amount: 0 },
    validate: { amount: isInRange({ min: 1 }, "Donation value must be supplied") },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = (form: FormSchema) => {
    console.log(form);
    setIsSubmitting(true);
    getDoneraDapp()
      .donateToFund(signer!, { fundContractId, ...form })
      .then(console.log)
      .catch(console.error)
      .finally(() => setIsSubmitting(false));

    setIsSubmitting(false);
  };
  /** "donate" (or connect wallet) button, should be disabled if unconfirmed */
  /** message that cant donate until confirmed */

  return (
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
  );
}
