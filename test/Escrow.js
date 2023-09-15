const { expect } = require("chai");
const { ethers, web3 } = require("hardhat");
const { upgrades } = require("hardhat");
require("@nomiclabs/hardhat-web3");

describe("Escrow testing", async () => {
  before(async () => {
    accounts = await ethers.getSigners();
    [seller, buyer, add1, add2, add3, _] = accounts;

    Escrow = await hre.ethers.getContractFactory("Escrow");
    escrow = await upgrades.deployProxy(Escrow, []);
    await escrow.deployed();
    console.log("Escrow contract deployed at: ", escrow.address);
  });

  describe("Now create a Escrow", () => {
    it("Should Buy", async () => {
      await escrow.initalize(
        buyer.address,
        seller.address,
        ethers.utils.parseEther("1")
      );
      let OLDStatus = await escrow.currState();
      console.log("ITEMSTATUS", OLDStatus);
      await escrow
        .connect(buyer)
        .deposit({ value: ethers.utils.parseEther("1"), from: buyer.address });
      let Balance = await escrow.provider.getBalance(escrow.address);

      console.log("ESCROW BALANCE", Balance);
      let BuyerBalance = await escrow.provider.getBalance(buyer.address);
      console.log("BUYERBAL", BuyerBalance);
     expect(await escrow.currState()).to.be.equal(1);
      console.log("ITEMSTATUS",await escrow.currState());
      let SellerOldBalance = await escrow.provider.getBalance(seller.address);
      console.log("SellerOldBalance", SellerOldBalance);
      await escrow.connect(buyer).confirmDelivery()
      let SellerNewBalance = await escrow.provider.getBalance(seller.address);
      console.log("SellerNewBalance", SellerNewBalance);
      expect(await escrow.currState()).to.be.equal(2);
      console.log("ITEMSTATUS",await escrow.currState());
    });
  });
});
