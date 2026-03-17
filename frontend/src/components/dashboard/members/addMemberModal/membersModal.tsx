"use client";
import { Guild } from "@/constants/constants";
import styles from "./membersModal.module.css";
import { useState } from "react";
import { useGuild } from "@/hooks/useGuild";

type MembersModalProps = {
  onClose: () => void;
};

export default function MembersModal({ onClose }: MembersModalProps) {
  const [memberName, setMemberName] = useState("");

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Add Member</h2>
          <button onClick={onClose}>✕</button>
        </div>
        <div className={styles.modalBody}>
          <label>Member Name</label>
          <input type="text" onChange={(e) => setMemberName(e.target.value)} />
        </div>
        {/* <div className={styles.modalFooter}>
            <button onClick={onClose}>Cancel</button>
            <button onClick={handleSubmit} disabled={isPending}>
              {isPending ? "Creating..." : "Create Guild"}
            </button>
          </div> */}
      </div>
    </div>
  );
}
