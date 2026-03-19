"use client";

import styles from "./memberModal.module.css";
import { useState, useEffect } from "react";
import { Guild } from "./../../../constants/constants";
import { roleNames } from "./../../../constants/constants";
import { useGuild } from "@/hooks/useGuild";

type MemberModalProps = {
  onClose: () => void;
  addressMember: string;
  role: number;
};

export default function MemberModal({
  onClose,
  role,
  addressMember,
}: MemberModalProps) {
  const [selectedRole, setSelectedRole] = useState(Number(role));
  const [different, setDifferent] = useState(false);
  const initialRole = role;

  const isSelectedValid = !Number.isNaN(selectedRole);
  const isInitialValid = !Number.isNaN(initialRole);

  useEffect(() => {
    if (isSelectedValid && isInitialValid) {
      if (initialRole !== selectedRole) {
        console.log("different");
        setDifferent(true);
      } else {
        console.log("not different");
        setDifferent(false);
      }
    }
  }, [selectedRole]);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button className={styles.modalClose} onClick={onClose}>
          ✕
        </button>
        <div className={styles.modalTitle}>⚔ User Info</div>
        <div className={styles.formGroup}>
          <span className={styles.formLabel}>User address</span>
          <span className={styles.formLabelBig}>{addressMember}</span>
        </div>
        <div className={styles.formGroup}>
          <span className={styles.formLabel}>User Role</span>
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

        <div className={styles.formGroup}>
          <span className={styles.formLabel}>Actions</span>
          <div className={styles.container}>
            <button className={styles.button}>Delete</button>
            {different && <button className={styles.button}>Upgrade</button>}
          </div>
        </div>
      </div>
    </div>
  );
}
