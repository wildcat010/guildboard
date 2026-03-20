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
    await guild.createGuild("guild Test");
    await expect(guild.mintMember("Member", otherAccount, "ipfs://test", 1))
      .to.emit(guild, "MemberMinted")
      .withArgs(1, 1);

    const member = await guild.getMember(1);

    expect(member.name).to.equal("Member");

    expect(await guild.isMember(otherAccount.address)).to.equal(true);
  });

  it("should mint a nft for a future member and return the URI", async () => {
    await guild.createGuild("guild Test");
    await guild.mintMember("Member", otherAccount, "ipfs://test", 1);

    const member = await guild.getMember(1);

    expect(await guild.isMember(otherAccount.address)).to.equal(true);

    expect(member.uri).to.equal("ipfs://test");
  });

  it("shoud create a member by minting and get back the token URI by the address wallet", async () => {
    await guild.createGuild("guild Test");
    await guild.mintMember("Member", otherAccount, "ipfs://test", 1);
    expect(await guild.isMember(otherAccount.address)).to.equal(true);

    const member = await guild.getMember(1);
    expect(member.uri).to.equal("ipfs://test");
  });

  it("should create 2 members of a guild and return the members", async () => {
    await guild.createGuild("guild Test");
    await guild.mintMember("Member1", otherAccount.address, "ipfs://test", 1);
    await guild.mintMember("Member2", otherAccount2.address, "ipfs://test", 1);

    const members = await guild.getGuildMembers(1);

    await expect(members[0]).to.equal(1);
    expect(members[1]).to.equal(2);
  });

  it("should create 3 members of a guild, delete 1 and get 2 members in the guild", async () => {
    await guild.createGuild("guild Test");
    await guild.mintMember("Member1", otherAccount.address, "ipfs://test", 1);
    await guild.mintMember("Member2", otherAccount2.address, "ipfs://test", 1);
    await guild.mintMember("Member3", otherAccount3.address, "ipfs://test", 1);

    await expect(guild.removeGuildMember(2))
      .to.emit(guild, "MemberRemoved")
      .withArgs(2, 1);

    const members = await guild.getGuildMembers(1);

    expect(members.length).to.equal(2);
    expect(members[0]).to.equal(1);
    expect(members[1]).to.equal(3);
  });

  it("should not allowed to add a member if the guild is deactivate", async () => {
    await guild.createGuild("guild Test");
    await guild.mintMember("Member", otherAccount.address, "ipfs://test", 1);

    await guild.disableGuild(1);

    await expect(
      guild.mintMember("Member2", otherAccount2.address, "ipfs://test", 1),
    ).to.be.revertedWith("GuildNFT: guild not active");
  });

  describe("GuildNFT management member and find role", function () {
    beforeEach(async function () {
      ({ guild, owner, otherAccount } = await initContract());
    });

    it("should create 3 members of a guild, returns all", async () => {
      await guild.createGuild("guild Test");
      await guild.mintMember("Member1", otherAccount.address, "ipfs://test", 1);
      await guild.mintMember(
        "Member2",
        otherAccount2.address,
        "ipfs://test",
        1,
      );
      await guild.mintMember(
        "Member3",
        otherAccount3.address,
        "ipfs://test",
        1,
      );

      const allMembers = await guild.getAllMembers();
      expect(allMembers[0].id).to.equal(1);
      expect(allMembers[1].id).to.equal(2);
      expect(allMembers[2].id).to.equal(3);
      const memberCount = await guild.getMemberCount();
      expect(memberCount).to.equal(3);
    });

    it("should create 3 members of a guild, 2 in guild id 1 and 1 in guild id 2", async () => {
      await guild.createGuild("guild Test");
      await guild.createGuild("guild Test2");
      await guild.mintMember("Member1", otherAccount.address, "ipfs://test", 1);
      await guild.mintMember(
        "Member2",
        otherAccount2.address,
        "ipfs://test",
        2,
      );
      await guild.mintMember(
        "Member3",
        otherAccount3.address,
        "ipfs://test",
        1,
      );

      const allMembers = await guild.getAllMembers();
      expect(allMembers[0].guildId).to.equal(1);
      expect(allMembers[1].guildId).to.equal(2);
      expect(allMembers[2].guildId).to.equal(1);

      const memberCount = await guild.getMemberCount();
      expect(memberCount).to.equal(3);

      const memberInGuild1 = await guild.getGuildMembers(1);
      expect(memberInGuild1.length).to.equal(2);

      const memberInGuild2 = await guild.getGuildMembers(2);
      expect(memberInGuild2.length).to.equal(1);
    });

    it("should create 3 members of a guild, 2 in guild id 1 and 1 in guild id 2, we delete guild id 1 it should remove the members too", async () => {
      await guild.createGuild("guild Test");
      await guild.createGuild("guild Test2");
      await guild.mintMember("Member1", otherAccount.address, "ipfs://test", 1);
      await guild.mintMember(
        "Member2",
        otherAccount2.address,
        "ipfs://test",
        2,
      );
      await guild.mintMember(
        "Member3",
        otherAccount3.address,
        "ipfs://test",
        1,
      );

      await expect(guild.removeGuild(1))
        .to.emit(guild, "GuildRemoved")
        .withArgs(1, 2);

      const allMembersArray = await guild.getAllMembers();
      expect(allMembersArray.length).to.equal(1);

      const memberInGuild2 = await guild.getGuildMembers(2);
      expect(memberInGuild2.length).to.equal(1);
    });

    it("should create a member and give him a member role", async () => {
      await guild.createGuild("guild Test");
      await expect(guild.mintMember("Member", otherAccount, "ipfs://test", 1))
        .to.emit(guild, "MemberMinted")
        .withArgs(1, 1);

      expect(await guild.isMember(otherAccount.address)).to.equal(true);

      const myMember = await guild.getMember(1);
      expect(myMember.role).to.equal(0);
    });

    it("should create a member and give him a member role and upgrade to senior", async () => {
      await guild.createGuild("guild Test");
      await guild.mintMember("Member", otherAccount, "ipfs://test", 1);

      expect(await guild.isMember(otherAccount.address)).to.equal(true);
      const myMember = await guild.getMember(1);
      expect(myMember.role).to.equal(0);

      await expect(guild.upgradeMember(1, 1))
        .to.emit(guild, "MemberUpgraded")
        .withArgs(1, 1);
      const myMemberUpdated = await guild.getMember(1);
      expect(myMemberUpdated.role).to.equal(1);
    });
  });
});
