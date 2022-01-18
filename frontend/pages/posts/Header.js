import Image from "next/image";
import HeaderItem from "./HeaderItem";
import {
    HomeIcon,
    CubeIcon
} from "@heroicons/react/outline"

import Link from 'next/link'



function Header(){

    return(

        <header className="flex flex-col sm:flex-row m-2 mt-10 justify-between
        items-center h-auto"> 

        <div className="flex flex-grow justify-evenly max-w-sm"> 
           

  <Link href="/">
  <a><HeaderItem title="HOME" Icon={HomeIcon}/></a>
  </Link>

  <Link href="/posts/mintingFrontPage">
   <a><HeaderItem title="MINT" Icon={CubeIcon}/></a>
  </Link>

       
        </div>
        
        <Image 

            className="object-contain"
            src={'/../public/headName.png'}
            width={110}
            height={50}
        />
        </header>
    )
}

export default Header



