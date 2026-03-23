"use client";

import styles from "./membersTable.module.css";
import { useEffect, useState } from "react";
import { Guild, Member, roleNames } from "./../../../../constants/constants";
import { SimpleTable } from "simple-table-core";
import { useMember } from "@/hooks/useMember";
import { useGuildById } from "@/hooks/useGuildById";

import "simple-table-core/styles.css";
import "./CustomTheme.css";

const headers = [
  { accessor: "id", label: "ID", width: 60 },
  { accessor: "user", label: "User", width: 220 },
  { accessor: "addressMember", label: "Address", width: 300 },
  { accessor: "guildName", label: "Guild", width: 160 }, // display name
  { accessor: "action", label: "", width: 120 },
];

export default function MembersTable() {
  const { getAllMembers } = useMember();
  const membersArray = (getAllMembers as Member[]) ?? [];

  const [rows, setRows] = useState<any[]>([]);
  const [guildNames, setGuildNames] = useState<Record<number, string>>({});

  // fetch all guild names once
  useEffect(() => {
    async function fetchGuilds() {
      const names: Record<number, string> = {};
      for (const member of membersArray) {
        const guildId = Number(member.guildId);
        if (!names[guildId]) {
          const { getGuildById } = useGuildById(guildId);
          const guild = getGuildById as Guild;
          console.log("guild", guild);
          if (guild.name) {
            names[guildId] = guild.name;
          } else {
            names[guildId] = `Guild #${guildId}`;
          }
        }
      }
      setGuildNames(names);
    }

    fetchGuilds();
  }, [membersArray]);

  useEffect(() => {
    const formatted = membersArray.map((member) => ({
      id: Number(member.id),
      user: (
        <div className="userCell">
          <div className="userName">{member.name}</div>
          <div className="userRole">{roleNames[Number(member.role)]}</div>
        </div>
      ),
      addressMember: <div className="addressCell">{member.addressMember}</div>,
      guildName: (
        <div className="guildCell">
          {guildNames[Number(member.guildId)] ?? `Guild #${member.guildId}`}
        </div>
      ),
      action: <button className="updateBtn">Update</button>,
    }));

    setRows(formatted);
  }, [membersArray, guildNames]);

  return (
    <div className={`custom-theme-container ${styles.tableWrapper}`}>
      <SimpleTable
        defaultHeaders={headers}
        rows={rows}
        getRowId={({ row }) => (row as any).id}
        height="500px"
        autoExpandColumns
        theme="custom"
        customTheme={{
          headerHeight: 40,
          rowHeight: 72,
        }}
      />
    </div>
  );
}
