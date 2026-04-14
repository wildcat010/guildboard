"use client";
import { useTask } from "@/hooks/useTask";
import styles from "./addTaskModal.module.css";
import { useState, useEffect, useRef } from "react";
import { useTaskManagement } from "@/hooks/useTaskManagement";
import { parseUnits } from "ethers";

type AddTaskModalProps = {
  onClose: () => void;
  refetchAllTasks: () => void;
};

export default function AddTaskModal({
  onClose,
  refetchAllTasks,
}: AddTaskModalProps) {
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [reward, setReward] = useState("");
  const {
    isTaskPending,
    isTaskCreateConfirmed,
    isTaskCreateConfirming,
    createTask,
  } = useTaskManagement();

  const createQuest = useRef(false);

  useEffect(() => {
    if (isTaskCreateConfirmed && createQuest.current) {
      createQuest.current = false;
      refetchAllTasks();
      onClose();
    }
  }, [isTaskCreateConfirmed, refetchAllTasks, onClose]);

  function handleSubmit() {
    if (isTaskCreateConfirmed || isTaskCreateConfirming) {
      onClose();
      return;
    }
    if (!taskName.trim() || Number(reward) == 0) return;
    createQuest.current = true;
    createTask(taskName, description, parseUnits(reward, "gwei"));
  }

  return (
    <>
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <div className={styles.modalHeader}>
            <h2>Add Task</h2>
            <button onClick={onClose}>✕</button>
          </div>
          <div className={styles.modalBody}>
            <label>Task Name</label>
            <input
              type="text"
              value={taskName}
              disabled={isTaskPending || isTaskCreateConfirming}
              onChange={(e) => setTaskName(e.target.value)}
            />
          </div>
          <div className={styles.modalBody}>
            <label>Description</label>
            <input
              type="text"
              value={description}
              disabled={isTaskPending || isTaskCreateConfirming}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className={styles.modalBody}>
            <label>Reward in GWEI</label>
            <input
              type="number"
              placeholder="e.g. 100000000 (GWEI) - 0.1 ETH"
              value={reward}
              disabled={isTaskPending || isTaskCreateConfirming}
              onChange={(e) => setReward(e.target.value)}
            />
          </div>
          <div className={styles.modalFooter}>
            <button onClick={onClose}>Cancel</button>
            <button
              onClick={handleSubmit}
              disabled={isTaskPending || isTaskCreateConfirming}
            >
              {isTaskPending
                ? "Confirm in MetaMask..."
                : isTaskCreateConfirming
                  ? "Confirming on Sepolia..."
                  : "Create Task"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
