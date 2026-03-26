"use client";
import { useTask } from "@/hooks/useTask";
import styles from "./taskModal.module.css";
import { useState, useEffect } from "react";
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
  const [myTask, setMyTask] = useState(task);

  const [editedTask, setEditedTask] = useState({
    description: task.description,
    reward: formatEther(task.reward),
    guildId: task.guildId,
    status: task.status,
  });

  const hasChanges =
    editedTask.description !== task.description ||
    editedTask.reward !== formatEther(task.reward) ||
    editedTask.guildId !== task.guildId;

  const {
    isTaskUpdatePending,
    isTaskUpdateSuccess,
    isTaskUpdateError,
    updateTask,
  } = useTaskManagement();

  const { guilds } = useGuild();
  const guildsArray =
    (guilds as Guild[]).filter((guild) => guild.active == true) ?? [];

  const handleUpgrade = () => {
    console.log("handleUpgrade");
    updateTask(
      task.id,
      myTask.name,
      editedTask.description,
      parseEther(editedTask.reward),
      editedTask.guildId,
    );
    console.log("handleUpgrade end");
  };

  useEffect(() => {
    if (isTaskUpdateSuccess) {
      refetchAllTasks();
      onClose();
    }
  }, [isTaskUpdateSuccess]);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button className={styles.modalClose} onClick={onClose}>
          ✕
        </button>
        <div className={styles.modalTitle}>⚔ Task Card - #{task.id}</div>
        <div className={styles.formGroup}>
          <span className={styles.formLabel}>{task.name}</span>
          <span className={styles.formLabel}>Description</span>
          <textarea
            className={styles.descriptionArea}
            value={editedTask.description}
            onChange={(e) =>
              setEditedTask({ ...editedTask, description: e.target.value })
            }
          />
        </div>
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
        <div className={styles.formGroup}>
          <span className={styles.formLabel}>Guild - #{task.guildId}</span>
          <select
            className={styles.statusSelect}
            value={editedTask.guildId.toString()}
            onChange={(e) =>
              setEditedTask({ ...editedTask, guildId: BigInt(e.target.value) })
            }
          >
            <option key={0} value={0}>
              {"NA"}
            </option>
            {guildsArray.map((guild) => (
              <option key={guild.id} value={guild.id.toString()}>
                {guild.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <span className={styles.formLabel}>Status - #{task.status}</span>
          <p>{taskStatus[task.status]}</p>
        </div>
        <div className={styles.formGroup}>
          <span className={styles.formLabel}>Actions</span>
          <div className={styles.container}>
            {hasChanges && (
              <button
                className={styles.button}
                onClick={handleUpgrade}
                disabled={isTaskUpdatePending}
              >
                {isTaskUpdatePending ? "⬆ Upgrading..." : "⬆ Upgrade"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
