// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockLUSD
 * @notice Mock LUSD token for testing on Arbitrum Sepolia
 * @dev این فقط برای تست است - در production از LUSD واقعی استفاده کنید
 */
contract MockLUSD is ERC20, Ownable {
    /**
     * @notice Constructor
     */
    constructor() ERC20("Liquity USD (Mock)", "LUSD") Ownable(msg.sender) {
        // Mint 1,000,000 LUSD به deployer
        _mint(msg.sender, 1_000_000 * 10**18);
    }

    /**
     * @notice Mint LUSD برای آدرس مشخص (فقط owner)
     * @param to آدرس گیرنده
     * @param amount مقدار (با 18 decimal)
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    /**
     * @notice Mint LUSD برای خودت (برای تست - هر کسی می‌تواند)
     * @param amount مقدار (با 18 decimal)
     */
    function faucet(uint256 amount) external {
        require(amount <= 10_000 * 10**18, "Maximum 10,000 LUSD per request");
        _mint(msg.sender, amount);
    }

    /**
     * @notice Burn LUSD
     * @param amount مقدار برای burn
     */
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}
