"use client";
import styles from "./addMemberModal.module.css";
import { useState } from "react";

type AddMemberModalProps = {
  onClose: () => void;
};

export default function AddMemberModal({ onClose }: AddMemberModalProps) {
  const [walletAddress, setWalletAddress] = useState("");
  const [tokenURI, setTokenURI] = useState("");
  const [guildId, setGuildId] = useState("");

  return (
    <>
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <div className={styles.modalHeader}>
            <h2>Add Member</h2>
            <button onClick={onClose}>✕</button>
          </div>
          <div className={styles.modalBody}>
            <label>Wallet Address</label>
            <input
              type="text"
              placeholder="0x..."
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
            />
          </div>
        </div>
      </div>
    </>
  );
}
