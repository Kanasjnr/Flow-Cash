import { ethers } from "hardhat";
import { verify } from "./verify";

async function main() {
  console.log("Starting FlowCash deployment to Electroneum testnet...");

  const [deployer] = await ethers.getSigners();
  console.log(`Deploying with account: ${deployer.address}`);
  console.log(`Balance: ${ethers.formatEther(await ethers.provider.getBalance(deployer.address))} ETN`);

  // Single wallet for all fees
  const feeWallet = "0xa1599790B763E537bd15b5b912012e5Fb65491a3";

  try {
    // Deploy FeeCollector
    console.log("Deploying FeeCollector...");
    const FeeCollector = await ethers.getContractFactory("FeeCollector");
    const feeCollector = await FeeCollector.deploy(feeWallet, feeWallet, feeWallet);
    await feeCollector.waitForDeployment();
    const feeCollectorAddress = await feeCollector.getAddress();
    console.log(`FeeCollector deployed: ${feeCollectorAddress}`);

    // Deploy FlowCashCore
    console.log("Deploying FlowCashCore...");
    const FlowCashCore = await ethers.getContractFactory("FlowCashCore");
    const flowCashCore = await FlowCashCore.deploy(feeCollectorAddress);
    await flowCashCore.waitForDeployment();
    const flowCashCoreAddress = await flowCashCore.getAddress();
    console.log(`FlowCashCore deployed: ${flowCashCoreAddress}`);

    // Configure contracts
    console.log("Configuring contracts...");
    await feeCollector.setAuthorizedCollector(flowCashCoreAddress, true);
    await flowCashCore.setAuthorizedProcessor(deployer.address, true);

    // Verify contracts
    try {
      await verify(feeCollectorAddress, [feeWallet, feeWallet, feeWallet]);
      await verify(flowCashCoreAddress, [feeCollectorAddress]);
    } catch (error) {
      console.log("Contract verification failed (may not be supported)");
    }

    // Save deployment info
    const network = await ethers.provider.getNetwork();
    const deploymentInfo = {
      network: network.name,
      chainId: Number(network.chainId),
      deployer: deployer.address,
      timestamp: new Date().toISOString(),
      contracts: {
        feeCollector: feeCollectorAddress,
        flowCashCore: flowCashCoreAddress
      },
      feeWallet: feeWallet
    };

    const fs = require("fs");
    const deploymentPath = `deployments/${network.name}-${network.chainId}.json`;
    fs.mkdirSync("deployments", { recursive: true });
    fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));

    console.log("DEPLOYMENT SUCCESSFUL!");
    console.log(`FeeCollector: ${feeCollectorAddress}`);
    console.log(`FlowCashCore: ${flowCashCoreAddress}`);
    console.log(`Fee Wallet: ${feeWallet}`);

    return {
      feeCollector: feeCollectorAddress,
      flowCashCore: flowCashCoreAddress,
      network: network.name,
      chainId: network.chainId
    };

  } catch (error) {
    console.error("DEPLOYMENT FAILED!");
    console.error(error);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 