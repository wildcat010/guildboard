"use client";
import { useGuild } from "@/hooks/useGuild";
import { useAccount } from "wagmi";

export default function Dashboard() {
  const { isConnected } = useAccount();
  const { isOwner, guilds, role } = useGuild();

  return (
    <>
      {isConnected && isOwner ? (
        <div>
          <h1>Dashboard</h1>
        </div>
      ) : (
        <p>❌ You are not the owner</p>
      )}
    </>
  );
}
