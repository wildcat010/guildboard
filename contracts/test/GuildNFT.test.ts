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
let otherAccount2: HardhatEthersSigner;
let otherAccount3: HardhatEthersSigner;

async function initContract() {
  [owner, otherAccount, otherAccount2, otherAccount3] =
    await hre.ethers.getSigners();

  const GuildNFTFactory = await hre.ethers.getContractFactory("GuildNFT");
  guild = (await hre.upgrades.deployProxy(GuildNFTFactory, {
    kind: "uups",
    initializer: "initialize",
  })) as unknown as GuildNFT;

  await guild.waitForDeployment();

  return { guild, owner, otherAccount, otherAccount2, otherAccount3 };
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

  it("should create a guild", async () => {
    await expect(guild.createGuild("guild Test"))
      .to.emit(guild, "GuildCreated")
      .withArgs(1n, "guild Test");

    const myGuild = await guild.getGuild(1); // ← always 1 for first guild

    expect(myGuild.id).to.equal(1n);
    expect(myGuild.name).to.equal("guild Test");
    expect(myGuild.active).to.equal(true);
  });

  it("should mint a nft for a future member guild", async () => {
    await expect(guild.createGuild("guild Test"));
    await expect(guild.mintMember(otherAccount, "ipfs://test", 1))
      .to.emit(guild, "MemberMinted")
      .withArgs(otherAccount.address, 1, 1);

    expect(await guild.isMember(otherAccount.address)).to.equal(true);
  });

  it("should mint a nft for a future member and return the URI", async () => {
    await expect(guild.createGuild("guild Test"));
    await guild.mintMember(otherAccount, "ipfs://test", 1);
    expect(await guild.isMember(otherAccount.address)).to.equal(true);

    const tokenURI = await guild.tokenURI(1);
    console.log("URI", tokenURI);

    expect(tokenURI).to.equal("ipfs://test");
  });

  it("shoud create a member by minting and get back the token URI by the address wallet", async () => {
    await expect(guild.createGuild("guild Test"));
    await guild.mintMember(otherAccount, "ipfs://test", 1);
    expect(await guild.isMember(otherAccount.address)).to.equal(true);

    const URI = await guild.getMemberURI(otherAccount);
    expect(URI).to.equal("ipfs://test");
  });

  it("should create 2 members of a guild and return the members", async () => {
    await guild.createGuild("guild Test");
    await guild.mintMember(otherAccount.address, "ipfs://test", 1);
    await guild.mintMember(otherAccount2.address, "ipfs://test", 1);

    const members = await guild.getGuildMembers(1);

    expect(members[0]).to.equal(otherAccount.address);
    expect(members[1]).to.equal(otherAccount2.address);
  });

  it("should create 3 members of a guild, delete 1 and get 2 members in the guild", async () => {
    await guild.createGuild("guild Test");
    await guild.mintMember(otherAccount.address, "ipfs://test", 1);
    await guild.mintMember(otherAccount2.address, "ipfs://test", 1);
    await guild.mintMember(otherAccount3.address, "ipfs://test", 1);

    await expect(guild.removeGuildMember(otherAccount2.address))
      .to.emit(guild, "MemberRemoved")
      .withArgs(otherAccount2.address, 2, 1);

    const members = await guild.getGuildMembers(1);

    expect(members.length).to.equal(2);
    expect(members[0]).to.equal(otherAccount.address);
    expect(members[1]).to.equal(otherAccount3.address);
  });

  describe("GuildNFT management member and find role", function () {
    beforeEach(async function () {
      ({ guild, owner, otherAccount } = await initContract());
    });

    // it("should create a member and give him a member role", async () => {
    //   await expect(guild.mintMember(otherAccount, "ipfs://test"))
    //     .to.emit(guild, "MemberMinted")
    //     .withArgs(otherAccount.address, 1);

    //   expect(await guild.isMember(otherAccount.address)).to.equal(true);
    //   expect(await guild.getRole(1)).to.equal(0);
    // });

    // it("should create a member and give him a member role and upgrade to senior", async () => {
    //   await guild.mintMember(otherAccount, "ipfs://test");

    //   expect(await guild.isMember(otherAccount.address)).to.equal(true);
    //   expect(await guild.getRole(1)).to.equal(0);

    //   await expect(guild.upgradeMember(otherAccount, 1))
    //     .to.emit(guild, "MemberUpgraded")
    //     .withArgs(1, 1);
    //   expect(await guild.getRole(1)).to.equal(1);
    // });

    // it("should retrieve the role of a member by the address", async () => {
    //   let memberRole;

    //   await guild.mintMember(otherAccount, "ipfs://test");
    //   memberRole = await guild.getRoleByWallet(otherAccount);
    //   expect(memberRole).to.equal(0);

    //   await guild.upgradeMember(otherAccount, 1);
    //   memberRole = await guild.getRoleByWallet(otherAccount);
    //   expect(memberRole).to.equal(1);
    // });
  });
});
