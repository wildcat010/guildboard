"use client";
import { useTask } from "@/hooks/useTask";
import styles from "./addTaskModal.module.css";
import { useState, useEffect } from "react";
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
  const { isTaskPending, isTaskSuccess, isTaskError, createTask } =
    useTaskManagement();

  useEffect(() => {
    if (isTaskSuccess) {
      refetchAllTasks();
      onClose();
    }
  }, [isTaskSuccess]);

  function handleSubmit() {
    if (isTaskSuccess) {
      onClose();
      return;
    }
    if (!taskName.trim() || Number(reward) == 0) return;
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
              onChange={(e) => setTaskName(e.target.value)}
            />
          </div>
          <div className={styles.modalBody}>
            <label>Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className={styles.modalBody}>
            <label>Reward in GWEI</label>
            <input
              type="number"
              placeholder="e.g. 100000000 (GWEI) - 0.1 ETH"
              value={reward}
              onChange={(e) => setReward(e.target.value)}
            />
          </div>
          <div className={styles.modalFooter}>
            <button onClick={onClose}>Cancel</button>
            <button onClick={handleSubmit} disabled={isTaskPending}>
              {isTaskPending ? "Creating..." : "Create Task"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
