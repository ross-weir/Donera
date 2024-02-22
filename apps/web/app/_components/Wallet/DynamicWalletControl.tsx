/**
 * Dynamically loaded wallet button
 * Fixes the loading jank of wallet connect button.
 * Only noticable on first load in dev envs, maybe also on slow connections?
 * Still probably worth having if it prevents jank for laggy users
 */

import { ExtractProps } from "@/_lib/types";
import { Button } from "@mantine/core";
import { ConnectButtonLoader } from "./WalletButton";
import dynamic from "next/dynamic";
import { WalletIconLoader, WalletIconProps } from "./WalletIcon";

type ButtonProps = ExtractProps<typeof Button>;

export const dynamicWalletButton = (loaderProps: ButtonProps = {}) =>
  dynamic<ButtonProps>(() => import("./WalletButton"), {
    ssr: false,
    loading: () => <ConnectButtonLoader {...loaderProps} />,
  });

export const dynamicWalletIcon = (loaderProps: WalletIconProps) =>
  dynamic(() => import("./WalletIcon"), {
    ssr: false,
    loading: () => <WalletIconLoader {...loaderProps} />,
  });
