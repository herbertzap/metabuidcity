# Metabuild HUB 🚀

**Metabuild HUB** is a decentralized platform for launching, customizing, and monetizing virtual fairs and events in the metaverse. Built on **Internet Computer Protocol (ICP)**, it allows organizations to mint their events as NFTs, create interactive 3D stands, and monetize digital assets through a gamified marketplace.

---

## 🌐 Overview

Metabuild HUB is the innovation HUB of the metaverse, where organizations and industries can build their virtual districts, host events, and engage with audiences through immersive experiences. Every event is tokenized, every exhibitor receives 3D merch to sell, and every user has a way to earn real money. We’ve already launched high-impact events like **Chile Fintech Forum 2025**.

> 💡 **Everyone earns in Metabuild HUB:** event organizers, exhibitors, and final users — all roles have economic incentives and withdrawal tools integrated.

---

## 🧩 Features

- 🎪 **NFT-based Fair Minting**: Events are tokenized and minted as NFTs using ICP.
- 🧱 **3D Stand Builder**: Exhibitors customize their stands with prompts, file upload, and live previews.
- 🛍️ **Virtual Merchandising**: T-shirts, hats, backpacks, shoes – every exhibitor receives 10,000 merch items to sell.
- 🪙 **Tokenized Withdrawals**: Admin wallets manage revenue from stand and merch sales.
- 📈 **Leaderboard & Rewards**: Users interact, visit stands, complete quests, and earn tokens.
- 🔐 **Secure Login**: Plug Wallet and Internet Identity integration.
- 🕹️ **WebGL Multiplayer**: Built in Unity for browser-based immersive experiences.
- 🌍 **Public Dashboard**: Metrics, transactions, activity reports per event.

---

## 📦 Tech Stack

- **Frontend**: Unity (WebGL), React
- **Blockchain**: Internet Computer Protocol (Motoko, dfx, canisters)
- **Back-end**: Canister-based architecture
- **Wallets**: Plug, Internet Identity (II), WalletConnect
- **NFT Minting**: Smart contracts on ICP
- **3D Design**: Blender, Figma
- **Deployment**: ICP Mainnet (with working canisters)

---

## 📹 Demo

🎥 Watch our live platform and experience it now:  
[https://azhuu-hqaaa-aaaam-aeggq-cai.icp0.io/](https://azhuu-hqaaa-aaaam-aeggq-cai.icp0.io/)

Demo Video (YouTube):  
[https://youtu.be/-BEWIxx8Gb0)](https://youtu.be/-BEWIxx8Gb0)

---

## 📹 Pitck Deck

🎥 Watch our live platform and experience it now:  
[https://www.canva.com/design/DAGuABP-LvA/8NF-v0pQh_BXjwVTobjGOQ/edit?utm_content=DAGuABP-LvA&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton](https://www.canva.com/design/DAGuABP-LvA/8NF-v0pQh_BXjwVTobjGOQ/edit?utm_content=DAGuABP-LvA&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)

---

## 👥 Team

### Rodrigo Requena – Project Lead & 3D Product Designer  
Civil Constructor UC | Expert in Unity, XR & Metaverse Strategy | Speaker ETH Chile & Paris Blockchain Week Winner

### Herbert Zapata – CTO & Blockchain Architect  
Full-stack Dev | Specialist in Motoko, Rust & ICP Canisters | NFT Minting & Smart Contract Logic

### Francisco Román – Unity Developer  
WebGL Frontend | Unity C# Programmer | Avatar Interactions & Stand Rendering

### Pablo Rodríguez – 3D & Visual Designer  
Figma + Blender | Merch Design | Web UI for exhibitor tools and marketplace

---

## 🧪 How to Run Locally

To learn more before you start working with `metabuildcity`, see the following documentation available online:

- [Quick Start](https://internetcomputer.org/docs/current/developer-docs/setup/deploy-locally)
- [SDK Developer Tools](https://internetcomputer.org/docs/current/developer-docs/setup/install)
- [Motoko Programming Language Guide](https://internetcomputer.org/docs/current/motoko/main/motoko)
- [Motoko Language Quick Reference](https://internetcomputer.org/docs/current/motoko/main/language-manual)

If you want to start working on your project right away, you might want to try the following commands:

```bash
cd metabuildcity/
dfx help
dfx canister --help
```

## Running the project locally

If you want to test your project locally, you can use the following commands:

```bash
# Starts the replica, running in the background
dfx start --background

# Deploys your canisters to the replica and generates your candid interface
dfx deploy
```

Once the job completes, your application will be available at `http://localhost:4943?canisterId={asset_canister_id}`.

If you have made changes to your backend canister, you can generate a new candid interface with

```bash
npm run generate
```

at any time. This is recommended before starting the frontend development server, and will be run automatically any time you run `dfx deploy`.

If you are making frontend changes, you can start a development server with

```bash
npm start
```

Which will start a server at `http://localhost:8080`, proxying API requests to the replica at port 4943.

### Note on frontend environment variables

If you are hosting frontend code somewhere without using DFX, you may need to make one of the following adjustments to ensure your project does not fetch the root key in production:

- set`DFX_NETWORK` to `ic` if you are using Webpack
- use your own preferred method to replace `process.env.DFX_NETWORK` in the autogenerated declarations
  - Setting `canisters -> {asset_canister_id} -> declarations -> env_override to a string` in `dfx.json` will replace `process.env.DFX_NETWORK` with the string in the autogenerated declarations
- Write your own `createActor` constructor
