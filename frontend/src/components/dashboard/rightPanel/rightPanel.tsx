"use client";
import Image from "next/image";
import styles from "./rightPanel.module.css";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useGuild } from "@/hooks/useGuild";

import { Guild } from "./../../../constants/constants";
import GuildPanel from "./guildPanel/guildPanel";

export default function Rightbar() {
  const { guilds, guildCount, guildCountLimit, isOwner } = useGuild();
  console.log("guildCount:", guildCount);
  console.log("guildCountLimit:", guildCountLimit);
  console.log("isOwner:", isOwner);

  const count = (guildCount as bigint)?.toString() ?? "0";
  const guildsArray = (guildCountLimit as Guild[]) ?? [];
  useEffect(() => {});

  return (
    <div className={styles.rightPanel}>
      <div className={styles.panelTitle}>Guilds - {count}</div>
      <GuildPanel guilds={guildsArray}></GuildPanel>
    </div>
  );
}
