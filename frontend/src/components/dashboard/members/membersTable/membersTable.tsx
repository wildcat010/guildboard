"use client";

import styles from "./membersTable.module.css";
import { useState } from "react";
import { Guild, Member, roleNames } from "./../../../../constants/constants";
import { SimpleTable } from "simple-table-core";
import { useMember } from "@/hooks/useMember";
import { useGuildById } from "@/hooks/useGuildById";

import "simple-table-core/styles.css";
import "./CustomTheme.css";
import MemberModal from "../../memberModal/memberModal";
import { useGuild } from "@/hooks/useGuild";

const headers = [
  { accessor: "id", label: "ID", width: 60 },
  { accessor: "user", label: "User", width: 220 },
  { accessor: "addressMember", label: "Address", width: 300 },
  { accessor: "guildName", label: "Guild", width: 160 },
  { accessor: "action", label: "", width: 120 },
];

function GuildName({ guildId }: { guildId: number }) {
  const { getGuildById } = useGuildById(guildId);
  const guild = getGuildById as Guild | null;
  return <div className="guildCell">{guild?.name ?? `Guild #${guildId}`}</div>;
}

export default function MembersTable() {
  const { isOwner } = useGuild();
  const { getAllMembers, refetchMember, refetchAllMember } = useMember();
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [deletedIds, setDeletedIds] = useState<Set<number>>(new Set());

  const allMembers = ((getAllMembers as Member[]) ?? []).filter(
    (m) => !deletedIds.has(Number(m.id)),
  );

  const handleDeleteSuccess = (deletedId: number) => {
    setDeletedIds((prev) => new Set(prev).add(deletedId));
    setSelectedMember(null);
  };

  const rows = allMembers.map((member) => ({
    id: Number(member.id),
    user: (
      <div className="userCell">
        <div className="userName">{member.name}</div>
        <div className="userRole">{roleNames[Number(member.role)]}</div>
      </div>
    ),
    addressMember: <div className="addressCell">{member.addressMember}</div>,
    guildName: <GuildName guildId={Number(member.guildId)} />,
    action: (
      <button className="updateBtn" onClick={() => setSelectedMember(member)}>
        Update
      </button>
    ),
  }));

  return (
    <div className={`custom-theme-container ${styles.tableWrapper}`}>
      {selectedMember && (
        <MemberModal
          member={selectedMember}
          refetchMember={refetchMember}
          refetchAllMember={refetchAllMember}
          onClose={() => setSelectedMember(null)}
          onDeleteSuccess={() => handleDeleteSuccess(Number(selectedMember.id))}
          isOwner={isOwner as boolean}
        />
      )}
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
