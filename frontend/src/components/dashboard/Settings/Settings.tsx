"use client";

import styles from "./Settings.module.css";

import { useEffect } from "react";
import { useGuild } from "@/hooks/useGuild";

import { Guild, Member, Task } from "../../../constants/constants";
import { GUILDBOARD_ADDRESS } from "@/contracts";
import { useBalance } from "wagmi";
import { useMember } from "@/hooks/useMember";
import { useTask } from "@/hooks/useTask";
import { useSettings } from "@/hooks/useSettings";
import { useShutdownActions } from "@/hooks/useShutdownActions";

export default function Settings() {
  const { data: balance, refetch: refetchBalance } = useBalance({
    address: GUILDBOARD_ADDRESS,
  });

  const { guilds } = useGuild();
  const { getAllMembers } = useMember();
  const { getAllTasks } = useTask();
  const { isPaused } = useSettings();
  const {
    enableShutdown,
    disableShutdown,
    isEnableShutdownPending,
    isEnableShutdownSuccess,
    isDisableShutdownPending,
    isDisableShutdownSuccess,
  } = useShutdownActions();

  const myGuilds = (guilds as Guild[]) ?? [];
  const members = (getAllMembers as Member[]) ?? [];
  const tasks = (getAllTasks as Task[]) ?? [];
  const tasksVerified =
    (getAllTasks as Task[])?.filter((task) => task.status === 3) ?? [];
  const tasksDone =
    (getAllTasks as Task[])?.filter((task) => task.status === 4) ?? [];

  const handlePauseContractProperty = (isPaused: boolean) => {
    if (isPaused) {
      disableShutdown();
    } else {
      enableShutdown();
    }
  };

  useEffect(() => {
    if (isEnableShutdownSuccess || isDisableShutdownSuccess) {
    }
  }, [isEnableShutdownSuccess, isDisableShutdownSuccess]);

  return (
    <>
      {" "}
      <div className={styles.content}>
        <div className={`${styles.pageHeader} ${styles.animateIn}`}>
          <div>
            <div className={styles.pageTitle}>Settings - Quick Dashboard</div>
          </div>
        </div>
        <div className={styles.container}>
          <div className={styles.pageSub}>
            Contract Balance
            <p className={styles.text}>
              {balance?.formatted} {balance?.symbol}
            </p>
          </div>
          <div className={styles.pageSub}>
            Number of users
            <p className={styles.text}>{members.length}</p>
          </div>
          <div className={styles.pageSub}>
            Number of guilds
            <p className={styles.text}>{myGuilds.length}</p>
          </div>
          <div className={styles.pageSub}>
            Number of tasks
            <p className={styles.text}>{tasks.length}</p>
          </div>
          <div className={styles.pageSub}>
            Number of tasks verified
            <p className={styles.text}>{tasksVerified.length}</p>
          </div>
          <div className={styles.pageSub}>
            Number of tasks closed
            <p className={styles.text}>{tasksDone.length}</p>
          </div>
        </div>
        <div className={`${styles.pageHeader} ${styles.animateIn}`}>
          <div>
            <div className={styles.pageTitle}>
              Settings - Disable Contract - {isPaused ? "Paused" : "Active"}
            </div>
          </div>
        </div>
        <button
          className={styles.btnPrimary}
          onClick={() => handlePauseContractProperty(isPaused as boolean)}
          disabled={isEnableShutdownPending || isDisableShutdownPending}
        >
          {isEnableShutdownPending || isDisableShutdownPending
            ? "Processing..."
            : !isPaused
              ? "Deactivate the Contract"
              : "Activate the Contract"}
        </button>
      </div>
    </>
  );
}
