import {expect} from "chai";
import {Contract} from "ethers";
import {ethers} from "hardhat";
import {vars} from "hardhat/config";
import {abi as ierc20Abi} from "@openzeppelin/contracts/build/contracts/IERC20.json";

describe("UniswapERC20Swapper", function () {
    let swapper: Contract;
    before(async function () {
        swapper = await ethers.getContractAt("UniswapERC20Swapper", vars.get("SWAPPER_ADDR"));
    });

    it("Should set the right Uniswap Router address", async function () {
        expect(await swapper.swapRouterAddr()).to.equal(vars.get("ROUTER_ADDR"));
    });

    it("Should set the right WETH address", async function () {
        expect(await swapper.wethAddr()).to.equal(vars.get("WETH_ADDR"));
    });

    it("Should update ETH and USDC balances", async function () {
        //For testing purposes, we will not define a specific minimum amount and leave it to 0, so it always concludes
        const minAmount = 0n;

        const [owner] = await ethers.getSigners();
        const initETHBalance = await ethers.provider.getBalance(owner.address);
        const usdc = await ethers.getContractAt(ierc20Abi, vars.get("USDC_ADDR"))
        const initUSDCBalance = await usdc.balanceOf(owner.address);

        const amountIn = ethers.parseEther("0.001");
        const tx = await swapper.swapEtherToToken(vars.get("USDC_ADDR"), minAmount, {value: amountIn});
        await tx.wait();

        const finalETHBalance = await ethers.provider.getBalance(owner.address);
        const finalUSDCBalance = await usdc.balanceOf(owner.address);

        //After the swap, the ETH balance should decrease at least the amountIn (amountIn + gas, gas > 0)
        expect(initETHBalance - finalETHBalance >= amountIn).to.be.true;

        //After the swap, the USDC balance should increase
        expect(finalUSDCBalance - initUSDCBalance > 0).to.be.true;
    });
});
