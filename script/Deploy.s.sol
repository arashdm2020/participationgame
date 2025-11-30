// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console2} from "forge-std/Script.sol";
import {ParticipationGame} from "../src/ParticipationGame.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

/**
 * @title DeployParticipationGame
 * @notice Deployment script for ParticipationGame on Arbitrum
 * @dev Run with: forge script script/Deploy.s.sol --rpc-url $RPC_URL --broadcast --verify
 */
contract DeployParticipationGame is Script {
    // Arbitrum Sepolia VRF Configuration
    address constant ARBITRUM_SEPOLIA_VRF_COORDINATOR = 0x50d47e4142598E3411aA864e08a44284e471AC6f;
    bytes32 constant ARBITRUM_SEPOLIA_KEY_HASH = 0x027f94ff1465b3525f9fc03e9ff7d6d2c0953482246dd6ae07570c45d6631414;
    
    // Arbitrum Mainnet VRF Configuration (for reference)
    // address constant ARBITRUM_MAINNET_VRF_COORDINATOR = 0x41034678D6C633D8a95c75e1138A360a28bA15d1;
    // bytes32 constant ARBITRUM_MAINNET_KEY_HASH = 0x72d2b016bb5b62912afea355ebf33b91319f828738b111b723b78696b9847b63;

    function run() external {
        // Load environment variables
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address lusdToken = vm.envAddress("LUSD_TOKEN_ADDRESS");
        address platformFeeWallet = vm.envAddress("PLATFORM_FEE_WALLET");
        uint256 vrfSubIdRaw = vm.envUint("VRF_SUBSCRIPTION_ID");
        require(vrfSubIdRaw <= type(uint64).max, "VRF_SUBSCRIPTION_ID too large for uint64");
        uint64 vrfSubscriptionId = uint64(vrfSubIdRaw);
        
        // Get deployer address from private key
        address deployer = vm.addr(deployerPrivateKey);
        
        // Initial game cap (e.g., 10,000 LUSD)
        uint256 initialCap = 10_000e18;

        vm.startBroadcast(deployerPrivateKey);

        // Deploy implementation
        ParticipationGame implementation = new ParticipationGame(ARBITRUM_SEPOLIA_VRF_COORDINATOR);
        console2.log("Implementation deployed at:", address(implementation));

        // Prepare VRF config
        ParticipationGame.VRFConfig memory vrfConfig = ParticipationGame.VRFConfig({
            coordinator: ARBITRUM_SEPOLIA_VRF_COORDINATOR,
            subscriptionId: vrfSubscriptionId,
            callbackGasLimit: 500_000,
            keyHash: ARBITRUM_SEPOLIA_KEY_HASH,
            requestConfirmations: 3
        });

        // Prepare initialization data
        bytes memory initData = abi.encodeWithSelector(
            ParticipationGame.initialize.selector,
            initialCap,
            vrfConfig,
            lusdToken,
            platformFeeWallet,
            deployer // owner
        );

        // Deploy proxy
        ERC1967Proxy proxy = new ERC1967Proxy(address(implementation), initData);
        console2.log("Proxy deployed at:", address(proxy));

        // Set up operator (deployer as initial operator)
        ParticipationGame game = ParticipationGame(address(proxy));
        game.setOperator(deployer, true);
        console2.log("Deployer set as operator");

        vm.stopBroadcast();

        // Log deployment info
        console2.log("\n=== Deployment Summary ===");
        console2.log("Network: Arbitrum Sepolia");
        console2.log("Implementation:", address(implementation));
        console2.log("Proxy (use this):", address(proxy));
        console2.log("Owner:", deployer);
        console2.log("LUSD Token:", lusdToken);
        console2.log("Platform Fee Wallet:", platformFeeWallet);
        console2.log("Initial Cap:", initialCap / 1e18, "LUSD");
    }
}

/**
 * @title UpgradeParticipationGame
 * @notice Upgrade script for ParticipationGame
 */
contract UpgradeParticipationGame is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address proxyAddress = vm.envAddress("PROXY_ADDRESS");
        address vrfCoordinator = vm.envAddress("VRF_COORDINATOR_ADDRESS");

        vm.startBroadcast(deployerPrivateKey);

        // Deploy new implementation
        ParticipationGame newImplementation = new ParticipationGame(vrfCoordinator);
        console2.log("New implementation deployed at:", address(newImplementation));

        // Upgrade proxy
        ParticipationGame proxy = ParticipationGame(proxyAddress);
        proxy.upgradeToAndCall(address(newImplementation), "");
        console2.log("Proxy upgraded to new implementation");

        vm.stopBroadcast();
    }
}
