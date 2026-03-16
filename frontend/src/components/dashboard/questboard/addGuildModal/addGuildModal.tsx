"use client";
import styles from "./addGuildModal.module.css";
import { useState, useEffect } from "react";
import { useManagementGuild } from "@/hooks/useManagementGuilds";
import { useGuild } from "@/hooks/useGuild";

type AddGuildModalProps = {
  onClose: () => void;
};

export default function AddGuildModal({ onClose }: AddGuildModalProps) {
  const [guildName, setGuildName] = useState("");

  const { refetchGuilds, refetchGuildsCount, refetchGuildsLimit } = useGuild();

  const { createGuild, isPending, isSuccess } = useManagementGuild();

  useEffect(() => {
    if (isSuccess) {
      onClose();
      refetchGuilds();
      refetchGuildsCount();
      refetchGuildsLimit();
    }
  }, [isSuccess]);

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
          <div className={styles.modalFooter}>
            <button onClick={onClose}>Cancel</button>
            <button onClick={handleSubmit} disabled={isPending}>
              {isPending ? "Creating..." : "Create Guild"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
