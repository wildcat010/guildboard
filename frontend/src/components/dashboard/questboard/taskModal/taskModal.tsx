"use client";
import styles from "./taskModal.module.css";
import { useState, useEffect, useRef } from "react";
import { useTaskManagement } from "@/hooks/useTaskManagement";
import { Guild, Task, taskStatus } from "@/constants/constants";
import { formatEther, parseEther } from "ethers";
import { useGuild } from "@/hooks/useGuild";

type TaskCardModalProps = {
  task: Task;
  onClose: () => void;
  refetchAllTasks: () => void;
  guildSelection: boolean;
};

export default function TaskModal({
  task,
  onClose,
  refetchAllTasks,
  guildSelection,
}: TaskCardModalProps) {
  const [editedTask, setEditedTask] = useState({
    name: task.name,
    description: task.description,
    reward: formatEther(task.reward),
    guildId: task.guildId,
    taskStatus: Number(task.status),
  });

  const pendingAssign = useRef(false);
  const guildChanged = editedTask.guildId !== task.guildId;

  const hasChanges =
    editedTask.name !== task.name ||
    editedTask.description !== task.description ||
    editedTask.reward !== formatEther(task.reward) ||
    guildChanged ||
    Number(editedTask.taskStatus) !== Number(task.status);

  const {
    updateTask,
    updateTaskStatus,
    isTaskUpdatePending,
    isTaskUpdateSuccess,
    assignTaskToGuild,
    isTaskAssignPending,
    isTaskAssignSuccess,
    isTaskStatusPending,
    isTaskStatusSuccess,
  } = useTaskManagement();

  const { guilds } = useGuild();
  const guildsArray =
    (guilds as Guild[]).filter((guild) => guild.active === true) ?? [];

  useEffect(() => {
    if (isTaskStatusSuccess) {
      refetchAllTasks();
      onClose();
    }
  }, [isTaskStatusSuccess]);

  useEffect(() => {
    if (isTaskUpdateSuccess) {
      if (guildChanged) {
        pendingAssign.current = true;
        assignTaskToGuild(
          editedTask.guildId,
          task.id,
          "0x0000000000000000000000000000000000000000",
        );
      } else {
        refetchAllTasks();
        onClose();
      }
    }
  }, [isTaskUpdateSuccess]);

  useEffect(() => {
    if (isTaskAssignSuccess && pendingAssign.current) {
      pendingAssign.current = false;
      refetchAllTasks();
      onClose();
    }
  }, [isTaskAssignSuccess]);

  const handleUpdate = () => {
    if (guildSelection) {
      updateTask(
        task.id,
        editedTask.name,
        editedTask.description,
        parseEther(editedTask.reward),
        editedTask.guildId ?? 0,
      );
    } else {
      updateTaskStatus(task.id, editedTask.taskStatus);
    }
  };

  const isPending = isTaskUpdatePending || isTaskAssignPending;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.modalClose} onClick={onClose}>
          ✕
        </button>
        <div className={styles.modalTitle}>⚔ Task - #{Number(task.id)}</div>

        {/* ── Name ── */}
        <div className={styles.formGroup}>
          <span className={styles.formLabel}>Name</span>
          {guildSelection ? (
            <input
              disabled={!guildSelection}
              className={styles.rewardInput}
              type="text"
              value={editedTask.name}
              onChange={(e) =>
                setEditedTask({ ...editedTask, name: e.target.value })
              }
            />
          ) : (
            <span>{task.name}</span>
          )}
        </div>

        {/* ── Description ── */}
        <div className={styles.formGroup}>
          <span className={styles.formLabel}>Description</span>
          {guildSelection ? (
            <textarea
              disabled={!guildSelection}
              className={styles.descriptionArea}
              value={editedTask.description}
              onChange={(e) =>
                setEditedTask({ ...editedTask, description: e.target.value })
              }
            />
          ) : (
            <span>{task.description}</span>
          )}
        </div>

        {/* ── Reward ── */}
        <div className={styles.formGroup}>
          <span className={styles.formLabel}>Reward (ETH)</span>
          {guildSelection ? (
            <input
              disabled={!guildSelection}
              className={styles.rewardInput}
              type="number"
              value={editedTask.reward}
              onChange={(e) =>
                setEditedTask({ ...editedTask, reward: e.target.value })
              }
            />
          ) : (
            <span>{formatEther(task.reward)}</span>
          )}
        </div>

        {/* ── Guild ── */}
        <div className={styles.formGroup}>
          <span className={styles.formLabel}>
            Guild — current: #{Number(task.guildId)}
          </span>
          {guildSelection ? (
            <select
              className={styles.statusSelect}
              value={editedTask.guildId.toString()}
              disabled={!guildSelection}
              onChange={(e) =>
                setEditedTask({
                  ...editedTask,
                  guildId: BigInt(e.target.value),
                })
              }
            >
              <option value="0">NA</option>
              {guildsArray.map((guild) => (
                <option key={guild.id.toString()} value={guild.id.toString()}>
                  {guild.name}
                </option>
              ))}
            </select>
          ) : (
            <span>{task.guildId}</span>
          )}
        </div>

        {/* ── Status ── */}
        <div className={styles.formGroup}>
          <span className={styles.formLabel}>Status</span>
          {guildSelection ? (
            <span>{taskStatus[task.status]}</span>
          ) : (
            <select
              className={styles.statusSelect}
              value={Number(editedTask.taskStatus)}
              disabled={guildSelection}
              onChange={(e) =>
                setEditedTask({
                  ...editedTask,
                  taskStatus: Number(e.target.value),
                })
              }
            >
              {Object.entries(taskStatus).map(([value, label]) => (
                <option
                  key={Number(value)}
                  value={Number(value)}
                  disabled={Number(value) === 4}
                >
                  {label}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* ── Actions ── */}
        <div className={styles.formGroup}>
          <span className={styles.formLabel}>Actions</span>
          <div className={styles.container}>
            {hasChanges && (
              <button
                className={styles.button}
                onClick={handleUpdate}
                disabled={isPending}
              >
                {isTaskUpdatePending || isTaskStatusPending
                  ? "⬆ Updating..."
                  : isTaskAssignPending || isTaskStatusPending
                    ? "⬆ Assigning..."
                    : "⬆ Update"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
