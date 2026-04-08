"use client";
import { useGuild } from "@/hooks/useGuild";
import styles from "./listQuestToPay.module.css";
import { Guild, Task, taskStatus } from "@/constants/constants";
import { useTask } from "@/hooks/useTask";
import { formatEther } from "viem";
import { useGuildById } from "@/hooks/useGuildById";
import { usePayment } from "@/hooks/usePayment";
import { useEffect } from "react";

type ListQuestToPayProps = {
  task: Task;
  refetchAllTasks: () => void;
  refetchBalance: () => void;
};

export function ListQuestToPay({
  task,
  refetchAllTasks,
  refetchBalance,
}: ListQuestToPayProps) {
  const { getGuildById } = useGuildById(Number(task.guildId));
  const myGuild = getGuildById as Guild;
  const { paidAndCloseQuest, isPaidTaskPending, isPaidTaskSuccess } =
    usePayment();

  function handlePay() {
    console.log("pay");
    paidAndCloseQuest(BigInt(task.id));
  }

  useEffect(() => {
    if (isPaidTaskSuccess) {
      refetchAllTasks();
      refetchBalance();
    }
  }, [isPaidTaskSuccess, refetchAllTasks, refetchBalance]);

  return (
    <>
      <div className={styles.memberListItem}>
        <div className={styles.miniHex}>{task.name}</div>
        <div className={styles.memberInfo}>
          <div className={`${styles.memberListName} ${styles.gold}`}>
            {formatEther(BigInt(task.reward.toString()))}
            <span>&nbsp;ETH</span>
          </div>
          <div className={styles.memberListRole}>
            <div className={styles.memberListName}>{myGuild?.name}</div>
          </div>
        </div>
        <button className={styles.memberUpdate} onClick={handlePay}>
          {isPaidTaskPending ? "⬆ Paying..." : "⬆ Pay"}
        </button>
      </div>
    </>
  );
}
