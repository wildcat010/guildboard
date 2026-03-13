"use client";
import Image from "next/image";
import styles from "./content.module.css";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Section } from "./../../../constants/constants";
import Questboard from "./../../dashboard/questboard/questboard";
import GuildMembers from "./../../dashboard/guildMembers/guildMembers";
import Payments from "./../../dashboard/payments/payments";

type ContentProps = {
  activeSection: Section;
};

export default function Content({ activeSection }: ContentProps) {
  useEffect(() => {});

  return (
    <div className={styles.content}>
      {activeSection === "questboard" && <Questboard />}
      {activeSection === "members" && <GuildMembers />}
      {activeSection === "payments" && <Payments />}
    </div>
  );
}
