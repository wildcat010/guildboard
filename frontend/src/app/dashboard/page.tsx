"use client";
import { useGuild } from "@/hooks/useGuild";
import { useAccount } from "wagmi";
import Sidebar from "./../../components/dashboard/sidebar/sidebar";
import Rightbar from "./../../components/dashboard/rightPanel/rightPanel";
import Content from "./../../components/dashboard/content/content";
import styles from "./page.module.css";
import { useState, useEffect } from "react";
import { Section } from "./../../constants/constants";

export default function Dashboard() {
  const { isConnected } = useAccount();
  const { isOwner } = useGuild();
  const [activeSection, setActiveSection] = useState<Section>("questboard");

  return (
    <>
      <div id="dashboard" style={{ display: "block" }}>
        <div className={styles.main}>
          {isConnected && isOwner ? (
            <>
              <Sidebar
                activeSection={activeSection}
                onSectionChange={setActiveSection}
              ></Sidebar>
              <Content activeSection={activeSection}></Content>
              <Rightbar></Rightbar>
            </>
          ) : (
            <p>❌ You are not the owner</p>
          )}
        </div>
      </div>
    </>
  );
}
