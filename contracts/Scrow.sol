// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.12;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract Escrow  is Initializable, OwnableUpgradeable, UUPSUpgradeable{
    enum State { AWAITING_PAYMENT, AWAITING_DELIVERY, COMPLETE }
    
    State public currState;
    
    address public buyer;
    address payable public seller;
    uint256 public itemPrice;
    
    modifier onlyBuyer() {
        require(msg.sender == buyer, "Only buyer can call this method");
        _;
    }
    function initalize(address  _buyer, address payable _seller, uint256 _itemPrice) public initializer {
       buyer = _buyer;
       seller = _seller;
       itemPrice = _itemPrice;
       __Ownable_init();
    }
    function deposit() onlyBuyer external payable {
        require(msg.value >= itemPrice,"Plase pay");
        require(currState == State.AWAITING_PAYMENT, "Already paid");
        currState = State.AWAITING_DELIVERY;
    }
    
    function confirmDelivery() onlyBuyer external {
        require(currState == State.AWAITING_DELIVERY, "Cannot confirm delivery");
        seller.transfer(address(this).balance);
        currState = State.COMPLETE;
    }

    
        function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyOwner
    {}


}