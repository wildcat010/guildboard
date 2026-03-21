"use client";

import styles from "./guildMembers.module.css";
import { useState } from "react";
import { Guild } from "./../../../constants/constants";
import GuildCard from "./GuildCard/guildCard";
import AddGuildModal from "./addGuildModal/addGuildModal";
import { useGuild } from "@/hooks/useGuild";

export default function AddMemberModal() {
  const [showModalCreateGuild, setShowModalCreateGuild] = useState(false);

  const {
    guilds,
    refetchGuilds,
    refetchGuildsCount,
    refetchGuildsLimit,
    guildCount,
    activeGuildCount,
    inactiveGuildCount,
    refetchCounterActive,
    refetchCounterInactive,
  } = useGuild(5, 0);

  const guildsArray = (guilds as Guild[]) ?? [];

  const handleOnSuccess = () => {
    setTimeout(() => {
      refetchGuilds();
      refetchGuildsCount();
      refetchGuildsLimit();
      refetchCounterActive();
      refetchCounterInactive();
    }, 500);
  };

  return (
    <div className={styles.content}>
      <div className={`${styles.pageHeader} ${styles.animateIn}`}>
        <div>
          <div className={styles.pageTitle}>
            Guilds - All {guildCount as number}/Active{" "}
            {Number(activeGuildCount ?? 0)}/ Inactive{" "}
            {Number(inactiveGuildCount ?? 0)}
          </div>
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
        </div>
      </div>
      <div className={styles.pageGuilds}>
        {guildsArray.map((guild: Guild) => (
          <GuildCard key={guild.id.toString()} guildCard={guild}></GuildCard>
        ))}
      </div>

      {showModalCreateGuild && (
        <AddGuildModal
          onClose={() => setShowModalCreateGuild(false)}
          onSuccess={handleOnSuccess}
        />
      )}
    </div>
  );
}
