"use client";
import styles from "./memberModal.module.css";
import { Guild, Member } from "./../../../constants/constants";
import { roleNames } from "./../../../constants/constants";
import { useState, useEffect, useRef } from "react";
import { useGuildById } from "@/hooks/useGuildById";
import { useManagementMember } from "@/hooks/useManagementMember";
import { useGuild } from "@/hooks/useGuild";
import { useMember } from "@/hooks/useMember";

type MemberModalProps = {
  onClose: () => void;
  member: Member;
  refetchMember: () => void;
  onDeleteSuccess: () => void;
};

export default function MemberModal({
  onClose,
  member,
  refetchMember,
  onDeleteSuccess,
}: MemberModalProps) {
  const [selectedRole, setSelectedRole] = useState(Number(member.role));

  const {
    upgradeMember,
    removeMember,
    isUpgradingPending,
    isRemoveMemberPending,
    isUpgradingSuccess,
    isRemoveMemberSuccess,
  } = useManagementMember();
  const { refetchGuilds } = useGuild();
  const { refetchGuildMembers, getGuildById } = useGuildById(
    Number(member.guildId),
  );

  const pendingClose = useRef(false);
  const guild = getGuildById as Guild;

  const currentRole = Number(member.role);
  const roleChanged = selectedRole !== currentRole;
  const memberId = Number(member.id);

  function handleUpgrade() {
    upgradeMember(memberId, selectedRole);
  }

  function handleDelete() {
    pendingClose.current = true;
    removeMember(memberId);
  }

  useEffect(() => {
    if (isRemoveMemberSuccess && pendingClose.current) {
      pendingClose.current = false;
      refetchGuilds();
      refetchGuildMembers();
      onDeleteSuccess();
      onClose();
    }
  }, [
    isRemoveMemberSuccess,
    refetchGuilds,
    refetchGuildMembers,
    onClose,
    onDeleteSuccess,
  ]);

  useEffect(() => {
    if (isUpgradingSuccess) {
      refetchGuildMembers();
      refetchMember();
    }
  }, [isUpgradingSuccess, refetchGuildMembers, refetchMember]);

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* ── Header ── */}
        <button className={styles.modalClose} onClick={onClose}>
          ✕
        </button>
        <div className={styles.modalTitle}>⚔ Member Info</div>

        {/* ── Address ── */}
        <div className={styles.formGroup}>
          <span className={styles.formLabel}>Address</span>
          <span className={styles.formLabelBig}>{member.addressMember}</span>
        </div>

        {/* ── Guild ── */}
        <div className={styles.formGroup}>
          <span className={styles.formLabel}>Guild</span>
          <span className={styles.formLabelBig}>
            {guild.name} - {guild.id}
          </span>
        </div>

        {/* ── Role selector ── */}
        <div className={styles.formGroup}>
          <span className={styles.formLabel}>
            Role — current: {roleNames[currentRole]}
          </span>
          <select
            className={styles.select}
            value={selectedRole}
            onChange={(e) => setSelectedRole(Number(e.target.value))}
          >
            {Object.entries(roleNames).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* ── Actions ── */}
        <div className={styles.formGroup}>
          <span className={styles.formLabel}>Actions</span>
          <div className={styles.container}>
            <button
              className={styles.button}
              onClick={handleDelete}
              disabled={isRemoveMemberPending}
            >
              {isRemoveMemberPending ? "🗑 Deleting..." : "🗑 Delete"}
            </button>

            {roleChanged && (
              <button
                className={styles.button}
                onClick={handleUpgrade}
                disabled={isUpgradingPending}
              >
                {isUpgradingPending ? "⬆ Upgrading..." : "⬆ Upgrade"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
