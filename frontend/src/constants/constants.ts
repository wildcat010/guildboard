export const roleNames: Record<number, string> = {
  0: "Member",
  1: "Senior",
  2: "Master",
};

export const guildState: Record<number, string> = {
  0: "All",
  1: "Active",
  2: "Inactive",
};
export const taskStatus: Record<number, string> = {
  0: "toDo",
  1: "inProgress",
  2: "Done",
  3: "Verified",
  4: "Close",
};

export type Task = {
  id: bigint;
  description: string;
  status: number;
  poster: string; // who created the task
  assignee: string; // who does the task and gets paid
  guildId: bigint;
  reward: bigint; // ← ETH in escrow
  paid: boolean; // ← prevent double payment
};

export type Guild = {
  id: bigint;
  name: string;
  active: boolean;
};

export type Member = {
  id: bigint;
  name: string;
  addressMember: string;
  role: number;
  guildId: bigint;
  uri: string;
};

export type Section =
  | "questboard"
  | "guildMembers"
  | "members"
  | "payments"
  | "mynft"
  | "settings";
