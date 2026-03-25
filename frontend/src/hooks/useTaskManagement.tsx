"use client";
import { useWriteContract } from "wagmi";
import { GUILDBOARD_ADDRESS, GUILDBOARD_ABI } from "@/contracts";
import { parseEther, parseUnits } from "ethers";

export function useTaskManagement() {
  const {
    writeContract: writeTask,
    isPending: isTaskPending,
    isSuccess: isTaskSuccess,
    isError: isTaskError,
  } = useWriteContract();

  function createTask(
    name: string,
    description: string,
    reward: bigint,
    depositInGwei: bigint = BigInt(0),
  ) {
    writeTask({
      address: GUILDBOARD_ADDRESS,
      abi: GUILDBOARD_ABI,
      functionName: "createTask",
      args: [name, description, reward],
      value: depositInGwei,
    });
  }

  return {
    isTaskPending,
    isTaskSuccess,
    isTaskError,
    createTask,
  };
}
