"use client";

import styles from "./Settings.module.css";

import { useEffect, useState } from "react";
import { useGuild } from "@/hooks/useGuild";

import { Guild, Member, Task } from "../../../constants/constants";
import {
  GUILD_NFT_ABI,
  GUILD_NFT_ADDRESS,
  GUILDBOARD_ABI,
  GUILDBOARD_ADDRESS,
} from "@/contracts";
import { useAccount, useBalance, useWatchContractEvent } from "wagmi";
import { useMember } from "@/hooks/useMember";
import { useTask } from "@/hooks/useTask";
import { useSettings } from "@/hooks/useSettings";
import { useShutdownActions } from "@/hooks/useShutdownActions";
import { Withdrawal } from "./withdrawal/withdrawal";
import { TransferOwnership } from "./transferOwnership/transferOwnership";

export default function Settings() {
  const { data: balance, refetch: refetchBalance } = useBalance({
    address: GUILDBOARD_ADDRESS,
  });

  const { address } = useAccount();
  const { contractOwner, refetchOwner } = useGuild();
  const owner = contractOwner as string;

  const [withdrawalModal, setWithdrawalModal] = useState(false);
  const [transferOwnershipModal, setTransferOwnershipModal] = useState(false);

  const { guilds, isOwner } = useGuild();
  const { getAllMembers } = useMember();
  const { getAllTasks } = useTask();
  const { isPaused, refetchIsPaused } = useSettings();
  const {
    enableShutdown,
    disableShutdown,
    isEnableShutdownPending,
    isDisableShutdownPending,
  } = useShutdownActions();

  const myGuilds = (guilds as Guild[]) ?? [];
  const members = (getAllMembers as Member[]) ?? [];
  const tasks = (getAllTasks as Task[]) ?? [];
  const tasksVerified =
    (getAllTasks as Task[])?.filter((task) => task.status === 3) ?? [];
  const tasksDone =
    (getAllTasks as Task[])?.filter((task) => task.status === 4) ?? [];

  const handlePauseContractProperty = (isPaused: boolean) => {
    if (isOwner) {
      setIsRefreshing(true);
      if (isPaused) {
        disableShutdown();
      } else {
        enableShutdown();
      }
    } else {
      alert("Only the owner of the contract can perform this action.");
    }
  };

  const onTransferOwnership = () => {
    if (isOwner) {
      setTransferOwnershipModal(true);
    } else {
      alert("Only the owner of the contract can perform this action.");
    }
  };

  const emergencyWithdrawal = () => {
    setWithdrawalModal(true);
  };

  const [isRefreshing, setIsRefreshing] = useState(false);

  useWatchContractEvent({
    address: GUILD_NFT_ADDRESS,
    abi: GUILD_NFT_ABI,
    eventName: "OwnershipTransferred",
    onLogs: (log) => {
      console.log("OwnershipTransferred fired:", log);
      refetchOwner();
      setTransferOwnershipModal(false);
      setIsRefreshing(false);
    },
  });

  useWatchContractEvent({
    address: GUILDBOARD_ADDRESS,
    abi: GUILDBOARD_ABI,
    eventName: "Paused",
    onLogs: () => {
      refetchIsPaused();
      refetchBalance();
      setIsRefreshing(false);
    },
  });

  useWatchContractEvent({
    address: GUILDBOARD_ADDRESS,
    abi: GUILDBOARD_ABI,
    eventName: "Unpaused",
    onLogs: () => {
      refetchIsPaused();
      refetchBalance();
      setIsRefreshing(false);
    },
  });

  return (
    <>
      {" "}
      <div className={styles.content}>
        <div className={`${styles.pageHeader} ${styles.animateIn}`}>
          <div>
            <div className={styles.pageTitle}>Settings - Quick Dashboard</div>
          </div>
        </div>
        <div className={styles.pageSub}>
          Owner
          <p className={styles.text}>{owner ?? "N/A"}</p>
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
              Settings - Disable/Enable Contract -{" "}
              {isPaused ? "Paused" : "Active"}
            </div>
          </div>
        </div>
        <button
          className={styles.btnPrimary}
          onClick={() => handlePauseContractProperty(isPaused as boolean)}
          disabled={
            isEnableShutdownPending || isDisableShutdownPending || isRefreshing
          }
        >
          {isEnableShutdownPending || isDisableShutdownPending
            ? "⬆ Confirm in MetaMask..."
            : isRefreshing
              ? "⏳ Updating..."
              : !isPaused
                ? "Deactivate the Contract"
                : "Activate the Contract"}
        </button>
        <div className={`${styles.pageHeader} ${styles.animateIn}`}>
          <div>
            <div className={styles.pageTitle}>
              Settings - Emergency Withdrawal
            </div>
          </div>
        </div>
        <button className={styles.btnPrimary} onClick={emergencyWithdrawal}>
          Emergency Withdrawal
        </button>
        <div className={`${styles.pageHeader} ${styles.animateIn}`}>
          <div>
            <div className={styles.pageTitle}>
              Settings - Transfer Ownership
            </div>
          </div>
        </div>
        <button
          className={styles.btnPrimary}
          onClick={onTransferOwnership}
          disabled={isRefreshing}
        >
          {isRefreshing ? "⏳ Updating..." : "Transfer Ownership"}
        </button>
      </div>
      {withdrawalModal && (
        <Withdrawal
          onClose={() => {
            setWithdrawalModal(false);
          }}
          balance={balance}
          owner={owner ?? ""}
          refetchBalance={refetchBalance}
        />
      )}
      {transferOwnershipModal && (
        <TransferOwnership
          onClose={() => {
            setIsRefreshing(false);
            setTransferOwnershipModal(false);
          }}
          refetchOwner={refetchOwner}
          isRefreshing={isRefreshing}
          setIsRefreshing={setIsRefreshing}
          isOwner={isOwner as boolean}
        />
      )}
    </>
  );
}
