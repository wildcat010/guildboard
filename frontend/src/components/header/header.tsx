"use client";
import Image from "next/image";
import styles from "./header.module.css";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Header() {
  const { openConnectModal } = useConnectModal();
  const { address, isConnected } = useAccount();
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    debugger;
    const btn = document.getElementById("connectBtn");
    const text = document.getElementById("connectText");
    const icon = document.getElementById("connectIcon");

    if (!btn || !text || !icon) return;

    if (isConnected) {
      btn.classList.add("connected");

      icon.textContent = "✓";
    } else {
      btn.classList.remove("connected");
      text.textContent = "Connect Wallet";
      icon.textContent = "◆";
    }
  }, [isConnected]);

  return (
    <>
      <div className={styles.topbar}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>⚔</div>
          <div className={styles.logoText}>GUILDBOARD</div>
        </div>
        <div className={styles.topbarNav} id="navLanding">
          <Link href="/" className={`${styles.navBtn} ${styles.active}`}>
            Home
          </Link>
          <Link href="/dashboard" className={styles.navBtn}>
            Dashboard
          </Link>
        </div>
        <button
          className={styles.connectBtn}
          onClick={openConnectModal}
          id="connectBtn"
        >
          <span id="connectIcon">◆</span>
          <span id="connectText">
            {isConnected
              ? address?.slice(0, 6) + "..." + address?.slice(-4)
              : "Connect Wallet"}
          </span>
        </button>
      </div>
    </>
  );
}
