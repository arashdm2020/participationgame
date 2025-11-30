// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {VRFConsumerBaseV2} from "@chainlink/v0.8/vrf/VRFConsumerBaseV2.sol";
import {VRFCoordinatorV2Interface} from "@chainlink/v0.8/vrf/interfaces/VRFCoordinatorV2Interface.sol";

/**
 * @title ParticipationGame
 * @notice Trustless decentralized lottery on Arbitrum using LUSD
 * @dev UUPS upgradeable with Chainlink VRF v2. 10% fee / 90% prize (85% final, 5% consolation)
 */
contract ParticipationGame is 
    Initializable, UUPSUpgradeable, OwnableUpgradeable, 
    PausableUpgradeable, ReentrancyGuard, VRFConsumerBaseV2
{
    using SafeERC20 for IERC20;

    // ========== ENUMS & ERRORS ==========
    enum GameStatus { Buying, CapReached, VRF_Request, Eliminating, Voting8, Voting4, Voting2, Finished }

    error InsufficientLUSD();
    error GameNotActive();
    error AlreadyVoted();
    error InvalidPhase();
    error InvalidOperator();
    error GameCapNotReached();
    error InvalidAmount();
    error ZeroAddress();
    error InvalidArrayLength();
    error NotParticipant();
    error VotingDeadlinePassed();
    error VotingStillActive();
    error InvalidRequestId();
    error CannotWithdrawPrizeFunds();
    error InvalidCap();
    error BatchSizeExceeded();
    error NoParticipantsToEliminate();
    error InsufficientPrizePool();
    error AlreadyDistributed();

    // ========== STRUCTS ==========
    struct Participant {
        uint256 shares;
        address prizeWithdrawalAddress;
        bool defaultVote;
        bool hasVotedInCurrentStage;
    }

    struct GameDetails {
        uint256 tokenCap;
        uint256 totalRevenue;
        uint256 prizePool;
        uint256 platformFee;
        uint256 eliminationRandomSeed;
        uint128 startTime;
        uint128 endTime;
        uint128 votingDeadline;
        GameStatus status;
    }

    struct VRFConfig {
        address coordinator;
        uint64 subscriptionId;
        uint32 callbackGasLimit;
        bytes32 keyHash;
        uint16 requestConfirmations;
    }

    // ========== CONSTANTS ==========
    uint256 public constant BASIS_POINTS = 10000;
    uint256 public constant PLATFORM_FEE_BPS = 1000;
    uint256 public constant PRIZE_POOL_BPS = 9000;
    uint256 public constant FINAL_PRIZE_BPS = 8500;
    uint256 public constant CONSOLATION_PRIZE_BPS = 500;
    uint256 public constant CAP_ADJUSTMENT_BPS = 2000;
    uint256 public constant TARGET_DURATION = 7 days;
    uint256 public constant VOTING_PERIOD = 24 hours;
    uint256 public constant MAX_BATCH_SIZE = 50;
    uint256 public constant MIN_CAP = 100e18;

    // ========== STATE ==========
    IERC20 public lusdToken;
    address public platformFeeWallet;
    uint256 public currentGameId;
    VRFConfig public vrfConfig;
    uint256 public totalPrizePoolAllGames;

    mapping(uint256 => GameDetails) public games;
    mapping(uint256 => mapping(address => Participant)) public gameParticipants;
    mapping(uint256 => uint256) public requestIdToGame;
    mapping(address => bool) public isOperator;
    mapping(uint256 => mapping(bool => uint256)) public voteTallies;
    mapping(uint256 => address[]) public gameParticipantList;
    mapping(uint256 => address[]) public activeParticipants;
    mapping(uint256 => address) public gameWinners;
    mapping(uint256 => bool) public consolationPrizesDistributed;
    mapping(uint256 => bool) public finalPrizeDistributed;
    mapping(uint256 => uint256) public consolationDistributedAmount;

    uint256[40] private __gap;

    // ========== EVENTS ==========
    event SharesPurchased(address indexed user, uint256 indexed gameId, uint256 amount, uint256 rolloverAmount);
    event GameStatusChanged(uint256 indexed gameId, GameStatus oldStatus, GameStatus newStatus);
    event PrizeDistributed(address indexed winner, uint256 indexed gameId, uint256 amount, string prizeType);
    event CapAdjusted(uint256 indexed gameId, uint256 oldCap, uint256 newCap);
    event VoteCast(address indexed voter, uint256 indexed gameId, bool decision, uint8 stage);
    event RandomnessRequested(uint256 indexed gameId, uint256 requestId);
    event RandomnessFulfilled(uint256 indexed gameId, uint256 randomSeed);
    event EliminationPerformed(uint256 indexed gameId, uint256 remainingParticipants);
    event OperatorUpdated(address indexed operator, bool isAuthorized);
    event PlatformFeeWalletUpdated(address indexed oldWallet, address indexed newWallet);
    event ConsolationBatchDistributed(uint256 indexed gameId, uint256 batchIndex, uint256 recipientCount, uint256 totalAmount);
    event GameCreated(uint256 indexed gameId, uint256 tokenCap);

    // ========== MODIFIERS ==========
    modifier onlyOperator() {
        if (!isOperator[msg.sender]) revert InvalidOperator();
        _;
    }

    // ========== CONSTRUCTOR & INIT ==========
    constructor(address _vrfCoordinator) VRFConsumerBaseV2(_vrfCoordinator) {
        _disableInitializers();
    }

    function initialize(
        uint256 initialCap,
        VRFConfig calldata _vrfConfig,
        address _lusdTokenAddress,
        address _platformFeeWallet,
        address _owner
    ) external initializer {
        if (_lusdTokenAddress == address(0)) revert ZeroAddress();
        if (_platformFeeWallet == address(0)) revert ZeroAddress();
        if (_owner == address(0)) revert ZeroAddress();
        if (_vrfConfig.coordinator == address(0)) revert ZeroAddress();
        if (initialCap < MIN_CAP) revert InvalidCap();

        __Ownable_init(_owner);
        __Pausable_init();
        // ReentrancyGuard is now stateless in OZ v5, no init needed
        // UUPSUpgradeable no longer has init in OZ v5

        lusdToken = IERC20(_lusdTokenAddress);
        platformFeeWallet = _platformFeeWallet;
        vrfConfig = _vrfConfig;
        currentGameId = 1;

        games[1] = GameDetails({
            tokenCap: initialCap,
            totalRevenue: 0,
            prizePool: 0,
            platformFee: 0,
            eliminationRandomSeed: 0,
            startTime: uint128(block.timestamp),
            endTime: 0,
            votingDeadline: 0,
            status: GameStatus.Buying
        });

        emit GameCreated(1, initialCap);
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    // ========== CORE GAME FUNCTIONS ==========

    /**
     * @notice Purchase shares in the current game
     * @param amount LUSD amount to spend
     * @param optionalPrizeAddress Custom prize withdrawal address (address(0) = msg.sender)
     */
    function buyShares(uint256 amount, address optionalPrizeAddress) external nonReentrant whenNotPaused {
        if (amount == 0) revert InvalidAmount();
        
        uint256 gameId = currentGameId;
        GameDetails storage game = games[gameId];
        if (game.status != GameStatus.Buying) revert GameNotActive();

        address prizeAddress = optionalPrizeAddress == address(0) ? msg.sender : optionalPrizeAddress;
        uint256 remainingCap = game.tokenCap - game.totalRevenue;
        uint256 purchaseAmount;
        uint256 rolloverAmount;

        if (amount <= remainingCap) {
            purchaseAmount = amount;
        } else {
            purchaseAmount = remainingCap;
            rolloverAmount = amount - remainingCap;
        }

        // Transfer LUSD from user
        lusdToken.safeTransferFrom(msg.sender, address(this), amount);

        // Process purchase for current game
        if (purchaseAmount > 0) {
            _processPurchase(gameId, purchaseAmount, prizeAddress);
        }

        // Check if cap is reached
        if (game.totalRevenue >= game.tokenCap) {
            _transitionToCapReached(gameId);
        }

        // Handle rollover to next game
        if (rolloverAmount > 0) {
            _handleRollover(rolloverAmount, prizeAddress);
        }

        emit SharesPurchased(msg.sender, gameId, purchaseAmount, rolloverAmount);
    }

    function _processPurchase(uint256 gameId, uint256 amount, address prizeAddress) internal {
        GameDetails storage game = games[gameId];
        
        uint256 platformFeeAmount = (amount * PLATFORM_FEE_BPS) / BASIS_POINTS;
        uint256 prizePoolAmount = amount - platformFeeAmount;

        // Effects
        game.totalRevenue += amount;
        game.platformFee += platformFeeAmount;
        game.prizePool += prizePoolAmount;
        totalPrizePoolAllGames += prizePoolAmount;

        Participant storage participant = gameParticipants[gameId][msg.sender];
        if (participant.shares == 0) {
            gameParticipantList[gameId].push(msg.sender);
            participant.prizeWithdrawalAddress = prizeAddress;
        }
        participant.shares += amount;

        // Interactions - transfer platform fee immediately
        lusdToken.safeTransfer(platformFeeWallet, platformFeeAmount);
    }

    function _handleRollover(uint256 rolloverAmount, address prizeAddress) internal {
        uint256 newGameId = currentGameId + 1;
        currentGameId = newGameId;
        
        uint256 newCap = _calculateNextGameCap(newGameId - 1);
        
        games[newGameId] = GameDetails({
            tokenCap: newCap,
            totalRevenue: 0,
            prizePool: 0,
            platformFee: 0,
            eliminationRandomSeed: 0,
            startTime: uint128(block.timestamp),
            endTime: 0,
            votingDeadline: 0,
            status: GameStatus.Buying
        });

        emit GameCreated(newGameId, newCap);
        _processPurchase(newGameId, rolloverAmount, prizeAddress);
        emit SharesPurchased(msg.sender, newGameId, rolloverAmount, 0);
    }

    function _transitionToCapReached(uint256 gameId) internal {
        GameDetails storage game = games[gameId];
        GameStatus oldStatus = game.status;
        game.status = GameStatus.CapReached;
        game.endTime = uint128(block.timestamp);
        emit GameStatusChanged(gameId, oldStatus, GameStatus.CapReached);
    }

    function _calculateNextGameCap(uint256 previousGameId) internal view returns (uint256 newCap) {
        GameDetails storage prevGame = games[previousGameId];
        uint256 oldCap = prevGame.tokenCap;
        uint256 duration = prevGame.endTime - prevGame.startTime;
        uint256 adjustment = (oldCap * CAP_ADJUSTMENT_BPS) / BASIS_POINTS;
        
        if (duration < TARGET_DURATION) {
            newCap = oldCap + adjustment;
        } else {
            newCap = oldCap > adjustment ? oldCap - adjustment : MIN_CAP;
        }
        
        if (newCap < MIN_CAP) newCap = MIN_CAP;
    }

    // ========== VRF & ELIMINATION ==========

    function requestRandomWords(uint256 gameId) external onlyOperator nonReentrant {
        GameDetails storage game = games[gameId];
        if (game.status != GameStatus.CapReached) revert GameCapNotReached();

        GameStatus oldStatus = game.status;
        game.status = GameStatus.VRF_Request;

        uint256 requestId = VRFCoordinatorV2Interface(vrfConfig.coordinator).requestRandomWords(
            vrfConfig.keyHash,
            vrfConfig.subscriptionId,
            vrfConfig.requestConfirmations,
            vrfConfig.callbackGasLimit,
            1
        );

        requestIdToGame[requestId] = gameId;
        emit GameStatusChanged(gameId, oldStatus, GameStatus.VRF_Request);
        emit RandomnessRequested(gameId, requestId);
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
        uint256 gameId = requestIdToGame[requestId];
        if (gameId == 0) revert InvalidRequestId();

        GameDetails storage game = games[gameId];
        game.eliminationRandomSeed = randomWords[0];
        
        GameStatus oldStatus = game.status;
        game.status = GameStatus.Eliminating;

        emit RandomnessFulfilled(gameId, randomWords[0]);
        emit GameStatusChanged(gameId, oldStatus, GameStatus.Eliminating);
        
        _performElimination(gameId);
    }

    function _performElimination(uint256 gameId) internal {
        GameDetails storage game = games[gameId];
        address[] storage participants = gameParticipantList[gameId];
        uint256 participantCount = participants.length;

        if (participantCount == 0) revert NoParticipantsToEliminate();

        if (participantCount <= 8) {
            for (uint256 i = 0; i < participantCount; i++) {
                activeParticipants[gameId].push(participants[i]);
            }
        } else {
            // Fisher-Yates shuffle to select 8 random participants
            uint256 seed = game.eliminationRandomSeed;
            address[] memory shuffled = new address[](participantCount);
            
            for (uint256 i = 0; i < participantCount; i++) {
                shuffled[i] = participants[i];
            }

            for (uint256 i = 0; i < 8; i++) {
                uint256 remaining = participantCount - i;
                uint256 randomIndex = i + (uint256(keccak256(abi.encodePacked(seed, i))) % remaining);
                
                (shuffled[i], shuffled[randomIndex]) = (shuffled[randomIndex], shuffled[i]);
                activeParticipants[gameId].push(shuffled[i]);
            }
        }

        GameStatus oldStatus = game.status;
        game.status = GameStatus.Voting8;
        game.votingDeadline = uint128(block.timestamp + VOTING_PERIOD);

        emit EliminationPerformed(gameId, activeParticipants[gameId].length);
        emit GameStatusChanged(gameId, oldStatus, GameStatus.Voting8);
    }

    // ========== VOTING ==========

    function submitVote(uint256 gameId, bool decision) external nonReentrant whenNotPaused {
        GameDetails storage game = games[gameId];
        
        if (game.status != GameStatus.Voting8 && 
            game.status != GameStatus.Voting4 && 
            game.status != GameStatus.Voting2) {
            revert InvalidPhase();
        }

        if (block.timestamp >= game.votingDeadline) revert VotingDeadlinePassed();
        if (!_isActiveParticipant(gameId, msg.sender)) revert NotParticipant();

        Participant storage participant = gameParticipants[gameId][msg.sender];
        if (participant.hasVotedInCurrentStage) revert AlreadyVoted();

        participant.hasVotedInCurrentStage = true;
        voteTallies[gameId][decision]++;

        uint8 stage = game.status == GameStatus.Voting8 ? 8 : (game.status == GameStatus.Voting4 ? 4 : 2);
        emit VoteCast(msg.sender, gameId, decision, stage);
    }

    function _isActiveParticipant(uint256 gameId, address user) internal view returns (bool) {
        address[] storage active = activeParticipants[gameId];
        for (uint256 i = 0; i < active.length; i++) {
            if (active[i] == user) return true;
        }
        return false;
    }

    function processVotingResults(uint256 gameId) external onlyOperator nonReentrant {
        GameDetails storage game = games[gameId];
        
        if (game.status != GameStatus.Voting8 && 
            game.status != GameStatus.Voting4 && 
            game.status != GameStatus.Voting2) {
            revert InvalidPhase();
        }

        if (block.timestamp < game.votingDeadline) revert VotingStillActive();

        uint256 continueVotes = voteTallies[gameId][true];
        uint256 endVotes = voteTallies[gameId][false];
        
        // Reset vote tallies for next stage
        voteTallies[gameId][true] = 0;
        voteTallies[gameId][false] = 0;

        // Reset voting flags for active participants
        address[] storage active = activeParticipants[gameId];
        for (uint256 i = 0; i < active.length; i++) {
            gameParticipants[gameId][active[i]].hasVotedInCurrentStage = false;
        }

        GameStatus oldStatus = game.status;

        if (endVotes > continueVotes || game.status == GameStatus.Voting2) {
            // End game - determine winner
            _determineWinner(gameId);
            game.status = GameStatus.Finished;
            emit GameStatusChanged(gameId, oldStatus, GameStatus.Finished);
        } else {
            // Continue - eliminate half
            _eliminateHalf(gameId);
            
            if (oldStatus == GameStatus.Voting8) {
                game.status = GameStatus.Voting4;
            } else {
                game.status = GameStatus.Voting2;
            }
            game.votingDeadline = uint128(block.timestamp + VOTING_PERIOD);
            emit GameStatusChanged(gameId, oldStatus, game.status);
        }
    }

    function _eliminateHalf(uint256 gameId) internal {
        GameDetails storage game = games[gameId];
        address[] storage active = activeParticipants[gameId];
        uint256 currentCount = active.length;
        uint256 targetCount = currentCount / 2;
        
        uint256 seed = uint256(keccak256(abi.encodePacked(game.eliminationRandomSeed, block.timestamp)));
        
        // Shuffle and keep first half
        for (uint256 i = 0; i < targetCount; i++) {
            uint256 remaining = currentCount - i;
            uint256 randomIndex = i + (uint256(keccak256(abi.encodePacked(seed, i))) % remaining);
            (active[i], active[randomIndex]) = (active[randomIndex], active[i]);
        }
        
        // Remove eliminated participants
        while (active.length > targetCount) {
            active.pop();
        }
    }

    function _determineWinner(uint256 gameId) internal {
        GameDetails storage game = games[gameId];
        address[] storage active = activeParticipants[gameId];
        
        if (active.length == 1) {
            gameWinners[gameId] = active[0];
        } else if (active.length > 1) {
            // Random selection among remaining
            uint256 seed = uint256(keccak256(abi.encodePacked(game.eliminationRandomSeed, block.timestamp, "winner")));
            uint256 winnerIndex = seed % active.length;
            gameWinners[gameId] = active[winnerIndex];
        }
    }

    // ========== PRIZE DISTRIBUTION ==========

    function distributeConsolationPrizes(
        address[] calldata winners,
        uint256[] calldata amounts,
        uint256 batchSize
    ) external onlyOperator nonReentrant {
        if (winners.length != amounts.length) revert InvalidArrayLength();
        if (batchSize > MAX_BATCH_SIZE) revert BatchSizeExceeded();
        
        uint256 gameId = currentGameId;
        GameDetails storage game = games[gameId];
        if (game.status != GameStatus.Finished) revert InvalidPhase();

        uint256 consolationPool = (game.prizePool * CONSOLATION_PRIZE_BPS) / BASIS_POINTS;
        uint256 totalToDistribute;
        
        for (uint256 i = 0; i < winners.length && i < batchSize; i++) {
            totalToDistribute += amounts[i];
        }

        if (consolationDistributedAmount[gameId] + totalToDistribute > consolationPool) {
            revert InsufficientPrizePool();
        }

        // Effects
        consolationDistributedAmount[gameId] += totalToDistribute;
        totalPrizePoolAllGames -= totalToDistribute;

        // Interactions
        for (uint256 i = 0; i < winners.length && i < batchSize; i++) {
            if (winners[i] != address(0) && amounts[i] > 0) {
                Participant storage p = gameParticipants[gameId][winners[i]];
                address recipient = p.prizeWithdrawalAddress != address(0) 
                    ? p.prizeWithdrawalAddress 
                    : winners[i];
                    
                lusdToken.safeTransfer(recipient, amounts[i]);
                emit PrizeDistributed(recipient, gameId, amounts[i], "consolation");
            }
        }

        emit ConsolationBatchDistributed(gameId, 0, winners.length, totalToDistribute);
        
        if (consolationDistributedAmount[gameId] >= consolationPool) {
            consolationPrizesDistributed[gameId] = true;
        }
    }

    function distributeFinalPrize(uint256 gameId) external onlyOperator nonReentrant {
        GameDetails storage game = games[gameId];
        if (game.status != GameStatus.Finished) revert InvalidPhase();
        if (finalPrizeDistributed[gameId]) revert AlreadyDistributed();

        address winner = gameWinners[gameId];
        if (winner == address(0)) revert ZeroAddress();

        uint256 finalPrizeAmount = (game.prizePool * FINAL_PRIZE_BPS) / BASIS_POINTS;
        
        // Effects
        finalPrizeDistributed[gameId] = true;
        totalPrizePoolAllGames -= finalPrizeAmount;

        // Get prize withdrawal address
        Participant storage p = gameParticipants[gameId][winner];
        address recipient = p.prizeWithdrawalAddress != address(0) 
            ? p.prizeWithdrawalAddress 
            : winner;

        // Interactions
        lusdToken.safeTransfer(recipient, finalPrizeAmount);
        emit PrizeDistributed(recipient, gameId, finalPrizeAmount, "final");

        // Adjust next game cap
        _adjustNextGameCap(gameId);
    }

    function _adjustNextGameCap(uint256 gameId) internal {
        uint256 nextGameId = gameId + 1;
        if (games[nextGameId].tokenCap > 0 && games[nextGameId].status == GameStatus.Buying) {
            uint256 oldCap = games[nextGameId].tokenCap;
            uint256 newCap = _calculateNextGameCap(gameId);
            games[nextGameId].tokenCap = newCap;
            emit CapAdjusted(nextGameId, oldCap, newCap);
        }
    }

    // ========== ADMIN FUNCTIONS ==========

    function setOperator(address operator, bool isAuthorized) external onlyOwner {
        if (operator == address(0)) revert ZeroAddress();
        isOperator[operator] = isAuthorized;
        emit OperatorUpdated(operator, isAuthorized);
    }

    function pauseGame() external onlyOwner {
        _pause();
    }

    function unpauseGame() external onlyOwner {
        _unpause();
    }

    function setPlatformFeeWallet(address newWallet) external onlyOwner {
        if (newWallet == address(0)) revert ZeroAddress();
        address oldWallet = platformFeeWallet;
        platformFeeWallet = newWallet;
        emit PlatformFeeWalletUpdated(oldWallet, newWallet);
    }

    function updateVRFConfig(VRFConfig calldata _vrfConfig) external onlyOwner {
        if (_vrfConfig.coordinator == address(0)) revert ZeroAddress();
        vrfConfig = _vrfConfig;
    }

    function emergencyLUSDWithdrawal(address to, uint256 amount) external onlyOwner nonReentrant {
        if (to == address(0)) revert ZeroAddress();
        
        uint256 contractBalance = lusdToken.balanceOf(address(this));
        if (contractBalance - totalPrizePoolAllGames < amount) {
            revert CannotWithdrawPrizeFunds();
        }
        
        lusdToken.safeTransfer(to, amount);
    }

    // ========== VIEW FUNCTIONS ==========

    function getGameDetails(uint256 gameId) external view returns (GameDetails memory) {
        return games[gameId];
    }

    function getParticipant(uint256 gameId, address user) external view returns (Participant memory) {
        return gameParticipants[gameId][user];
    }

    function getParticipantCount(uint256 gameId) external view returns (uint256) {
        return gameParticipantList[gameId].length;
    }

    function getActiveParticipants(uint256 gameId) external view returns (address[] memory) {
        return activeParticipants[gameId];
    }

    function getVoteTallies(uint256 gameId) external view returns (uint256 continueVotes, uint256 endVotes) {
        return (voteTallies[gameId][true], voteTallies[gameId][false]);
    }

    function getConsolationPrizePool(uint256 gameId) external view returns (uint256) {
        return (games[gameId].prizePool * CONSOLATION_PRIZE_BPS) / BASIS_POINTS;
    }

    function getFinalPrizePool(uint256 gameId) external view returns (uint256) {
        return (games[gameId].prizePool * FINAL_PRIZE_BPS) / BASIS_POINTS;
    }
}
