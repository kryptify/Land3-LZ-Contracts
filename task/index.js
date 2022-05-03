// set Trusted Remote for NFT contract on ETH
task(
    "nftSetTrustedRemote",
    "setTrustedRemote(chainId, sourceAddr) to allow the local contract to send/receive messages from known source contracts",
    require("./nftSetTrustedRemote")
).addParam("targetNetwork", "the target network to let this instance receive messages from")

// mint NFT on ETH
task("nftMint", "mint() mint ExampleNFT", require("./nftMint"))

// set Trusted Remote for Avax contract
task(
    "avaxSetTrustedRemote",
    "setTrustedRemote(chainId, sourceAddr) to allow the local contract to receive messages from known source contracts",
    require("./avaxSetTrustedRemote")
).addParam("targetNetwork", "the target network to let this instance receive messages from")
