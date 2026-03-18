"use client";
import { Guild } from "@/constants/constants";
import styles from "./membersModal.module.css";
import { useState, useEffect } from "react";
import { useGuild } from "@/hooks/useGuild";
import ListMember from "../ListMember/listMember";
import { useManagementGuild } from "@/hooks/useManagementGuilds";

type MembersModalProps = {
  onClose: () => void;
  listMembers: string[];
  active: boolean;
  guildCard: Guild;
};

export default function MembersModal({
  onClose,
  listMembers,
  active,
  guildCard,
}: MembersModalProps) {
  const [memberName, setMemberName] = useState("");
  const [activeGuild, setActiveGuild] = useState(active);

  const { enableStatus, disableStatus, isStatusGuildSuccess } =
    useManagementGuild();

  useEffect(() => {}, [activeGuild]);

  const clickStatus = () => {
    if (activeGuild) {
      disableStatus(parseInt(guildCard.id.toString()));
    } else {
      enableStatus(parseInt(guildCard.id.toString()));
    }
  };

  useEffect(() => {
    if (isStatusGuildSuccess) {
      setActiveGuild((prev) => !prev);
    }
  }, [isStatusGuildSuccess]);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button className={styles.modalClose} onClick={onClose}>
          ✕
        </button>
        <div className={styles.modalTitle}>⚔ Guild Card - {guildCard.name}</div>

        <div className={styles.formGroup}>
          <span className={styles.formLabel}>
            Users address - {listMembers.length}
          </span>
          <div>
            {listMembers.map((member: string, i: number) => (
              <ListMember addressMember={member}></ListMember>
            ))}
          </div>
        </div>

        <button
          className="btn-primary"
          style={{ width: "100%", padding: "12px" }}
        >
          ⟶ Deploy Quest On-Chain
        </button>
        <div className={styles.toggleContainer} onClick={clickStatus}>
          <span className={styles.toggleLabel}>Status</span>
          <button
            className={`${styles.toggle} ${activeGuild ? styles.toggleActive : styles.toggleInactive}`}
          >
            <div className={styles.toggleThumb} />
            <span className={styles.toggleText}>
              {activeGuild ? "Active" : "Inactive"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
