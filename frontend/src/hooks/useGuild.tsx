"use client";
import { useReadContract } from "wagmi";
import { useAccount } from "wagmi";
import { GUILD_NFT_ADDRESS, GUILD_NFT_ABI } from "@/contracts";
import { useQueryClient } from "@tanstack/react-query";

export function useGuild(limit = 5, guildState = 0) {
  const { address, isConnected } = useAccount();

  const { data: contractOwner, refetch: refetchOwner } = useReadContract({
    address: GUILD_NFT_ADDRESS,
    abi: GUILD_NFT_ABI,
    functionName: "owner",
    query: { enabled: isConnected },
  });

  const isOwner =
    address &&
    contractOwner &&
    address.toLowerCase() === (contractOwner as string).toLowerCase();

  const { data: isMember } = useReadContract({
    address: GUILD_NFT_ADDRESS,
    abi: GUILD_NFT_ABI,
    functionName: "isMember",
    args: [address],
    query: { retry: false },
  });

  const { data: guilds, refetch: refetchGuilds } = useReadContract({
    address: GUILD_NFT_ADDRESS,
    abi: GUILD_NFT_ABI,
    functionName: "getAllGuilds",
    args: [guildState],
    query: { retry: false },
  });

  const { data: activeGuildCount, refetch: refetchCounterActive } =
    useReadContract({
      address: GUILD_NFT_ADDRESS,
      abi: GUILD_NFT_ABI,
      functionName: "getGuildCountByState",
      args: [1], // Active
      query: { retry: false },
    });

  const { data: inactiveGuildCount, refetch: refetchCounterInactive } =
    useReadContract({
      address: GUILD_NFT_ADDRESS,
      abi: GUILD_NFT_ABI,
      functionName: "getGuildCountByState",
      args: [2], // Inactive
      query: { retry: false },
    });

  const { data: guildCount, refetch: refetchGuildsCount } = useReadContract({
    address: GUILD_NFT_ADDRESS,
    abi: GUILD_NFT_ABI,
    functionName: "getGuildCount",
    query: { retry: false },
  });

  const { data: guildCountLimit, refetch: refetchGuildsLimit } =
    useReadContract({
      address: GUILD_NFT_ADDRESS,
      abi: GUILD_NFT_ABI,
      functionName: "getRecentGuilds",
      args: [BigInt(limit)],
      query: { retry: false },
    });

  return {
    isMember,
    guilds,
    guildCount,
    guildCountLimit,
    refetchGuilds,
    refetchGuildsCount,
    refetchGuildsLimit,
    activeGuildCount,
    inactiveGuildCount,
    refetchCounterActive,
    refetchCounterInactive,
    isOwner,
    contractOwner,
    refetchOwner,
  };
}
