"use client";
import { useWriteContract } from "wagmi";
import { GUILD_NFT_ADDRESS, GUILD_NFT_ABI } from "@/contracts";

export function useManagementMember() {
  const {
    writeContract: writeUpgradeMember,
    isPending: isUpgradingPending,
    isSuccess: isUpgradingSuccess,
    isError: isUpgradingError,
  } = useWriteContract();

  const {
    writeContract: writeRemoveMember,
    isPending: isRemoveMemberPending,
    isSuccess: isRemoveMemberSuccess,
    isError: isRemoveMemberError,
  } = useWriteContract();

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
    isUpgradingSuccess,
    isUpgradingError,
    upgradeMember,
    isRemoveMemberPending,
    isRemoveMemberSuccess,
    isRemoveMemberError,
    removeMember,
  };
}
