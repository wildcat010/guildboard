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
        string name;
        string description;
        TaskStatus status;
        address poster;    // who created the task
        address payable assignee;  // who does the task and gets paid
        uint256 guildId;
        uint256 reward;  // ← ETH in escrow
        bool paid;       // ← prevent double payment
    }

    struct Depo {
        uint256 id;
        string name;
        string date;
        uint256 amount;
    }

    mapping(uint256 => uint256[]) public _guildTasks; // ID guild -> tasks
    mapping(uint256 => uint256) public _guildPayements; //ID guild -> total payments received
    mapping(uint256 => Depo) public deposits;
    mapping(uint256 => Task) _TaskIDs;

    uint256 private tasksCreated;
    uint256 private totalDeposited;

    // =========================================
    // STATE VARIABLES
    // =========================================
    IGuildNFT public guildNFT; // ← declare the variable

    // =========================================
    // EVENTS
    // =========================================
    event TaskCreated(uint256 taskId);
    event TaskUpdated(uint256 taskId);
    event TaskAssigned(uint256 taskId,  uint256 guildId);
    event TaskDoneAndPaid(uint256 taskId,  uint256 amount, uint256 guildId);
    event TaskStatusUpdated(uint256 taskId, TaskStatus newStatus);
    event Deposited(uint256 depositId, uint256 amount);


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

    function createTask(string memory name, string memory description, uint256 reward) external onlyOwner{
        tasksCreated++;

        _TaskIDs[tasksCreated] = Task({
           id: tasksCreated,
           name: name,
            description: description,
            status: TaskStatus.toDo,
            poster: msg.sender,
            assignee:  payable(address(0)),
            guildId: 0,
            reward: reward,
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

    function updateTask(uint256 taskId, string memory name, string memory description, uint256 reward, uint256 guildId) external onlyOwner taskExists(taskId) whenNotPaused
    {
        Task storage myTask = _TaskIDs[taskId];
        require(!myTask.paid, "GuildBoard: task already paid");
        require(myTask.status != TaskStatus.Close, "GuildBoard: task is closed");
       
        myTask.name = name;
        myTask.description = description;
        myTask.reward = reward;
        myTask.guildId = guildId;
        
        emit TaskUpdated(taskId);
    }

    function updateTaskStatus(uint256 taskId, TaskStatus newStatus) external onlyOwner taskExists(taskId) whenNotPaused
    {
        Task storage myTask = _TaskIDs[taskId];
        myTask.status = newStatus;
        emit TaskStatusUpdated(taskId, newStatus);
    }

    function getAllDeposits() external view returns(Depo[] memory){
        Depo[] memory depo = new Depo[](totalDeposited);
        for(uint256 i = 1; i <= totalDeposited; i++) 
        {
                depo[i-1] = deposits[i];
        }
        return depo;
    }

    function deposit(string memory name,string memory date) external payable onlyOwner{
        require(msg.value > 0, "GuildBoard: must send ETH");
        totalDeposited++;

        deposits[totalDeposited] = Depo({
            id: totalDeposited,
            name: name,
            date: date,
            amount: msg.value
        });
        
        emit Deposited(totalDeposited, msg.value);
    }


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


    function _removeTask(uint256 guildId, uint256 taskId) internal {
    uint256[] storage arr = _guildTasks[guildId];

    for (uint256 i = 0; i < arr.length; i++) {
        if (arr[i] == taskId) {
            arr[i] = arr[arr.length - 1];
            arr.pop();
            break;
        }
    }
}

    function AssignTaskToGuild(uint256 guildId, uint256 taskId) external onlyOwner taskExists(taskId) guildActiveOnNFT(guildId) whenNotPaused {
       Task storage myTask = _TaskIDs[taskId];
      

    if(myTask.guildId != 0){
        _removeTask(myTask.guildId, taskId);
    }

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