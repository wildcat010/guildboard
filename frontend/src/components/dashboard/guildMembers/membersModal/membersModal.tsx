"use client";
import { Guild, Member } from "@/constants/constants";
import styles from "./membersModal.module.css";
import { useState, useEffect, useRef } from "react";
import ListMember from "../ListMember/listMember";
import { useManagementGuild } from "@/hooks/useManagementGuilds";
import { useGuild } from "@/hooks/useGuild";

type MembersModalProps = {
  onClose: () => void;
  onSuccess: () => void;
  listMembers: number[];
  active: boolean;
  guildCard: Guild;
};

export default function MembersModal({
  onClose,
  listMembers,
  onSuccess,
  active,
  guildCard,
}: MembersModalProps) {
  const [activeGuild, setActiveGuild] = useState(active);
  const pendingStatus = useRef<boolean | null>(null);

  const {
    enableStatus,
    disableStatus,
    isStatusGuildPending,
    isStatusGuildConfirmed,
    isStatusGuildConfirming,
  } = useManagementGuild();

  const {
    refetchCounterActive,
    refetchCounterInactive,
    refetchGuilds,
    isOwner,
  } = useGuild();

  const clickStatus = () => {
    if (isOwner) {
      pendingStatus.current = !activeGuild;
      if (activeGuild) {
        disableStatus(Number(guildCard.id));
      } else {
        enableStatus(Number(guildCard.id));
      }
    } else {
      alert(
        "Only the owner of the contract can change the status of the guild.",
      );
    }
  };

  useEffect(() => {
    if (isStatusGuildConfirmed && pendingStatus.current !== null) {
      setActiveGuild(pendingStatus.current);
      refetchGuilds();
      refetchCounterActive();
      refetchCounterInactive();
      pendingStatus.current = null;
    }
  }, [isStatusGuildConfirmed]);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button className={styles.modalClose} onClick={onClose}>
          ✕
        </button>
        <div className={styles.modalTitle}>⚔ Guild Card - {guildCard.name}</div>

        <div className={styles.formGroup}>
          <span className={styles.formLabel}>Users - {listMembers.length}</span>
          <div>
            {listMembers.map((memberId: number, i: number) => (
              <ListMember
                key={i}
                memberId={memberId}
                isOwner={isOwner as boolean}
              />
            ))}
          </div>
        </div>

        <div
          className={styles.toggleContainer}
          onClick={!isStatusGuildPending ? clickStatus : undefined}
        >
          <span className={styles.toggleLabel}>Status</span>
          <button
            className={`${styles.toggle} ${activeGuild ? styles.toggleActive : styles.toggleInactive}`}
            disabled={isStatusGuildPending || isStatusGuildConfirming}
          >
            <div className={styles.toggleThumb} />
            <span className={styles.toggleText}>
              {isStatusGuildPending
                ? "Pending..."
                : isStatusGuildConfirming
                  ? "Confirming on Sepolia..."
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
