"use client";

import styles from "./questboard.module.css";
import { useEffect, useState } from "react";
import { Section, Task } from "./../../../constants/constants";

import AddTaskModal from "./addTaskModal/addTaskModal";
import { useTask } from "@/hooks/useTask";
import TaskCard from "./taskCard/taskCard";

export default function Questboard() {
  const [showModalGuild, setShowModalGuild] = useState(false);
  const [showModalTask, setShowModalTask] = useState(false);

  const { getAllTasks, refetchAllTasks } = useTask();
  const allTasksUnassigned =
    (getAllTasks as Task[])?.filter(
      (task: Task) => Number(task.guildId) == 0,
    ) ?? [];
  const allTasksAssigned =
    (getAllTasks as Task[])?.filter(
      (task: Task) => Number(task.guildId) != 0,
    ) ?? [];

  console.log("allTasksUnassigned", allTasksUnassigned);
  console.log("allTasksAssigned", allTasksAssigned);

  return (
    <div className={styles.content}>
      <div className={`${styles.pageHeader} ${styles.animateIn}`}>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            height: "inherit",
            alignItems: "flex-start",
          }}
        >
          <div className={styles.pageTitle}>Quest Board</div>
          <div className={styles.pageDub}></div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "5px",
          }}
        >
          <button
            className={styles.btnPrimary}
            onClick={() => {
              setShowModalTask(true);
            }}
          >
            + Post Task
          </button>
        </div>
      </div>
      <div className={styles.pageTitle}>
        Unassigned - {allTasksUnassigned.length}
      </div>
      <div className={styles.pageTasks}>
        {allTasksUnassigned.map((task: Task) => (
          <TaskCard
            key={task.id.toString()}
            task={task}
            refetchAllTasks={refetchAllTasks}
            guildSelection={true}
          ></TaskCard>
        ))}
      </div>
      <div className={styles.pageTitle}>
        Assigned - {allTasksAssigned.length}
      </div>
      <div className={styles.pageTasks}>
        {allTasksAssigned.map((task: Task) => (
          <TaskCard
            key={task.id.toString()}
            task={task}
            refetchAllTasks={refetchAllTasks}
            guildSelection={true}
          ></TaskCard>
        ))}
      </div>
      {showModalTask && (
        <AddTaskModal
          onClose={() => setShowModalTask(false)}
          refetchAllTasks={refetchAllTasks}
        />
      )}
    </div>
  );
}
