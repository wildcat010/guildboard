"use client";

import styles from "./MyGuild.module.css";
import { useEffect, useState } from "react";

import { useBalance } from "wagmi";
import { GUILDBOARD_ADDRESS } from "@/contracts";

import { useDeposit } from "@/hooks/useDeposit";
import { useMember } from "@/hooks/useMember";
import { useAccount } from "wagmi";
import { Member, roleNames, Task } from "@/constants/constants";
import { useGuild } from "@/hooks/useGuild";
import { useTask } from "@/hooks/useTask";
import TaskCard from "../../questboard/taskCard/taskCard";

export default function MyGuild() {
  const { address } = useAccount();
  const { isOwner } = useGuild();
  const { getMemberByAddress } = useMember(0, address ?? "");
  const myMember = getMemberByAddress as Member | undefined;

  const guildId = myMember?.guildId ? Number(myMember.guildId) : 0;

  const { getTasksByGuildId, refetchTasksByGuildId } = useTask(0, guildId);

  const allTasksForGuild = (getTasksByGuildId as Task[]) ?? [];

  console.log("myMember:", myMember);
  console.log("guildId:", guildId);
  console.log("getTasksByGuildId:", getTasksByGuildId);

  const myGuildSelection = false;

  return (
    <>
      <div className={styles.content}>
        <div className={`${styles.pageHeader} ${styles.animateIn}`}>
          <div>
            <div className={styles.pageTitle}>
              My Guild -
              {`${myMember?.name} - ${roleNames[Number(myMember?.role)]}`}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "5px",
            }}
          ></div>
        </div>
        <div className={styles.pageGuilds}>{/* //CARD HERE */}</div>

        <div className={styles.pageTasks}>
          {allTasksForGuild.map((task: Task) => (
            <TaskCard
              key={task.id.toString()}
              task={task}
              refetchAllTasks={refetchTasksByGuildId}
              guildSelection={myGuildSelection}
            ></TaskCard>
          ))}
        </div>
      </div>
    </>
  );
}
