"use client";
import { useWriteContract } from "wagmi";
import { GUILDBOARD_ADDRESS, GUILDBOARD_ABI } from "@/contracts";
import { parseEther } from "viem";

export function useDeposit() {
  const {
    writeContract: writeDeposit,
    isPending: isDepositPending,
    isSuccess: isDepositSuccess,
    isError: isDepositError,
  } = useWriteContract();

  function deposit(amountInEth: string) {
    writeDeposit({
      address: GUILDBOARD_ADDRESS,
      abi: GUILDBOARD_ABI,
      functionName: "deposit",
      value: parseEther(amountInEth), // converts "0.1" → wei
    });
  }

  return {
    deposit,
    isDepositPending,
    isDepositSuccess,
    isDepositError,
  };
}
