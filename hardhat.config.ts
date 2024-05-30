import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import {privateKey, projectId} from './secrets.json';


const config: HardhatUserConfig = {
  solidity: "0.8.24",
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
  }
};

export default config;
