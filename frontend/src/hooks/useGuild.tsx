"use client";
import { useReadContract } from "wagmi";
import { useAccount } from "wagmi";
import { GUILD_NFT_ADDRESS, GUILD_NFT_ABI } from "@/contracts";
import { useQueryClient } from "@tanstack/react-query";

export function useGuild(limit = 5) {
  const { address, isConnected } = useAccount();
  const queryClient = useQueryClient();

  const { data: contractOwner } = useReadContract({
    address: GUILD_NFT_ADDRESS,
    abi: GUILD_NFT_ABI,
    functionName: "owner",
    query: { enabled: isConnected, retry: false },
  });

  const isOwner =
    isConnected &&
    address?.toLowerCase() === (contractOwner as string)?.toLowerCase();

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
    query: { enabled: isOwner, retry: false },
  });

  const { data: guildCount, refetch: refetchGuildsCount } = useReadContract({
    address: GUILD_NFT_ADDRESS,
    abi: GUILD_NFT_ABI,
    functionName: "getGuildCount",
    query: { enabled: isOwner, retry: false },
  });

  const { data: guildCountLimit, refetch: refetchGuildsLimit } =
    useReadContract({
      address: GUILD_NFT_ADDRESS,
      abi: GUILD_NFT_ABI,
      functionName: "getRecentGuilds",
      args: [BigInt(limit)],
      query: { enabled: isOwner, retry: false },
    });

  return {
    isMember,
    guilds,
    guildCount,
    guildCountLimit,
    isOwner,
    refetchGuilds,
    refetchGuildsCount,
    refetchGuildsLimit,
  };
}
