"use client";
import { useReadContract } from "wagmi";
import { useAccount } from "wagmi";
import { GUILDBOARD_ADDRESS, GUILDBOARD_ABI } from "@/contracts";

export function useSettings() {
  const { isConnected } = useAccount();

  const { data: isPaused } = useReadContract({
    address: GUILDBOARD_ADDRESS,
    abi: GUILDBOARD_ABI,
    functionName: "paused",
    query: { enabled: isConnected },
  });

  return {
    isPaused,
  };
}
