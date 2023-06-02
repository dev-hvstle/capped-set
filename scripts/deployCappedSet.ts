import { ethers, run } from "hardhat";

async function main() {
  const CappedSet = await ethers.getContractFactory("CappedSet");
  const cappedSet = await CappedSet.deploy(5);

  console.info("\nDeploying capped set...");
  await cappedSet.deployed();
  console.info("Capped set deployed to:", cappedSet.address);

  console.info("\nverifying contract...");
  await run("verify:verify", {
    address: cappedSet.address,
    constructorArguments: [5],
  });
  console.info("Done!");
}

main();
