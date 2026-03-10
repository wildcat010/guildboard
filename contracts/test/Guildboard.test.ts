import { Guildboard, GuildNFT, GuildNFT__factory } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { expect } from "chai";
import hre from "hardhat";

// =========================================
// VARIABLES — shared across all tests
// =========================================
let guildboard: Guildboard;
let guildNFT: GuildNFT;
let owner: HardhatEthersSigner;
let otherAccount: HardhatEthersSigner;
let otherAccount2: HardhatEthersSigner;
let otherAccount3: HardhatEthersSigner;

async function initContract() {
  [owner, otherAccount, otherAccount2, otherAccount3] =
    await hre.ethers.getSigners();

  const GuildNFTFactory = await hre.ethers.getContractFactory("GuildNFT");
  const guildNFT = (await hre.upgrades.deployProxy(GuildNFTFactory, {
    kind: "uups",
    initializer: "initialize",
  })) as unknown as GuildNFT;
  await guildNFT.waitForDeployment();

  const GuildboardFactory = await hre.ethers.getContractFactory("Guildboard");
  guildboard = (await hre.upgrades.deployProxy(
    GuildboardFactory,
    [await guildNFT.getAddress()],
    {
      kind: "uups",
      initializer: "initialize",
    },
  )) as unknown as Guildboard;
  await guildboard.waitForDeployment();

  return {
    guildboard,
    guildNFT,
    owner,
    otherAccount,
    otherAccount2,
    otherAccount3,
  };
}

describe("Guildboard contract config", function () {
  beforeEach(async function () {
    ({ guildboard, guildNFT, owner, otherAccount } = await initContract());
  });

  it("should deployed the contract", async () => {
    const address = await guildboard.getAddress();
    expect(address).to.be.a("string");
    expect(address).to.have.lengthOf(42); // ethereum address length
  });

  it("should disable the contract", async () => {
    const pause = await guildboard.paused();
    expect(pause).to.equal(false);

    await guildboard.enableShutdown();
    const newPause = await guildboard.paused();
    expect(newPause).to.equal(true);

    await guildboard.disableShutdown();
    const disable = await guildboard.paused();
    expect(disable).to.equal(false);
  });

  it("should enable the contract", async () => {
    const pause = await guildboard.paused();
    expect(pause).to.equal(false);

    await guildboard.enableShutdown();
    const newPause = await guildboard.paused();
    expect(newPause).to.equal(true);
  });

  it("should create a task", async () => {
    await expect(guildboard.createTask("test task", otherAccount))
      .to.emit(guildboard, "TaskCreated")
      .withArgs(1);
  });

  it("should change the status of a task", async () => {
    await guildboard.createTask("test task", otherAccount);

    await expect(guildboard.updateTaskStatus(1, 2))
      .to.emit(guildboard, "TaskStatusUpdated")
      .withArgs(1, 2);
    // task to be done. The 2 is the satus Done

    const task = await guildboard.getTask(1);
    expect(task.status).to.equal(2);
  });
});

