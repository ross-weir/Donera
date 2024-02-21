import { useBalance, useWallet } from "@alephium/web3-react";
import { Menu } from "@mantine/core";

// pass in disconnect func
export function WalletMenu() {
  // get wallet th
  const { account } = useWallet();
  const balance = useBalance();

  return <Menu></Menu>;
}
