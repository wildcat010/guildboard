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

    // =========================================
    // STATE VARIABLES
    // =========================================
    uint256 private _tokenIdCounter;
    mapping(uint256 => string) private _tokenURIs;
    mapping(uint256 => Role) private _memberRoles;
    mapping(address => uint256) private _ownerTokenId;

    // =========================================
    // EVENTS
    // =========================================
    event MemberMinted(address indexed to, uint256 tokenId);
    event MemberUpgraded(uint256 tokenId, Role newRole);
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

    //FUNCTIONS

    function mintMember(address to, string memory uri) external onlyOwner notAlreadyMember(to){
        _tokenIdCounter++;
        _mint(to, _tokenIdCounter);
        _tokenURIs[_tokenIdCounter] = uri;
        _memberRoles[_tokenIdCounter] = Role.Member;
        _ownerTokenId[to] = _tokenIdCounter;
        emit MemberMinted(to, _tokenIdCounter);
    }

    function isMember(address wallet) external view returns (bool) {
        return balanceOf(wallet) > 0;
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