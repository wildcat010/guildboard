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
import Members from "./../../dashboard/members/members";
import MyGuild from "./myGuild/MyGuild";

type ContentProps = {
  activeSection: Section;
};

export default function Content({ activeSection }: ContentProps) {
  useEffect(() => {});

  return (
    <div className={styles.content}>
      {activeSection === "myGuild" && <MyGuild />}
      {activeSection === "questboard" && <Questboard />}
      {activeSection === "guildMembers" && <GuildMembers />}
      {activeSection === "members" && <Members />}
      {activeSection === "payments" && <Payments />}
    </div>
  );
}
