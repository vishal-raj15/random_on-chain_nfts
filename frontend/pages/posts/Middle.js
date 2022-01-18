

import Image from "next/image";
function Middle(){

    return (
        <div className="">
        <div className=" flex-grow grid place-items-center tracking-widest"> 
        <h1 className=" m-2 text-justify text-lg "> RIBBONS is a minting platform to generate On-Chain i.e  Art works without being dependend on IFPS.</h1>

            <h1 className=" m-2 text-justify text-lg "> Built on rinkeby network with the help of chainlink protocol</h1>
            <p1 className=" m-2 text-justify text-lg"> Fully decentralise NFTs</p1>

        </div>

        <div className="mt-10 grid grid-col:1 md:grid-cols-4 md:gap-3 justify-items-center">
        
            <div className="rounded overflow-hidden shadow-lg max-w-sm">
        <Image 
            className="cursor-pointer hover:opacity-80 "
            src={'/../public/b.png'}
            width={350}
            height={350}
        />
        </div>

        <div className="rounded overflow-hidden shadow-lg max-w-sm">
        <Image 

        className="cursor-pointer hover:opacity-80"
        src={'/../public/d.png'}
        width={350}
        height={350}
        />
</div>

        <div className="rounded overflow-hidden shadow-lg max-w-sm">
        <Image 

        className="cursor-pointer hover:opacity-80"
        src={'/../public/e.png'}
        width={350}
        height={350}
        />
    </div>

        <div className="rounded overflow-hidden shadow-lg max-w-sm">
        <Image 

        className="cursor-pointer hover:opacity-80"
        src={'/../public/f.png'}
        width={350}
        height={350}
        />
    </div>
        </div>

        
        <div className=" flex-grow grid place-items-center tracking-widest"> 
            <h1 className=" m-2 text-justify text-lg "> These are some examples of output SVG images </h1>
            <p1 className=" m-2 text-justify text-lg"> This minting process outputs a base64 Incoded URI of an SVG image</p1>

        </div>

        </div>
    )
}

export default Middle;