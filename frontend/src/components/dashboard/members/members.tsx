"use client";

import styles from "./members.module.css";
import { useEffect, useState } from "react";
import { Guild, Section } from "./../../../constants/constants";

import { useGuild } from "@/hooks/useGuild";
import AddMemberModal from "./addMemberModal/membersModal";
import MembersTable from "./membersTable/membersTable";

export default function GuildMembers() {
  const [showModal, setShowModal] = useState(false);
  const { guilds } = useGuild();
  const guildsArray = (guilds as Guild[]) ?? [];

  return (
    <div className={styles.content}>
      <div className={`${styles.pageHeader} ${styles.animateIn}`}>
        <div>
          <div className={styles.pageTitle}>Members </div>
        </div>
        <button
          className={styles.btnPrimary}
          onClick={() => setShowModal(true)}
        >
          + Create Member
        </button>
      </div>
      <MembersTable></MembersTable>
      {showModal && <AddMemberModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
