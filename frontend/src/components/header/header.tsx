"use client";

import styles from "./header.module.css";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import Link from "next/link";

export default function Header() {
  const { openConnectModal } = useConnectModal();
  const { address, isConnected } = useAccount();

  return (
    <div className={styles.topbar}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>⚔</div>
        <div className={styles.logoText}>GUILDBOARD</div>
      </div>

      <div className={styles.topbarNav}>
        <Link href="/" className={styles.navBtn}>
          Home
        </Link>
        <Link href="/dashboard" className={styles.navBtn}>
          Dashboard
        </Link>
      </div>

      <button
        className={`${styles.connectBtn} ${
          isConnected ? styles.connected : ""
        }`}
        onClick={openConnectModal}
      >
        <span>{isConnected ? "✓" : "◆"}</span>

        <span>
          {isConnected
            ? address?.slice(0, 6) + "..." + address?.slice(-4)
            : "Connect Wallet"}
        </span>
      </button>
    </div>
  );
}
