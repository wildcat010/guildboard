"use client";
import { useTask } from "@/hooks/useTask";
import styles from "./taskCard.module.css";
import { useState, useEffect } from "react";
import { useTaskManagement } from "@/hooks/useTaskManagement";
import { Task, taskStatus } from "@/constants/constants";
import { formatEther } from "ethers";
import TaskModal from "../taskModal/taskModal";

type TaskCardModalProps = {
  task: Task;
  refetchAllTasks: () => void;
  guildSelection: boolean;
};

export default function TaskCard({
  task,
  refetchAllTasks,
  guildSelection,
}: TaskCardModalProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div
        className={styles.taskCard}
        onClick={(e) => {
          e.stopPropagation();
          setShowModal(true);
        }}
      >
        <div className={styles.taskTitle}>
          #{task.id} - {task.description}
        </div>
        <div className={styles.taskSkills}>
          <span className={styles.skillTag}>
            {task.guildId ? task.guildId : "Unassigned"}
          </span>
          <span className={styles.skillTag}>{taskStatus[task.status]}</span>
        </div>

        <div className={styles.taskFooter}>
          <div className={styles.taskReward}>
            {formatEther(task.reward)} ETH
          </div>
        </div>
      </div>
      {showModal && (
        <TaskModal
          task={task}
          refetchAllTasks={refetchAllTasks}
          onClose={() => setShowModal(false)}
          guildSelection={guildSelection}
        ></TaskModal>
      )}
    </>
  );
}
