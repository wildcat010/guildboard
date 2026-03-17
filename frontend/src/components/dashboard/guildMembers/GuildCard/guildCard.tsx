"use client";
import { Guild } from "@/constants/constants";
import styles from "./guildCard.module.css";
import { useState } from "react";
import { useGuild } from "@/hooks/useGuild";
import MembersModal from "./../membersModal/membersModal";

type GuildCardProps = {
  guildCard: Guild;
};

export default function GuildCard({ guildCard }: GuildCardProps) {
  const [showModal, setShowModal] = useState(false);

  const { guildMembers } = useGuild(parseInt(guildCard.id.toString()));
  const listMembers = (guildMembers as string[]) ?? [];

  return (
    <div className={styles.taskCard}>
      <div className={styles.taskTitle}>{guildCard.name}</div>
      <div className={styles.taskSkills}>
        <span className={styles.skillTag}>{listMembers.length}</span>
      </div>

      <div className={styles.taskFooter}>
        <div className={styles.taskReward}>
          <div className={styles.ethIcon}></div>0.08 ETH
        </div>
      </div>
      {showModal && <MembersModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
