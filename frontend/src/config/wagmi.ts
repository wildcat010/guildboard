import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { hardhat, sepolia } from "wagmi/chains";
import { http, webSocket } from "wagmi";

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL;

export const config = getDefaultConfig({
  appName: "GuildBoard",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(
      RPC_URL || "https://eth-sepolia.g.alchemy.com/v2/DEFAULT_KEY",
    ),
  },
  ssr: true,
});
