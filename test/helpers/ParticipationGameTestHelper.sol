// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ParticipationGame} from "../../src/ParticipationGame.sol";

/**
 * @title ParticipationGameTestHelper
 * @notice Test helper that exposes internal VRF functions for testing
 */
contract ParticipationGameTestHelper is ParticipationGame {
    constructor() ParticipationGame() {}

    /**
     * @notice Expose rawFulfillRandomWords for testing
     * @dev This function should NEVER be deployed to production
     */
    function fulfillRandomWordsTest(uint256 requestId, uint256[] calldata randomWords) external {
        _fulfillRandomWords(requestId, randomWords);
    }
}
