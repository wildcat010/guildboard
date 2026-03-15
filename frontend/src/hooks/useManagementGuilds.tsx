"use client";
import { useWriteContract, useReadContract } from "wagmi";
import { useAccount } from "wagmi";
import { GUILD_NFT_ADDRESS, GUILD_NFT_ABI } from "@/contracts";

export function useManagementGuild() {
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

  const { writeContract, isPending, isSuccess, isError } = useWriteContract();

  function createGuild(name: string) {
    writeContract({
      address: GUILD_NFT_ADDRESS,
      abi: GUILD_NFT_ABI,
      functionName: "createGuild",
      args: [name],
    });
  }

  return { createGuild, isOwner, isPending, isSuccess, isError };
}
