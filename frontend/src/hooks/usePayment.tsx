"use client";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { GUILDBOARD_ADDRESS, GUILDBOARD_ABI } from "@/contracts";

export function usePayment() {
  const {
    writeContract: writePaidTask,
    isPending: isPaidTaskPending,
    data: paidTaskHash,
  } = useWriteContract();

  const { isLoading: isPaidTaskConfirming, isSuccess: isPaidTaskConfirmed } =
    useWaitForTransactionReceipt({
      hash: paidTaskHash,
    });

  function paidAndCloseQuest(taskId: bigint) {
    writePaidTask({
      address: GUILDBOARD_ADDRESS,
      abi: GUILDBOARD_ABI,
      functionName: "closeAndPayTask",
      args: [taskId],
    });
  }

  const {
    writeContract: writeWithdrawal,
    isPending: isWithdrawalPending,
    data: withdrawalHash,
  } = useWriteContract();

  const {
    isLoading: isWithdrawalConfirming,
    isSuccess: isWithdrawalConfirmed,
  } = useWaitForTransactionReceipt({
    hash: withdrawalHash,
  });

  function withdrawTo(to: string, amount: bigint) {
    writeWithdrawal({
      address: GUILDBOARD_ADDRESS,
      abi: GUILDBOARD_ABI,
      functionName: "withdrawTo",
      args: [to, amount],
    });
  }

  return {
    isPaidTaskPending,
    isPaidTaskConfirming,
    isPaidTaskConfirmed,
    paidAndCloseQuest,
    withdrawTo,
    isWithdrawalPending,
    isWithdrawalConfirming,
    isWithdrawalConfirmed,
  };
}
