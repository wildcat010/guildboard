"use client";
import styles from "./memberModal.module.css";
import { Guild, Member } from "./../../../constants/constants";
import { roleNames } from "./../../../constants/constants";
import { useState } from "react";
import { useManagementGuild } from "@/hooks/useManagementGuilds";
import { useGuildById } from "@/hooks/useGuildById";

type MemberModalProps = {
  onClose: () => void;
  member: Member;
};

export default function MemberModal({ onClose, member }: MemberModalProps) {
  const [selectedRole, setSelectedRole] = useState(Number(member.role));

  const { getGuildById } = useGuildById(Number(member.guildId));
  const guild = getGuildById as Guild;

  const currentRole = Number(member.role);
  const roleChanged = selectedRole !== currentRole;
  const memberId = Number(member.id);

  function handleUpgrade() {
    //upgradeMember(memberId, selectedRole);
  }

  function handleDelete() {
    //removeMember(memberId, () => onClose());
  }

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
              // disabled={isRemovePending}
            >
              {"🗑 Delete"}
            </button>

            {roleChanged && (
              <button
                className={styles.button}
                onClick={handleUpgrade}
                // disabled={isUpgradePending}
              >
                {"⬆ Upgrade"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
