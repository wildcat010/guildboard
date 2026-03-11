import Image from "next/image";
import styles from "./header.module.css";

export default function Header() {
  return (
    <>
      <div className={styles.topbar}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>⚔</div>
          <div className={styles.logoText}>GUILDBOARD</div>
        </div>
        <div className={styles.topbarNav} id="navLanding">
          <button className={`${styles.navBtn} ${styles.active}`}>Home</button>
          <button className={styles.navBtn}>Dashboard</button>
          <button className={styles.navBtn}>Docs</button>
        </div>
        <button className={styles.connectBtn} id="connectBtn">
          <span id="connectIcon">◆</span>
          <span id="connectText">Connect Wallet</span>
        </button>
      </div>
    </>
  );
}
