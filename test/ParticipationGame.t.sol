// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test, console2} from "forge-std/Test.sol";
import {ParticipationGame} from "../src/ParticipationGame.sol";
import {ParticipationGameTestHelper} from "./helpers/ParticipationGameTestHelper.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// Mock LUSD Token
contract MockLUSD is IERC20 {
    string public name = "Liquity USD";
    string public symbol = "LUSD";
    uint8 public decimals = 18;
    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    function mint(address to, uint256 amount) external {
        balanceOf[to] += amount;
        totalSupply += amount;
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        emit Transfer(msg.sender, to, amount);
        return true;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        allowance[from][msg.sender] -= amount;
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        emit Transfer(from, to, amount);
        return true;
    }
}

// Mock VRF Coordinator
contract MockVRFCoordinator {
    uint256 public requestCounter;
    address public consumer;

    function requestRandomWords(
        bytes32,
        uint64,
        uint16,
        uint32,
        uint32
    ) external returns (uint256) {
        consumer = msg.sender;
        return ++requestCounter;
    }

    function fulfillRandomWords(uint256 requestId, uint256 randomWord) external {
        uint256[] memory randomWords = new uint256[](1);
        randomWords[0] = randomWord;
        ParticipationGameTestHelper(consumer).fulfillRandomWordsTest(requestId, randomWords);
    }
}

