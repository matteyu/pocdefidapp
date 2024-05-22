import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy ERC721 Token Contract
  const ERC721Token = await ethers.getContractFactory("ERC721Token");
  const erc721Token = await ERC721Token.deploy();
  await erc721Token.deployed();
  console.log("ERC721Token deployed to:", erc721Token.address);

  // Mint ERC721 Tokens to the deployer address
  const mintTx1 = await erc721Token.mint(deployer.address, "tokenURI1");
  await mintTx1.wait();
  console.log("Minted ERC721 Token 1 to:", deployer.address);

  const mintTx2 = await erc721Token.mint(deployer.address, "tokenURI2");
  await mintTx2.wait();
  console.log("Minted ERC721 Token 2 to:", deployer.address);

  // Deploy ERC20 Token Contract
  const ERC20Token = await ethers.getContractFactory("ERC20Token");
  const erc20Token = await ERC20Token.deploy(
    ethers.utils.parseUnits("1000", 18)
  );
  await erc20Token.deployed();
  console.log("ERC20Token deployed to:", erc20Token.address);

  // Deploy Loan Contract
  const LoanContract = await ethers.getContractFactory("LoanContract");
  const loanContract = await LoanContract.deploy();
  await loanContract.deployed();
  console.log("LoanContract deployed to:", loanContract.address);

  // Set approval for all for the ERC721 token contract
  const setApprovalForAllTx = await erc721Token.setApprovalForAll(
    loanContract.address,
    true
  );
  await setApprovalForAllTx.wait();
  console.log("Set approval for all for ERC721 token contract");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
