const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("ExampleNFT: ", function () {
    const chainIdSrc = 1
    const chainIdDst = 2
    const name = "ExampleNFT"
    const symbol = "ENFT"

    let owner, lzEndpointSrcMock, lzEndpointDstMock, ONFTSrc, ONFTDst, LZEndpointMock, ONFT

    before(async function () {
        owner = (await ethers.getSigners())[0]

        LZEndpointMock = await ethers.getContractFactory("LZEndpointMock")
        ONFT = await ethers.getContractFactory("ExampleNFT")
    })

    beforeEach(async function () {
        lzEndpointSrcMock = await LZEndpointMock.deploy(chainIdSrc)
        lzEndpointDstMock = await LZEndpointMock.deploy(chainIdDst)

        // create two UniversalONFT instances
        ONFTSrc = await ONFT.deploy(name, symbol, lzEndpointSrcMock.address, ...ONFTSrcIds)
        ONFTDst = await ONFT.deploy(name, symbol, lzEndpointDstMock.address, ...ONFTDstIds)

        lzEndpointSrcMock.setDestLzEndpoint(ONFTDst.address, lzEndpointDstMock.address)
        lzEndpointDstMock.setDestLzEndpoint(ONFTSrc.address, lzEndpointSrcMock.address)

        // set each contracts source address so it can send to each other
        await ONFTSrc.setTrustedRemote(chainIdDst, ONFTDst.address) // for A, set B
        await ONFTDst.setTrustedRemote(chainIdSrc, ONFTSrc.address) // for B, set A
    })

    it("send() - mint on the source chain and send ONFT to the destination chain", async function () {
        // mint ONFT
        const newId = await ONFTSrc.nextMintId()
        await ONFTSrc.mint()

        // verify the owner of the token is on the source chain
        expect(await ONFTSrc.ownerOf(newId)).to.be.equal(owner.address)

        // approve and send ONFT
        await ONFTSrc.approve(ONFTSrc.address, newId)
        // v1 adapterParams, encoded for version 1 style, and 200k gas quote
        const adapterParam = ethers.utils.solidityPack(["uint16", "uint256"], [1, 225000])

        await ONFTSrc.send(chainIdDst, owner.address, newId, owner.address, "0x000000000000000000000000000000000000dEaD", adapterParam)

        // verify the owner of the token is no longer on the source chain
        await expect(ONFTSrc.ownerOf(newId)).to.revertedWith("ERC721: owner query for nonexistent token")

        // verify the owner of the token is on the destination chain
        expect(await ONFTDst.ownerOf(newId)).to.not.equal(owner)

        // hit the max mint on the source chain
        await expect(ONFTSrc.mint()).to.revertedWith("ONFT: Max Mint limit reached")
    })
})
