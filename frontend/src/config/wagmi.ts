import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { hardhat, sepolia } from "wagmi/chains";
import { http, webSocket } from "wagmi";

export const config = getDefaultConfig({
  appName: "GuildBoard",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  chains: [hardhat, sepolia],
  transports: {
    [sepolia.id]: webSocket(
      "wss://eth-sepolia.g.alchemy.com/v2/fKAEOsW0bPfVJ-Blws3PL",
    ),
    [hardhat.id]: http("http://127.0.0.1:8545"),
  },
  ssr: true,
});
