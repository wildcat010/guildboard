"use client";
import Image from "next/image";
import styles from "./guildPanel.module.css";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useGuild } from "@/hooks/useGuild";

import { Guild } from "./../../../../constants/constants";

type GuildPanelProps = {
  guilds: Guild[];
};

export default function GuildPanel({ guilds }: GuildPanelProps) {
  useEffect(() => {
    console.log("guilds", guilds);
  });

  return (
    <>
      {guilds.map((guild: Guild) => (
        <div key={guild.id.toString()} className={styles.memberListItem}>
          <div
            className={styles.miniHex}
            style={{ width: "32px", height: "32px", fontSize: "13px" }}
          >
            {guild.name}.charAt(0).toUpperCase();
          </div>
          <div className={styles.memberInfo}>
            <div className={styles.memberListName}>{guild.name}</div>
            <div className={styles.memberListRole}></div>
          </div>
        </div>
      ))}
    </>
  );
}
