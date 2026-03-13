"use client";

import styles from "./guildMembers.module.css";
import { useEffect, useState } from "react";
import { Section } from "./../../../constants/constants";
import AddMemberdModal from "./addMemberModal/addMemberModal";

export default function GuildMembers() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className={styles.content}>
      <div className={`${styles.pageHeader} ${styles.animateIn}`}>
        <div>
          <div className={styles.pageTitle}>Guild Members</div>
        </div>
        <button
          className={styles.btnPrimary}
          onClick={() => setShowModal(true)}
        >
          + Add Member
        </button>
      </div>
      {showModal && <AddMemberdModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
