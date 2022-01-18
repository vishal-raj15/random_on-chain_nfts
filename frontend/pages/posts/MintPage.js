
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"


import { ethers , BigNumber} from 'ethers';
import { MaxUint256 } from '@ethersproject/constants';

import NFT from '../../../artifacts/contracts/RandomSVG.sol/RandomSVG.json';
import LinkSC from '../../../artifacts/@chainlink/token/contracts/v0.4/LinkToken.sol/LinkToken.json'



	const overrides = {
  gasLimit: 9999999
}

function expandTo18Decimals(n) {
  return BigNumber.from(n).mul(BigNumber.from(10).pow(18))
}

let { networkConfig, getNetworkIdFromName } = require('../../../helper-hardhat-config')


export default function Home() {

  const [userAccount, setUserAccount] = useState()
  const [recAccount, setRecAccount] = useState()
  const [amount, setAmount] = useState()

  var nftAddress = "0xB085E2265E48E1456Dcc15Eb658056CB7Ad81567";

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  

  async function mint(){

    let val = parseInt(amount);

    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = await provider.getSigner();
    const signerAddress = await signer.getAddress();
    const chainId = await signer.getChainId();

    const linkTokenAddress = networkConfig[chainId]['linkToken']
    const vrfCoordinatorAddress = networkConfig[chainId]['vrfCoordinator']
    const keyHash = networkConfig[chainId]['keyHash']
    const fee = networkConfig[chainId]['fee']
    const fundAmount = networkConfig[chainId]['fundAmount']


    const LinkToken = new ethers.Contract(linkTokenAddress , LinkSC.abi , signer);

    let fund_tx = await LinkToken.transfer( nftAddress , fundAmount);

    await fund_tx.wait(1);

    const NFTcontract = new ethers.Contract(nftAddress , NFT.abi , signer);

    console.log( chainId);

    console.log(" provider ",signerAddress);

      if( val <= 0){
        console.log(" error , put some integer ");
      }

     else{
        console.log( " starting ..............");
        let tx = await NFTcontract.create( val, { gasLimit: 3000000 });
        let receipt = await tx.wait(1);
        let tokenId = receipt.events[3].args.tokenId;
        tokenId = tokenId.toString();
        tokenId = parseInt(tokenId);

        for( let i=tokenId ; i < val + tokenId ; i++){
          let delta = Math.floor( Math.random()*1000000);


          console.log( " minting ", i, "th nft ");
          let tx = await NFTcontract.mintNft( i , signerAddress , delta);
          await tx.wait(1);
        }

        if( chainId != 31337){

          console.log( "now finish the minting process ...");
          for( let i=tokenId ; i< tokenId + val ; i++){

            let minttx = await NFTcontract.finishMint( i, { gasLimit: 20000000 });
            await minttx.wait(1);
            console.log( i,`th tokenURL ${ await NFTcontract.tokenURI(i)}`);
          }
        }

    }




  }

  return (
    <div >
     
     <div className=" flex-grow grid place-items-center tracking-widest"> 
            <h1 className=" m-2 text-justify text-lg "> This is a random digital art generatator platform on chain on rinkeby network with the help of chainlink protocol</h1>
            <p1 className=" m-2 text-justify text-lg"> Fully decentralise NFTs</p1>
            
            <p1 className=" m-2 text-justify text-lg"> Mint your own NFTs on-chain</p1>

        </div>

        <div className="mt-10 flex-grow grid place-items-center tracking-widest"> 


    <input onChange={e => setAmount(e.target.value)} placeholder="Number of NFTs" />

    <button class="mt-5 py-2 px-4 rounded bg-green-600 text-white"
      onClick={mint}>
      MINT
    </button>

    </div>

    </div>
  )
}
