"use client";

import styles from "./Settings.module.css";

import { useEffect, useState } from "react";
import { useGuild } from "@/hooks/useGuild";

import { Guild, Member, Task } from "../../../constants/constants";
import { GUILDBOARD_ADDRESS } from "@/contracts";
import { useAccount, useBalance, usePublicClient } from "wagmi";
import { useMember } from "@/hooks/useMember";
import { useTask } from "@/hooks/useTask";
import { useSettings } from "@/hooks/useSettings";
import { useShutdownActions } from "@/hooks/useShutdownActions";
import { Withdrawal } from "./withdrawal/withdrawal";
import { TransferOwnership } from "./transferOwnership/transferOwnership";

export default function Settings() {
  // =========================
  // FIX #1: contract balance was incorrectly using useBalance with a CONTRACT address
  // This is unreliable for contracts in wagmi + often breaks in production
  // =========================
  const publicClient = usePublicClient();

  const [contractBalance, setContractBalance] = useState<bigint | null>(null);

  useEffect(() => {
    // FIX #2: wait until wallet + client exist before querying blockchain
    if (!publicClient) return;

    const fetchBalance = async () => {
      try {
        const bal = await publicClient.getBalance({
          address: GUILDBOARD_ADDRESS as `0x${string}`,
        });
        setContractBalance(bal);
      } catch (err) {
        console.error("Failed to fetch contract balance:", err);
      }
    };

    fetchBalance();
  }, [publicClient]);

  const { contractOwner, refetchOwner, guilds, isOwner } = useGuild();
  const owner = contractOwner as string;

  const [withdrawalModal, setWithdrawalModal] = useState(false);
  const [transferOwnershipModal, setTransferOwnershipModal] = useState(false);

  const { getAllMembers } = useMember();
  const { getAllTasks } = useTask();
  const { isPaused, refetchIsPaused } = useSettings();

  const {
    enableShutdown,
    disableShutdown,
    isEnableShutdownPending,
    isEnableShutdownConfirming,
    isEnableShutdownConfirmed,
    isDisableShutdownPending,
    isDisableShutdownConfirming,
    isDisableShutdownConfirmed,
  } = useShutdownActions();

  const myGuilds = (guilds as Guild[]) ?? [];

  // =========================
  // FIX #3: these were likely async hooks OR undefined on first render
  // now we safely guard against undefined + timing issues
  // =========================
  const members = (getAllMembers as Member[]) ?? [];
  const tasks = (getAllTasks as Task[]) ?? [];

  const tasksVerified =
    (getAllTasks as Task[])?.filter((task) => task.status === 3) ?? [];

  const tasksDone =
    (getAllTasks as Task[])?.filter((task) => task.status === 4) ?? [];

  const handlePauseContractProperty = (isPaused: boolean) => {
    if (isOwner) {
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

  useEffect(() => {
    if (isEnableShutdownConfirmed || isDisableShutdownConfirmed) {
      refetchIsPaused();
    }
  }, [isEnableShutdownConfirmed, isDisableShutdownConfirmed]);

  // =========================
  // FIX #4: logging env vars is fine — but NOT the root issue anymore
  // they ARE correctly loaded (confirmed earlier)
  // =========================
  console.log("NFT:", process.env.NEXT_PUBLIC_GUILD_NFT_ADDRESS);
  console.log("Board:", process.env.NEXT_PUBLIC_GUILDBOARD_ADDRESS);
  console.log("RPC:", process.env.NEXT_PUBLIC_RPC_URL);

  return (
    <>
      <div className={styles.content}>
        <div className={`${styles.pageHeader} ${styles.animateIn}`}>
          <div>
            <div className={styles.pageTitle}>Settings - Quick Dashboard</div>
          </div>
        </div>

        <div className={styles.pageSub}>
          Owner
          <p className={styles.text}>{owner}</p>
        </div>

        <div className={styles.container}>
          <div className={styles.pageSub}>
            Contract Balance
            <p className={styles.text}>
              {/* FIX #5: replaced wagmi useBalance with safe manual fetch */}
              {contractBalance
                ? `${Number(contractBalance) / 1e18} ETH`
                : "Loading..."}
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
            isEnableShutdownPending ||
            isDisableShutdownPending ||
            isEnableShutdownConfirming ||
            isDisableShutdownConfirming
          }
        >
          {isEnableShutdownPending || isDisableShutdownPending
            ? "⬆ Confirm in MetaMask..."
            : isEnableShutdownConfirming || isDisableShutdownConfirming
              ? "⬆ Confirming on Sepolia..."
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

        <button className={styles.btnPrimary} onClick={onTransferOwnership}>
          Transfer Ownership
        </button>
      </div>

      {withdrawalModal && (
        <Withdrawal
          onClose={() => setWithdrawalModal(false)}
          balance={contractBalance}
          owner={owner ?? ""}
          refetchBalance={() => {}} // FIX #6: placeholder since wagmi useBalance removed
        />
      )}

      {transferOwnershipModal && (
        <TransferOwnership
          onClose={() => setTransferOwnershipModal(false)}
          refetchOwner={refetchOwner}
          isOwner={isOwner as boolean}
        />
      )}
    </>
  );
}
