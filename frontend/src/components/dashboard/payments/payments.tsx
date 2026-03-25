"use client";

import styles from "./payments.module.css";
import { useEffect } from "react";
import { Section } from "./../../../constants/constants";

export default function Payments() {
  return (
    <div className={styles.content}>
      <div className={`${styles.pageHeader} ${styles.animateIn}`}>
        <div>
          <div className={styles.pageTitle}>Payments </div>
        </div>
        <button className={styles.btnPrimary}>+ Create Payment</button>
      </div>
    </div>
  );
}
