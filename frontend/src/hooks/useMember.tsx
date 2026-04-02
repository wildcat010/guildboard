"use client";
import { useReadContract } from "wagmi";
import { useAccount } from "wagmi";
import { GUILD_NFT_ADDRESS, GUILD_NFT_ABI } from "@/contracts";

export function useMember(memberId: number = 0, adr: string = "") {
  const { isConnected } = useAccount();

  const { data: getMemberById, refetch: refetchMember } = useReadContract({
    address: GUILD_NFT_ADDRESS,
    abi: GUILD_NFT_ABI,
    functionName: "getMember",
    args: [memberId],
    query: {
      enabled: isConnected && memberId > 0,
      retry: false,
    },
  });

  const { data: getAllMembers, refetch: refetchAllMember } = useReadContract({
    address: GUILD_NFT_ADDRESS,
    abi: GUILD_NFT_ABI,
    functionName: "getAllMembers",
    query: { enabled: isConnected, retry: false },
  });

  const {
    data: getMemberByAddress,
    error,
    isLoading,
  } = useReadContract({
    address: GUILD_NFT_ADDRESS,
    abi: GUILD_NFT_ABI,
    functionName: "getMemberByAddress",
    args: [adr as `0x${string}`],
    query: { enabled: isConnected, retry: false },
  });

  console.log("error", error);
  console.log("isLoading", isLoading);

  return {
    getMemberById,
    refetchMember,
    getAllMembers,
    refetchAllMember,
    getMemberByAddress,
  };
}
