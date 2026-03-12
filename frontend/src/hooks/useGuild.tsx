"use client";
import { useReadContract } from "wagmi";
import { useAccount } from "wagmi";
import { GUILD_NFT_ADDRESS, GUILD_NFT_ABI } from "@/contracts";

export function useGuild() {
  const { address, isConnected } = useAccount();

  const { data: isMember } = useReadContract({
    address: GUILD_NFT_ADDRESS,
    abi: GUILD_NFT_ABI,
    functionName: "isMember",
    args: [address],
  });

  const { data: contractOwner } = useReadContract({
    address: GUILD_NFT_ADDRESS,
    abi: GUILD_NFT_ABI,
    functionName: "owner",
    query: { enabled: isConnected },
  });

  const { data: guilds } = useReadContract({
    address: GUILD_NFT_ADDRESS,
    abi: GUILD_NFT_ABI,
    functionName: "getAllGuilds",
  });

  const { data: role } = useReadContract({
    address: GUILD_NFT_ADDRESS,
    abi: GUILD_NFT_ABI,
    functionName: "getRoleByWallet",
    args: [address],
  });

  const isOwner =
    isConnected &&
    address?.toLowerCase() === (contractOwner as string)?.toLowerCase();

  return { isMember, guilds, role, isOwner };
}
