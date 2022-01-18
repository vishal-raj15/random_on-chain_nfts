

import Image from "next/image";
function Middle(){

    return (
        <div className="min-h-screen">
        <div className=" flex-grow grid items-center tracking-widest"> 
        <h1 className=" mt-20 text-center  md:text-9xl text-6xl text-white font-bold mx-auto max-w-6xl"> RIBBONS</h1>

           
        <h1 className=" mt-5 text-center  md:text-9xl text-6xl text-white font-bold"> an On-Chain Artwork</h1>
        <h1 className=" mt-5 text-center text-4xl md:text-5xl text-white"> without being dependend on IFPS.</h1>

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

        
        <div className=" flex-grow grid place-items-center"> 
            <h1 className=" m-2 text-justify text-4xl"> Ready to mint your own NFT ? </h1>
        </div>

        </div>
    )
}

export default Middle;