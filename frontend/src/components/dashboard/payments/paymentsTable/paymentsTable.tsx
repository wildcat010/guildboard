"use client";

import { useDeposit } from "@/hooks/useDeposit";
import styles from "./../depositModal/depositModal.module.css";
import { useState, useEffect } from "react";
import { useBalance } from "wagmi";
import { Depo } from "@/constants/constants";
import "simple-table-core/styles.css";
import "./CustomTheme.css";
import { SimpleTable } from "simple-table-core";
import { formatEther } from "viem";

type PaymentsTableProps = {
  refetchDeposits: () => void;
};

const headers = [
  { accessor: "id", label: "ID", width: 60 },
  { accessor: "name", label: "Name", width: 220 },
  { accessor: "amount", label: "Amount", width: 160 },
];

export function PaymentsTable({ refetchDeposits }: PaymentsTableProps) {
  const { deposits } = useDeposit();
  const [selectedDeposit, setSelectedDeposit] = useState<Depo | null>(null);
  const [allDeposits, setAllDeposits] = useState<Depo[]>([]);

  useEffect(() => {
    setAllDeposits(
      ((deposits as Depo[]) ?? []).sort((a, b) => Number(b.id) - Number(a.id)),
    );
  }, [deposits]);

  const rows = allDeposits.map((depo: Depo) => ({
    id: Number(depo.id),
    name: (
      <div className="userCell">
        <div className="userName">{depo.name}</div>
        <div className="userRole">{depo.date}</div>
      </div>
    ),

    amount: <div>{formatEther(depo.amount)}</div>,
  }));

  return (
    <>
      <div className={`custom-theme-container ${styles.tableWrapper}`}>
        <SimpleTable
          defaultHeaders={headers}
          rows={rows}
          getRowId={({ row }) => (row as any).id}
          height="500px"
          autoExpandColumns
          theme="custom"
          customTheme={{
            headerHeight: 40,
            rowHeight: 72,
          }}
        />
      </div>
    </>
  );
}
