
import Header from './posts/Header';
import Head from 'next/head';
import Middle from './posts/Middle';
import Link from 'next/link'
// import { contract } from '@chainlink/test-helpers';
// import { eventDoesNotExist } from '@chainlink/test-helpers/dist/src/matchers';
// import { parseTransaction } from 'ethers/lib/utils';


export default function Home() {

  return (
    <div className="">

      <Header />
      <Middle />
     
     {/* foolter ----------------- */}

    </div>
  )
}



