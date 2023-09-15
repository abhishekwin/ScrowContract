async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    console.log("Account balance:", (await deployer.getBalance()).toString());
  
    const Escrow = await ethers.getContractFactory("Escrow");
    const escrow = await upgrades.deployProxy(Escrow, []);
  
    await escrow.deployed();
  const address = await hre.upgrades.erc1967.getImplementationAddress(
    escrow.address
  );
  console.log("Proxy address: ", address);
  console.log("Implementation Escrow deployed at: ", escrow.address);

//   await hre.run("verify:verify", {
//     address: address,
//     contract: "contracts/Scrow.sol:Escrow",
//     constructorArguments: []
//   });

  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });