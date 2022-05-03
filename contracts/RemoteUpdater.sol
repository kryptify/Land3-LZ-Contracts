// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;
pragma abicoder v2;

import "./lzApp/NonblockingLzApp.sol";

/// @title A LayerZero example sending a cross chain message from a source chain to a destination chain to increment a counter
contract RemoteUpdater is NonblockingLzApp {

    constructor(address _lzEndpoint) NonblockingLzApp(_lzEndpoint) {}

    function _nonblockingLzReceive(uint16, bytes memory, uint64, bytes memory) internal override {}

    function updateOwnerOfNFT(uint16 _dstChainId, uint _tokenId, address _newOwner) public payable {
        // encode the payload with the _tokenId and _newOwner
        bytes memory payload = abi.encode(_tokenId, msg.sender, _newOwner);

        _lzSend(_dstChainId, payload, payable(msg.sender), address(0x0), bytes(""));
    }
}
