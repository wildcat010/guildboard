"use client";

import styles from "./questboard.module.css";
import { useEffect, useState } from "react";
import { Section } from "./../../../constants/constants";
import AddGuildModal from "./addGuildModal/addGuildModal";

export default function Questboard() {
  const [showModal, setShowModal] = useState(false);

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
              setShowModal(true);
            }}
          >
            + Post Task
          </button>
          <button
            className={styles.btnPrimary}
            onClick={() => {
              setShowModal(true);
            }}
          >
            + Create Guild
          </button>
        </div>
      </div>
      {showModal && <AddGuildModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
