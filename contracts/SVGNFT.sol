// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.0;

// import "@openzeppelin/contracts/access/Ownable.sol";
// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
// import "base64-sol/base64.sol";
// import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

// contract RandomSVG is ERC721URIStorage, VRFConsumerBase, Ownable {
//     uint256 public tokenCounter;

//     event CreatedRandomSVG(uint256 indexed tokenId, string tokenURI);
//     event CreatedUnfinishedRandomSVG(uint256 indexed tokenId, uint256 randomNumber);
//     event requestedRandomSVG(bytes32 indexed requestId, uint256 indexed tokenId); 

//     mapping(bytes32 => address) public requestIdToSender;
//     mapping(uint256 => uint256) public tokenIdToRandomNumber;
//     mapping(bytes32 => uint256) public requestIdToTokenId;
    
//     bytes32 internal keyHash;
//     uint256 internal fee;

//     uint256 public maxNumberOfPaths;
//     uint256 public maxNumberOfPathCommands;
//     uint256 public size;
//     uint256 public width;



//     constructor(address _VRFCoordinator, address _LinkToken, bytes32 _keyhash, uint256 _fee) 
    
//     VRFConsumerBase(_VRFCoordinator, _LinkToken)
//     ERC721("Random-OnChain-Art-SVG", "ROAS")
//     {
//         tokenCounter = 0;
//         keyHash = _keyhash;
//         fee = _fee;
//         maxNumberOfPaths = 15;
//         maxNumberOfPathCommands = 10;
//         size = 500;         
//         width = 30;
        
//     }

//     function withdraw() public payable onlyOwner {
//         payable(owner()).transfer(address(this).balance);
//     }

//      function finishMint(uint256 tokenId) public {
//         require(bytes(tokenURI(tokenId)).length <= 0, "tokenURI is already set!"); 
//         require(tokenCounter > tokenId, "TokenId has not been minted yet!");
//         require(tokenIdToRandomNumber[tokenId] > 0, "Need to wait for the Chainlink node to respond!");
//         uint256 randomNumber = tokenIdToRandomNumber[tokenId];
//         string memory svg = generateSVG(randomNumber);
//         string memory imageURI = svgToImageURI(svg);
//         _setTokenURI(tokenId, formatTokenURI(imageURI));
//         emit CreatedRandomSVG(tokenId, svg);
//     }

//     function create() public returns (bytes32 requestId) {
//         requestId = requestRandomness(keyHash, fee);
//         requestIdToSender[requestId] = msg.sender;
//         uint256 tokenId = tokenCounter; 
//         requestIdToTokenId[requestId] = tokenId;
//         tokenCounter = tokenCounter + 1;
//         emit requestedRandomSVG(requestId, tokenId); // just to emit that something happened
//     }


//     function generateSVG(uint256 _randomness) public view returns (string memory finalSvg) {
//         // We will only use the path element, with stroke and d elements
//         uint256 crange = 255;
//         uint256 numberOfPaths = (_randomness % maxNumberOfPaths) + 1;
//         uint256 color = ( _randomness % crange);

//         // <svg height="210" width="500" style="background-color:black">
//         // <line x1="0" y1="0" x2="200" y2="200" style="stroke:hsl(0,100%,50%);stroke-width:10;" />
//         // <line x1="200" y1="200" x2="400" y2="10" style="stroke:hsl(200,100%,45%);stroke-width:10" />
//         // </svg>


//         finalSvg = string(abi.encodePacked("<svg xmlns='http://www.w3.org/2000/svg' height='", uint2str(size),"' width='", uint2str(size),"' style='background-color:black' >"));
        
//         uint256 _brit = 50;
//         uint256 _width = 30;
//         for(uint i = 0; i < numberOfPaths; i++) {
//             // we get a new random number for each path
//             string memory pathSvg = generatePath(uint256(keccak256(abi.encode(_randomness, i))) , color , _width, _brit);
//             finalSvg = string(abi.encodePacked(finalSvg, pathSvg));
//         }
//         _brit = _brit - 6;
//         _width = _width - 5;
//         finalSvg = string(abi.encodePacked(finalSvg, "</svg>"));
//     }


//     function generatePath(uint256 _randomness , uint256 _color , uint256 _width, uint256 _brit) public view returns(string memory pathSvg) {
//         // uint256 numberOfPathCommands = (_randomness % maxNumberOfPathCommands) + 1; 
        
//         pathSvg = "<line ";
//         // don't nedd the no of path commands because svg line has
//         // only 2 commanda needed for 2 points.
//         // <line x1="0" y1="0" x2="200" y2="200" style="stroke:hsl(0,100%,50%);stroke-width:10;" />
        
//         string memory pathCommand = generatePathCommand(uint256(keccak256(abi.encode(_randomness, size ))));
//         pathSvg = string(abi.encodePacked(pathSvg, pathCommand));
    
