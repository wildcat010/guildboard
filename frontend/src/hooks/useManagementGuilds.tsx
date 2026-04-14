"use client";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { GUILD_NFT_ADDRESS, GUILD_NFT_ABI } from "@/contracts";

export function useManagementGuild() {
  const {
    writeContract: writeGuild,
    isPending: isGuildPending,
    data: guildHash,
  } = useWriteContract();

  const { isLoading: isGuildConfirming, isSuccess: isGuildConfirmed } =
    useWaitForTransactionReceipt({
      hash: guildHash,
    });

  const {
    writeContract: writeMember,
    isPending: isMemberPending,
    data: memberHash,
  } = useWriteContract();

  const { isLoading: isMemberConfirming, isSuccess: isMemberConfirmed } =
    useWaitForTransactionReceipt({
      hash: memberHash,
    });

  const {
    writeContract: writeStatusGuild,
    isPending: isStatusGuildPending,
    data: guildStatusHash,
  } = useWriteContract();

  const {
    isLoading: isStatusGuildConfirming,
    isSuccess: isStatusGuildConfirmed,
  } = useWaitForTransactionReceipt({
    hash: guildStatusHash,
  });

  function enableStatus(guildId: number) {
    writeStatusGuild({
      address: GUILD_NFT_ADDRESS,
      abi: GUILD_NFT_ABI,
      functionName: "enableGuild",
      args: [BigInt(guildId)],
    });
  }

  function disableStatus(guildId: number) {
    writeStatusGuild({
      address: GUILD_NFT_ADDRESS,
      abi: GUILD_NFT_ABI,
      functionName: "disableGuild",
      args: [BigInt(guildId)],
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
    name: string,
    addressMember: string,
    tokenURI: string,
    selectedGuildId: number,
  ) {
    writeMember({
      address: GUILD_NFT_ADDRESS,
      abi: GUILD_NFT_ABI,
      functionName: "mintMember",
      args: [
        name,
        addressMember as `0x${string}`,
        tokenURI,
        BigInt(selectedGuildId),
      ],
    });
  }

  return {
    createGuild,
    isGuildPending,
    mintMember,
    isMemberPending,
    isMemberConfirmed,
    isMemberConfirming,
    enableStatus,
    disableStatus,
    isStatusGuildConfirmed,
    isStatusGuildConfirming,
    isStatusGuildPending,
    isGuildConfirming,
    isGuildConfirmed,
  };
}
