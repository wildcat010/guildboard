"use client";

import styles from "./guildMembers.module.css";
import { useEffect, useState } from "react";
import { Guild, Section } from "./../../../constants/constants";
import AddMemberdModal from "./addMemberModal/addMemberModal";
import GuildCard from "./GuildCard/guildCard";
import AddGuildModal from "./addGuildModal/addGuildModal";
import { useGuild } from "@/hooks/useGuild";

export default function AddMemberModal() {
  const [showModalCreateGuild, setShowModalCreateGuild] = useState(false);
  const [showModalMember, setShowModalMember] = useState(false);
  const { guilds } = useGuild();
  const guildsArray = (guilds as Guild[]) ?? [];

  return (
    <div className={styles.content}>
      <div className={`${styles.pageHeader} ${styles.animateIn}`}>
        <div>
          <div className={styles.pageTitle}>Guilds </div>
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
              setShowModalCreateGuild(true);
            }}
          >
            + Create Guild
          </button>
          <button
            className={styles.btnPrimary}
            onClick={() => {
              setShowModalMember(true);
            }}
          >
            + Add Member to Guild
          </button>
        </div>
      </div>
      <div className={styles.pageGuilds}>
        {guildsArray.map((guild: Guild) => (
          <GuildCard guildCard={guild}></GuildCard>
        ))}
      </div>

      {showModalCreateGuild && (
        <AddGuildModal onClose={() => setShowModalCreateGuild(false)} />
      )}
      {showModalMember && (
        <AddMemberdModal onClose={() => setShowModalMember(false)} />
      )}
    </div>
  );
}
