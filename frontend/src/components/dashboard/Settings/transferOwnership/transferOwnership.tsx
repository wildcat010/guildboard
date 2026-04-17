"use client";

import styles from "./transferOwnership.module.css";
import { useEffect, useState } from "react";
import { useNewOwner } from "@/hooks/useNewOwner";

type TransferOwnershipProps = {
  onClose: () => void;
  refetchOwner: () => void;
};

export function TransferOwnership({
  onClose,
  refetchOwner,
}: TransferOwnershipProps) {
  const {
    setNewOwner,
    isNewOwnerPending,
    isNewOwnerConfirming,
    isNewOwnerConfirmed,
  } = useNewOwner();

  const [addressTo, setAddressTo] = useState("");

  const onTransfer = () => {
    setNewOwner(addressTo);
  };

  useEffect(() => {
    if (isNewOwnerConfirmed) {
      refetchOwner();
      onClose();
    }
  }, [isNewOwnerConfirmed]);

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
              disabled={isNewOwnerPending || isNewOwnerConfirming}
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
              disabled={isNewOwnerPending || isNewOwnerConfirming}
            >
              {isNewOwnerPending
                ? "⬆ Confirm in MetaMask..."
                : isNewOwnerConfirming
                  ? "⬆ Confirming on Sepolia..."
                  : "⬆ Update"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
