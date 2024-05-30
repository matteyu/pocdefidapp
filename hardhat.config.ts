import "@nomicfoundation/hardhat-verify";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import { HardhatUserConfig } from "hardhat/config";
import {privateKey, projectId, etherscanApiKey} from './secrets.json';


const config: HardhatUserConfig = {
  networks: {
    hardhat: {},
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${projectId}`,
      accounts: [`0x${privateKey}`],
      gasPrice: 'auto'
    }
  },
  solidity: {
    compilers: [
      {
        version: "0.8.24",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  etherscan: {
  	apiKey: etherscanApiKey,
  },
  sourcify: {
    enabled: true
  }
};

export default config;
