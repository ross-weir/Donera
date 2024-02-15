"use client";

import { NodeProvider, web3 } from "@alephium/web3";
import { useWallet } from "@alephium/web3-react";
import { useEffect } from "react";

function tryGetNodeProvider(): NodeProvider | undefined {
  try {
    return web3.getCurrentNodeProvider();
  } catch {
    return;
  }
}

// Try ensure alephium web3 required globals are always set
export default function AlephiumWeb3({ children }: { children: React.ReactNode }) {
  const { signer } = useWallet();

  useEffect(() => {
    const currentNode = tryGetNodeProvider();

    if (signer?.nodeProvider && !currentNode) {
      web3.setCurrentNodeProvider(signer.nodeProvider);
    }
  }, [signer]);

  return <>{children}</>;
}
