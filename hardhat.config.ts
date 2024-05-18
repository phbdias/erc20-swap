import {HardhatUserConfig, vars} from "hardhat/config";
import '@nomicfoundation/hardhat-ethers';
import "@openzeppelin/hardhat-upgrades";

const INFURA_API_KEY = vars.get("INFURA_API_KEY");
const PRIVATE_KEY = vars.get("SEPOLIA_PRIVATE_KEY");

const config: HardhatUserConfig = {
    solidity: "0.8.24",
    networks: {
        sepolia: {
            url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
            accounts: [PRIVATE_KEY],
            timeout: 60000
        },
    },
};

export default config;
