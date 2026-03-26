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
  } = useWriteContract();

  const {
    writeContract: writeUpdateTask,
    isPending: isTaskUpdatePending,
    isSuccess: isTaskUpdateSuccess,
    isError: isTaskUpdateError,
    error: taskUpdateError,
  } = useWriteContract();

  useEffect(() => {
    if (taskUpdateError) console.error("updateTask error:", taskUpdateError);
  }, [taskUpdateError]);

  function createTask(name: string, description: string, reward: bigint) {
    writeTask({
      address: GUILDBOARD_ADDRESS,
      abi: GUILDBOARD_ABI,
      functionName: "createTask",
      args: [name, description, reward],
    });
  }

  function updateTask(
    taskId: bigint,
    name: string,
    description: string,
    reward: bigint,
    guildId: bigint,
  ) {
    writeUpdateTask({
      address: GUILDBOARD_ADDRESS,
      abi: GUILDBOARD_ABI,
      functionName: "updateTask",
      args: [taskId, name, description, reward, guildId],
    });
  }

  return {
    isTaskPending,
    isTaskSuccess,
    isTaskError,
    createTask,
    isTaskUpdatePending,
    isTaskUpdateSuccess,
    isTaskUpdateError,
    updateTask,
  };
}
