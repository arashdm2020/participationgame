// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console2} from "forge-std/Script.sol";
import {ParticipationGame} from "../src/ParticipationGame.sol";

contract UpdateVRFConfig is Script {
    // Arbitrum Sepolia VRF Configuration (v2.5)
    address constant VRF_COORDINATOR = 0x5CE8D5A2BC84beb22a398CCA51996F7930313D61;
    bytes32 constant KEY_HASH = 0x1770bdc7eec7771f7ba4ffd640f34260d7f095b79c92d34a5b2551d6f6cfd2be;
    
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address proxyAddress = vm.envAddress("PROXY_ADDRESS");
        uint256 subscriptionId = vm.envUint("VRF_SUBSCRIPTION_ID");
        
        vm.startBroadcast(deployerPrivateKey);
        
        ParticipationGame game = ParticipationGame(proxyAddress);
        
        ParticipationGame.VRFConfig memory newConfig = ParticipationGame.VRFConfig({
            coordinator: VRF_COORDINATOR,
            subscriptionId: subscriptionId,
            callbackGasLimit: 500_000,
            keyHash: KEY_HASH,
            requestConfirmations: 3
        });
        
        game.updateVRFConfig(newConfig);
        console2.log("VRF Config updated!");
        console2.log("Coordinator:", VRF_COORDINATOR);
        console2.log("Subscription ID:", subscriptionId);
        
        vm.stopBroadcast();
    }
}
