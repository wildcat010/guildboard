"use client";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import {
  GUILDBOARD_ADDRESS,
  GUILDBOARD_ABI,
  GUILD_NFT_ADDRESS,
  GUILD_NFT_ABI,
} from "@/contracts";

export function useNewOwner() {
  const { writeContract: writeNewOwner, isPending: isNewOwnerPending } =
    useWriteContract();

  function setNewOwner(newOwner: string) {
    writeNewOwner({
      address: GUILD_NFT_ADDRESS,
      abi: GUILD_NFT_ABI,
      functionName: "transferOwnership",
      args: [newOwner],
    });
  }

  return {
    setNewOwner,
    isNewOwnerPending,
  };
}
