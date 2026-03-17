export const roleNames: Record<number, string> = {
  0: "Member",
  1: "Senior",
  2: "Master",
};

export type Guild = {
  id: bigint;
  name: string;
  active: boolean;
};

export type Section =
  | "questboard"
  | "guildMembers"
  | "members"
  | "payments"
  | "mynft"
  | "settings";
