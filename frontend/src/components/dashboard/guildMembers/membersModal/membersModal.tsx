"use client";
import { Guild } from "@/constants/constants";
import styles from "./membersModal.module.css";
import { useState, useEffect, useRef } from "react";
import ListMember from "../ListMember/listMember";
import { useManagementGuild } from "@/hooks/useManagementGuilds";
import { useGuild } from "@/hooks/useGuild";

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
  const [activeGuild, setActiveGuild] = useState(active);
  const pendingStatus = useRef<boolean | null>(null);

  const {
    enableStatus,
    disableStatus,
    isStatusGuildPending,
    isStatusGuildSuccess,
  } = useManagementGuild();

  const { refetchCounterActive, refetchCounterInactive } = useGuild();
  const { refetchGuilds } = useGuild();

  const clickStatus = () => {
    pendingStatus.current = !activeGuild;
    if (activeGuild) {
      disableStatus(Number(guildCard.id));
    } else {
      enableStatus(Number(guildCard.id));
    }
  };

  useEffect(() => {
    if (isStatusGuildSuccess && pendingStatus.current !== null) {
      setActiveGuild(pendingStatus.current);
      refetchGuilds();
      refetchCounterActive();
      refetchCounterInactive();
      pendingStatus.current = null;
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
              <ListMember key={i} addressMember={member} />
            ))}
          </div>
        </div>

        <button
          className="btn-primary"
          style={{ width: "100%", padding: "12px" }}
        >
          ⟶ Deploy Quest On-Chain
        </button>

        <div
          className={styles.toggleContainer}
          onClick={!isStatusGuildPending ? clickStatus : undefined}
        >
          <span className={styles.toggleLabel}>Status</span>
          <button
            className={`${styles.toggle} ${activeGuild ? styles.toggleActive : styles.toggleInactive}`}
            disabled={isStatusGuildPending}
          >
            <div className={styles.toggleThumb} />
            <span className={styles.toggleText}>
              {isStatusGuildPending
                ? "Pending..."
                : activeGuild
                  ? "Active"
                  : "Inactive"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
