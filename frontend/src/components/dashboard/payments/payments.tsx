"use client";

import styles from "./payments.module.css";
import { useEffect } from "react";
import { Section } from "./../../../constants/constants";
import { useBalance } from "wagmi";
import { GUILDBOARD_ADDRESS } from "@/contracts";

export default function Payments() {
  const { data: balance } = useBalance({
    address: GUILDBOARD_ADDRESS,
  });
  return (
    <div className={styles.content}>
      <div className={`${styles.pageHeader} ${styles.animateIn}`}>
        <div>
          <div className={styles.pageTitle}>Payments </div>
        </div>
        <div className={styles.buttonWraper}>
          <button className={styles.btnPrimary}>+ Create Payment</button>
          <button className={styles.btnPrimary}>+ Create Deposit</button>
        </div>
      </div>
      <div className={styles.pageSub}>
        Contract Balance
        <p className={styles.text}>
          {balance?.formatted} {balance?.symbol}
        </p>
      </div>
    </div>
  );
}
