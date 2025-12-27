// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console2} from "forge-std/Script.sol";

interface IMockLUSD {
    function mint(address to, uint256 amount) external;
    function balanceOf(address account) external view returns (uint256);
}

contract MintMockLUSD is Script {
    address constant MOCK_LUSD = 0xCc4Ad4856222044Af187E7275820BC4367A0FDdF;
    
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address recipient = vm.addr(deployerPrivateKey);
        uint256 amount = 100_000e18; // 100,000 mLUSD
        
        vm.startBroadcast(deployerPrivateKey);
        
        IMockLUSD(MOCK_LUSD).mint(recipient, amount);
        
        uint256 balance = IMockLUSD(MOCK_LUSD).balanceOf(recipient);
        console2.log("Minted to:", recipient);
        console2.log("Amount:", amount / 1e18, "mLUSD");
        console2.log("New balance:", balance / 1e18, "mLUSD");
        
        vm.stopBroadcast();
    }
}
