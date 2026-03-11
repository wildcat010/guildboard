import hre from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Upgrading with account:", deployer.address);

  // =========================================
  // LOAD EXISTING ADDRESSES
  // =========================================
  const addressesPath = path.join(
    __dirname,
    `../deployments/${hre.network.name}.json`,
  );

  if (!fs.existsSync(addressesPath)) {
    throw new Error(
      `No deployment found for network: ${hre.network.name}. Run deploy.ts first.`,
    );
  }

  const addresses = JSON.parse(fs.readFileSync(addressesPath, "utf8"));
  console.log("Upgrading contracts at:", addresses);

  // =========================================
  // 1. UPGRADE GUILDNFT
  // =========================================
  console.log("\nUpgrading GuildNFT...");
  const GuildNFTFactory = await hre.ethers.getContractFactory("GuildNFT");
  const guildNFT = await hre.upgrades.upgradeProxy(
    addresses.guildNFT, // ← same proxy address
    GuildNFTFactory,
  );
  await guildNFT.waitForDeployment();
  console.log("✅ GuildNFT upgraded at:", addresses.guildNFT);

  // =========================================
  // 2. UPGRADE GUILDBOARD
  // =========================================
  console.log("\nUpgrading GuildBoard...");
  const GuildboardFactory = await hre.ethers.getContractFactory("Guildboard");
  const guildboard = await hre.upgrades.upgradeProxy(
    addresses.guildboard, // ← same proxy address
    GuildboardFactory,
  );
  await guildboard.waitForDeployment();
  console.log("✅ GuildBoard upgraded at:", addresses.guildboard);

  // =========================================
  // 3. UPDATE TIMESTAMP
  // =========================================
  addresses.upgradedAt = new Date().toISOString();
  fs.writeFileSync(addressesPath, JSON.stringify(addresses, null, 2));
  console.log("\n✅ Deployment file updated");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
