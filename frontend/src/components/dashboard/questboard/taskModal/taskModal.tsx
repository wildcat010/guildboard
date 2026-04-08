"use client";
import styles from "./taskModal.module.css";
import { useState, useEffect } from "react";
import { useTaskManagement } from "@/hooks/useTaskManagement";
import { Guild, Task, taskStatus } from "@/constants/constants";
import { formatEther, parseEther } from "ethers";
import { useGuild } from "@/hooks/useGuild";
import { useGuildById } from "@/hooks/useGuildById";

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
    assignee: (task as { assignee?: string }).assignee ?? "",
  });

  const guildChanged = editedTask.guildId !== task.guildId;
  const isTaskClosed = Number(task.status) === 4; // Assuming 4 is the closed status
  const isTaskVerified =
    taskStatus[Number(editedTask.taskStatus)] === "Verified";

  const hasChanges =
    editedTask.name !== task.name ||
    editedTask.description !== task.description ||
    editedTask.reward !== formatEther(task.reward) ||
    guildChanged ||
    Number(editedTask.taskStatus) !== Number(task.status) ||
    editedTask.assignee !== (task as { assignee?: string }).assignee;

  const {
    updateTask,
    updateTaskStatus,
    isTaskUpdatePending,
    isTaskUpdateSuccess,
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
  }, [isTaskStatusSuccess, refetchAllTasks, onClose]);

  useEffect(() => {
    if (isTaskUpdateSuccess) {
      refetchAllTasks();
      onClose();
    }
  }, [isTaskUpdateSuccess, refetchAllTasks, onClose]);

  const handleUpdate = () => {
    console.log("task update ", editedTask);
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

  function GuildName({ guildId }: { guildId: bigint }) {
    const { getGuildById } = useGuildById(Number(guildId));
    const guild = getGuildById as Guild | null;
    return <span>{guild?.name ?? `Guild #${Number(guildId)}`}</span>;
  }

  const isPending = isTaskUpdatePending || isTaskStatusPending;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.modalClose} onClick={onClose}>
          ✕
        </button>
        <div className={styles.modalTitle}>⚔ Task - #{Number(task.id)}</div>

        {isTaskClosed && (
          <div
            style={{
              color: "#ff6b6b",
              marginBottom: "1rem",
              fontWeight: "bold",
            }}
          >
            ⚠ This task is closed and cannot be modified
          </div>
        )}

        {/* ── Name ── */}
        <div className={styles.formGroup}>
          <span className={styles.formLabel}>Name</span>
          {guildSelection ? (
            <input
              disabled={!guildSelection || isTaskClosed}
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
              disabled={!guildSelection || isTaskClosed}
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
              disabled={!guildSelection || isTaskClosed}
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
              disabled={!guildSelection || isTaskClosed}
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
            <GuildName guildId={task.guildId} />
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
              disabled={guildSelection || isTaskClosed}
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

        <div className={styles.formGroup}>
          <span className={styles.formLabel}>
            Assignee{" "}
            <span className={styles.note}>
              (can be updated only with "verified" status)
            </span>
          </span>

          {isTaskClosed || editedTask.taskStatus !== 3 ? (
            <span>{editedTask.assignee || ""}</span>
          ) : (
            <input
              className={styles.rewardInput}
              type="text"
              value={editedTask.assignee}
              onChange={(e) =>
                setEditedTask({ ...editedTask, assignee: e.target.value })
              }
            />
          )}
        </div>

        {/* ── Actions ── */}
        <div className={styles.formGroup}>
          <span className={styles.formLabel}>Actions</span>
          <div className={styles.container}>
            <button
              className={styles.button}
              onClick={handleUpdate}
              disabled={isPending || isTaskClosed || !hasChanges}
            >
              {isPending
                ? isTaskStatusPending
                  ? "⬆ Assigning..."
                  : "⬆ Updating..."
                : "⬆ Update"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
