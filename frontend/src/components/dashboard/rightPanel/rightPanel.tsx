"use client";
import Image from "next/image";
import styles from "./rightPanel.module.css";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useGuild } from "@/hooks/useGuild";

import { Guild } from "./../../../constants/constants";
import GuildPanel from "./guildPanel/guildPanel";

export default function Rightbar() {
  const { guilds } = useGuild();
  const guildsArray = (guilds as Guild[]) ?? [];
  useEffect(() => {});

  return (
    <div className={styles.rightPanel}>
      <div className={styles.panelTitle}>Guilds - {guildsArray.length}</div>
      <GuildPanel guilds={guildsArray}></GuildPanel>
    </div>
  );
}