//        // string memory color = colors[_randomness % colors.length];
//         pathSvg = string(abi.encodePacked(pathSvg, " style='stroke:hsl(", uint2str(_color), ",100%,", uint2str(_brit), "%); stroke-width:" ,uint2str(_width), ";' />" ));
//     }

//     function generatePathCommand(uint256 _randomness) public view returns(string memory pathCommand) {
//         pathCommand ="";
//         uint256 parameterOne = uint256(keccak256(abi.encode(_randomness, size * 2))) % size;
//         uint256 parameterTwo = uint256(keccak256(abi.encode(_randomness, size * 2 + 1))) % size;
//         uint256 parameterThree = uint256(keccak256(abi.encode(_randomness, size * 2 + 2))) % size;
//         uint256 parameterFour = uint256(keccak256(abi.encode(_randomness, size * 2 + 3))) % size;

//         pathCommand = string(abi.encodePacked(pathCommand, "x1= '",uint2str(parameterOne),"' ","y1= '",uint2str(parameterTwo) ,"'"));
//         pathCommand = string(abi.encodePacked(pathCommand, "x2= '",uint2str(parameterThree),"' ","y2= '",uint2str(parameterFour) ,"'"));

//     }


   

//     function fulfillRandomness(bytes32 requestId, uint256 randomNumber) internal override {
//         address nftOwner = requestIdToSender[requestId];
//         uint256 tokenId = requestIdToTokenId[requestId];
//         _safeMint(nftOwner, tokenId);
//         tokenIdToRandomNumber[tokenId] = randomNumber;
//         emit CreatedUnfinishedRandomSVG(tokenId, randomNumber);
//     }




    
//     // From: https://stackoverflow.com/a/65707309/11969592
//     function uint2str(uint _i) internal pure returns (string memory _uintAsString) {
//         if (_i == 0) {
//             return "0";
//         }
//         uint j = _i;
//         uint len;
//         while (j != 0) {
//             len++;
//             j /= 10;
//         }
//         bytes memory bstr = new bytes(len);
//         uint k = len;
//         while (_i != 0) {
//             k = k-1;
//             uint8 temp = (48 + uint8(_i - _i / 10 * 10));
//             bytes1 b1 = bytes1(temp);
//             bstr[k] = b1;
//             _i /= 10;
//         }
//         return string(bstr);
//     }



//     function svgToImageURI(string memory svg) public pure returns (string memory) {
//         // example:
//         // <svg width='500' height='500' viewBox='0 0 285 350' fill='none' xmlns='http://www.w3.org/2000/svg'><path fill='black' d='M150,0,L75,200,L225,200,Z'></path></svg>
//         // data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nNTAwJyBoZWlnaHQ9JzUwMCcgdmlld0JveD0nMCAwIDI4NSAzNTAnIGZpbGw9J25vbmUnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+PHBhdGggZmlsbD0nYmxhY2snIGQ9J00xNTAsMCxMNzUsMjAwLEwyMjUsMjAwLFonPjwvcGF0aD48L3N2Zz4=
//         string memory baseURL = "data:image/svg+xml;base64,";
//         string memory svgBase64Encoded = Base64.encode(bytes(string(abi.encodePacked(svg))));
//         return string(abi.encodePacked(baseURL,svgBase64Encoded));
//     }

//     function formatTokenURI(string memory imageURI) public pure returns (string memory) {
//         return string(
//                 abi.encodePacked(
//                     "data:application/json;base64,",
//                     Base64.encode(
//                         bytes(
//                             abi.encodePacked(
//                                 '{"name":"',
//                                 "SVG NFT", // You can add whatever name here
//                                 '", "description":"An NFT based on SVG!", "attributes":"", "image":"',imageURI,'"}'
//                             )
//                         )
//                     )
//                 )
//             );
//     }

//     // remove later:
//     function bytes32ToString(bytes32 _bytes32) public pure returns (string memory) {
//         uint8 i = 0;
//         while(i < 32 && _bytes32[i] != 0) {
//             i++;
//         }
//         bytes memory bytesArray = new bytes(i);
//         for (i = 0; i < 32 && _bytes32[i] != 0; i++) {
//             bytesArray[i] = _bytes32[i];
//         }
//         return string(bytesArray);
//     }
// }
















// pragma solidity ^0.6.6;

// import "@chainlink/contracts/src/v0.6/VRFConsumerBase.sol";

// contract randomno is VRFConsumerBase {

//     bytes32 public keyHash;
//     uint256 public fee;
//     uint256 public randomResult;

//     constructor() VRFConsumerBase(
//         0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9,
//         0xa36085F69e2889c224210F603D836748e7dC0088
//     )public {

//         keyHash = 0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4;
//         fee = 0.1 * 10 ** 18;
//     }

  

//     function getRandomNumber() public returns ( bytes32 requestId){

//         return requestRandomness( keyHash , fee );

//     }

//     function fulfillRandomness( bytes32 requestId , uint256 randomness) internal override {
//         randomResult = randomness;
//     }
// }


