// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract GuildNFT is Initializable,
    ERC721Upgradeable,
    OwnableUpgradeable,
    UUPSUpgradeable
{
    // =========================================
    // ENUM 
    // =========================================
    enum Role { Member, Senior, Master }
    enum GuildState { All, Active, Inactive }

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
    uint256 private _memberIdCounter;   // latest member ID issued
    uint256 private _guildIdCounter;    // latest guild ID issued
    uint256 private _memberCounter;     // active members count
    uint256 private _guildCounter;      // active guilds count

    mapping(uint256 => Member) private _members;
    mapping(uint256 => Guild) private _guilds;
    mapping(uint256 => uint256) private _memberIdGuildId; // memberId → guildId
    mapping(uint256 => uint256[]) private _guildMembers;   // guildId → memberIds

    // =========================================
    // EVENTS
    // =========================================
    event GuildCreated(uint256 indexed guildId, string name);
    event GuildRemoved(uint256 indexed guildId);
    event MemberMinted(uint256 indexed memberId, uint256 indexed guildId);
    event MemberUpgraded(uint256 indexed memberId, Role newRole);
    event MemberRemoved(uint256 indexed memberId, uint256 indexed guildId);

    // =========================================
    // INITIALIZER
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

        for (uint256 i = 0; i < guildMembers.length; i++) {
            uint256 memberId = guildMembers[i];
            _burn(memberId);
            delete _members[memberId];
            delete _memberIdGuildId[memberId];
            _memberCounter--;

            emit MemberRemoved(memberId, guildId);
        }

        delete _guilds[guildId];
        delete _guildMembers[guildId];
        _guildCounter--;

        emit GuildRemoved(guildId);
    }

    function getAllGuilds(GuildState state) external view returns(Guild[] memory) {
        uint256 count = 0;
        for (uint256 i = 1; i <= _guildIdCounter; i++) {
            if (_matchesFilter(i, state)) count++;
        }

        Guild[] memory allGuilds = new Guild[](count);
        uint256 index = 0;
        for (uint256 i = 1; i <= _guildIdCounter; i++) {
            if(_matchesFilter(i, state)){
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

    function getGuildCount() external view returns(uint256) {
        return _guildCounter;
    }

    function getRecentGuilds(uint256 limit) external view returns (Guild[] memory) {
        uint256 count = 0;
        uint256 current = _guildIdCounter;

        while (current > 0 && count < limit) {
            if (_guilds[current].id != 0) {
                count++;
            }
            current--;
        }

        Guild[] memory recent = new Guild[](count);
        uint256 index = 0;
        current = _guildIdCounter;

        while (current > 0 && index < count) {
            if (_guilds[current].id != 0) {
                recent[index] = _guilds[current];
                index++;
            }
            current--;
        }

        return recent;
    }

    function getGuildMembers(uint256 guildId) external view guildExists(guildId) returns (uint256[] memory) {
        return _guildMembers[guildId];
    }

    function enableGuild(uint256 guildId) external onlyOwner guildExists(guildId) returns(bool) {
        Guild storage g = _guilds[guildId];
        g.active = true;
        return g.active;
    }

    function disableGuild(uint256 guildId) external onlyOwner guildExists(guildId) returns(bool) {
        Guild storage g = _guilds[guildId];
        g.active = false;
        return g.active;
    }

    function getGuild(uint256 guildId) external view guildExists(guildId) returns (Guild memory) {
        return _guilds[guildId];
    }

    // =========================================
    // MEMBER FUNCTIONS
    // =========================================
    function mintMember(string memory name, address to, string memory uri, uint256 guildId) 
        external onlyOwner notAlreadyMember(to) guildExists(guildId)
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

        _memberIdGuildId[_memberIdCounter] = guildId;
        _guildMembers[guildId].push(_memberIdCounter);

        emit MemberMinted(_memberIdCounter, guildId);
    }

    function removeGuildMember(uint256 memberId) external onlyOwner memberExists(memberId) {
        uint256 guildId = _members[memberId].guildId;
        uint256 membersIdsCount = _guildMembers[guildId].length;

        for(uint256 i = 0; i < membersIdsCount; i++){
            if(_guildMembers[guildId][i] == memberId){
                _guildMembers[guildId][i] = _guildMembers[guildId][membersIdsCount - 1];
                _guildMembers[guildId].pop();
                break;
            }
        }

        _burn(memberId);
        delete _members[memberId];
        delete _memberIdGuildId[memberId];
        _memberCounter--;

        emit MemberRemoved(memberId, guildId);
    }

    function getAllMembers() external view returns(Member[] memory) {
        Member[] memory result = new Member[](_memberCounter);
        uint256 index = 0;
        for(uint256 i = 1; i <= _memberIdCounter; i++){
            if(_members[i].id != 0){
                result[index] = _members[i];
                index++;
            }
        }
        return result;
    }

    function getMemberCount() external view returns(uint256) {
        return _memberCounter;
    }

    function isMember(address wallet) external view returns(bool) {
        return balanceOf(wallet) > 0;
    }

    function isMemberOfGuild(uint256 memberId, uint256 guildId) 
        external view memberExists(memberId) guildExists(guildId) returns(bool) 
    {
        return _members[memberId].guildId == guildId;
    }

    function upgradeMember(uint256 memberId, Role newRole) external onlyOwner memberExists(memberId) {
        _members[memberId].role = newRole;
        emit MemberUpgraded(memberId, newRole);
    }



    // =========================================
    // UUPS Upgrade
    // =========================================
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}