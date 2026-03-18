"use client";
import { Guild } from "@/constants/constants";
import styles from "./listMember.module.css";
import { useState } from "react";
import { useGuild } from "@/hooks/useGuild";
import { useMember } from "@/hooks/useMember";
import { roleNames } from "../../../../constants/constants";

type ListMemberProps = {
  addressMember: string;
};

export default function ListMember({ addressMember }: ListMemberProps) {
  const { roleByWallet, isOwner } = useMember();
  const role = roleNames[roleByWallet as number] ?? "Unknow";

  return (
    <div className={styles.memberListItem}>
      <div className={styles.miniHex}>K</div>
      <div className={styles.memberInfo}>
        <div className={styles.memberListName}>{addressMember}</div>
        <div className={styles.memberListRole}>{role}</div>
      </div>
      <div className={styles.memberUpdate}>Update</div>
    </div>
  );
}
