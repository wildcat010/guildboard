"use client";
import Image from "next/image";
import styles from "./hero.module.css";

import { useGuild } from "@/hooks/useGuild";
import { useAccount } from "wagmi";
import { roleNames } from "../../../constants/constants";

export default function Hero() {
  const { isConnected } = useAccount();
  const { isMember, role } = useGuild();

  if (!isConnected) return <p>Please connect your wallet</p>;

  return (
    <>
      <div id="landing">
        <div className={styles.hero}>
          <div className={styles.heroBg}></div>
          <div className={styles.heroEmblem}>⚔</div>
          <div className={styles.heroTitle}>GuildBoard</div>
          <div className={styles.heroSub}>
            Web3 Guild Platform · NFT · ETH · On-Chain
          </div>

          <div>
            {isMember ? (
              <p className={styles.heroDesc}>
                ✅ You are a guild member — role:
                {roleNames[role as number] ?? "Unknow"}
              </p>
            ) : (
              <p className={styles.heroDesc}>❌ You are not a member</p>
            )}
          </div>

          <p className={styles.heroDesc}>
            A decentralized guild platform where membership is verified by{" "}
            <strong>NFT</strong>. Post quests, assign members, and release{" "}
            <strong>ETH payments</strong> through smart contracts. Built to
            showcase fullstack Web3 engineering.
          </p>

          <div className={styles.heroActions}>
            <button className={styles.btnHeroPrimary}>⟶ Enter the Guild</button>

            <button className={styles.btnHeroSecondary}>View Dashboard</button>
          </div>
        </div>
      </div>
    </>
  );
}
