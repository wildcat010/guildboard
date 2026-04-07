"use client";

import styles from "./payments.module.css";
import { useEffect, useState } from "react";
import { Section } from "./../../../constants/constants";
import { useBalance } from "wagmi";
import { GUILDBOARD_ADDRESS } from "@/contracts";
import { DepositModal } from "./depositModal/depositModal";
import { PaymentsTable } from "./paymentsTable/paymentsTable";
import { useDeposit } from "@/hooks/useDeposit";
import { PaymentModal } from "./paymentModal/paymentModal";

export default function Payments() {
  const [depositModal, setDepositModal] = useState(false);
  const [paymentModal, setPaymentModal] = useState(false);
  const { data: balance, refetch: refetchBalance } = useBalance({
    address: GUILDBOARD_ADDRESS,
  });
  const { refetchDeposits } = useDeposit();

  return (
    <div className={styles.content}>
      <div className={`${styles.pageHeader} ${styles.animateIn}`}>
        <div>
          <div className={styles.pageTitle}>Payments </div>
        </div>
        <div className={styles.buttonWraper}>
          <button
            className={styles.btnPrimary}
            onClick={() => setPaymentModal(true)}
          >
            + Create Payment
          </button>
          <button
            className={styles.btnPrimary}
            onClick={() => setDepositModal(true)}
          >
            + Create Deposit
          </button>
        </div>
      </div>
      <div className={styles.pageSub}>
        Contract Balance
        <p className={styles.text}>
          {balance?.formatted} {balance?.symbol}
        </p>
      </div>
      {depositModal && (
        <DepositModal
          onClose={() => setDepositModal(false)}
          refetchBalance={refetchBalance}
          onDepositSuccess={refetchDeposits}
        ></DepositModal>
      )}
      {paymentModal && (
        <PaymentModal
          onClose={() => setPaymentModal(false)}
          refetchBalance={refetchBalance}
          onDepositSuccess={refetchDeposits}
        ></PaymentModal>
      )}
      <br />
      <PaymentsTable refetchDeposits={refetchDeposits}></PaymentsTable>
    </div>
  );
}
