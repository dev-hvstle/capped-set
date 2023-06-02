import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { testData } from "./data/testData";

describe("Capped Set", function () {
  async function deployCappedSetFixture() {
    const CappedSet = await ethers.getContractFactory("CappedSet");
    const cappedSet = await CappedSet.deploy(5);

    for (let index = 0; index < 4; index++) {
      await cappedSet.insert(testData[index].address, testData[index].amount);
    }

    return { cappedSet };
  }

  describe("Deployment", function () {
    it("Should have maxElements set to 5", async function () {
      const { cappedSet } = await loadFixture(deployCappedSetFixture);
      expect(await cappedSet.maxElements()).to.equal(5);
    });

    it("Should have inserted 4 addresses", async function () {
      const { cappedSet } = await loadFixture(deployCappedSetFixture);
      expect(await cappedSet.getElementLength()).to.equal(4);
    });
  });

  describe("Insert", function () {
    it("Should insert an address and return lowest value", async function () {
      const { cappedSet } = await loadFixture(deployCappedSetFixture);
      const pair = await cappedSet.callStatic.insert(
        testData[4].address,
        testData[4].amount
      );
      expect(Number(pair[1])).to.equal(10);
    });

    it("Should remove lowest value when inserting 6th address", async function () {
      const { cappedSet } = await loadFixture(deployCappedSetFixture);

      await cappedSet.insert(testData[4].address, testData[4].amount);

      const pair = await cappedSet.callStatic.insert(
        testData[5].address,
        testData[5].amount
      );
      expect(Number(pair[1])).to.equal(1);

      await cappedSet.insert(testData[5].address, testData[5].amount);

      const lowest = await cappedSet.getLowestValueElement();

      expect(await cappedSet.getElementLength()).to.equal(5);
      expect(Number(lowest[1])).to.equal(1);
    });
  });

  describe("Update", () => {
    it("Should update a pair", async () => {
      const { cappedSet } = await loadFixture(deployCappedSetFixture);
      await cappedSet.update(testData[0].address, testData[0].amount + 1);

      const pair = await cappedSet.element(0);
      expect(Number(pair[1])).to.equal(81);
    });
    it("Should revert when updating a pair that does not exist", async () => {
      const { cappedSet } = await loadFixture(deployCappedSetFixture);
      await expect(
        cappedSet.update(testData[5].address, testData[5].amount)
      ).to.be.revertedWith("Address not found");
    });
    it("Should return lowest value after updating a pair", async () => {
      const { cappedSet } = await loadFixture(deployCappedSetFixture);
      const pair = await cappedSet.callStatic.update(testData[0].address, 1);

      expect(Number(pair[1])).to.equal(1);
    });
  });

  describe("Remove", () => {
    it("Should remove the pair", async () => {
      const { cappedSet } = await loadFixture(deployCappedSetFixture);
      await cappedSet.remove(testData[0].address);
      expect(await cappedSet.getElementLength()).to.equal(3);
      // console.info(await cappedSet.getElements());
    });
    it("Should not remove anything if pair does not exist", async () => {
      const { cappedSet } = await loadFixture(deployCappedSetFixture);
      await cappedSet.remove(ethers.constants.AddressZero);
      expect(await cappedSet.getElementLength()).to.equal(4);
    });
    it("Should return lowest value after removing a pair", async () => {
      const { cappedSet } = await loadFixture(deployCappedSetFixture);
      const pair = await cappedSet.callStatic.remove(testData[1].address);
      expect(Number(pair[1])).to.equal(30);
    });
    it("Should return lowest value after trying to remove a pair that does not exist", async () => {
      const { cappedSet } = await loadFixture(deployCappedSetFixture);
      const pair = await cappedSet.callStatic.remove(
        ethers.constants.AddressZero
      );
      expect(Number(pair[1])).to.equal(10);
    });
  });

  describe("Get Value", () => {
    it("Should return pair value", async () => {
      const { cappedSet } = await loadFixture(deployCappedSetFixture);

      for (let index = 0; index < 4; index++) {
        const pair = await cappedSet.getValue(testData[index].address);
        expect(Number(pair)).to.equal(testData[index].amount);
      }
    });
  });
});
