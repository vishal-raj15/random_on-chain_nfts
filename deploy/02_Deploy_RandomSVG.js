let { networkConfig, getNetworkIdFromName } = require('../helper-hardhat-config')
const fs = require('fs')
const { encodeOracleRequest } = require('@chainlink/test-helpers/dist/src/contracts/coordinator')

module.exports = async ({
    getNamedAccounts,
    deployments,
    getChainId
}) => {

    const { deploy, get, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = await getChainId()
    let linkTokenAddress
    let vrfCoordinatorAddress

    if (chainId == 31337) {
        let linkToken = await get('LinkToken')
        let VRFCoordinatorMock = await get('VRFCoordinatorMock')
        linkTokenAddress = linkToken.address
        vrfCoordinatorAddress = VRFCoordinatorMock.address
        additionalMessage = " --linkaddress " + linkTokenAddress
    } else {
        linkTokenAddress = networkConfig[chainId]['linkToken']
        vrfCoordinatorAddress = networkConfig[chainId]['vrfCoordinator']
    }
    const keyHash = networkConfig[chainId]['keyHash']
    const fee = networkConfig[chainId]['fee']
    args = [vrfCoordinatorAddress, linkTokenAddress, keyHash, fee]
    log("----------------------------------------------------")
    const RandomSVG = await deploy('RandomSVG', {
        from: deployer,
        args: args,
        log: true
    })
    log(`You have deployed an NFT contract to ${RandomSVG.address}`)
    const networkName = networkConfig[chainId]['name']
    log(`Verify with:\n npx hardhat verify --network ${networkName} ${RandomSVG.address} ${args.toString().replace(/,/g, " ")}`)
    const RandomSVGContract = await ethers.getContractFactory("RandomSVG")
    const accounts = await hre.ethers.getSigners()
    const signer = accounts[0]
    const randomSVG = new ethers.Contract(RandomSVG.address, RandomSVGContract.interface, signer)

    // fund with LINK
    let networkId = await getNetworkIdFromName(network.name)
    const fundAmount = networkConfig[networkId]['fundAmount']
    const linkTokenContract = await ethers.getContractFactory("LinkToken")
    const linkToken = new ethers.Contract(linkTokenAddress, linkTokenContract.interface, signer)
    let fund_tx = await linkToken.transfer(RandomSVG.address, fundAmount)
    await fund_tx.wait(1)
    // await new Promise(r => setTimeout(r, 5000))


    log("Let's create an NFT now!")
    let tx = await randomSVG.create({ gasLimit: 300000 })
    let receipt = await tx.wait(2)
    //console.log( "receipt ",receipt);

    console.log( "this is the random no that we got---------------------- ", tx);

    let tokenId = receipt.events[3].topics[2]

    // console.log(receipt.events[1])
    // console.log("----------------------------------------")


    // console.log(receipt.events[2])
    // console.log("----------------------------------------")

    // console.log(receipt.events[3])
    // console.log("----------------------------------------")
    
    ///console.log( tokenId);

    
    log(`You've made your NFT! This is number ${tokenId.toString()}`)
    log("Let's wait for the Chainlink VRF node to respond...")
    if (chainId != 31337) {

        await new Promise(r => setTimeout(r, 180000))
        log(`Now let's finsih the mint...`)
        tx = await randomSVG.finishMint(0, { gasLimit: 20000000 })
       await tx.wait(1)

           log(`You can view the tokenURI here ${await randomSVG.tokenURI(0)}`)

        
        
    } else {
        const VRFCoordinatorMock = await deployments.get('VRFCoordinatorMock')
        vrfCoordinator = await ethers.getContractAt('VRFCoordinatorMock', VRFCoordinatorMock.address, signer)
        let transactionResponse = await vrfCoordinator.callBackWithRandomness(receipt.logs[3].topics[1], 77777, randomSVG.address)
        await transactionResponse.wait(1)
        log(`Now let's finsih the mint...`)
        tx = await randomSVG.finishMint(tokenId, { gasLimit: 2000000 })
        await tx.wait(1)
        log(`You can view the tokenURI here ${await randomSVG.tokenURI(0)}`)
    }
}

module.exports.tags = ['all', 'rsvg']
