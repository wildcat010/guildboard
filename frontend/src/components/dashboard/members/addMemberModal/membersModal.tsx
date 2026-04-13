"use client";
import { Guild } from "@/constants/constants";
import styles from "./membersModal.module.css";
import { useState, useEffect, useRef } from "react";
import { useGuild } from "@/hooks/useGuild";
import { useManagementGuild } from "@/hooks/useManagementGuilds";
import { PinataSDK } from "pinata";
import { useMember } from "@/hooks/useMember";

const pinata = new PinataSDK({
  pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT!,
  pinataGateway: process.env.NEXT_PUBLIC_PINATA_GATEWAY!,
});

type MembersModalProps = {
  onClose: () => void;
};

export default function MembersModal({ onClose }: MembersModalProps) {
  const [memberName, setMemberName] = useState("");
  const [addressMember, setAddressMember] = useState("");
  const [selectedGuildId, setSelectedGuildId] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  const pendingClose = useRef(false);

  const { mintMember, isMemberPending, isMemberSuccess, isMemberError } =
    useManagementGuild();
  const { refetchAllMember } = useMember();

  const { guilds } = useGuild();
  const guildsArray =
    (guilds as Guild[])?.filter((guild) => guild.active == true) ?? [];

  useEffect(() => {
    if (isMemberSuccess && pendingClose.current) {
      pendingClose.current = false;
      refetchAllMember();
      onClose();
    }
  }, [isMemberSuccess, onClose]);

  async function handleSubmit() {
    if (
      !memberName.trim() ||
      !addressMember.trim() ||
      !selectedGuildId ||
      !imageFile
    )
      return;

    setIsUploading(true);
    try {
      const imageResult = await pinata.upload.public.file(imageFile);
      const imageURI = `ipfs://${imageResult.cid}`;

      const metadataResult = await pinata.upload.public.json({
        name: memberName,
        image: imageURI,
        attributes: [{ trait_type: "Guild ID", value: selectedGuildId }],
      });

      const tokenURI = `ipfs://${metadataResult.cid}`;
      pendingClose.current = true;
      mintMember(
        memberName,
        addressMember,
        tokenURI,
        parseInt(selectedGuildId),
      );
    } catch (err) {
      console.error("Upload failed:", err);
      pendingClose.current = false;
    } finally {
      setIsUploading(false);
    }
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  const isLoading = isUploading || isMemberPending;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Add Member</h2>
          <button onClick={onClose}>✕</button>
        </div>

        <div className={styles.modalBody}>
          <label>Member Name</label>
          <input
            type="text"
            value={memberName}
            onChange={(e) => setMemberName(e.target.value)}
          />
        </div>

        <div className={styles.modalBody}>
          <label>Member Address</label>
          <input
            type="text"
            value={addressMember}
            onChange={(e) => setAddressMember(e.target.value)}
          />

          <label>Guild</label>
          <select
            value={selectedGuildId}
            onChange={(e) => setSelectedGuildId(e.target.value)}
          >
            <option value="">Select a guild...</option>
            {guildsArray.map((guild) => (
              <option key={guild.id.toString()} value={guild.id.toString()}>
                {guild.name}
              </option>
            ))}
          </select>

          <label>NFT Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />

          {imagePreview && (
            <img
              src={imagePreview}
              alt="NFT Preview"
              style={{
                width: "100px",
                height: "100px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
          )}
        </div>

        <div className={styles.modalFooter}>
          <button onClick={onClose} disabled={isLoading}>
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={isLoading}>
            {isUploading
              ? "Uploading to IPFS..."
              : isMemberPending
                ? "Confirm in MetaMask..."
                : "Create Member"}
          </button>
        </div>
      </div>
    </div>
  );
}
