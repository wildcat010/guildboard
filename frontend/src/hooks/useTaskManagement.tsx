"use client";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { GUILDBOARD_ADDRESS, GUILDBOARD_ABI } from "@/contracts";
import { useEffect } from "react";

export function useTaskManagement() {
  const {
    writeContract: writeCreateTask,
    isPending: isTaskCreatePending,
    data: taskCreateHash,
  } = useWriteContract();

  const {
    isLoading: isTaskCreateConfirming,
    isSuccess: isTaskCreateConfirmed,
  } = useWaitForTransactionReceipt({
    hash: taskCreateHash,
    confirmations: 1,
  });

  const {
    writeContract: writeUpdateTask,
    isPending: isTaskUpdatePending,
    data: taskUpdateHash,
  } = useWriteContract();

  const {
    isLoading: isTaskUpdateConfirming,
    isSuccess: isTaskUpdateConfirmed,
  } = useWaitForTransactionReceipt({
    hash: taskUpdateHash,
    confirmations: 1,
  });

  const {
    writeContract: writeUpdateTaskStatus,
    isPending: isUpdateTaskStatusPending,
    isSuccess: isUpdateTaskStatusSuccess,
    data: UpdateTaskStatusHash,
  } = useWriteContract();

  const {
    isLoading: isUpdateTaskStatusConfirming,
    isSuccess: isUpdateTaskStatusConfirmed,
  } = useWaitForTransactionReceipt({
    hash: UpdateTaskStatusHash,
    confirmations: 1,
  });

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
    newStatus: number,
    assignee: string,
  ) {
    writeUpdateTask({
      address: GUILDBOARD_ADDRESS,
      abi: GUILDBOARD_ABI,
      functionName: "updateTaskAndAssign",
      args: [taskId, name, description, reward, guildId, newStatus, assignee],
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

  return {
    createTask,
    isTaskCreatePending,
    isTaskPending: isTaskCreatePending,
    isTaskCreateConfirming,
    isTaskCreateConfirmed,
    updateTask,
    isTaskUpdatePending,
    isTaskUpdateConfirming,
    isTaskUpdateConfirmed,
    updateTaskStatus,
    isUpdateTaskStatusPending,
    isUpdateTaskStatusConfirming,
    isUpdateTaskStatusConfirmed,
    closeAndPayTask,
    isCloseAndPayPending,
    isCloseAndPaySuccess,
    isCloseAndPayError,
  };
}
