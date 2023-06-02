import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require("dotenv").config();

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_HTTPS ?? "",
      accounts: [process.env.SEPOLIA_ACCOUNT ?? ""],
    },
  },
  etherscan: {
    apiKey: {
      sepolia: process.env.SEPOLIA_SCAN_KEY ?? "",
    },
  },
};

export default config;
