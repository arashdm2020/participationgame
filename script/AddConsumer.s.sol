// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console2} from "forge-std/Script.sol";

interface IVRFSubscriptionV2Plus {
    function addConsumer(uint256 subId, address consumer) external;
}

contract AddConsumer is Script {
    // Arbitrum Sepolia VRF Coordinator (v2.5)
    address constant VRF_COORDINATOR = 0x5CE8D5A2BC84beb22a398CCA51996F7930313D61;
    
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        uint256 subscriptionId = vm.envUint("VRF_SUBSCRIPTION_ID");
        address consumer = vm.envAddress("PROXY_ADDRESS");
        
        vm.startBroadcast(deployerPrivateKey);
        
        IVRFSubscriptionV2Plus(VRF_COORDINATOR).addConsumer(subscriptionId, consumer);
        console2.log("Consumer added:", consumer);
        console2.log("To subscription:", subscriptionId);
        
        vm.stopBroadcast();
    }
}
