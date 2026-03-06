import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import hre from "hardhat";
import { GuildNFT, GuildNFT__factory } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import type { GuildNFTInterface } from "../typechain-types/contracts/GuildNFT";
// =========================================
// VARIABLES — shared across all tests
// =========================================
let guild: GuildNFT;
let owner: HardhatEthersSigner;
let otherAccount: HardhatEthersSigner;

async function initContract() {
  [owner, otherAccount] = await hre.ethers.getSigners();

  const GuildNFTFactory = await hre.ethers.getContractFactory("GuildNFT");
  guild = (await hre.upgrades.deployProxy(GuildNFTFactory, {
    kind: "uups",
    initializer: "initialize",
  })) as unknown as GuildNFT;

  await guild.waitForDeployment();

  return { guild, owner, otherAccount };
}

describe("GuildNFT contract config", function () {
  beforeEach(async function () {
    ({ guild, owner, otherAccount } = await initContract());
  });

  it("should deployed the contract", async () => {
    const address = await guild.getAddress();
    expect(address).to.be.a("string");
    expect(address).to.have.lengthOf(42); // ethereum address length
  });

  it("should have the owner at accounts[0]", async () => {
    const ownerContract = await guild.owner();
    expect(ownerContract).to.equal(owner);
  });

  it("should have correct name and symbol", async function () {
    const name = await guild.name();
    const symbol = await guild.symbol();

    expect(name).to.equal("GuildBoard Member");
    expect(symbol).to.equal("GUILD");
  });
});

describe("GuildNFT creation member and retrieve nft", function () {
  beforeEach(async function () {
    ({ guild, owner, otherAccount } = await initContract());
  });

  it("should not recognise as a user", async () => {
    const resultIsMember = await guild.isMember(otherAccount);
    expect(resultIsMember).to.equal(false);
  });

  it("should mint a nft for a future member", async () => {
    await expect(guild.mintMember(otherAccount, "ipfs://test"))
      .to.emit(guild, "MemberMinted")
      .withArgs(otherAccount.address, 1);

    expect(await guild.isMember(otherAccount.address)).to.equal(true);
  });

  it("should mint a nft for a future member", async () => {
    await guild.mintMember(otherAccount, "ipfs://test");
    expect(await guild.isMember(otherAccount.address)).to.equal(true);

    const tokenURI = await guild.tokenURI(1);
    console.log("URI", tokenURI);

    expect(tokenURI).to.equal("ipfs://test");
  });

  it("shoud create a member by minting and get back the token URI by the address wallet", async () => {
    await guild.mintMember(otherAccount, "ipfs://test");
    expect(await guild.isMember(otherAccount.address)).to.equal(true);

    const URI = await guild.getMemberURI(otherAccount);
    expect(URI).to.equal("ipfs://test");
  });

  describe("GuildNFT management member and find role", function () {
    beforeEach(async function () {
      ({ guild, owner, otherAccount } = await initContract());
    });

    it("should create a member and give him a member role", async () => {
      await expect(guild.mintMember(otherAccount, "ipfs://test"))
        .to.emit(guild, "MemberMinted")
        .withArgs(otherAccount.address, 1);

      expect(await guild.isMember(otherAccount.address)).to.equal(true);
      expect(await guild.getRole(1)).to.equal(0);
    });

    it("should create a member and give him a member role and upgrade to senior", async () => {
      await guild.mintMember(otherAccount, "ipfs://test");

      expect(await guild.isMember(otherAccount.address)).to.equal(true);
      expect(await guild.getRole(1)).to.equal(0);

      await expect(guild.upgradeMember(otherAccount, 1))
        .to.emit(guild, "MemberUpgraded")
        .withArgs(1, 1);
      expect(await guild.getRole(1)).to.equal(1);
    });

    it("should retrieve the role of a member by the address", async () => {
      let memberRole;

      await guild.mintMember(otherAccount, "ipfs://test");
      memberRole = await guild.getRoleByWallet(otherAccount);
      expect(memberRole).to.equal(0);

      await guild.upgradeMember(otherAccount, 1);
      memberRole = await guild.getRoleByWallet(otherAccount);
      expect(memberRole).to.equal(1);
    });
  });
});
