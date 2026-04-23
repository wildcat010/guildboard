"use client";
import styles from "./memberModal.module.css";
import { Guild, Member } from "./../../../constants/constants";
import { roleNames } from "./../../../constants/constants";
import { useState, useEffect, useRef } from "react";
import { useGuildById } from "@/hooks/useGuildById";
import { useManagementMember } from "@/hooks/useManagementMember";
import { useGuild } from "@/hooks/useGuild";

const PINATA_GATEWAY = process.env.NEXT_PUBLIC_PINATA_GATEWAY!;

type MemberModalProps = {
  onClose: () => void;
  member: Member;
  refetchMember: () => void;
  onDeleteSuccess: () => void;
  refetchAllMember: () => void;
  isOwner: boolean;
};

export default function MemberModal({
  onClose,
  member,
  refetchMember,
  onDeleteSuccess,
  refetchAllMember,
  isOwner,
}: MemberModalProps) {
  // ── State ──
  const [selectedRole, setSelectedRole] = useState(Number(member.role));
  const [memberState, setMemberState] = useState<Member>(member);
  const [nft, setNft] = useState<{
    id: string;
    name?: string;
    image: string;
  }>();
  const pendingClose = useRef(false);
  const pendingUpgrade = useRef(false);

  // ── Hooks ──
  const {
    upgradeMember,
    removeMember,
    isUpgradingPending,
    isRemoveMemberPending,
    isUpgradingConfirming,
    isUpgradingConfirmed,
    isRemoveMemberConfirmed,
    isRemoveMemberConfirming,
  } = useManagementMember();

  const { refetchGuilds } = useGuild();
  const { refetchGuildMembers, getGuildById } = useGuildById(
    Number(memberState.guildId),
  );
  const guild = getGuildById as Guild;

  // ── Helpers ──
  const ipfsToHttp = (uri: string) => {
    if (!uri) return "";
    if (uri.startsWith("ipfs://")) {
      const hash = uri.replace("ipfs://", "");
      return `https://${PINATA_GATEWAY}/ipfs/${hash}`;
    }
    return uri;
  };

  // ── Actions ──
  function handleUpgrade() {
    console.log("is owner", isOwner);
    if (isOwner) {
      pendingUpgrade.current = true;
      upgradeMember(Number(memberState.id), selectedRole);
    } else {
      alert(
        "Only the owner of the contract can upgrade the role of the member.",
      );
    }
  }

  function handleDelete() {
    if (isOwner) {
      pendingClose.current = true;
      removeMember(Number(memberState.id));
    } else {
      alert("Only the owner of the contract can delete the member.");
    }
  }

  // ── Effects ──
  // Handle delete
  useEffect(() => {
    if (isRemoveMemberConfirmed && pendingClose.current) {
      pendingClose.current = false;
      refetchGuilds();
      refetchGuildMembers();
      onDeleteSuccess();
      onClose();
    }
  }, [
    isRemoveMemberConfirmed,
    refetchGuilds,
    refetchGuildMembers,
    onClose,
    onDeleteSuccess,
  ]);

  useEffect(() => {
    setMemberState(member);
    setSelectedRole(Number(member.role));
  }, [member]);

  // Handle upgrade
  useEffect(() => {
    if (isUpgradingConfirmed && pendingUpgrade.current) {
      pendingUpgrade.current = false;
      setMemberState((prev) => ({
        ...prev,
        role: selectedRole as Member["role"],
      }));

      refetchGuildMembers();
      refetchAllMember();
      refetchMember();
    }
  }, [
    isUpgradingConfirmed,
    selectedRole,
    refetchGuildMembers,
    refetchMember,
    refetchAllMember,
  ]);

  // Load NFT metadata
  useEffect(() => {
    async function loadNFT() {
      if (!memberState?.uri) return;

      try {
        const res = await fetch(ipfsToHttp(memberState.uri));
        const metadata = await res.json();

        setNft({
          id: memberState.id.toString(),
          name: metadata.name,
          image: ipfsToHttp(metadata.image),
        });
      } catch (e) {
        console.error("Error loading NFT", e);
      }
    }

    loadNFT();
  }, [memberState]);

  const currentRole = Number(memberState.role);
  const roleChanged = selectedRole !== currentRole;

  // ── JSX ──
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <button className={styles.modalClose} onClick={onClose}>
          ✕
        </button>
        <div className={styles.modalTitle}>⚔ Member Info</div>

        {/* Address */}
        <div className={styles.formGroup}>
          <span className={styles.formLabel}>Address</span>
          <span className={styles.formLabelBig}>
            {memberState.addressMember}
          </span>
        </div>

        {/* Guild */}
        <div className={styles.formGroup}>
          <span className={styles.formLabel}>Guild</span>
          <span className={styles.formLabelBig}>
            {guild?.name} - {guild?.id}
          </span>
        </div>

        {/* Role selector */}
        <div className={styles.formGroup}>
          <span className={styles.formLabel}>
            Role — current: {roleNames[currentRole]}
          </span>
          <select
            className={styles.select}
            value={selectedRole}
            disabled={
              isUpgradingPending ||
              isUpgradingConfirming ||
              isRemoveMemberPending ||
              isRemoveMemberConfirming
            }
            onChange={(e) => setSelectedRole(Number(e.target.value))}
          >
            {Object.entries(roleNames).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* NFT */}
        {nft && (
          <div className={styles.formGroup}>
            <span className={styles.formLabel}>NFT</span>
            <img
              src={nft.image}
              alt={nft.name || "NFT"}
              width={50}
              height={50}
              style={{ borderRadius: "8px" }}
            />
          </div>
        )}

        {/* Actions */}
        <div className={styles.formGroup}>
          <span className={styles.formLabel}>Actions</span>
          <div className={styles.container}>
            <button
              className={styles.button}
              onClick={handleDelete}
              disabled={isRemoveMemberPending || isRemoveMemberConfirming}
            >
              {isRemoveMemberPending
                ? "🗑 Confirm in MetaMask..."
                : isRemoveMemberConfirming
                  ? "🗑 Confirming on Sepolia..."
                  : "🗑 Delete"}
            </button>

            {roleChanged && (
              <button
                className={styles.button}
                onClick={handleUpgrade}
                disabled={isUpgradingPending || isUpgradingConfirming}
              >
                {isUpgradingPending
                  ? "⬆ Confirm in MetaMask..."
                  : isUpgradingConfirming
                    ? "⬆ Confirming on Sepolia..."
                    : "⬆ Upgrade"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
