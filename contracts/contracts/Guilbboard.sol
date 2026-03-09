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
     function isMemberOfGuild(address wallet, uint256 guildId) external view returns (bool);

     struct Guild {
        uint256 id;
        string name;
        bool active;
    }

    function getGuild(uint256 guildId) external view returns (Guild memory);
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
    // EVENTS
    // =========================================
    event TaskCreated(uint256 indexed taskId);
    event TaskAssigned(uint256 indexed taskId,  uint256 indexed guildId);
    event TaskDoneAndPaid(uint256 indexed taskId,  uint256 indexed amount, uint256 guildId);


     // =========================================
    // MODIFIERS
    // =========================================
    modifier taskExists(uint256 taskId) {
        require(_TaskIDs[taskId].id != 0, "GuildBoard: task does not exist");
        _;
    }

    modifier guildActiveOnNFT(uint256 guildId) {
        IGuildNFT.Guild memory g = guildNFT.getGuild(guildId);
        require(g.active, "GuildBoard: guild is not active");
        _;
    }

    // =========================================
    // CONSTRUCTOR & INITIALIZER
    // =========================================
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers(); // ← added
    }

    function createTask(string memory description, address payable assigneeAddress) external payable onlyOwner{
        tasksCreated++;

        _TaskIDs[tasksCreated] = Task({
           id: tasksCreated,
            description: description,
            status: TaskStatus.toDo,
            poster: msg.sender,
            assignee: assigneeAddress,
            guildId: 0,
            reward: msg.value,
            paid: false
        });

        emit TaskCreated(tasksCreated);
        
    }

    function paidTaskToGuild(uint256 guildId, uint256 taskId) external onlyOwner taskExists(taskId) guildActiveOnNFT(guildId) nonReentrant {
        Task storage myTask = _TaskIDs[taskId];
        require(!myTask.paid, "GuildBoard: already paid");
        require(myTask.reward <= address(this).balance, "Insufficient balance");

        myTask.paid=true;
        myTask.status= TaskStatus.Done;

        (bool success, ) =  myTask.assignee.call{value: myTask.reward,to:myTask.assignee}("");
        require(success, "GuildBoard: payment failed");

        emit TaskDoneAndPaid(taskId, myTask.reward, guildId);
    }

    function AssignTaskToGuild(uint256 guildId, uint256 taskId) external onlyOwner taskExists(taskId) guildActiveOnNFT(guildId) {
       Task storage myTask = _TaskIDs[taskId];
       myTask.guildId = guildId;
       emit TaskAssigned(taskId,guildId)
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