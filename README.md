# GuildBoard

GuildBoard is a full-stack Web3 dApp for managing community guilds, members, and paid tasks on-chain.

It combines:

- **Upgradeable smart contracts** (UUPS)
- **Role and guild membership management with NFTs**
- **Task lifecycle and escrow-like ETH payouts**
- **Next.js frontend with wallet connection**

This project is built as a portfolio-ready Web3 application to demonstrate practical Solidity + frontend integration skills.

## Why This Project

Traditional task boards do not provide trust-minimized execution and transparent payment history.

GuildBoard solves this by:

- storing guild/member/task state on-chain,
- enforcing workflow with smart contract rules,
- handling reward payouts directly from contract balance,
- exposing everything through a user-facing dashboard.

## Core Features

### Smart Contracts

- **Two upgradeable UUPS contracts — GuildNFT and Guildboard**
  - Two upgradeable UUPS contracts — GuildNFT and Guildboard
  - GuildNFT manages guild and member lifecycle as ERC721 tokens
  - Guildboard handles task creation, assignment, status tracking, ETH deposits and payouts
  - Security patterns: ReentrancyGuard, Pausable, Ownable, nonReentrant
  - Full test suite with Hardhat + Mocha/Chai

- **GuildNFT (ERC-721 Upgradeable)**
  - Create/disable/enable/remove guilds
  - Mint member NFTs
  - Upgrade member roles
  - Query members and guilds

- **Guildboard (Upgradeable task board)**
  - Create/update/assign tasks
  - Track task status (`toDo -> inProgress -> Done -> Verified -> Close`)
  - Deposit ETH to contract treasury
  - Close verified task and pay assignee
  - Emergency pause/unpause via owner controls

### Frontend (Next.js)

- Wallet connect with RainbowKit/Wagmi
- Dashboard sections for guild/task/member management
- Contract settings page (contract state + pause controls)
- Read/write hooks for blockchain interactions
- Real-time blockchain state with useReadContract and useWaitForTransactionReceipt for Sepolia confirmation handling
- Role-based UI — admin view vs guild member view
- Deployed on Azure Static Web Apps

## Tech Stack

- **Solidity** `0.8.28`
- **Hardhat** + TypeScript
- **OpenZeppelin Upgradeable Contracts**
- **Ethers v6**, **Wagmi**, **Viem**, **RainbowKit**
- **Next.js (App Router)** + TypeScript

## Project Structure

```text
guildboard/
  contracts/
    contracts/
      GuildNFT.sol
      Guilbboard.sol
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

## Getting Started

## 1) Contracts Setup

```bash
cd contracts
npm install
```

Create a `.env` file in `contracts/`:

```env
PRIVATE_KEY=your_private_key
SEPOLIA_RPC_URL=your_rpc_url
ETHERSCAN_API_KEY=your_etherscan_key
```

Run local chain (terminal 1):

```bash
npx hardhat node
```

Deploy contracts (terminal 2):

```bash
npx hardhat run scripts/deploy.ts --network localhost
```

Run tests:

```bash
npx hardhat test
```

## 2) Frontend Setup

```bash
cd frontend
npm install
```

Create `.env.local` in `frontend/`:

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_GUILD_NFT_ADDRESS=0x...
NEXT_PUBLIC_GUILDBOARD_ADDRESS=0x...
```

Start frontend:

```bash
npm run dev
```

Open: `http://localhost:3000`

## Demo Flow

1. Connect wallet in frontend.
2. Create a guild.
3. Mint members into the guild.
4. Create and assign tasks.
5. Deposit ETH into Guildboard contract.
6. Move task to `Verified` and close it.
7. Observe on-chain payout to assignee.

## Current Quality Signals

- Contracts use upgradeable proxy pattern (UUPS).
- Owner-only controls protect sensitive actions.
- Pause mechanism exists for emergency control.
- Contract test suite currently passes (`33 passing`).

## Known Improvements (Roadmap)

- Add contract events indexing and analytics views.
- Add role-based access beyond owner-only paths.
- Add CI pipeline (lint + test on PR).
- Expand frontend error states and transaction UX.
- Add test coverage report and gas snapshot.
- Add production deployment docs (Sepolia + verification steps).

## Portfolio Positioning

GuildBoard demonstrates:

- Solidity architecture beyond basic token contracts,
- Smart contract testing and deployment workflow,
- Full-stack Web3 integration from contract to UI,
- Practical product thinking (membership + tasks + payments).

## License

This repository currently uses the existing project licenses/settings in each package.

<!-- ...existing code... -->

## Getting Started

## 1) Contracts Setup

```bash
cd contracts
npm install
```

Create a `.env` file in `contracts/`:

```env
PRIVATE_KEY=your_private_key
SEPOLIA_RPC_URL=your_rpc_url
ETHERSCAN_API_KEY=your_etherscan_key
```

### Deploy on Localhost

Run local chain (terminal 1):

```bash
cd contracts
npx hardhat node
```

Deploy contracts (terminal 2):

```bash
cd contracts
npm run deploy:local
```

Run tests:

```bash
cd contracts
npm run test
```

### Deploy on Sepolia

Deploy contracts:

```bash
cd contracts
npm run deploy:sepolia
```

(Optional) verify contracts:

```bash
cd contracts
npm run verify:sepolia
OR
npx hardhat verify --network sepolia <IMPLEMENTATION_ADDRESS>
```

After deployment, copy contract addresses to `frontend/.env.local`:

```env
NEXT_PUBLIC_GUILD_NFT_ADDRESS=0x...
NEXT_PUBLIC_GUILDBOARD_ADDRESS=0x...
```

## 2) Frontend Setup

```bash
cd frontend
npm install
```

Create `.env.local` in `frontend/`:

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_GUILD_NFT_ADDRESS=0x...
NEXT_PUBLIC_GUILDBOARD_ADDRESS=0x...
```

Start frontend:

```bash
npm run dev
```

Open: `http://localhost:3000`

<!-- ...existing code... -->
