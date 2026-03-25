"use client";

import styles from "./membersTable.module.css";
import { useEffect, useState } from "react";
import { Guild, Member, roleNames } from "./../../../../constants/constants";
import { SimpleTable } from "simple-table-core";
import { useMember } from "@/hooks/useMember";
import { useGuildById } from "@/hooks/useGuildById";

import "simple-table-core/styles.css";
import "./CustomTheme.css";
import MemberModal from "../../memberModal/memberModal";

const headers = [
  { accessor: "id", label: "ID", width: 60 },
  { accessor: "user", label: "User", width: 220 },
  { accessor: "addressMember", label: "Address", width: 300 },
  { accessor: "guildName", label: "Guild", width: 160 }, // display name
  { accessor: "action", label: "", width: 120 },
];

function GuildName({ guildId }: { guildId: number }) {
  const { getGuildById } = useGuildById(guildId);
  const guild = getGuildById as Guild | null;
  return <div className="guildCell">{guild?.name ?? `Guild #${guildId}`}</div>;
}

export default function MembersTable() {
  const { getAllMembers, refetchMember } = useMember();
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    setMembers((getAllMembers as Member[]) ?? []);
  }, [getAllMembers]);

  const handleDeleteSuccess = (deletedId: number) => {
    setMembers((prev) => prev.filter((m) => Number(m.id) !== deletedId));
    setSelectedMember(null);
  };

  const rows = members.map((member) => ({
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
      <button
        className="updateBtn"
        onClick={() => {
          setSelectedMember(member);
        }}
      >
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
          onClose={() => setSelectedMember(null)}
          onDeleteSuccess={() => handleDeleteSuccess(Number(selectedMember.id))}
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
