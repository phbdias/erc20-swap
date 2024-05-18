import {ethers, upgrades} from "hardhat";
import {vars} from "hardhat/config";

const deploy = async function () {
    const contractFactory = await ethers.getContractFactory("UniswapERC20Swapper");
    const contract = await upgrades.deployProxy(contractFactory, [vars.get("ROUTER_ADDR"), vars.get("WETH_ADDR")], {kind: "uups"});
    await contract.waitForDeployment();
    console.log("UniswapERC20Swapper deployed to: ", await contract.getAddress());
};

deploy()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error deploying UniswapERC20Swapper: ", error.message);
        process.exit(1);
    });
