import hre from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log(
    "Account balance:",
    (await hre.ethers.provider.getBalance(deployer.address)).toString(),
  );

  // =========================================
  // 1. DEPLOY GUILDNFT
  // =========================================
  console.log("\nDeploying GuildNFT...");
  const GuildNFTFactory = await hre.ethers.getContractFactory("GuildNFT");
  const guildNFT = await hre.upgrades.deployProxy(GuildNFTFactory, {
    kind: "uups",
    initializer: "initialize",
  });
  await guildNFT.waitForDeployment();
  const guildNFTAddress = await guildNFT.getAddress();
  console.log("✅ GuildNFT deployed to:", guildNFTAddress);

  // =========================================
  // 2. DEPLOY GUILDBOARD
  // =========================================
  console.log("\nDeploying GuildBoard...");
  const GuildboardFactory = await hre.ethers.getContractFactory("Guildboard");
  const guildboard = await hre.upgrades.deployProxy(
    GuildboardFactory,
    [guildNFTAddress],
    {
      kind: "uups",
      initializer: "initialize",
    },
  );
  await guildboard.waitForDeployment();
  const guildboardAddress = await guildboard.getAddress();
  console.log("✅ GuildBoard deployed to:", guildboardAddress);

  // =========================================
  // 3. SAVE ADDRESSES
  // =========================================
  const addresses = {
    network: hre.network.name,
    guildNFT: guildNFTAddress,
    guildboard: guildboardAddress,
    deployedAt: new Date().toISOString(),
    deployer: deployer.address,
  };

  const outputDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  const outputPath = path.join(outputDir, `${hre.network.name}.json`);
  fs.writeFileSync(outputPath, JSON.stringify(addresses, null, 2));
  console.log("\n✅ Addresses saved to:", outputPath);
  console.log(addresses);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
