// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

// Already have in GuildNFT, reuse pattern:
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

// New for GuildBoard — payments security:
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";


// =========================================
// INTERFACE — talks to GuildNFT contract
// =========================================
interface IGuildNFT {
    function isMember(address wallet) external view returns (bool);
    function getRoleByWallet(address wallet) external view returns (uint8);
}


contract Guildboard is 
Initializable
,OwnableUpgradeable
,UUPSUpgradeable
,ReentrancyGuard {

    enum TaskStatus { toDo, inProgress, Done, Verified, Close }

    struct Task {
        uint256 id;
        string description;
        TaskStatus status;
        address poster;    // who created the task
        address payable assignee;  // who does the task and gets paid
        uint256 guildId;
        uint256 reward;  // ← ETH in escrow
        bool paid;       // ← prevent double payment
    }

    mapping(uint256 => Task[]) public _guildTasks; // ID guild -> tasks
    mapping(uint256 => uint256) public _guildPayements; //ID guild -> total payments received


    mapping(uint256 => Task) _TaskIDs;


    uint256 private guildCreated;
    uint256 private tasksCreated;

    // =========================================
    // STATE VARIABLES
    // =========================================
    IGuildNFT public guildNFT; // ← declare the variable


    // =========================================
    // CONSTRUCTOR & INITIALIZER
    // =========================================
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers(); // ← added
    }

    function createTask(string memory description, address payable assigneeAddress) external payable onlyOwner{
        tasksCreated++;

        
    }

    function AssignTaskToGuild(uint256 guildID, uint256 taskId) external onlyOwner{
       Task memory myTask = _TaskIDs[taskId];
       myTask.guildId = guildID;
       
    }

    // =========================================
    // CONSTRUCTOR & INITIALIZER
    // =========================================
    /// @custom:oz-upgrades-unsafe-allow constructor
    function initialize(address _guildNFT) public initializer {
        __Ownable_init(msg.sender);
        // ← remove __ReentrancyGuard_init(), not needed in v5
        guildNFT = IGuildNFT(_guildNFT);
    }

    

    // =========================================
    // INTERNAL FUNCTIONS
    // =========================================
    function _authorizeUpgrade(address newImplementation) // ← added
        internal
        override
        onlyOwner
    {}
}