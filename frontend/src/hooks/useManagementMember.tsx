"use client";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { GUILD_NFT_ADDRESS, GUILD_NFT_ABI } from "@/contracts";

export function useManagementMember() {
  const {
    writeContract: writeUpgradeMember,
    isPending: isUpgradingPending,
    data: upgradeMemberHash,
  } = useWriteContract();

  const { isLoading: isUpgradingConfirming, isSuccess: isUpgradingConfirmed } =
    useWaitForTransactionReceipt({
      hash: upgradeMemberHash,
      confirmations: 1,
    });

  const {
    writeContract: writeRemoveMember,
    isPending: isRemoveMemberPending,
    data: removeMemberHash,
  } = useWriteContract();

  const {
    isLoading: isRemoveMemberConfirming,
    isSuccess: isRemoveMemberConfirmed,
  } = useWaitForTransactionReceipt({
    hash: removeMemberHash,
  });

  function upgradeMember(guildId: number, newRole: number) {
    writeUpgradeMember({
      address: GUILD_NFT_ADDRESS,
      abi: GUILD_NFT_ABI,
      functionName: "upgradeMember",
      args: [BigInt(guildId), newRole],
    });
  }

  function removeMember(guildId: number) {
    writeRemoveMember({
      address: GUILD_NFT_ADDRESS,
      abi: GUILD_NFT_ABI,
      functionName: "removeGuildMember",
      args: [BigInt(guildId)],
    });
  }

  return {
    isUpgradingPending,
    isUpgradingConfirmed,
    isUpgradingConfirming,
    upgradeMember,
    isRemoveMemberPending,
    isRemoveMemberConfirmed,
    isRemoveMemberConfirming,
    removeMember,
  };
}
