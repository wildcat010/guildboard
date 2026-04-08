import { Guildboard, GuildNFT, GuildNFT__factory } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { expect } from "chai";
import hre from "hardhat";
import { parseEther } from "ethers";

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
    await expect(
      guildboard.createTask("task 1", "test task", parseEther("0.1")),
    )
      .to.emit(guildboard, "TaskCreated")
      .withArgs(1);
  });

  it("should change the status of a task", async () => {
    await guildboard.createTask("task 1", "test task", parseEther("0.1"));

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
    await expect(
      guildboard.createTask("task 1", "test task", parseEther("0.1")),
    )
      .to.emit(guildboard, "TaskCreated")
      .withArgs(1);
  });

  it("should change the status of a task", async () => {
    await guildboard.createTask("task 1", "test task", parseEther("0.1"));

    await expect(guildboard.updateTaskStatus(1, 2))
      .to.emit(guildboard, "TaskStatusUpdated")
      .withArgs(1, 2);
    // task to be done. The 2 is the satus Done

    const task = await guildboard.getTask(1);
    expect(task.status).to.equal(2);
  });

  it("should not change the status of a task because the contract is shutdown", async () => {
    await guildboard.createTask("task 1", "test task", parseEther("0.1"));

    await guildboard.enableShutdown();

    const paused = await guildboard.paused();
    expect(paused).to.equal(true);

    await expect(
      guildboard.updateTaskStatus(1, 2),
    ).to.be.revertedWithCustomError(guildboard, "EnforcedPause");
  });

  it("should assign a task to a guild", async () => {
    await guildboard.createTask("task 1", "test task", parseEther("0.1"));

    await guildNFT.createGuild("guild Test");

    const task = await guildboard.getTask(1);
    expect(task.guildId).to.equal(0);

    await guildboard.updateTaskAndAssign(
      1,
      "task 1",
      "test task",
      parseEther("0.1"),
      1,
      otherAccount.address,
    );

    const taskUpdated = await guildboard.getTask(1);
    expect(taskUpdated.guildId).to.equal(1);
  });

  it("should not assign a task to a guild which not exist", async () => {
    await guildboard.createTask("task 1", "test task", parseEther("0.1"));
    const task = await guildboard.getTask(1);
    expect(task.guildId).to.equal(0);

    //function updateTaskAndAssign(uint256 taskId, string memory name, string memory description, uint256 reward, uint256 guildId)

    await expect(
      guildboard.updateTaskAndAssign(
        1,
        "task 1",
        "test task",
        parseEther("0.1"),
        1,
        otherAccount.address,
      ),
    ).to.be.revertedWith("GuildNFT: guild does not exist");
  });

  it("should deposit an amount of ETH on the contract", async () => {
    const balance = await hre.ethers.provider.getBalance(
      await guildboard.getAddress(),
    );
    expect(balance).to.equal(hre.ethers.parseEther("0"));

    await guildboard.deposit("deposit 1", "01/01/2026", {
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

    await guildboard.createTask("task 1", "test task", parseEther("0.1"));

    await guildboard.deposit("deposit 1", "01/01/2026", {
      value: hre.ethers.parseEther("0.1"),
    });

    const createTaskbalance = await hre.ethers.provider.getBalance(
      await guildboard.getAddress(),
    );
    expect(createTaskbalance).to.equal(hre.ethers.parseEther("0.1"));

    await guildboard.updateTaskStatus(1, 3);

    await guildboard.updateTaskAndAssign(
      1,
      "task 1",
      "test task",
      parseEther("0.1"),
      1,
      otherAccount.address,
    );

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
    await guildboard.createTask("task 1", "test task", parseEther("0.1"));
    await guildboard.updateTaskAndAssign(
      1,
      "task 1",
      "test task",
      parseEther("0.1"),
      1,
      otherAccount.address,
    );
    await guildboard.updateTaskStatus(1, 3);

    await expect(guildboard.connect(otherAccount).closeAndPayTask(1))
      .to.be.revertedWithCustomError(guildboard, "OwnableUnauthorizedAccount")
      .withArgs(otherAccount.address);
  });

  it("should return all the tasks for a guild", async () => {
    await guildNFT.createGuild("guild Test");
    await guildboard.createTask("task 1", "test task", parseEther("0.1"));
    await guildboard.createTask("task 2", "test task", parseEther("0.1"));
    await guildboard.updateTaskAndAssign(
      1,
      "task 1",
      "test task",
      parseEther("0.1"),
      1,
      otherAccount.address,
    );
    await guildboard.updateTaskAndAssign(
      2,
      "task 2",
      "test task",
      parseEther("0.1"),
      1,
      otherAccount.address,
    );

    const task = await guildboard.getGuildTasks(1);
    expect(task.length).to.equal(2);
    expect(task[0].guildId).to.equal(1);
    expect(task[1].guildId).to.equal(1);
  });

  it("should return all the tasks created", async () => {
    await guildNFT.createGuild("guild Test");
    await guildboard.createTask("task 1", "test task", parseEther("0.1"));
    await guildboard.createTask("task 2", "test task", parseEther("0.1"));
    await guildboard.createTask("task 3", "test task", parseEther("0.1"));

    await guildboard.updateTaskAndAssign(
      1,
      "task 1",
      "test task",
      parseEther("0.1"),
      1,
      otherAccount.address,
    );

    const task = await guildboard.getAllTasks();
    expect(task.length).to.equal(3);
    expect(task[0].guildId).to.equal(1);
    expect(task[1].guildId).to.equal(0);
    expect(task[2].guildId).to.equal(0);
  });
});

describe("Deposit management", function () {
  beforeEach(async function () {
    ({ guildboard, guildNFT, owner, otherAccount } = await initContract());
  });

  it("should make a deposit and add money in the smart contract", async () => {
    await expect(
      guildboard.deposit("Deposit 1", "01/01/2026", {
        value: hre.ethers.parseEther("0.01"),
      }),
    )
      .to.emit(guildboard, "Deposited")
      .withArgs(1, hre.ethers.parseEther("0.01"));

    const balance = await hre.ethers.provider.getBalance(
      await guildboard.getAddress(),
    );

    expect(balance).to.equal(hre.ethers.parseEther("0.01"));
  });

  it("should make two deposits and return all of them", async () => {
    let balance: bigint = 0n;

    await guildboard.deposit("Deposit 1", "01/01/2026", {
      value: hre.ethers.parseEther("0.01"),
    });
    balance = await hre.ethers.provider.getBalance(
      await guildboard.getAddress(),
    );
    expect(balance).to.equal(hre.ethers.parseEther("0.01"));

    await guildboard.deposit("Deposit 2", "02/01/2026", {
      value: hre.ethers.parseEther("0.02"),
    });
    balance = await hre.ethers.provider.getBalance(
      await guildboard.getAddress(),
    );
    expect(balance).to.equal(hre.ethers.parseEther("0.03"));

    const deposits = await guildboard.getAllDeposits();

    expect(deposits.length).to.equal(2);
    expect(deposits[0].id).to.equal(1n);
    expect(deposits[0].name).to.equal("Deposit 1");
    expect(deposits[0].date).to.equal("01/01/2026");
    expect(deposits[0].amount).to.equal(hre.ethers.parseEther("0.01"));

    expect(deposits[1].id).to.equal(2n);
    expect(deposits[1].name).to.equal("Deposit 2");
    expect(deposits[1].date).to.equal("02/01/2026");
    expect(deposits[1].amount).to.equal(hre.ethers.parseEther("0.02"));
  });
});
