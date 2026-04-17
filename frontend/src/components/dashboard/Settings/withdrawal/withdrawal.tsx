"use client";

import styles from "./withdrawal.module.css";
import { Task } from "@/constants/constants";
import { useTask } from "@/hooks/useTask";
import { useEffect, useState } from "react";
import { usePayment } from "@/hooks/usePayment";
import { isAddress, parseEther } from "ethers";
import { useGuild } from "@/hooks/useGuild";

type WithdrawalProps = {
  onClose: () => void;
  balance: any;
  refetchBalance: () => void;
  owner: string;
};

export function Withdrawal({
  onClose,
  balance,
  refetchBalance,
  owner,
}: WithdrawalProps) {
  const {
    withdrawTo,
    isWithdrawalPending,
    isWithdrawalConfirming,
    isWithdrawalConfirmed,
  } = usePayment();

  const { isOwner } = useGuild();

  const [addressTo, setAddressTo] = useState(owner);
  const [amount, setAmount] = useState(balance?.formatted);

  const onWithdrawal = () => {
    if (isOwner) {
      if (!isAddress(addressTo)) {
        alert("Invalid wallet address");
        return;
      }

      if (!amount || Number(amount) <= 0) {
        alert("Invalid amount");
        return;
      }

      withdrawTo(addressTo, parseEther(amount));
    } else {
      alert("Only the owner of the contract can perform withdrawals.");
    }
  };

  useEffect(() => {
    if (isWithdrawalConfirmed) {
      refetchBalance();
      onClose();
    }
  }, [isWithdrawalConfirmed]);

  return (
    <>
      <div className={styles.modalOverlay} onClick={onClose}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <button className={styles.modalClose} onClick={onClose}>
            ✕
          </button>
          <div className={styles.modalTitle}>⚔ Emergency Withdrawal</div>

          {/* ── Name ── */}
          <div className={styles.formGroup}>
            <span className={styles.formLabel}>
              Balance - {balance?.formatted} {balance?.symbol}
            </span>
          </div>

          <div className={styles.modalBody}>
            <label>Address To</label>
            <input
              type="text"
              value={addressTo}
              placeholder={addressTo}
              disabled={isWithdrawalPending || isWithdrawalConfirming}
              onChange={(e) => setAddressTo(e.target.value)}
            />
          </div>

          <div className={styles.modalBody}>
            <label>Amount in ETH</label>
            <input
              type="number"
              value={amount}
              placeholder={amount}
              disabled={isWithdrawalPending || isWithdrawalConfirming}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          {/* ── Actions ── */}
          <br></br>
          <div className={styles.formGroup}>
            <span className={styles.formLabel}>Actions</span>
            <button
              className={styles.button}
              onClick={onWithdrawal}
              disabled={isWithdrawalPending || isWithdrawalConfirming}
            >
              {isWithdrawalPending
                ? "⬆ Confirm in MetaMask..."
                : isWithdrawalConfirming
                  ? "⬆ Confirming on Sepolia..."
                  : "⬆ Withdrawal"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