describe("Task management", function () {
  beforeEach(async function () {
    ({ guildboard, guildNFT, owner, otherAccount } = await initContract());
  });

  it("should create a task", async () => {
    await expect(guildboard.createTask("test task", otherAccount))
      .to.emit(guildboard, "TaskCreated")
      .withArgs(1);
  });

  it("should change the status of a task", async () => {
    await guildboard.createTask("test task", otherAccount);

    await expect(guildboard.updateTaskStatus(1, 2))
      .to.emit(guildboard, "TaskStatusUpdated")
      .withArgs(1, 2);
    // task to be done. The 2 is the satus Done

    const task = await guildboard.getTask(1);
    expect(task.status).to.equal(2);
  });

  it("should not change the status of a task because the contract is shutdown", async () => {
    await guildboard.createTask("test task", otherAccount);

    await guildboard.enableShutdown();

    const paused = await guildboard.paused();
    expect(paused).to.equal(true);

    await expect(
      guildboard.updateTaskStatus(1, 2),
    ).to.be.revertedWithCustomError(guildboard, "EnforcedPause");
  });

  it("should assign a task to a guild", async () => {
    await guildboard.createTask("test task", otherAccount);

    await guildNFT.createGuild("guild Test");

    const task = await guildboard.getTask(1);
    expect(task.guildId).to.equal(0);

    await guildboard.AssignTaskToGuild(1, 1);

    const taskUpdated = await guildboard.getTask(1);
    expect(taskUpdated.guildId).to.equal(1);
  });

  it("should not assign a task to a guild which not exist", async () => {
    await guildboard.createTask("test task", otherAccount);
    const task = await guildboard.getTask(1);
    expect(task.guildId).to.equal(0);

    await expect(guildboard.AssignTaskToGuild(1, 1)).to.be.revertedWith(
      "GuildNFT: guild does not exist",
    );
  });

  it("should deposit an amount of ETH on the contract", async () => {
    const balance = await hre.ethers.provider.getBalance(
      await guildboard.getAddress(),
    );
    expect(balance).to.equal(hre.ethers.parseEther("0"));

    await guildboard.deposit({
      value: hre.ethers.parseEther("0.01"),
    });
    const newBalance = await hre.ethers.provider.getBalance(
      await guildboard.getAddress(),
    );
    expect(newBalance).to.equal(hre.ethers.parseEther("0.01"));
  });

  it("should verfied a task and pay the assignee", async () => {
    const balance = await hre.ethers.provider.getBalance(
      await guildboard.getAddress(),
    );
    expect(balance).to.equal(hre.ethers.parseEther("0"));

    await guildNFT.createGuild("guild Test");

    await guildboard.createTask("test task", otherAccount.address, {
      value: hre.ethers.parseEther("0.1"),
    });

    const createTaskbalance = await hre.ethers.provider.getBalance(
      await guildboard.getAddress(),
    );
    expect(createTaskbalance).to.equal(hre.ethers.parseEther("0.1"));

    await guildboard.updateTaskStatus(1, 3);

    await guildboard.AssignTaskToGuild(1, 1);

    await expect(guildboard.closeAndPayTask(1))
      .to.emit(guildboard, "TaskDoneAndPaid")
      .withArgs(1, hre.ethers.parseEther("0.1"), 1);

    const newBalance = await hre.ethers.provider.getBalance(
      await guildboard.getAddress(),
    );
    expect(newBalance).to.equal(hre.ethers.parseEther("0"));
  });

  it("should verfied a task and not pay the assignee because we are not the owner", async () => {
    await guildNFT.createGuild("guild Test");
    await guildboard.createTask("test task", otherAccount.address, {
      value: hre.ethers.parseEther("0.1"),
    });
    await guildboard.AssignTaskToGuild(1, 1);
    await guildboard.updateTaskStatus(1, 3);

    await expect(guildboard.connect(otherAccount).closeAndPayTask(1))
      .to.be.revertedWithCustomError(guildboard, "OwnableUnauthorizedAccount")
      .withArgs(otherAccount.address);
  });

  it("should return all the tasks for a guild", async () => {
    await guildNFT.createGuild("guild Test");
    await guildboard.createTask("test task 1", otherAccount.address, {
      value: hre.ethers.parseEther("0.1"),
    });
    await guildboard.createTask("test task 2", otherAccount.address, {
      value: hre.ethers.parseEther("0.1"),
    });
    await guildboard.AssignTaskToGuild(1, 1);
    await guildboard.AssignTaskToGuild(1, 2);

    const task = await guildboard.getGuildTasks(1);
    expect(task.length).to.equal(2);
    expect(task[0].guildId).to.equal(1);
    expect(task[1].guildId).to.equal(1);
  });

  it("should return all the tasks created", async () => {
    await guildNFT.createGuild("guild Test");
    await guildboard.createTask("test task 1", otherAccount.address, {
      value: hre.ethers.parseEther("0.1"),
    });
    await guildboard.createTask("test task 2", otherAccount.address, {
      value: hre.ethers.parseEther("0.1"),
    });
    await guildboard.createTask("test task 3", otherAccount.address, {
      value: hre.ethers.parseEther("0.1"),
    });

    await guildboard.AssignTaskToGuild(1, 1);

    const task = await guildboard.getAllTasks();
    expect(task.length).to.equal(3);
    expect(task[0].guildId).to.equal(1);
    expect(task[1].guildId).to.equal(0);
    expect(task[2].guildId).to.equal(0);
  });
});
