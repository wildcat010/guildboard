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
};

export default function TaskModal({
  task,
  onClose,
  refetchAllTasks,
}: TaskCardModalProps) {
  const [editedTask, setEditedTask] = useState({
    name: task.name,
    description: task.description,
    reward: formatEther(task.reward),
    guildId: task.guildId,
  });

  const pendingAssign = useRef(false);
  const guildChanged = editedTask.guildId !== task.guildId;

  const hasChanges =
    editedTask.name !== task.name ||
    editedTask.description !== task.description ||
    editedTask.reward !== formatEther(task.reward) ||
    guildChanged;

  const {
    updateTask,
    isTaskUpdatePending,
    isTaskUpdateSuccess,
    assignTaskToGuild,
    isTaskAssignPending,
    isTaskAssignSuccess,
  } = useTaskManagement();

  const { guilds } = useGuild();
  const guildsArray =
    (guilds as Guild[]).filter((guild) => guild.active === true) ?? [];

  // after updateTask success → assign to guild if guildId changed
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

  // after assignTask success → refetch and close
  useEffect(() => {
    if (isTaskAssignSuccess && pendingAssign.current) {
      pendingAssign.current = false;
      refetchAllTasks();
      onClose();
    }
  }, [isTaskAssignSuccess]);

  const handleUpdate = () => {
    updateTask(
      task.id,
      editedTask.name,
      editedTask.description,
      parseEther(editedTask.reward),
    );
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
          <input
            className={styles.rewardInput}
            type="text"
            value={editedTask.name}
            onChange={(e) =>
              setEditedTask({ ...editedTask, name: e.target.value })
            }
          />
        </div>

        {/* ── Description ── */}
        <div className={styles.formGroup}>
          <span className={styles.formLabel}>Description</span>
          <textarea
            className={styles.descriptionArea}
            value={editedTask.description}
            onChange={(e) =>
              setEditedTask({ ...editedTask, description: e.target.value })
            }
          />
        </div>

        {/* ── Reward ── */}
        <div className={styles.formGroup}>
          <span className={styles.formLabel}>Reward (ETH)</span>
          <input
            className={styles.rewardInput}
            type="number"
            value={editedTask.reward}
            onChange={(e) =>
              setEditedTask({ ...editedTask, reward: e.target.value })
            }
          />
        </div>

        {/* ── Guild ── */}
        <div className={styles.formGroup}>
          <span className={styles.formLabel}>
            Guild — current: #{Number(task.guildId)}
          </span>
          <select
            className={styles.statusSelect}
            value={editedTask.guildId.toString()}
            onChange={(e) =>
              setEditedTask({ ...editedTask, guildId: BigInt(e.target.value) })
            }
          >
            <option value="0">NA</option>
            {guildsArray.map((guild) => (
              <option key={guild.id.toString()} value={guild.id.toString()}>
                {guild.name}
              </option>
            ))}
          </select>
        </div>

        {/* ── Status ── */}
        <div className={styles.formGroup}>
          <span className={styles.formLabel}>Status</span>
          <p>{taskStatus[Number(task.status)]}</p>
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
                {isTaskUpdatePending
                  ? "⬆ Updating..."
                  : isTaskAssignPending
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
