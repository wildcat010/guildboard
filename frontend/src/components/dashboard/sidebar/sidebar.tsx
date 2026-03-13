"use client";
import Image from "next/image";
import styles from "./sidebar.module.css";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Section } from "./../../../constants/constants";

type SidebarProps = {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
};

export default function Sidebar({
  activeSection,
  onSectionChange,
}: SidebarProps) {
  useEffect(() => {});

  return (
    <div className={styles.sidebar}>
      <div style={{ padding: " 0 8px" }}>
        <div className={styles.sidebarLabel} style={{ padding: " 0 8px" }}>
          Navigation
        </div>
        <button
          className={`${styles.sidebarItem} ${activeSection === "questboard" ? styles.active : ""}`}
          onClick={() => onSectionChange("questboard")}
        >
          <span className="icon">📋</span> Quest Board
        </button>
        <button
          className={`${styles.sidebarItem} ${activeSection === "members" ? styles.active : ""}`}
          onClick={() => onSectionChange("members")}
        >
          <span className="icon">👥</span> Guild Members
        </button>
        <button
          className={`${styles.sidebarItem} ${activeSection === "leaderboard" ? styles.active : ""}`}
          onClick={() => onSectionChange("leaderboard")}
        >
          <span className="icon">🏆</span> Leaderboard
        </button>
        <button
          className={`${styles.sidebarItem} ${activeSection === "payments" ? styles.active : ""}`}
          onClick={() => onSectionChange("payments")}
        >
          <span className="icon">💰</span> Payments
        </button>
        <button
          className={`${styles.sidebarItem} ${activeSection === "mynft" ? styles.active : ""}`}
          onClick={() => onSectionChange("mynft")}
        >
          <span className="icon">🛡</span> My NFT
        </button>
        <button
          className={`${styles.sidebarItem} ${activeSection === "settings" ? styles.active : ""}`}
          onClick={() => onSectionChange("settings")}
        >
          <span className="icon">⚙</span> Settings
        </button>
      </div>
    </div>
  );
}
