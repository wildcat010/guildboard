"use client";
import styles from "./addGuildModal.module.css";
import { useState, useEffect } from "react";
import { useManagementGuild } from "@/hooks/useManagementGuilds";
import { useGuild } from "@/hooks/useGuild";

type AddGuildModalProps = {
  onClose: () => void;
  onSuccess: () => void;
};

export default function AddGuildModal({
  onClose,
  onSuccess,
}: AddGuildModalProps) {
  const [guildName, setGuildName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const { createGuild, isGuildPending, isGuildConfirming, isGuildConfirmed } =
    useManagementGuild();

  useEffect(() => {
    if (submitted && isGuildConfirmed) {
      onClose();
      onSuccess();
    }
  }, [submitted, isGuildConfirmed]);

  function handleSubmit() {
    if (isGuildConfirmed) {
      onClose();
      return;
    }
    if (!guildName.trim()) return;
    setSubmitted(true);
    createGuild(guildName.trim());
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
              disabled={isGuildPending || isGuildConfirming}
            />
          </div>
          <div className={styles.modalFooter}>
            <button
              onClick={onClose}
              disabled={isGuildPending || isGuildConfirming}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isGuildPending || isGuildConfirming}
            >
              {isGuildPending
                ? "Submitting..."
                : isGuildConfirming
                  ? "Confirming on Sepolia..."
                  : "Create Guild"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
