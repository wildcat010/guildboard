import { useDeposit } from "@/hooks/useDeposit";
import styles from "./../depositModal/depositModal.module.css";
import { useState, useEffect } from "react";
import { useBalance } from "wagmi";

type MembeDepositModalProps = {
  onClose: () => void;
  refetchBalance: () => void;
};

export function DepositModal({
  onClose,
  refetchBalance,
}: MembeDepositModalProps) {
  const [depositAmount, setDepositAmount] = useState(0);
  const { deposit, isDepositPending, isDepositSuccess } = useDeposit();

  useEffect(() => {
    if (isDepositSuccess) {
      onClose();
    }
  }, [isDepositSuccess]);

  const handleSubmit = () => {
    if (isDepositSuccess) {
      onClose();
      refetchBalance();
      return;
    }

    deposit(depositAmount.toString());
  };

  return (
    <>
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <div className={styles.modalHeader}>
            <h2>Add Guild</h2>
            <button onClick={onClose}>✕</button>
          </div>
          <div className={styles.modalBody}>
            <label>Deposit Amount in ETH</label>
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(Number(e.target.value))}
            />
          </div>
          <div className={styles.modalFooter}>
            <button onClick={onClose}>Cancel</button>
            <button onClick={handleSubmit} disabled={isDepositPending}>
              {isDepositPending ? "Deposit..." : "Create Deposit"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
