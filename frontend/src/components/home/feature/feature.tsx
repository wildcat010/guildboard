import Image from "next/image";
import styles from "./feature.module.css";

export default function Feature() {
  return (
    <div className={styles.featureRow}>
      <div className={styles.featureCard}>
        <div className={styles.featureIcon}>🛡</div>
        <div className={styles.featureTitle}>NFT Auth</div>
        <div className={styles.featureDesc}>
          Sign-In with Ethereum (EIP-4361). Only NFT holders access the guild.
          Membership is on-chain.
        </div>
      </div>
      <div className={styles.featureCard}>
        <div className={styles.featureIcon}>📋</div>
        <div className={styles.featureTitle}>On-Chain Tasks</div>
        <div className={styles.featureDesc}>
          Tasks live on the blockchain. ETH rewards are held in smart contract
          escrow until completion.
        </div>
      </div>
      <div className={styles.featureCard}>
        <div className={styles.featureIcon}>💸</div>
        <div className={styles.featureTitle}>ETH Payments</div>
        <div className={styles.featureDesc}>
          Pay guild members directly in ETH. No intermediaries. Contract
          enforces all rules trustlessly.
        </div>
      </div>
    </div>
  );
}
