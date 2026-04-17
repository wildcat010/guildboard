"use client";

import styles from "./MyGuild.module.css";
import { useEffect } from "react";

import { useAccount } from "wagmi";
import {
  Guild,
  Member,
  roleNames,
  Task,
  taskStatus,
} from "@/constants/constants";
import { useGuild } from "@/hooks/useGuild";
import { useMember } from "@/hooks/useMember";
import { useTask } from "@/hooks/useTask";
import { formatEther, parseEther } from "ethers";
import TaskCard from "../../questboard/taskCard/taskCard";
import { useGuildById } from "@/hooks/useGuildById";

export default function MyGuild() {
  const { address } = useAccount();

  const { getMemberByAddress } = useMember(0, address ?? "");
  const myMember = getMemberByAddress as Member | undefined;

  const guildId = myMember?.guildId ? Number(myMember.guildId) : 0;
  const { getTasksByGuildId, refetchTasksByGuildId } = useTask(0, guildId);
  const { guildMembers } = useGuildById(guildId);
  const myGuildSelection = false;

  useEffect(() => {
    if (guildId > 0) {
      refetchTasksByGuildId();
    }
  }, [guildId, refetchTasksByGuildId]);

  const taskGroups = [
    {
      tasks: (getTasksByGuildId as Task[])?.filter((t) => t.status === 0) ?? [],
      status: 0,
    },
    {
      tasks: (getTasksByGuildId as Task[])?.filter((t) => t.status === 1) ?? [],
      status: 1,
    },
    {
      tasks: (getTasksByGuildId as Task[])?.filter((t) => t.status === 2) ?? [],
      status: 2,
    },
    {
      tasks: (getTasksByGuildId as Task[])?.filter((t) => t.status === 3) ?? [],
      status: 3,
    },
    {
      tasks: (getTasksByGuildId as Task[])?.filter((t) => t.status === 4) ?? [],
      status: 4,
    },
  ];

  return (
    <div className={styles.content}>
      <div className={`${styles.pageHeader} ${styles.animateIn}`}>
        <div>
          <div className={styles.pageTitle}>
            My Guild -{" "}
            {`${myMember?.name} - ${roleNames[Number(myMember?.role)]}`}
          </div>

          <div className={styles.pageSub}>
            Rewards -{" "}
            {formatEther(
              taskGroups[4].tasks.reduce(
                (acc, task) => acc + BigInt(task.reward.toString()),
                BigInt(0),
              ),
            )}
            &nbsp;ETH
          </div>

          <div className={styles.pageSub}>
            Members - {guildMembers ? guildMembers.length : 0}
          </div>
        </div>
      </div>

      {taskGroups.map(
        ({ tasks, status }) =>
          tasks.length > 0 && (
            <div key={status}>
              <div className={styles.pageTitle}>
                {taskStatus[status]} - {tasks.length}
              </div>
              <div className={styles.pageTasks}>
                {tasks.map((task: Task) => (
                  <TaskCard
                    key={task.id.toString()}
                    task={task}
                    refetchAllTasks={refetchTasksByGuildId}
                    guildSelection={myGuildSelection}
                  />
                ))}
              </div>
            </div>
          ),
      )}
    </div>
  );
}
