# GuildBoard

GuildBoard is a full-stack Web3 dApp for managing community guilds, members, and paid tasks on-chain.

It combines:

- **Upgradeable smart contracts (UUPS)**
- **Role and guild membership management with NFTs**
- **Task lifecycle and ETH-based rewards**
- **Next.js frontend with wallet integration**

This project is built as a portfolio-ready Web3 application to demonstrate practical Solidity + frontend integration skills.

---

## Why This Project

Traditional task boards rely on trust in centralized systems.

GuildBoard solves this by:

- storing guild/member/task state on-chain,
- enforcing workflow rules via smart contracts,
- handling ETH payouts directly from the contract,
- exposing full transparency through a Web3 dashboard.

---

## Core Features

### Smart Contracts

- **Two upgradeable UUPS contracts — GuildNFT and Guildboard**
  - GuildNFT manages guild and member lifecycle as ERC721 tokens
  - Guildboard handles task creation, assignment, status tracking, ETH deposits and payouts
  - Security patterns: ReentrancyGuard, Pausable, Ownable, nonReentrant
  - Full test suite with Hardhat + Mocha/Chai

---

## Permission Model

GuildBoard supports a hybrid permission system:

### 👑 Owner capabilities

- Pause / unpause contract (emergency control)
- Withdraw or manage contract balance (if implemented)
- Transfer ownership
- System-level administration

---

### 👤 Non-owner (community users)

Non-owner users can fully interact with the system:

- Create tasks on-chain
- Update task status through lifecycle:
  - `toDo → inProgress → Done → Verified → Closed`
- Mint / register themselves as users (member NFT)
- Add themselves or others to guilds
- Participate in guild-based workflows

> This makes GuildBoard a collaborative decentralized task system, not just an admin-controlled board.

---

### GuildNFT (ERC-721 Upgradeable)

- Create and manage guilds
- Mint member NFTs (user registration)
- Assign users to guilds
- Update roles and membership
- Query guild and member relationships

---

### Guildboard (Upgradeable Task System)

- Create tasks (any user)
- Update task status (based on permissions)
- Assign tasks to members
- Track full lifecycle:
  - `toDo → inProgress → Done → Verified → Closed`
- Deposit ETH into contract treasury
- Pay assignees automatically on task completion
- Emergency pause/unpause via owner controls

---

## Frontend (Next.js)

- Wallet connection using Wagmi/RainbowKit
- Dashboard for guild, member, and task management
- Contract settings panel (pause, ownership, balance)
- Real-time blockchain state updates using:
  - `useWatchContractEvent`
  - `useWaitForTransactionReceipt`
- Role-based UI (owner vs user views)
- Deployed on Azure Static Web Apps

---

## Tech Stack

- **Solidity 0.8.28**
- **Hardhat + TypeScript**
- **OpenZeppelin Upgradeable Contracts**
- **Ethers v6**
- **Wagmi + Viem + RainbowKit**
- **Next.js (App Router) + TypeScript**

---

## Project Structure

```text
guildboard/
  contracts/
    contracts/
      GuildNFT.sol
      Guildboard.sol
    scripts/
      deploy.ts
      upgrade.ts
    test/
      GuildNFT.test.ts
      Guildboard.test.ts

  frontend/
    src/
      app/
      components/
      hooks/
      contracts/
```
