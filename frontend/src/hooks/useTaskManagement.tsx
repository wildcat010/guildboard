"use client";
import { useWriteContract } from "wagmi";
import { GUILDBOARD_ADDRESS, GUILDBOARD_ABI } from "@/contracts";
import { parseEther, parseUnits } from "ethers";
import { useEffect } from "react";

export function useTaskManagement() {
  const {
    writeContract: writeTask,
    isPending: isTaskPending,
    isSuccess: isTaskSuccess,
    isError: isTaskError,
    error: taskError,
  } = useWriteContract();

  useEffect(() => {
    if (taskError) console.error("createTask error:", taskError);
  }, [taskError]);

  function createTask(name: string, description: string, reward: bigint) {
    writeTask({
      address: GUILDBOARD_ADDRESS,
      abi: GUILDBOARD_ABI,
      functionName: "createTask",
      args: [name, description, reward],
    });
  }

  return {
    isTaskPending,
    isTaskSuccess,
    isTaskError,
    createTask,
  };
}
