"use client";

import styles from "./questboard.module.css";
import { useEffect } from "react";
import { Section } from "./../../../constants/constants";

export default function Questboard() {
  return (
    <div className={styles.content}>
      <div className={`${styles.pageHeader} ${styles.animateIn}`}>
        <div>
          <div className={styles.pageTitle}>Quest Board</div>
          <div className={styles.pageDub}>On-Chain Tasks · ETH Rewards</div>
        </div>
        <button className={styles.btnPrimary}>+ Post Task</button>
      </div>
    </div>
  );
}
