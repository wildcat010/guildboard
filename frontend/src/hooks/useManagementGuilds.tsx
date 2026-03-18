"use client";
import { useWriteContract, useReadContract } from "wagmi";
import { useAccount } from "wagmi";
import { GUILD_NFT_ADDRESS, GUILD_NFT_ABI } from "@/contracts";

export function useManagementGuild() {
  const {
    writeContract: writeGuild,
    isPending: isGuildPending,
    isSuccess: isGuildSuccess,
    isError: isGuildError,
  } = useWriteContract();

  const {
    writeContract: writeMember,
    isPending: isMemberPending,
    isSuccess: isMemberSuccess,
    isError: isMemberError,
  } = useWriteContract();

  const {
    writeContract: writeStatusGuild,
    isPending: isStatusGuildPending,
    isSuccess: isStatusGuildSuccess,
    isError: isStatusGuildError,
  } = useWriteContract();

  function enableStatus(guildId: number) {
    writeStatusGuild({
      address: GUILD_NFT_ADDRESS,
      abi: GUILD_NFT_ABI,
      functionName: "enableGuild",
      args: [guildId],
    });
  }

  function disableStatus(guildId: number) {
    writeStatusGuild({
      address: GUILD_NFT_ADDRESS,
      abi: GUILD_NFT_ABI,
      functionName: "disableGuild",
      args: [guildId],
    });
  }

  function createGuild(name: string) {
    writeGuild({
      address: GUILD_NFT_ADDRESS,
      abi: GUILD_NFT_ABI,
      functionName: "createGuild",
      args: [name],
    });
  }

  function mintMember(
    addressMember: string,
    tokenURI: string,
    selectedGuildId: number,
  ) {
    writeMember({
      address: GUILD_NFT_ADDRESS,
      abi: GUILD_NFT_ABI,
      functionName: "mintMember",
      args: [addressMember as `0x${string}`, tokenURI, BigInt(selectedGuildId)],
    });
  }

  return {
    createGuild,
    isGuildPending,
    isGuildSuccess,
    isGuildError,
    mintMember,
    isMemberPending,
    isMemberSuccess,
    isMemberError,
    enableStatus,
    disableStatus,
    isStatusGuildSuccess,
    isStatusGuildPending,
  };
}
