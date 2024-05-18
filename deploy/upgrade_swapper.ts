import {ethers, upgrades} from "hardhat";
import {vars} from "hardhat/config";

const upgrade = async function () {
    const contractFactory = await ethers.getContractFactory("UniswapERC20Swapper");
    await upgrades.upgradeProxy(vars.get("SWAPPER_ADDR"), contractFactory);
    console.log("UniswapERC20Swapper upgraded");
};

upgrade()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error upgrading UniswapERC20Swapper: ", error.message);
        process.exit(1);
    });
