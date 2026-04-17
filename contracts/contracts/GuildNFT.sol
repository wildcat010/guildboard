// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract GuildNFT is Initializable, ERC721Upgradeable, OwnableUpgradeable, UUPSUpgradeable {

    // =========================================
    // ENUMS
    // =========================================
    enum Role { Member, Senior, Master }
    enum GuildState { All, Active, Inactive }

    // =========================================
    // STRUCTS
    // =========================================
    struct Guild {
        uint256 id;
        string name;
        bool active;
    }

    struct Member {
        uint256 id;
        string name;
        address addressMember;
        Role role;
        uint256 guildId;
        string uri;
    }

    // =========================================
    // STATE VARIABLES
    // =========================================
    uint256 private _memberIdCounter;
    uint256 private _guildIdCounter;
    uint256 private _guildCounter;
    uint256 private _memberCounter;

    mapping(uint256 => Member) private _members;
    mapping(uint256 => Guild) private _guilds;
    mapping(uint256 => uint256[]) private _guildMembers; // guildId → list of member IDs
    mapping(address => uint256) private _memberIdByAddress;

    // =========================================
    // EVENTS
    // =========================================
    event GuildCreated(uint256 guildId, string name);
    event GuildRemoved(uint256 guildId, uint256 deletedMembers);
    event MemberMinted(uint256 memberId, uint256 guildId);
    event MemberUpgraded(uint256 memberId, Role newRole);
    event MemberRemoved(uint256 memberId, uint256 guildId);

    // =========================================
    // CONSTRUCTOR & INITIALIZE
    // =========================================
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize() public initializer {
        __ERC721_init("GuildBoard Member", "GUILD");
        __Ownable_init(msg.sender);
    }

    // =========================================
    // MODIFIERS
    // =========================================
    modifier notAlreadyMember(address wallet) {
        require(balanceOf(wallet) == 0, "GuildNFT: already a member");
        _;
    }

    modifier guildExists(uint256 guildId) {
        require(_guilds[guildId].id != 0, "GuildNFT: guild does not exist");
        _;
    }

    modifier guildActivated(uint256 guildId) {
        require(_guilds[guildId].active != false, "GuildNFT: guild not active");
        _;
    }

    modifier memberExists(uint256 memberId) {
        require(_members[memberId].id != 0, "GuildNFT: member does not exist");
        _;
    }

    // =========================================
    // GUILD FUNCTIONS
    // =========================================
    function createGuild(string memory name) external onlyOwner {
        _guildIdCounter++;
        _guildCounter++;

        _guilds[_guildIdCounter] = Guild({
            id: _guildIdCounter,
            name: name,
            active: true
        });

        emit GuildCreated(_guildIdCounter, name);
    }

    function removeGuild(uint256 guildId) external onlyOwner guildExists(guildId) {
        uint256[] storage guildMembers = _guildMembers[guildId];
        uint256 deletedMembers = 0;
        for (uint256 i = 0; i < guildMembers.length; i++) {
            uint256 memberId = guildMembers[i];
            address addr = _members[memberId].addressMember;
            _burn(guildMembers[i]);
            delete _memberIdByAddress[addr];  
            delete _members[guildMembers[i]];
            _memberCounter--;
            deletedMembers++;
        }

        delete _guildMembers[guildId];
        delete _guilds[guildId];
        _guildCounter--;

        emit GuildRemoved(guildId, deletedMembers);
    }

    function disableGuild(uint256 guildId) external onlyOwner guildExists(guildId) returns (bool) {
        _guilds[guildId].active = false;
        return false;
    }

    function enableGuild(uint256 guildId) external onlyOwner guildExists(guildId) returns (bool) {
        _guilds[guildId].active = true;
        return true;
    }

    function getAllGuilds(GuildState filter) external view returns (Guild[] memory) {
        uint256 count = 0;
        for (uint256 i = 1; i <= _guildIdCounter; i++) {
            if (_matchesFilter(i, filter)) count++;
        }

        Guild[] memory allGuilds = new Guild[](count);
        uint256 index = 0;
        for (uint256 i = 1; i <= _guildIdCounter; i++) {
            if (_matchesFilter(i, filter)) {
                allGuilds[index] = _guilds[i];
                index++;
            }
        }
        return allGuilds;
    }

    function _matchesFilter(uint256 i, GuildState filter) private view returns (bool) {
        if (_guilds[i].id == 0) return false;
        if (filter == GuildState.Active) return _guilds[i].active;
        if (filter == GuildState.Inactive) return !_guilds[i].active;
        return true;
    }

    function getGuildCount() external view returns (uint256) {
        return _guildCounter;
    }

    function getRecentGuilds(uint256 limit) external view returns (Guild[] memory) {
        uint256 count = limit > _guildCounter ? _guildCounter : limit;
        Guild[] memory recent = new Guild[](count);
        uint256 index = 0;
        for (uint256 i = _guildIdCounter; i >= 1 && index < count; i--) {
            if (_guilds[i].id != 0) {
                recent[index] = _guilds[i];
                index++;
            }
        }
        return recent;
    }


    function getGuildCountByState(GuildState filter) external view returns (uint256) {
        uint256 count = 0;
        for (uint256 i = 1; i <= _guildIdCounter; i++) {
            if (_matchesFilter(i, filter)) count++;
        }
        return count;
    }

    function getGuild(uint256 guildId) external view guildExists(guildId) returns (Guild memory) {
        return _guilds[guildId];
    }

    function getGuildMembers(uint256 guildId) external view guildExists(guildId) returns (uint256[] memory) {
        return _guildMembers[guildId];
    }

    // =========================================
    // MEMBER FUNCTIONS
    // =========================================
    function mintMember(string memory name, address to, string memory uri, uint256 guildId)
        external notAlreadyMember(to) guildExists(guildId) guildActivated(guildId)
    {
        _memberIdCounter++;
        _memberCounter++;
        _mint(to, _memberIdCounter);

        _members[_memberIdCounter] = Member({
            id: _memberIdCounter,
            name: name,
            addressMember: to,
            role: Role.Member,
            guildId: guildId,
            uri: uri
        });

        _guildMembers[guildId].push(_memberIdCounter);
        _memberIdByAddress[to] = _memberIdCounter;
        emit MemberMinted(_memberIdCounter, guildId);
    }

    function getMemberByAddress(address user) external view returns (Member memory) {
    uint256 memberId = _memberIdByAddress[user];
    require(memberId != 0, "GuildNFT: member not found");
    return _members[memberId];
}

    function removeGuildMember(uint256 memberId) external memberExists(memberId) {
        uint256 guildId = _members[memberId].guildId;
        uint256[] storage memberIds = _guildMembers[guildId];

        for (uint256 i = 0; i < memberIds.length; i++) {
            if (memberIds[i] == memberId) {
                memberIds[i] = memberIds[memberIds.length - 1];
                memberIds.pop();
                break;
            }
        }

         delete _memberIdByAddress[_members[memberId].addressMember];

        _burn(memberId);
        delete _members[memberId];
       
        _memberCounter--;

        emit MemberRemoved(memberId, guildId);
    }

    function upgradeMember(uint256 memberId, Role newRole) external memberExists(memberId) {
        _members[memberId].role = newRole;
        emit MemberUpgraded(memberId, newRole);
    }

    function getMember(uint256 memberId) external view memberExists(memberId) returns (Member memory) {
        return _members[memberId];
    }

    function getMemberCount() external view returns (uint256) {
        return _memberCounter;
    }

    function getAllMembers() external view returns (Member[] memory) {
        Member[] memory allMembers = new Member[](_memberCounter);
        uint256 index = 0;
        for (uint256 i = 1; i <= _memberIdCounter; i++) {
            if (_members[i].id != 0) {
                allMembers[index] = _members[i];
                index++;
            }
        }
        return allMembers;
    }

    function isMember(address wallet) external view returns (bool) {
        return balanceOf(wallet) > 0;
    }

    function isMemberOfGuild(uint256 memberId, uint256 guildId)
        external view memberExists(memberId) guildExists(guildId) returns (bool)
    {
        return _members[memberId].guildId == guildId;
    }

    // =========================================
    // TOKEN URI
    // =========================================
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        return _members[tokenId].uri;
    }

    // =========================================
    // INTERNAL
    // =========================================
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}