// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";


contract GuildNFT is Initializable,
    ERC721Upgradeable,
    OwnableUpgradeable,
    UUPSUpgradeable{

    // =========================================
    // ENUM 
    // =========================================
    enum Role { Member, Senior, Master }


    struct Guild {
        uint256 id;
        string name;
        bool active;
    }

    // =========================================
    // STATE VARIABLES
    // =========================================
    uint256 private _tokenIdCounter;
    uint256 private _guildCounter;


    mapping(uint256 => string) private _tokenURIs;
    mapping(uint256 => Role) private _memberRoles;
    mapping(address => uint256) private _ownerTokenId;

    mapping(uint256 => uint256) private _tokenGuildId;   // tokenId → guildId
    mapping(address => uint256) private _memberGuildId;  // wallet → guildId
    mapping(uint256 => Guild) private _guilds;   

    mapping(uint256 => address[]) private _guildMembers; // guildId → list of members


    // =========================================
    // EVENTS
    // =========================================
    event GuildCreated(uint256 indexed guildId, string name);
    event MemberMinted(address indexed to, uint256 tokenId, uint256 guildId);
    event MemberUpgraded(uint256 tokenId, Role newRole);
    event MemberRemoved(address member, uint256 tokenId, uint256 guildId);
    //ERRORS

    

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

    modifier onlyMember(address wallet) {
        require(balanceOf(wallet) > 0, "GuildNFT: not a member");
        _;
    }

    modifier guildExists(uint256 guildId) {
        require(_guilds[guildId].active, "GuildNFT: guild does not exist");
        _;
    }

    //FUNCTIONS

    function createGuild(string memory name)
        external
        onlyOwner
        returns (uint256)
    {
        _guildCounter++;

        _guilds[_guildCounter] = Guild({
            id: _guildCounter,
            name: name,
            active: true
        });

        emit GuildCreated(_guildCounter, name);

        return _guildCounter;
    }

    function getAllGuilds() external view returns(Guild[] memory){
        Guild[] memory allGuilds = new Guild[](_guildCounter);
        for (uint256 i = 1; i <= _guildCounter; i++) {
            allGuilds[i - 1] = _guilds[i];
        }
        return allGuilds;
    }

    function getGuildMembers(uint256 guildId) 
        external 
        view 
        guildExists(guildId)
        returns (address[] memory) 
    {
        return _guildMembers[guildId];
    }

    function mintMember(address to, string memory uri, uint256 guildId) external onlyOwner notAlreadyMember(to) guildExists(guildId){
        _tokenIdCounter++;
        _mint(to, _tokenIdCounter);
        _tokenURIs[_tokenIdCounter] = uri;
        _memberRoles[_tokenIdCounter] = Role.Member;

        _ownerTokenId[to] = _tokenIdCounter;
        _tokenGuildId[_tokenIdCounter] = guildId;
        _memberGuildId[to] = guildId;
        _guildMembers[guildId].push(to);
        emit MemberMinted(to, _tokenIdCounter,guildId);
    }

    function isMember(address wallet) external view returns (bool) {
        return balanceOf(wallet) > 0;
    }

    function removeGuildMember(address member) external onlyOwner onlyMember(member)
    {
        uint256 guildId = _memberGuildId[member];
        uint256 tokenId = _ownerTokenId[member];


        address[] storage members = _guildMembers[guildId];

        for(uint256 i = 0;i<members.length; i++){
            if(members[i] == member){
                members[i] = members[members.length - 1];
                members.pop();
                break;
            }
        }

        // =========================================
        // Clean up all mappings
        // =========================================
        delete _memberGuildId[member];
        delete _ownerTokenId[member];
        delete _tokenGuildId[tokenId];
        delete _memberRoles[tokenId];
        delete _tokenURIs[tokenId];

        // =========================================
        // Burn the NFT
        // =========================================
        _burn(tokenId);

        emit MemberRemoved(member, tokenId, guildId);

    }

    function disableGuild(uint256 guildId) external onlyOwner guildExists(guildId) returns(bool){
        Guild storage myGuild = _guilds[guildId];

        myGuild.active = false;

        return myGuild.active;
    }

    function enableGuild(uint256 guildId) external  onlyOwner guildExists(guildId) returns(bool) {
        Guild storage myGuild = _guilds[guildId];

        myGuild.active = true;
        return myGuild.active;
    }

    function isMemberOfGuild(address wallet, uint256 guildId) external view returns (bool) {
        return balanceOf(wallet) > 0 && _memberGuildId[wallet] == guildId;
    }

    function getGuild(uint256 guildId) external view guildExists(guildId) returns (Guild memory) {
        return _guilds[guildId];
    }

    function upgradeMember(address member, Role newRole) external onlyOwner onlyMember(member)
    {
        uint256 _tokenId = _ownerTokenId[member];
        _memberRoles[_tokenId] = newRole;
        emit MemberUpgraded(_tokenId, newRole);

    }


    function getRoleByWallet(address wallet) external view returns (Role) {
        uint256 tokenId = _ownerTokenId[wallet];
        return _memberRoles[tokenId];
    }

    function getRole(uint256 tokenId) external view returns (Role) {
        return _memberRoles[tokenId];
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        return _tokenURIs[tokenId];
    }

    function getMemberURI(address wallet) external view returns (string memory) {
        uint256 tokenId = _ownerTokenId[wallet];
        return _tokenURIs[tokenId];
    }
    
    function _authorizeUpgrade(address newImplementation)internal override onlyOwner {

    }
}