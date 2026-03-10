// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

// Already have in GuildNFT, reuse pattern:
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

// ✅ use PausableUpgradeable instead for shutdown
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";

import "@openzeppelin/contracts/utils/ReentrancyGuardTransient.sol";

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
,PausableUpgradeable, ReentrancyGuardTransient {

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

    mapping(uint256 => uint256[]) public _guildTasks; // ID guild -> tasks
    mapping(uint256 => uint256) public _guildPayements; //ID guild -> total payments received

    mapping(uint256 => Task) _TaskIDs;

    uint256 private tasksCreated;

    // =========================================
    // STATE VARIABLES
    // =========================================
    IGuildNFT public guildNFT; // ← declare the variable

    // =========================================
    // EVENTS
    // =========================================
    event TaskCreated(uint256 taskId);
    event TaskAssigned(uint256 taskId,  uint256 guildId);
    event TaskDoneAndPaid(uint256 taskId,  uint256 amount, uint256 guildId);
    event TaskStatusUpdated(uint256 taskId, TaskStatus newStatus);


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
        _disableInitializers(); 
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

    function enableShutdown() external onlyOwner { _pause(); }
    function disableShutdown() external onlyOwner { _unpause(); }

    function getAllTasks() external view returns(Task[] memory){
        Task[] memory tasks = new Task[](tasksCreated);
        for(uint256 i = 1; i <= tasksCreated; i++){
            tasks[i-1] = _TaskIDs[i];
        }
        return tasks;
    }

    function getGuildTasks(uint256 guildId) external view returns(Task[] memory){
        uint256[] memory taskIds = _guildTasks[guildId];
        Task[] memory tasks = new Task[](taskIds.length);
        for(uint256 i = 0; i < taskIds.length; i++) 
        {
            tasks[i] = _TaskIDs[taskIds[i]];
        }
        return tasks;
    }

    function getTask(uint256 taskId) external view taskExists(taskId) returns(Task memory) {
        return _TaskIDs[taskId];
    }

    function updateTaskStatus(uint256 taskId, TaskStatus newStatus) external onlyOwner taskExists(taskId) whenNotPaused
    {
        Task storage myTask = _TaskIDs[taskId];
        myTask.status = newStatus;
        emit TaskStatusUpdated(taskId, newStatus);
    }

    function deposit() external payable {}

    function closeAndPayTask(uint256 taskId) external onlyOwner taskExists(taskId) nonReentrant whenNotPaused
    {
        Task storage myTask = _TaskIDs[taskId];
        require(myTask.status == TaskStatus.Verified, "GuildBoard: task not verified");
        require(!myTask.paid, "GuildBoard: already paid");

        myTask.paid = true;
        myTask.status = TaskStatus.Close;

        (bool success, ) = myTask.assignee.call{value: myTask.reward}("");
        require(success, "GuildBoard: payment failed");

        emit TaskDoneAndPaid(taskId, myTask.reward, myTask.guildId);
    }

    function AssignTaskToGuild(uint256 guildId, uint256 taskId) external onlyOwner taskExists(taskId) guildActiveOnNFT(guildId) whenNotPaused {
       Task storage myTask = _TaskIDs[taskId];
       myTask.guildId = guildId;
       _guildTasks[guildId].push(taskId);
       emit TaskAssigned(taskId,guildId);
    }

    // =========================================
    // CONSTRUCTOR & INITIALIZER
    // =========================================
    function initialize(address _guildNFT) public initializer {
        __Ownable_init(msg.sender);
       __Pausable_init();
        guildNFT = IGuildNFT(_guildNFT);
    }

    

    // =========================================
    // INTERNAL FUNCTIONS
    // =========================================
    function _authorizeUpgrade(address newImplementation) 
        internal
        override
        onlyOwner
    {}
}