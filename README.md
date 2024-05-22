# PoC Borrowing/Lending Platform

<img width="1401" alt="image" src="https://github.com/matteyu/pocdefidapp/assets/33408292/91d21b94-e750-4621-83df-45dd4302a057">

<img width="1401" alt="image" src="https://github.com/matteyu/pocdefidapp/assets/33408292/04018a95-b9cf-4aab-9360-f85a5598a27c">


<img width="1401" alt="image" src="https://github.com/matteyu/pocdefidapp/assets/33408292/44d0c707-4d9c-4c38-9673-7ea216699520">

## Setup
- Sign up for an Infura account [here](https://app.infura.io/register).  Ensure you activate the Ethereum Sepolia endpoint after you create a project (along with any other chains you would like to deploy to).
- Install the metamask browser extension from [here](https://metamask.io/download/)

## Setup
```shell
git clone git@github.com:matteyu/pocdefidapp.git
cd pocdefidapp
npm install
cd frontend
npm install
```

## Deploy Smart Contracts
```shell
cd pocdefidapp
npx hardhat node
npx hardhat compile
npx hardhat run --network localhost scripts/deploy.ts

# The above commands will run a development node.  Then, it will compile an erc20 contract, erc721 contract, and a loans contract.  It will then deploy it to a development environment and mint a few tokens to the deployer address to test with.  You can get the address private keys after running the "npx hardhat node" command.
```

## Setup Env Vars
Once you have the contract addresses, create a .env file under `frontend/src`.  Use the `.env.example` file as a guide on how to structure your `.env` file.

## Run the Frontend
```shell
cd frontend
npm start

# The frontend should open in your default browser automatically.  If it does not, you can access the dapp at http://localhost:3000 
```

## Deploy Smart Contracts To Sepolia Testnet
In the file `secrets.json` add your infura project id to `projectId`.  Take the mnemonic phrase of the wallet that you would like to use (for deploying the contracts to testnet) and place it in `mnemonic`.

Execute the command:
```shell
npx hardhat run --network sepolia scripts/deploy.ts
```
