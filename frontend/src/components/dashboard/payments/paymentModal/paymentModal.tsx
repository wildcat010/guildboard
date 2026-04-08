"use client";
import { useGuild } from "@/hooks/useGuild";
import styles from "./paymentModal.module.css";
import { Guild, Task } from "@/constants/constants";
import { useTask } from "@/hooks/useTask";
import { ListQuestToPay } from "../listQuestToPay/listQuestToPay";

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
  const { getAllTasks, refetchAllTasks } = useTask();
  const allTasks = (getAllTasks as Task[]) || [];
  const verifiedTasks =
    allTasks?.filter((task: Task) => task.status == 3) || [];

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
              {verifiedTasks.map((task: Task, i: number) => (
                <ListQuestToPay
                  task={task}
                  key={i}
                  refetchAllTasks={refetchAllTasks}
                  refetchBalance={refetchBalance}
                ></ListQuestToPay>
              ))}

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
