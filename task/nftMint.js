module.exports = async function (taskArgs, hre) {
    const exampleNFT = await ethers.getContract("ExampleNFT")
    console.log(`[source] exampleNFT.address: ${exampleNFT.address}`)

    try {
        let tx = await (await exampleNFT.mint()).wait()
        console.log(`✅ [${hre.network.name}] mint()`)
        console.log(` tx: ${tx.transactionHash}`)
        let nftTokenId = await ethers.provider.getTransactionReceipt(tx.transactionHash)
        console.log(` NFT nftId: ${parseInt(Number(nftTokenId.logs[0].topics[3]))}`)
    } catch (e) {
        console.log(e)
    }
}
