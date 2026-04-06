"use client";
import { Guild, Member, roleNames } from "@/constants/constants";
import styles from "./listMember.module.css";
import { useEffect, useState } from "react";
import { useMember } from "@/hooks/useMember";
import MemberModal from "../../memberModal/memberModal";

type ListMemberProps = {
  memberId: number;
};

export default function ListMember({ memberId }: ListMemberProps) {
  const { getMemberById, refetchMember } = useMember(memberId);
  const [memberModal, setMemberModal] = useState(false);
  const member = getMemberById as Member;

  if (!member) return <div className={styles.memberListItem}>Loading...</div>;

  return (
    <>
      {memberModal && (
        <MemberModal
          member={member}
          refetchMember={refetchMember}
          refetchAllMember={() => {}}
          onClose={() => setMemberModal(false)}
          onDeleteSuccess={() => {}}
        />
      )}
      <div
        className={styles.memberListItem}
        onClick={(e) => {
          e.stopPropagation();
          setMemberModal(true);
        }}
      >
        <div className={styles.miniHex}>{member.name}</div>
        <div className={styles.memberInfo}>
          <div className={styles.memberListName}>{member.addressMember}</div>
          <div className={styles.memberListRole}>
            {roleNames[Number(member.role)]}
          </div>
        </div>
        <div className={styles.memberUpdate}>Update</div>
      </div>
    </>
  );
}
