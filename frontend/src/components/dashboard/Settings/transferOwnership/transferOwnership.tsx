"use client";

import styles from "./transferOwnership.module.css";
import { useEffect, useState } from "react";
import { useNewOwner } from "@/hooks/useNewOwner";

type TransferOwnershipProps = {
  onClose: () => void;
  refetchOwner: () => void;
  setIsRefreshing: (value: boolean) => void;
  isRefreshing: boolean;
  isOwner: boolean;
};

export function TransferOwnership({
  onClose,
  refetchOwner,
  isRefreshing,
  setIsRefreshing,
  isOwner,
}: TransferOwnershipProps) {
  const { setNewOwner, isNewOwnerPending } = useNewOwner();

  const [addressTo, setAddressTo] = useState("");

  const onTransfer = () => {
    if (isOwner) {
      setIsRefreshing(true);
      setNewOwner(addressTo);
    } else {
      alert("Only the owner of the smart contract can do it.");
    }
  };

  return (
    <>
      <div className={styles.modalOverlay} onClick={onClose}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <button className={styles.modalClose} onClick={onClose}>
            ✕
          </button>
          <div className={styles.modalTitle}>⚔ Transfer Ownership</div>

          <div className={styles.modalBody}>
            <label>New Owner</label>
            <input
              type="text"
              value={addressTo}
              placeholder={addressTo}
              disabled={isNewOwnerPending}
              onChange={(e) => setAddressTo(e.target.value)}
            />
          </div>

          {/* ── Actions ── */}
          <br></br>
          <div className={styles.formGroup}>
            <span className={styles.formLabel}>Actions</span>
            <button
              className={styles.button}
              onClick={onTransfer}
              disabled={isNewOwnerPending}
            >
              {isNewOwnerPending
                ? "⬆ Confirm in MetaMask..."
                : isRefreshing
                  ? "⬆ Updating..."
                  : "Update"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
