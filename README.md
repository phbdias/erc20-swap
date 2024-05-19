# Swap Ether to ERC20

This project implements an [exercise](https://github.com/eigerco/recruitment-exercises/blob/main/erc20-swap.md) proposed by Eiger, whose purpose is to create a smart contract for swapping Ether to any designated ERC-20.

## Solution
The smart contract is developed in **Solidity** with the **Hardhat** environment. To perform the exchange, it leverages the method **exactInputSingle** from **Uniswap v3 SwapRouter**. Since the DEXs are constantly evolving and mutating, the **upgradeability** of the contract is important, and therefore the **UUPS proxy** pattern is employed. Also, there is the need to restrict access to some of the sensitive features of the contract, concerning the funds that are exchanged there. For that reason, it utilizes the **Ownable** pattern, which is a simple but very efficient form of access control.

## Deployed on Sepolia
There is a deployment of this contract on Ethereum Sepolia Testnet:

- **Address**: [0x92fB37EC42DEDBf5187bD040018187b5e4942B80](https://sepolia.etherscan.io/address/0x92fb37ec42dedbf5187bd040018187b5e4942b80)

## Pre-requisites
- Install [Node.js](https://nodejs.org/en/) locally

## Getting started
- **Clone the repository**
```
git clone https://github.com/phbdias/erc20-swap.git
```
- **Install dependencies**
```
cd erc20-swap
npm install
```

## Hardhat commands
- **Compile the contract**
```
npx hardhat compile
```
- **Deploy to a live network**
```
npx hardhat run ./deploy/deploy_swapper.ts --network <network-name>
```
- **Test the code**
```
npx hardhat test --network <network-name>
```
- **Upgrade contract implementation**
```
npx hardhat run ./deploy/upgrade_swapper.ts --network <network-name>
```

## Hardhat vars
This project uses the following [Hardhat configuration variables](https://hardhat.org/hardhat-runner/docs/guides/configuration-variables):

| Name                          | Description                         | Example Value                                  |
| ----------------------------- | ------------------------------------| -----------------------------------------------|
| INFURA_API_KEY                | Infura API Key                      | -                                              |
| SEPOLIA_PRIVATE_KEY           | Private key of the owner's wallet   | -                                              |
| ROUTER_ADDR                   | Uniswap v3 SwapRouter address       | 0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48E     |
| WETH_ADDR                     | IWETH9 Address                      | 0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14     |
| USDC_ADDR                     | USDC Address                        | 0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238     |
| SWAPPER_ADDR                  | ERC20Swapper Address                | 0x92fB37EC42DEDBf5187bD040018187b5e4942B80     |
