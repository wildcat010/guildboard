"use client";
import styles from "./paymentModal.module.css";

type PaymentModalProps = {
  onClose: () => void;
  refetchBalance: () => void;
  onDepositSuccess: () => void;
};

export function PaymentModal({
  onClose,
  refetchBalance,
  onDepositSuccess,
}: PaymentModalProps) {
  return (
    <>
      <div className={styles.modalOverlay} onClick={onClose}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <button className={styles.modalClose} onClick={onClose}>
            ✕
          </button>
          <div className={styles.modalTitle}>⚔ Payments</div>

          {/* ── Name ── */}

          {/* ── Actions ── */}
          <div className={styles.formGroup}>
            <span className={styles.formLabel}>Actions</span>
            <div className={styles.container}>
              {/* {hasChanges && (
                <button
                  className={styles.button}
                  onClick={handleUpdate}
                  disabled={isPending}
                >
                  {isTaskUpdatePending || isTaskStatusPending
                    ? "⬆ Updating..."
                    : isTaskStatusPending
                      ? "⬆ Assigning..."
                      : "⬆ Update"}
                </button>
              )} */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
