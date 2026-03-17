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
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button className={styles.modalClose} onClick={onClose}>
          ✕
        </button>
        <div className={styles.modalTitle}>⚔ Guild Card</div>

        <div className="nft-check">
          <div className="nft-icon">🛡</div>
          <div className="nft-text">
            <div className="nft-title">NFT Membership Verified</div>
            <div className="nft-desc">
              GuildBoard Member #042 · 0x7f3a...c8b1
            </div>
          </div>
          <span className="badge">✓ Member</span>
        </div>

        <button
          className="btn-primary"
          style={{ width: "100%", padding: "12px" }}
        >
          ⟶ Deploy Quest On-Chain
        </button>
      </div>
    </div>
  );
}
