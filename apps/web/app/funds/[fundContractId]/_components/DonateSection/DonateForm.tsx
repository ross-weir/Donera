"use client";

import { Anchor, Button, Grid, NumberInput } from "@mantine/core";
import { SelectToken } from "./SelectToken";
import { useState } from "react";
import { ALPH_TOKEN_ID } from "@alephium/web3";
import { ALPH } from "@alephium/token-list";
import { isInRange, useForm } from "@mantine/form";
import { getDoneraDapp, getExternalLinkForTx, getNetwork } from "@/_lib/donera";
import { getTokensForNetwork } from "@donera/dapp";
import { useWallet } from "@alephium/web3-react";
import { notifications } from "@mantine/notifications";
import { IconExternalLink } from "@tabler/icons-react";
import { handleTxSubmitError } from "@/_components/TxErrorNotification";
import { ExtractProps } from "@/_lib/types";
import { dynamicWalletButton } from "@/_components/Wallet/DynamicWalletButton";

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

const donateButtonProps: ExtractProps<typeof Button> = {
  my: "lg",
  fullWidth: true,
};

const FallbackConnectButton = dynamicWalletButton(donateButtonProps);

export function DonateForm({ fundContractId }: DonateFormProps) {
  const { signer } = useWallet();
  const form = useForm<FormSchema>({
    initialValues: { tokenId: ALPH_TOKEN_ID, amount: 0 },
    validate: { amount: isInRange({ min: 1 }, "Donation value must be supplied") },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSuccess = ({ txId }: { txId: string }) => {
    form.reset();
    notifications.show({
      title: "Donation submitted! 🎉",
      message: (
        <span>
          Your donation should be added to the fund shortly
          <br />
          View your transaction on the explorer{" "}
          <Anchor href={getExternalLinkForTx(txId)} target="_blank" rel="noreferrer">
            <IconExternalLink size={12} />.
          </Anchor>
        </span>
      ),
      autoClose: 7000,
    });
  };

  const onError = (e: Error) => {
    handleTxSubmitError(e, "Donation");
  };

  const onSubmit = (data: FormSchema) => {
    setIsSubmitting(true);
    getDoneraDapp()
      .donateToFund(signer!, { fundContractId, ...data })
      .then(onSuccess)
      .catch(onError)
      .finally(() => setIsSubmitting(false));
  };

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
      <FallbackConnectButton {...donateButtonProps}>
        <Button type="submit" {...donateButtonProps} loading={isSubmitting}>
          Donate
        </Button>
      </FallbackConnectButton>
    </form>
  );
}
