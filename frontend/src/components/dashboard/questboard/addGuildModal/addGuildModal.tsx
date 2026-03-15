"use client";
import styles from "./addGuildModal.module.css";
import { useState, useEffect } from "react";
import { useManagementGuild } from "@/hooks/useManagementGuilds";

type AddGuildModalProps = {
  onClose: () => void;
};

export default function AddGuildModal({ onClose }: AddGuildModalProps) {
  const [guildName, setGuildName] = useState("");

  const { createGuild, isPending, isSuccess } = useManagementGuild();

  function handleSubmit() {
    if (isSuccess) {
      onClose();
      return;
    }
    if (!guildName.trim()) return;
    createGuild(guildName);
  }

  return (
    <>
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <div className={styles.modalHeader}>
            <h2>Add Guild</h2>
            <button onClick={onClose}>✕</button>
          </div>
          <div className={styles.modalBody}>
            <label>Guild Name</label>
            <input
              type="text"
              value={guildName}
              onChange={(e) => setGuildName(e.target.value)}
            />
          </div>
          <button onClick={() => handleSubmit} disabled={isPending}>
            {isPending ? "Creating..." : "Create Guild"}
          </button>
        </div>
      </div>
    </>
  );
}
