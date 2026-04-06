"use client";
import { useWriteContract } from "wagmi";
import { GUILDBOARD_ADDRESS, GUILDBOARD_ABI } from "@/contracts";

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
    reset: resetUpdateTask,
  } = useWriteContract();

  const {
    writeContract: writeAssignTask,
    isPending: isTaskAssignPending,
    isSuccess: isTaskAssignSuccess,
    isError: isTaskAssignError,
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
  ) {
    writeUpdateTask({
      address: GUILDBOARD_ADDRESS,
      abi: GUILDBOARD_ABI,
      functionName: "updateTask",
      args: [taskId, name, description, reward, guildId],
    });
  }

  function assignTaskToGuild(
    guildId: bigint,
    taskId: bigint,
    assigneeAddress: string,
  ) {
    writeAssignTask({
      address: GUILDBOARD_ADDRESS,
      abi: GUILDBOARD_ABI,
      functionName: "AssignTaskToGuild",
      args: [guildId, taskId, assigneeAddress as `0x${string}`],
    });
  }

  function updateTaskStatus(taskId: bigint, newStatus: number) {
    writeUpdateTaskStatus({
      address: GUILDBOARD_ADDRESS,
      abi: GUILDBOARD_ABI,
      functionName: "updateTaskStatus",
      args: [taskId, newStatus],
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
    assignTaskToGuild,
    isTaskAssignPending,
    isTaskAssignSuccess,
    isTaskAssignError,
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