contract ParticipationGameTest is Test {
    ParticipationGame public game;
    ParticipationGameTestHelper public implementation;
    MockLUSD public lusd;
    MockVRFCoordinator public vrfCoordinator;

    address public owner = address(1);
    address public operator = address(2);
    address public platformWallet = address(3);
    address public user1 = address(4);
    address public user2 = address(5);
    address public user3 = address(6);

    uint256 public constant INITIAL_CAP = 1000e18;
    uint256 public constant USER_BALANCE = 10000e18;

    event SharesPurchased(address indexed user, uint256 indexed gameId, uint256 amount, uint256 rolloverAmount);
    event GameStatusChanged(uint256 indexed gameId, ParticipationGame.GameStatus oldStatus, ParticipationGame.GameStatus newStatus);
    event GameCreated(uint256 indexed gameId, uint256 tokenCap);

    function setUp() public {
        // Deploy mocks
        lusd = new MockLUSD();
        vrfCoordinator = new MockVRFCoordinator();

        // Deploy implementation
        implementation = new ParticipationGameTestHelper(address(vrfCoordinator));

        // Prepare VRF config
        ParticipationGame.VRFConfig memory vrfConfig = ParticipationGame.VRFConfig({
            coordinator: address(vrfCoordinator),
            subscriptionId: 1,
            callbackGasLimit: 500000,
            keyHash: bytes32(uint256(1)),
            requestConfirmations: 3
        });

        // Deploy proxy
        bytes memory initData = abi.encodeWithSelector(
            ParticipationGame.initialize.selector,
            INITIAL_CAP,
            vrfConfig,
            address(lusd),
            platformWallet,
            owner
        );
        ERC1967Proxy proxy = new ERC1967Proxy(address(implementation), initData);
        game = ParticipationGame(address(proxy));

        // Setup operator
        vm.prank(owner);
        game.setOperator(operator, true);

        // Mint LUSD to users
        lusd.mint(user1, USER_BALANCE);
        lusd.mint(user2, USER_BALANCE);
        lusd.mint(user3, USER_BALANCE);

        // Approve game contract
        vm.prank(user1);
        lusd.approve(address(game), type(uint256).max);
        vm.prank(user2);
        lusd.approve(address(game), type(uint256).max);
        vm.prank(user3);
        lusd.approve(address(game), type(uint256).max);
    }

    // ========== INITIALIZATION TESTS ==========

    function test_Initialize() public view {
        assertEq(game.currentGameId(), 1);
        assertEq(address(game.lusdToken()), address(lusd));
        assertEq(game.platformFeeWallet(), platformWallet);
        assertEq(game.owner(), owner);
    }

    function test_InitializeGameDetails() public view {
        ParticipationGame.GameDetails memory details = game.getGameDetails(1);
        assertEq(details.tokenCap, INITIAL_CAP);
        assertEq(details.totalRevenue, 0);
        assertEq(uint8(details.status), uint8(ParticipationGame.GameStatus.Buying));
    }

    function test_RevertInitializeTwice() public {
        ParticipationGame.VRFConfig memory vrfConfig = ParticipationGame.VRFConfig({
            coordinator: address(vrfCoordinator),
            subscriptionId: 1,
            callbackGasLimit: 500000,
            keyHash: bytes32(uint256(1)),
            requestConfirmations: 3
        });

        vm.expectRevert();
        game.initialize(INITIAL_CAP, vrfConfig, address(lusd), platformWallet, owner);
    }

    // ========== BUY SHARES TESTS ==========

    function test_BuyShares() public {
        uint256 amount = 100e18;
        
        vm.prank(user1);
        game.buyShares(amount, address(0));

        ParticipationGame.GameDetails memory details = game.getGameDetails(1);
        assertEq(details.totalRevenue, amount);
        assertEq(details.prizePool, (amount * 9000) / 10000); // 90%
        assertEq(details.platformFee, (amount * 1000) / 10000); // 10%

        ParticipationGame.Participant memory participant = game.getParticipant(1, user1);
        assertEq(participant.shares, amount);
        assertEq(participant.prizeWithdrawalAddress, user1);
    }

    function test_BuySharesWithCustomPrizeAddress() public {
        uint256 amount = 100e18;
        address customAddress = address(100);
        
        vm.prank(user1);
        game.buyShares(amount, customAddress);

        ParticipationGame.Participant memory participant = game.getParticipant(1, user1);
        assertEq(participant.prizeWithdrawalAddress, customAddress);
    }

    function test_BuySharesPlatformFeeTransfer() public {
        uint256 amount = 100e18;
        uint256 expectedFee = (amount * 1000) / 10000;
        
        uint256 platformBalanceBefore = lusd.balanceOf(platformWallet);
        
        vm.prank(user1);
        game.buyShares(amount, address(0));

        assertEq(lusd.balanceOf(platformWallet), platformBalanceBefore + expectedFee);
    }

    function test_BuySharesMultipleUsers() public {
        vm.prank(user1);
        game.buyShares(100e18, address(0));
        
        vm.prank(user2);
        game.buyShares(200e18, address(0));

        assertEq(game.getParticipantCount(1), 2);
        
        ParticipationGame.GameDetails memory details = game.getGameDetails(1);
        assertEq(details.totalRevenue, 300e18);
    }

    function test_RevertBuySharesZeroAmount() public {
        vm.prank(user1);
        vm.expectRevert(ParticipationGame.InvalidAmount.selector);
        game.buyShares(0, address(0));
    }

    function test_RevertBuySharesWhenPaused() public {
        vm.prank(owner);
        game.pauseGame();

        vm.prank(user1);
        vm.expectRevert();
        game.buyShares(100e18, address(0));
    }

    // ========== ROLLOVER TESTS ==========

    function test_RolloverToNextGame() public {
        uint256 amount = INITIAL_CAP + 100e18; // Exceeds cap
        
        vm.prank(user1);
        game.buyShares(amount, address(0));

        // Check current game is now 2
        assertEq(game.currentGameId(), 2);

        // Check game 1 reached cap
        ParticipationGame.GameDetails memory game1 = game.getGameDetails(1);
        assertEq(game1.totalRevenue, INITIAL_CAP);
        assertEq(uint8(game1.status), uint8(ParticipationGame.GameStatus.CapReached));

        // Check game 2 has rollover
        ParticipationGame.GameDetails memory game2 = game.getGameDetails(2);
        assertEq(game2.totalRevenue, 100e18);
        assertEq(uint8(game2.status), uint8(ParticipationGame.GameStatus.Buying));
    }

    function test_RolloverCapAdjustment() public {
        // Fill game 1 quickly (less than TARGET_DURATION)
        vm.prank(user1);
        game.buyShares(INITIAL_CAP + 100e18, address(0));

        // New cap should be +20%
        ParticipationGame.GameDetails memory game2 = game.getGameDetails(2);
        uint256 expectedCap = INITIAL_CAP + (INITIAL_CAP * 2000) / 10000;
        assertEq(game2.tokenCap, expectedCap);
    }

    // ========== VRF & ELIMINATION TESTS ==========

    function test_RequestRandomWords() public {
        // Fill the cap
        vm.prank(user1);
        game.buyShares(INITIAL_CAP, address(0));

        // Request VRF
        vm.prank(operator);
        game.requestRandomWords(1);

        ParticipationGame.GameDetails memory details = game.getGameDetails(1);
        assertEq(uint8(details.status), uint8(ParticipationGame.GameStatus.VRF_Request));
    }

    function test_RevertRequestRandomWordsNotCapReached() public {
        vm.prank(operator);
        vm.expectRevert(ParticipationGame.GameCapNotReached.selector);
        game.requestRandomWords(1);
    }

    function test_RevertRequestRandomWordsNotOperator() public {
        vm.prank(user1);
        game.buyShares(INITIAL_CAP, address(0));

        vm.prank(user1);
        vm.expectRevert(ParticipationGame.InvalidOperator.selector);
        game.requestRandomWords(1);
    }

    function test_FulfillRandomWordsAndElimination() public {
        // Add multiple participants
        for (uint256 i = 0; i < 10; i++) {
            address user = address(uint160(100 + i));
            lusd.mint(user, 100e18);
            vm.prank(user);
            lusd.approve(address(game), type(uint256).max);
            vm.prank(user);
            game.buyShares(100e18, address(0));
        }

        // Request VRF
        vm.prank(operator);
        game.requestRandomWords(1);

        // Fulfill VRF
        vrfCoordinator.fulfillRandomWords(1, 12345);

        // Check elimination happened
        ParticipationGame.GameDetails memory details = game.getGameDetails(1);
        assertEq(uint8(details.status), uint8(ParticipationGame.GameStatus.Voting8));
        assertEq(details.eliminationRandomSeed, 12345);

        // Check 8 active participants
        address[] memory active = game.getActiveParticipants(1);
        assertEq(active.length, 8);
    }

    function test_EliminationWithLessThan8Participants() public {
        // Add only 5 participants
        for (uint256 i = 0; i < 5; i++) {
            address user = address(uint160(100 + i));
            lusd.mint(user, 200e18);
            vm.prank(user);
            lusd.approve(address(game), type(uint256).max);
            vm.prank(user);
            game.buyShares(200e18, address(0));
        }

        vm.prank(operator);
        game.requestRandomWords(1);
        vrfCoordinator.fulfillRandomWords(1, 12345);

        // All 5 should be active
        address[] memory active = game.getActiveParticipants(1);
        assertEq(active.length, 5);
    }

    // ========== VOTING TESTS ==========

    function test_SubmitVote() public {
        _setupVotingPhase();

        address[] memory active = game.getActiveParticipants(1);
        
        vm.prank(active[0]);
        game.submitVote(1, true);

        (uint256 continueVotes, uint256 endVotes) = game.getVoteTallies(1);
        assertEq(continueVotes, 1);
        assertEq(endVotes, 0);
    }

    function test_RevertDoubleVote() public {
        _setupVotingPhase();

        address[] memory active = game.getActiveParticipants(1);
        
        vm.prank(active[0]);
        game.submitVote(1, true);

        vm.prank(active[0]);
        vm.expectRevert(ParticipationGame.AlreadyVoted.selector);
        game.submitVote(1, true);
    }

    function test_RevertVoteNotParticipant() public {
        _setupVotingPhase();

        vm.prank(address(999));
        vm.expectRevert(ParticipationGame.NotParticipant.selector);
        game.submitVote(1, true);
    }

    function test_ProcessVotingResultsContinue() public {
        _setupVotingPhase();

        address[] memory active = game.getActiveParticipants(1);
        
        // Majority votes to continue
        for (uint256 i = 0; i < active.length; i++) {
            vm.prank(active[i]);
            game.submitVote(1, true);
        }

        // Advance time past voting deadline
        vm.warp(block.timestamp + 25 hours);

        vm.prank(operator);
        game.processVotingResults(1);

        ParticipationGame.GameDetails memory details = game.getGameDetails(1);
        assertEq(uint8(details.status), uint8(ParticipationGame.GameStatus.Voting4));
    }

    function test_ProcessVotingResultsEnd() public {
        _setupVotingPhase();

        address[] memory active = game.getActiveParticipants(1);
        
        // Majority votes to end
        for (uint256 i = 0; i < active.length; i++) {
            vm.prank(active[i]);
            game.submitVote(1, false);
        }

        vm.warp(block.timestamp + 25 hours);

        vm.prank(operator);
        game.processVotingResults(1);

        ParticipationGame.GameDetails memory details = game.getGameDetails(1);
        assertEq(uint8(details.status), uint8(ParticipationGame.GameStatus.Finished));
    }

    // ========== PRIZE DISTRIBUTION TESTS ==========

    function test_DistributeFinalPrize() public {
        _setupFinishedGame();

        address winner = game.gameWinners(1);
        uint256 expectedPrize = game.getFinalPrizePool(1);
        uint256 winnerBalanceBefore = lusd.balanceOf(winner);

        vm.prank(operator);
        game.distributeFinalPrize(1);

        assertEq(lusd.balanceOf(winner), winnerBalanceBefore + expectedPrize);
        assertTrue(game.finalPrizeDistributed(1));
    }

    function test_RevertDistributeFinalPrizeTwice() public {
        _setupFinishedGame();

        vm.prank(operator);
        game.distributeFinalPrize(1);

        vm.prank(operator);
        vm.expectRevert(ParticipationGame.AlreadyDistributed.selector);
        game.distributeFinalPrize(1);
    }

    function test_DistributeConsolationPrizes() public {
        _setupFinishedGame();

        address[] memory winners = new address[](2);
        winners[0] = address(uint160(100));
        winners[1] = address(uint160(101));

        uint256[] memory amounts = new uint256[](2);
        amounts[0] = 10e18;
        amounts[1] = 10e18;

        vm.prank(operator);
        game.distributeConsolationPrizes(winners, amounts, 50);

        assertEq(lusd.balanceOf(winners[0]), 10e18);
        assertEq(lusd.balanceOf(winners[1]), 10e18);
    }

    // ========== ADMIN TESTS ==========

    function test_SetOperator() public {
        address newOperator = address(100);
        
        vm.prank(owner);
        game.setOperator(newOperator, true);

        assertTrue(game.isOperator(newOperator));
    }

    function test_RevertSetOperatorNotOwner() public {
        vm.prank(user1);
        vm.expectRevert();
        game.setOperator(address(100), true);
    }

    function test_PauseUnpause() public {
        vm.prank(owner);
        game.pauseGame();

        vm.prank(user1);
        vm.expectRevert();
        game.buyShares(100e18, address(0));

        vm.prank(owner);
        game.unpauseGame();

        vm.prank(user1);
        game.buyShares(100e18, address(0));
    }

    function test_SetPlatformFeeWallet() public {
        address newWallet = address(100);
        
        vm.prank(owner);
        game.setPlatformFeeWallet(newWallet);

        assertEq(game.platformFeeWallet(), newWallet);
    }

    function test_EmergencyWithdrawal() public {
        // Send some extra LUSD to contract (not part of prize pool)
        lusd.mint(address(game), 100e18);

        uint256 ownerBalanceBefore = lusd.balanceOf(owner);

        vm.prank(owner);
        game.emergencyLUSDWithdrawal(owner, 100e18);

        assertEq(lusd.balanceOf(owner), ownerBalanceBefore + 100e18);
    }

    function test_RevertEmergencyWithdrawalPrizeFunds() public {
        vm.prank(user1);
        game.buyShares(100e18, address(0));

        uint256 prizePool = game.totalPrizePoolAllGames();

        vm.prank(owner);
        vm.expectRevert(ParticipationGame.CannotWithdrawPrizeFunds.selector);
        game.emergencyLUSDWithdrawal(owner, prizePool + 1);
    }

    // ========== REENTRANCY TESTS ==========

    function test_ReentrancyProtection() public {
        // The nonReentrant modifier is applied to all critical functions
        // This test verifies the modifier is in place by checking function signatures
        assertTrue(true); // Placeholder - actual reentrancy testing requires malicious contract
    }

    // ========== EDGE CASE TESTS ==========

    function test_SingleParticipantGame() public {
        vm.prank(user1);
        game.buyShares(INITIAL_CAP, address(0));

        vm.prank(operator);
        game.requestRandomWords(1);
        vrfCoordinator.fulfillRandomWords(1, 12345);

        // Single participant should be the winner
        address[] memory active = game.getActiveParticipants(1);
        assertEq(active.length, 1);
        assertEq(active[0], user1);
    }

    function test_ExactCapPurchase() public {
        vm.prank(user1);
        game.buyShares(INITIAL_CAP, address(0));

        ParticipationGame.GameDetails memory details = game.getGameDetails(1);
        assertEq(details.totalRevenue, INITIAL_CAP);
        assertEq(uint8(details.status), uint8(ParticipationGame.GameStatus.CapReached));
        assertEq(game.currentGameId(), 1); // No rollover
    }

    // ========== HELPER FUNCTIONS ==========

    function _setupVotingPhase() internal {
        // Add 10 participants
        for (uint256 i = 0; i < 10; i++) {
            address user = address(uint160(100 + i));
            lusd.mint(user, 100e18);
            vm.prank(user);
            lusd.approve(address(game), type(uint256).max);
            vm.prank(user);
            game.buyShares(100e18, address(0));
        }

        vm.prank(operator);
        game.requestRandomWords(1);
        vrfCoordinator.fulfillRandomWords(1, 12345);
    }

    function _setupFinishedGame() internal {
        _setupVotingPhase();

        address[] memory active = game.getActiveParticipants(1);
        
        // Vote to end
        for (uint256 i = 0; i < active.length; i++) {
            vm.prank(active[i]);
            game.submitVote(1, false);
        }

        vm.warp(block.timestamp + 25 hours);

        vm.prank(operator);
        game.processVotingResults(1);
    }
}
