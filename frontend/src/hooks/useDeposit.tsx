"use client";
import { useReadContract, useWriteContract } from "wagmi";
import { GUILDBOARD_ADDRESS, GUILDBOARD_ABI } from "@/contracts";
import { parseEther } from "viem";

export function useDeposit() {
  const {
    writeContract: writeDeposit,
    isPending: isDepositPending,
    isSuccess: isDepositSuccess,
    isError: isDepositError,
  } = useWriteContract();

  function deposit(name: string, date: string, amountInEth: string) {
    writeDeposit({
      address: GUILDBOARD_ADDRESS,
      abi: GUILDBOARD_ABI,
      functionName: "deposit",
      args: [name, date],
      value: parseEther(amountInEth), // converts "0.1" → wei
    });
  }

  const { data: deposits, refetch: refetchDeposits } = useReadContract({
    address: GUILDBOARD_ADDRESS,
    abi: GUILDBOARD_ABI,
    functionName: "getAllDeposits",
    query: { retry: false },
  });

  return {
    deposit,
    isDepositPending,
    isDepositSuccess,
    isDepositError,
    deposits,
    refetchDeposits,
  };
}
