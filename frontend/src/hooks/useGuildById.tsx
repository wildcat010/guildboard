"use client";
import { useReadContract } from "wagmi";
import { useAccount } from "wagmi";
import { GUILD_NFT_ADDRESS, GUILD_NFT_ABI } from "@/contracts";

export function useGuildById(guildId: number) {
  const { isConnected } = useAccount();

  const { data: guildMembers, refetch: refetchGuildMembers } = useReadContract({
    address: GUILD_NFT_ADDRESS,
    abi: GUILD_NFT_ABI,
    functionName: "getGuildMembers",
    args: [BigInt(guildId ?? 0)],
    query: {
      enabled: isConnected && guildId > 0,
      retry: false,
      retryOnMount: false,
      gcTime: 0,
    },
  });

  const { data: getGuildById } = useReadContract({
    address: GUILD_NFT_ADDRESS,
    abi: GUILD_NFT_ABI,
    functionName: "getGuild",
    args: [BigInt(guildId ?? 0)],
    query: {
      enabled: isConnected && guildId > 0,
      retry: false,
      retryOnMount: false,
      gcTime: 0,
    },
  });

  return {
    guildMembers: (guildMembers as number[]) ?? [],
    refetchGuildMembers,
    getGuildById,
  };
}
