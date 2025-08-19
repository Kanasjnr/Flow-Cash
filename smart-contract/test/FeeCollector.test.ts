import { expect } from "chai";
import { ethers } from "hardhat";
import { FeeCollector } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("FeeCollector", function () {
  let feeCollector: FeeCollector;
  let owner: SignerWithAddress;
  let collector1: SignerWithAddress;
  let collector2: SignerWithAddress;
  let operationsWallet: SignerWithAddress;
  let incentivesWallet: SignerWithAddress;
  let treasuryWallet: SignerWithAddress;
  let newOperationsWallet: SignerWithAddress;

  const HUNDRED_ETN = ethers.parseEther("100");
  const THOUSAND_ETN = ethers.parseEther("1000");
  const TEN_ETN = ethers.parseEther("10");
  const ONE_ETN = ethers.parseEther("1");

  beforeEach(async function () {
    [owner, collector1, collector2, operationsWallet, incentivesWallet, treasuryWallet, newOperationsWallet] = 
      await ethers.getSigners();

    // Deploy FeeCollector
    const FeeCollectorFactory = await ethers.getContractFactory("FeeCollector");
    feeCollector = await FeeCollectorFactory.deploy(
      operationsWallet.address,
      incentivesWallet.address,
      treasuryWallet.address
    );

    // Authorize collectors
    await feeCollector.setAuthorizedCollector(collector1.address, true);
    await feeCollector.setAuthorizedCollector(collector2.address, true);

    // Fund the contract for testing
    await owner.sendTransaction({
      to: await feeCollector.getAddress(),
      value: ethers.parseEther("50")
    });
  });

  describe("Deployment", function () {
    it("Should set the correct owner", async function () {
      expect(await feeCollector.owner()).to.equal(owner.address);
    });

    it("Should set the correct wallet addresses", async function () {
      const [ops, incentives, treasury] = await feeCollector.getWallets();
      expect(ops).to.equal(operationsWallet.address);
      expect(incentives).to.equal(incentivesWallet.address);
      expect(treasury).to.equal(treasuryWallet.address);
    });

    it("Should set correct distribution percentages", async function () {
      expect(await feeCollector.OPERATIONS_PERCENT()).to.equal(5000); // 50%
      expect(await feeCollector.INCENTIVES_PERCENT()).to.equal(3000); // 30%
      expect(await feeCollector.TREASURY_PERCENT()).to.equal(2000); // 20%
      expect(await feeCollector.PERCENT_DENOMINATOR()).to.equal(10000); // 100%
    });

    it("Should set default distribution threshold", async function () {
      expect(await feeCollector.minDistributionThreshold()).to.equal(ethers.parseEther("100"));
    });

    it("Should set owner as authorized collector", async function () {
      expect(await feeCollector.authorizedCollectors(owner.address)).to.be.true;
    });

    it("Should reject invalid wallet addresses in constructor", async function () {
      const FeeCollectorFactory = await ethers.getContractFactory("FeeCollector");
      
      await expect(
        FeeCollectorFactory.deploy(ethers.ZeroAddress, incentivesWallet.address, treasuryWallet.address)
      ).to.be.revertedWith("FeeCollector: Invalid operations wallet");

      await expect(
        FeeCollectorFactory.deploy(operationsWallet.address, ethers.ZeroAddress, treasuryWallet.address)
      ).to.be.revertedWith("FeeCollector: Invalid incentives wallet");

      await expect(
        FeeCollectorFactory.deploy(operationsWallet.address, incentivesWallet.address, ethers.ZeroAddress)
      ).to.be.revertedWith("FeeCollector: Invalid treasury wallet");
    });
  });

  describe("Fee Collection", function () {
    describe("Valid Fee Collection", function () {
      it("Should collect fees and update balances correctly", async function () {
        const feeAmount = TEN_ETN;
        const expectedOperations = (feeAmount * 5000n) / 10000n; // 50%
        const expectedIncentives = (feeAmount * 3000n) / 10000n; // 30%
        const expectedTreasury = feeAmount - expectedOperations - expectedIncentives; // 20%

        await expect(feeCollector.connect(collector1).collectFee(feeAmount))
          .to.emit(feeCollector, "FeeCollected")
          .withArgs(collector1.address, feeAmount);

        const feeBalance = await feeCollector.getFeeBalance();
        expect(feeBalance.totalCollected).to.equal(feeAmount);
        expect(feeBalance.operationsBalance).to.equal(expectedOperations);
        expect(feeBalance.incentivesBalance).to.equal(expectedIncentives);
        expect(feeBalance.treasuryBalance).to.equal(expectedTreasury);
      });

      it("Should accumulate multiple fee collections", async function () {
        const firstFee = ONE_ETN;
        const secondFee = ethers.parseEther("2");
        const totalFee = firstFee + secondFee;

        await feeCollector.connect(collector1).collectFee(firstFee);
        await feeCollector.connect(collector2).collectFee(secondFee);

        const feeBalance = await feeCollector.getFeeBalance();
        expect(feeBalance.totalCollected).to.equal(totalFee);
      });

      it("Should calculate distribution correctly", async function () {
        const amount = THOUSAND_ETN;
        const [operations, incentives, treasury] = await feeCollector.calculateDistribution(amount);

        expect(operations).to.equal((amount * 5000n) / 10000n); // 50%
        expect(incentives).to.equal((amount * 3000n) / 10000n); // 30%
        expect(treasury).to.equal(amount - operations - incentives); // 20%
      });
    });

    describe("Invalid Fee Collection", function () {
      it("Should reject collection from unauthorized address", async function () {
        await expect(
          feeCollector.connect(operationsWallet).collectFee(HUNDRED_ETN)
        ).to.be.revertedWith("FeeCollector: Not authorized collector");
      });

      it("Should reject zero amount collection", async function () {
        await expect(
          feeCollector.connect(collector1).collectFee(0)
        ).to.be.revertedWith("FeeCollector: Amount must be greater than 0");
      });

      it("Should reject collection exceeding contract balance", async function () {
        const excessiveAmount = ethers.parseEther("100"); // More than contract balance
        await expect(
          feeCollector.connect(collector1).collectFee(excessiveAmount)
        ).to.be.revertedWith("FeeCollector: Insufficient balance");
      });
    });
  });

  describe("Fee Distribution", function () {
    beforeEach(async function () {
      // Collect some fees first
      await feeCollector.connect(collector1).collectFee(TEN_ETN);
    });

    describe("Valid Distribution", function () {
      it("Should distribute fees to correct wallets", async function () {
        // Lower the threshold for testing
        await feeCollector.updateDistributionThreshold(ethers.parseEther("1"));
        const operationsBalanceBefore = await ethers.provider.getBalance(operationsWallet.address);
        const incentivesBalanceBefore = await ethers.provider.getBalance(incentivesWallet.address);
        const treasuryBalanceBefore = await ethers.provider.getBalance(treasuryWallet.address);

        const feeBalanceBefore = await feeCollector.getFeeBalance();
        const expectedOperations = feeBalanceBefore.operationsBalance;
        const expectedIncentives = feeBalanceBefore.incentivesBalance;
        const expectedTreasury = feeBalanceBefore.treasuryBalance;

        await expect(feeCollector.distributeFees())
          .to.emit(feeCollector, "FeeDistributed")
          .withArgs(expectedOperations, expectedIncentives, expectedTreasury);

        const operationsBalanceAfter = await ethers.provider.getBalance(operationsWallet.address);
        const incentivesBalanceAfter = await ethers.provider.getBalance(incentivesWallet.address);
        const treasuryBalanceAfter = await ethers.provider.getBalance(treasuryWallet.address);

        expect(operationsBalanceAfter - operationsBalanceBefore).to.equal(expectedOperations);
        expect(incentivesBalanceAfter - incentivesBalanceBefore).to.equal(expectedIncentives);
        expect(treasuryBalanceAfter - treasuryBalanceBefore).to.equal(expectedTreasury);
      });

      it("Should reset balances after distribution", async function () {
        // Lower the threshold for testing
        await feeCollector.updateDistributionThreshold(ethers.parseEther("1"));
        await feeCollector.distributeFees();

        const feeBalance = await feeCollector.getFeeBalance();
        expect(feeBalance.operationsBalance).to.equal(0);
        expect(feeBalance.incentivesBalance).to.equal(0);
        expect(feeBalance.treasuryBalance).to.equal(0);
        expect(feeBalance.lastDistributionTime).to.be.gt(0);
      });

      it("Should handle emergency distribution", async function () {
        const emergencyAmount = ethers.parseEther("5");
        const expectedOperations = (emergencyAmount * 5000n) / 10000n;
        const expectedIncentives = (emergencyAmount * 3000n) / 10000n;
        const expectedTreasury = emergencyAmount - expectedOperations - expectedIncentives;

        const operationsBalanceBefore = await ethers.provider.getBalance(operationsWallet.address);

        await expect(feeCollector.emergencyDistribute(emergencyAmount))
          .to.emit(feeCollector, "FeeDistributed")
          .withArgs(expectedOperations, expectedIncentives, expectedTreasury);

        const operationsBalanceAfter = await ethers.provider.getBalance(operationsWallet.address);
        expect(operationsBalanceAfter - operationsBalanceBefore).to.equal(expectedOperations);
      });
    });

    describe("Invalid Distribution", function () {
      it("Should reject distribution below threshold", async function () {
        // Set high threshold
        await feeCollector.updateDistributionThreshold(ethers.parseEther("2000"));

        await expect(
          feeCollector.distributeFees()
        ).to.be.revertedWith("FeeCollector: Below distribution threshold");
      });

      it("Should reject non-owner distribution", async function () {
        await expect(
          feeCollector.connect(collector1).distributeFees()
        ).to.be.revertedWith("Ownable: caller is not the owner");
      });

      it("Should reject emergency distribution from non-owner", async function () {
        await expect(
          feeCollector.connect(collector1).emergencyDistribute(HUNDRED_ETN)
        ).to.be.revertedWith("Ownable: caller is not the owner");
      });

      it("Should reject emergency distribution of zero amount", async function () {
        await expect(
          feeCollector.emergencyDistribute(0)
        ).to.be.revertedWith("FeeCollector: Amount must be greater than 0");
      });

      it("Should reject emergency distribution exceeding balance", async function () {
        const excessiveAmount = ethers.parseEther("100");
        await expect(
          feeCollector.emergencyDistribute(excessiveAmount)
        ).to.be.revertedWith("FeeCollector: Insufficient balance");
      });
    });
  });

  describe("Wallet Management", function () {
    describe("Valid Wallet Updates", function () {
      it("Should update operations wallet", async function () {
        await expect(feeCollector.updateWallet("operations", newOperationsWallet.address))
          .to.emit(feeCollector, "WalletUpdated")
          .withArgs("operations", operationsWallet.address, newOperationsWallet.address);

        expect(await feeCollector.operationsWallet()).to.equal(newOperationsWallet.address);
      });

      it("Should update incentives wallet", async function () {
        await expect(feeCollector.updateWallet("incentives", newOperationsWallet.address))
          .to.emit(feeCollector, "WalletUpdated")
          .withArgs("incentives", incentivesWallet.address, newOperationsWallet.address);

        expect(await feeCollector.incentivesWallet()).to.equal(newOperationsWallet.address);
      });

      it("Should update treasury wallet", async function () {
        await expect(feeCollector.updateWallet("treasury", newOperationsWallet.address))
          .to.emit(feeCollector, "WalletUpdated")
          .withArgs("treasury", treasuryWallet.address, newOperationsWallet.address);

        expect(await feeCollector.treasuryWallet()).to.equal(newOperationsWallet.address);
      });
    });

    describe("Invalid Wallet Updates", function () {
      it("Should reject invalid wallet type", async function () {
        await expect(
          feeCollector.updateWallet("invalid", newOperationsWallet.address)
        ).to.be.revertedWith("FeeCollector: Invalid wallet type");
      });

      it("Should reject zero address wallet", async function () {
        await expect(
          feeCollector.updateWallet("operations", ethers.ZeroAddress)
        ).to.be.revertedWith("FeeCollector: Invalid wallet address");
      });

      it("Should reject non-owner wallet updates", async function () {
        await expect(
          feeCollector.connect(collector1).updateWallet("operations", newOperationsWallet.address)
        ).to.be.revertedWith("Ownable: caller is not the owner");
      });
    });
  });

  describe("Threshold Management", function () {
    it("Should update distribution threshold", async function () {
      const newThreshold = ethers.parseEther("200");
      const oldThreshold = await feeCollector.minDistributionThreshold();

      await expect(feeCollector.updateDistributionThreshold(newThreshold))
        .to.emit(feeCollector, "ThresholdUpdated")
        .withArgs(oldThreshold, newThreshold);

      expect(await feeCollector.minDistributionThreshold()).to.equal(newThreshold);
    });

    it("Should reject zero threshold", async function () {
      await expect(
        feeCollector.updateDistributionThreshold(0)
      ).to.be.revertedWith("FeeCollector: Threshold must be greater than 0");
    });

    it("Should reject non-owner threshold updates", async function () {
      await expect(
        feeCollector.connect(collector1).updateDistributionThreshold(ethers.parseEther("200"))
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Collector Authorization", function () {
    it("Should authorize new collector", async function () {
      const newCollector = operationsWallet.address;

      await expect(feeCollector.setAuthorizedCollector(newCollector, true))
        .to.emit(feeCollector, "CollectorAuthorized")
        .withArgs(newCollector, true);

      expect(await feeCollector.authorizedCollectors(newCollector)).to.be.true;
      expect(await feeCollector.isAuthorizedCollector(newCollector)).to.be.true;
    });

    it("Should deauthorize collector", async function () {
      await expect(feeCollector.setAuthorizedCollector(collector1.address, false))
        .to.emit(feeCollector, "CollectorAuthorized")
        .withArgs(collector1.address, false);

      expect(await feeCollector.authorizedCollectors(collector1.address)).to.be.false;
      expect(await feeCollector.isAuthorizedCollector(collector1.address)).to.be.false;
    });

    it("Should reject invalid collector address", async function () {
      await expect(
        feeCollector.setAuthorizedCollector(ethers.ZeroAddress, true)
      ).to.be.revertedWith("FeeCollector: Invalid collector address");
    });

    it("Should reject non-owner authorization", async function () {
      await expect(
        feeCollector.connect(collector1).setAuthorizedCollector(operationsWallet.address, true)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Emergency Controls", function () {
    it("Should pause and unpause contract", async function () {
      await feeCollector.emergencyPause();
      expect(await feeCollector.paused()).to.be.true;

      await expect(
        feeCollector.connect(collector1).collectFee(HUNDRED_ETN)
      ).to.be.revertedWith("Pausable: paused");

      await feeCollector.emergencyUnpause();
      expect(await feeCollector.paused()).to.be.false;

      // Should work after unpause
      await expect(
        feeCollector.connect(collector1).collectFee(ONE_ETN)
      ).to.not.be.reverted;
    });

    it("Should reject non-owner pause", async function () {
      await expect(
        feeCollector.connect(collector1).emergencyPause()
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should reject non-owner unpause", async function () {
      await feeCollector.emergencyPause();
      
      await expect(
        feeCollector.connect(collector1).emergencyUnpause()
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("View Functions", function () {
    beforeEach(async function () {
      await feeCollector.connect(collector1).collectFee(TEN_ETN);
    });

    it("Should return fee balance correctly", async function () {
      const feeBalance = await feeCollector.getFeeBalance();
      expect(feeBalance.totalCollected).to.equal(TEN_ETN);
      expect(feeBalance.operationsBalance).to.be.gt(0);
      expect(feeBalance.incentivesBalance).to.be.gt(0);
      expect(feeBalance.treasuryBalance).to.be.gt(0);
    });

    it("Should return wallet addresses correctly", async function () {
      const [ops, incentives, treasury] = await feeCollector.getWallets();
      expect(ops).to.equal(operationsWallet.address);
      expect(incentives).to.equal(incentivesWallet.address);
      expect(treasury).to.equal(treasuryWallet.address);
    });

    it("Should check collector authorization correctly", async function () {
      expect(await feeCollector.isAuthorizedCollector(collector1.address)).to.be.true;
      expect(await feeCollector.isAuthorizedCollector(operationsWallet.address)).to.be.false;
    });

    it("Should calculate distribution correctly", async function () {
      const testAmount = ethers.parseEther("1000");
      const [operations, incentives, treasury] = await feeCollector.calculateDistribution(testAmount);
      
      expect(operations).to.equal(ethers.parseEther("500")); // 50%
      expect(incentives).to.equal(ethers.parseEther("300")); // 30%
      expect(treasury).to.equal(ethers.parseEther("200")); // 20%
      expect(operations + incentives + treasury).to.equal(testAmount);
    });
  });

  describe("Receive ETN", function () {
    it("Should accept ETN transfers", async function () {
      const sendAmount = HUNDRED_ETN;
      const contractBalanceBefore = await ethers.provider.getBalance(await feeCollector.getAddress());

      await owner.sendTransaction({
        to: await feeCollector.getAddress(),
        value: sendAmount
      });

      const contractBalanceAfter = await ethers.provider.getBalance(await feeCollector.getAddress());
      expect(contractBalanceAfter - contractBalanceBefore).to.equal(sendAmount);
    });
  });

  describe("Gas Usage", function () {
    it("Should have reasonable gas costs for fee collection", async function () {
      const tx = await feeCollector.connect(collector1).collectFee(ONE_ETN);
      const receipt = await tx.wait();
      
      // Should use less than 150k gas for fee collection
      expect(receipt!.gasUsed).to.be.lt(150000);
    });

    it("Should have reasonable gas costs for distribution", async function () {
      await feeCollector.connect(collector1).collectFee(TEN_ETN);
      await feeCollector.updateDistributionThreshold(ethers.parseEther("1"));
      
      const tx = await feeCollector.distributeFees();
      const receipt = await tx.wait();
      
      // Should use less than 120k gas for distribution
      expect(receipt!.gasUsed).to.be.lt(120000);
    });
  });

  describe("Edge Cases", function () {
    it("Should handle very small amounts", async function () {
      const smallAmount = 1000; // 1000 wei
      await feeCollector.connect(collector1).collectFee(smallAmount);

      const feeBalance = await feeCollector.getFeeBalance();
      expect(feeBalance.totalCollected).to.equal(smallAmount);
    });

    it("Should handle exact distribution calculations", async function () {
      const amount = 9999; // Amount that doesn't divide evenly
      const [operations, incentives, treasury] = await feeCollector.calculateDistribution(amount);
      
      // Sum should equal original amount (no rounding errors)
      expect(operations + incentives + treasury).to.equal(amount);
    });

    it("Should handle multiple distributions in sequence", async function () {
      await feeCollector.updateDistributionThreshold(ethers.parseEther("1"));
      
      await feeCollector.connect(collector1).collectFee(TEN_ETN);
      await feeCollector.distributeFees();
      
      await feeCollector.connect(collector1).collectFee(TEN_ETN);
      await feeCollector.distributeFees();
      
      // Should work without issues
      const feeBalance = await feeCollector.getFeeBalance();
      expect(feeBalance.operationsBalance).to.equal(0);
    });
  });
}); 