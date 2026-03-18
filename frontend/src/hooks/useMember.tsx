"use client";
import { useReadContract } from "wagmi";
import { useAccount } from "wagmi";
import { GUILD_NFT_ADDRESS, GUILD_NFT_ABI } from "@/contracts";

export function useMember(memberAddress?: string) {
  const { address, isConnected } = useAccount();

  const { data: contractOwner } = useReadContract({
    address: GUILD_NFT_ADDRESS,
    abi: GUILD_NFT_ABI,
    functionName: "owner",
    query: { enabled: isConnected },
  });

  const isOwner =
    isConnected &&
    address?.toLowerCase() === (contractOwner as string)?.toLowerCase();

  const { data: roleByWallet } = useReadContract({
    address: GUILD_NFT_ADDRESS,
    abi: GUILD_NFT_ABI,
    functionName: "getRoleByWallet",
    args: [memberAddress ?? address],
    query: { enabled: isConnected && !!(memberAddress ?? address) },
  });

  const { data: role } = useReadContract({
    address: GUILD_NFT_ADDRESS,
    abi: GUILD_NFT_ABI,
    functionName: "getRoleByWallet",
    args: [address],
    query: { enabled: isOwner },
  });

  return {
    roleByWallet,
    isOwner,
    role,
  };
}
