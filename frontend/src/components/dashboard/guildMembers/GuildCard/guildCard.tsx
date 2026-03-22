"use client";
import { Guild } from "@/constants/constants";
import styles from "./guildCard.module.css";
import { useState } from "react";
import MembersModal from "./../membersModal/membersModal";
import { useGuildById } from "@/hooks/useGuildById";

type GuildCardProps = {
  guildCard: Guild;
};

export default function GuildCard({ guildCard }: GuildCardProps) {
  const [showModal, setShowModal] = useState(false);
  const { guildMembers } = useGuildById(
    Number(guildCard.active ? Number(guildCard.id) : 0),
  );

  return (
    <>
      <div
        className={styles.taskCard}
        onClick={(e) => {
          e.stopPropagation();
          setShowModal(true);
        }}
      >
        <div className={styles.taskTitle}>{guildCard.name}</div>
        <div className={styles.taskSkills}>
          <span className={styles.skillTag}>{guildMembers.length}</span>
        </div>

        <div className={styles.taskFooter}>
          <div className={styles.taskReward}></div>
          <div
            className={guildCard.active ? styles.dotActive : styles.dotInactive}
          />
        </div>
      </div>
      {showModal && (
        <MembersModal
          listMembers={guildMembers}
          active={guildCard.active}
          guildCard={guildCard}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
