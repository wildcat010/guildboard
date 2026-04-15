import { useDeposit } from "@/hooks/useDeposit";
import styles from "./../depositModal/depositModal.module.css";
import { useState, useEffect } from "react";
import { useBalance } from "wagmi";

type MembeDepositModalProps = {
  onClose: () => void;
  refetchBalance: () => void;
  onDepositSuccess: () => void;
};

const getTodayDate = () => {
  const today = new Date();

  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();

  return `${day}/${month}/${year}`;
};

export function DepositModal({
  onClose,
  refetchBalance,
  onDepositSuccess,
}: MembeDepositModalProps) {
  const [depositAmount, setDepositAmount] = useState(0);
  const [name, setName] = useState("");
  const [date, setDate] = useState(getTodayDate());
  const { deposit, isDepositPending, isDepositSuccess } = useDeposit();

  useEffect(() => {
    if (isDepositSuccess) {
      refetchBalance();
      onDepositSuccess(); // ✅ refetch table
      onClose();
    }
  }, [isDepositSuccess]);

  const handleSubmit = () => {
    if (isDepositSuccess) {
      onClose();
      refetchBalance();
      return;
    }

    deposit(name, date, depositAmount.toString());
  };

  return (
    <>
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <div className={styles.modalHeader}>
            <h2>Add Deposit</h2>
            <button onClick={onClose}>✕</button>
          </div>
          <div className={styles.modalBody}>
            <label>Name Deposit</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className={styles.modalBody}>
            <label>Date Deposit</label>
            <input
              type="text"
              value={date}
              placeholder="01/01/2025"
              onChange={(e) => setDate(e.target.value)}
            />
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
