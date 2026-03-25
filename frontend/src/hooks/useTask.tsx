"use client";
import { useReadContract } from "wagmi";
import { useAccount } from "wagmi";
import { GUILDBOARD_ADDRESS, GUILDBOARD_ABI } from "@/contracts";

export function useTask(taskId: number = 0) {
  const { isConnected } = useAccount();

  const { data: getTaskById, refetch: refetchTaskById } = useReadContract({
    address: GUILDBOARD_ADDRESS,
    abi: GUILDBOARD_ABI,
    functionName: "getTask",
    args: [taskId],
    query: {
      enabled: isConnected && taskId > 0,
      retry: false,
    },
  });

  const { data: getAllTasks, refetch: refetchAllTasks } = useReadContract({
    address: GUILDBOARD_ADDRESS,
    abi: GUILDBOARD_ABI,
    functionName: "getAllTasks",
    query: { enabled: isConnected, retry: false },
  });

  return {
    getTaskById,
    refetchTaskById,
    getAllTasks,
    refetchAllTasks,
  };
}
