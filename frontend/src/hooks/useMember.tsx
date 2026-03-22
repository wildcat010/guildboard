"use client";
import { useReadContract } from "wagmi";
import { useAccount } from "wagmi";
import { GUILD_NFT_ADDRESS, GUILD_NFT_ABI } from "@/contracts";

export function useMember(memberId: number) {
  const { isConnected } = useAccount();

  const { data: getMemberById, refetch: refetchMember } = useReadContract({
    address: GUILD_NFT_ADDRESS,
    abi: GUILD_NFT_ABI,
    functionName: "getMember",
    args: [memberId],
    query: { enabled: isConnected },
  });

  return {
    getMemberById,
    refetchMember,
  };
}
