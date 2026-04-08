"use client";
import { useWriteContract } from "wagmi";
import { GUILDBOARD_ADDRESS, GUILDBOARD_ABI } from "@/contracts";
import { useEffect } from "react";

export function useTaskManagement() {
  const {
    writeContract: writeCreateTask,
    isPending: isTaskCreatePending,
    isSuccess: isTaskCreateSuccess,
    isError: isTaskCreateError,
  } = useWriteContract();

  const {
    writeContract: writeUpdateTask,
    isPending: isTaskUpdatePending,
    isSuccess: isTaskUpdateSuccess,
    isError: isTaskUpdateError,
    error: taskUpdateError,
    reset: resetUpdateTask,
  } = useWriteContract();

  const {
    writeContract: writeUpdateTaskStatus,
    isPending: isTaskStatusPending,
    isSuccess: isTaskStatusSuccess,
    isError: isTaskStatusError,
  } = useWriteContract();

  const {
    writeContract: writeCloseAndPay,
    isPending: isCloseAndPayPending,
    isSuccess: isCloseAndPaySuccess,
    isError: isCloseAndPayError,
  } = useWriteContract();

  function createTask(name: string, description: string, reward: bigint) {
    writeCreateTask({
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
    assignee: string,
  ) {
    writeUpdateTask({
      address: GUILDBOARD_ADDRESS,
      abi: GUILDBOARD_ABI,
      functionName: "updateTaskAndAssign",
      args: [taskId, name, description, reward, guildId, assignee],
    });
  }

  function updateTaskStatus(
    taskId: bigint,
    newStatus: number,
    assignee: string,
  ) {
    writeUpdateTaskStatus({
      address: GUILDBOARD_ADDRESS,
      abi: GUILDBOARD_ABI,
      functionName: "updateTaskStatus",
      args: [taskId, newStatus, assignee],
    });
  }

  function closeAndPayTask(taskId: bigint) {
    writeCloseAndPay({
      address: GUILDBOARD_ADDRESS,
      abi: GUILDBOARD_ABI,
      functionName: "closeAndPayTask",
      args: [taskId],
    });
  }

  useEffect(() => {
    if (isTaskUpdateError && taskUpdateError) {
      console.error("Update Task Error:", taskUpdateError);
    }
  }, [isTaskUpdateError, taskUpdateError]);

  return {
    createTask,
    isTaskCreatePending,
    isTaskCreateSuccess,
    isTaskCreateError,
    // ✅ aliases for backward compat with AddTaskModal
    isTaskPending: isTaskCreatePending,
    isTaskSuccess: isTaskCreateSuccess,
    isTaskError: isTaskCreateError,
    updateTask,
    isTaskUpdatePending,
    isTaskUpdateSuccess,
    isTaskUpdateError,
    resetUpdateTask,
    updateTaskStatus,
    isTaskStatusPending,
    isTaskStatusSuccess,
    isTaskStatusError,
    closeAndPayTask,
    isCloseAndPayPending,
    isCloseAndPaySuccess,
    isCloseAndPayError,
  };
}
