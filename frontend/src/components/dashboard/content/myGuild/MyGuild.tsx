"use client";

import styles from "./MyGuild.module.css";
import { useEffect, useState } from "react";

import { useBalance } from "wagmi";
import { GUILDBOARD_ADDRESS } from "@/contracts";

import { useDeposit } from "@/hooks/useDeposit";

export default function MyGuild() {
  return (
    <>
      <div className={styles.content}>
        <div className={`${styles.pageHeader} ${styles.animateIn}`}>
          <div>
            <div className={styles.pageTitle}>My Guild -</div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "5px",
            }}
          >
            <button className={styles.btnPrimary}>+ Create Guild</button>
          </div>
        </div>
        <div className={styles.pageGuilds}>{/* //CARD HERE */}</div>

        {/* {showModalCreateGuild && (
        <AddGuildModal
          onClose={() => setShowModalCreateGuild(false)}
          onSuccess={handleOnSuccess}
        />
      )} */}
      </div>
    </>
  );
}
