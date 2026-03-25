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
};

export default function TaskModal({ task, onClose }: TaskCardModalProps) {
  const [status, setStatus] = useState(task.status);

  const [guildSelect, setGuildSelect] = useState(task.guildId);
  const [description, setDescription] = useState(task.description);
  const [reward, setReward] = useState(formatEther(task.reward));

  const { guilds } = useGuild();
  const guildsArray =
    (guilds as Guild[]).filter((guild) => guild.active == true) ?? [];

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
            value={task.description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <span className={styles.formLabel}>Reward (ETH)</span>
          <input
            className={styles.rewardInput}
            type="number"
            value={reward}
            onChange={(e) => setReward(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <span className={styles.formLabel}>Status - {task.status}</span>
          <select
            className={styles.statusSelect}
            value={guildSelect.toString()}
            onChange={(e) => setGuildSelect(BigInt(e.target.value))}
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
          <span className={styles.formLabel}>Status - {task.status}</span>
          <select
            className={styles.statusSelect}
            value={status}
            onChange={(e) => setStatus(Number(e.target.value))}
          >
            {Object.entries(taskStatus).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button
            className={styles.saveButton}
            onClick={() => {
              // hook calls will go here
              console.log({ description, reward: parseEther(reward), status });
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
