// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console2} from "forge-std/Script.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockLUSD is ERC20 {
    constructor() ERC20("Mock LUSD", "mLUSD") {
        _mint(msg.sender, 1_000_000e18); // 1 million tokens
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

contract DeployMockLUSD is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        MockLUSD token = new MockLUSD();
        console2.log("MockLUSD deployed at:", address(token));
        
        vm.stopBroadcast();
    }
}
