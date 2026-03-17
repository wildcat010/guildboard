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
    isOwner,
  };
}
