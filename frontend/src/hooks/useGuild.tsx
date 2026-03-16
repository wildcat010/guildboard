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
    query: { enabled: isConnected },
  });

  const isOwner =
    isConnected &&
    address?.toLowerCase() === (contractOwner as string)?.toLowerCase();

  const { data: isMember } = useReadContract({
    address: GUILD_NFT_ADDRESS,
    abi: GUILD_NFT_ABI,
    functionName: "isMember",
    args: [address],
  });

  const { data: guilds, refetch: refetchGuilds } = useReadContract({
    address: GUILD_NFT_ADDRESS,
    abi: GUILD_NFT_ABI,
    functionName: "getAllGuilds",
    query: { enabled: isOwner },
  });

  const { data: role } = useReadContract({
    address: GUILD_NFT_ADDRESS,
    abi: GUILD_NFT_ABI,
    functionName: "getRoleByWallet",
    args: [address],
    query: { enabled: isOwner },
  });

  const { data: guildCount, refetch: refetchGuildsCount } = useReadContract({
    address: GUILD_NFT_ADDRESS,
    abi: GUILD_NFT_ABI,
    functionName: "getGuildCount",
    query: { enabled: isOwner },
  });

  const { data: guildCountLimit, refetch: refetchGuildsLimit } =
    useReadContract({
      address: GUILD_NFT_ADDRESS,
      abi: GUILD_NFT_ABI,
      functionName: "getRecentGuilds",
      args: [BigInt(limit)],
      query: { enabled: isOwner },
    });

  console.log("contractOwner:", contractOwner);
  console.log("address:", address);
  console.log("isOwner:", isOwner);
  console.log("guilds:", guilds);
  console.log("guildCount:", guildCount);
  console.log("guildCountLimit:", guildCountLimit);

  return {
    isMember,
    guilds,
    guildCount,
    guildCountLimit,
    role,
    isOwner,
    refetchGuilds,
    refetchGuildsCount,
    refetchGuildsLimit,
  };
}
