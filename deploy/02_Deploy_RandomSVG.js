let { networkConfig, getNetworkIdFromName } = require('../helper-hardhat-config')
const fs = require('fs')
const { encodeOracleRequest } = require('@chainlink/test-helpers/dist/src/contracts/coordinator')
const { sign } = require('crypto')

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
    const signer = accounts[2]
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
    let tx = await randomSVG.create( 2 ,{ gasLimit: 3000000 })
    let receipt = await tx.wait(1)
  // console.log( "account ",signer);

  // console.log( "receipt " , receipt);

   // let tokenId = receipt.events[3].topics[2];
    let tk = receipt.events[3].args.tokenId;
    tk = tk.toString();
    tk = parseInt(tk);
    
    console.log(" tk " , tk);
    
 // console.log(" tokenId ", tokenId.toString());




//    let tx2 = await randomSVG.tes();
//    let re = await tx2.wait(1);
//    console.log( "random " ,tx2); 

   for( let i=tk ; i<tk+2 ; i++){
       console.log( " minting the nft ...............")

    tx2 = await randomSVG.mintNft( i ,signer.address , i, {gasLimit: 2000000});
    await tx2.wait(1);
   }

    console.log( "this is the random no that we got---------------------- ", tx);

  //  let tokenId = receipt.events[3].topics[2];

  

    console.log("----------------------------------------")
    
    
   // log(`You've made your NFT! This is number ${tokenId.toString()}`)
    log("Let's wait for the Chainlink VRF node to respond...")
    if (chainId != 31337) {

       await new Promise(r => setTimeout(r, 180000))
        log(`Now let's finsih the mint...`)

        for( let i=tk ; i<tk+2 ; i++){
        tx = await randomSVG.finishMint(i, { gasLimit: 20000000 })
       await tx.wait(1)

           log(`You can view the tokenURI here ${await randomSVG.tokenURI(i)}`)
       
        
        }
        
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
