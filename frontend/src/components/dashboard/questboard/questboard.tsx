"use client";

import styles from "./questboard.module.css";
import { useEffect, useState } from "react";
import { Section } from "./../../../constants/constants";

import AddTaskModal from "./addTaskModal/addTaskModal";

export default function Questboard() {
  const [showModalGuild, setShowModalGuild] = useState(false);
  const [showModalTask, setShowModalTask] = useState(false);

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
      {showModalTask && (
        <AddTaskModal onClose={() => setShowModalTask(false)} />
      )}
    </div>
  );
}
