"use client";
import { useWriteContract } from "wagmi";
import { GUILDBOARD_ADDRESS, GUILDBOARD_ABI } from "@/contracts";

export function usePayment() {
  const {
    writeContract: writePaidTask,
    isPending: isPaidTaskPending,
    isSuccess: isPaidTaskSuccess,
    isError: isPaidTaskError,
  } = useWriteContract();

  function paidAndCloseQuest(taskId: bigint) {
    writePaidTask({
      address: GUILDBOARD_ADDRESS,
      abi: GUILDBOARD_ABI,
      functionName: "closeAndPayTask",
      args: [taskId],
    });
  }

  return {
    isPaidTaskPending,
    isPaidTaskSuccess,
    isPaidTaskError,
    paidAndCloseQuest,
  };
}
