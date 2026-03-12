import GuildNFTAbi from "./GuildNFT.json";
import GuildboardAbi from "./Guildboard.json";

export const GUILD_NFT_ADDRESS = process.env
  .NEXT_PUBLIC_GUILD_NFT_ADDRESS as `0x${string}`;
export const GUILDBOARD_ADDRESS = process.env
  .NEXT_PUBLIC_GUILDBOARD_ADDRESS as `0x${string}`;

export const GUILD_NFT_ABI = GuildNFTAbi.abi;
export const GUILDBOARD_ABI = GuildboardAbi.abi;
