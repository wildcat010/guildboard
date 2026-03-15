"use client";
import styles from "./addTaskModal.module.css";
import { useState } from "react";

type AddTaskModalProps = {
  onClose: () => void;
};

export default function AddTaskModal({ onClose }: AddTaskModalProps) {
  const [taskName, setTaskName] = useState("");

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
        </div>
      </div>
    </>
  );
}
