//// http://웹사이트주소/profile/[프로필볼 대상의 eth 주소]

import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import { ethers } from 'ethers'
import { hasEthereum } from '../../utils/ethereum'
import axios from 'axios'
import Buttons from '../../components/leftButtons'
import Header from '../../components/header'

const NowLoading = () => <div>Now Loading......</div>

export default function Home() {
  const [connectedWalletAddress, setConnectedWalletAddressState] = useState('Waiting for the wallet connect......')
  const [walletAddress, setWalletAddress] = useState('')
  const [isloading, setIsLoading] = useState(true)
  const [isNotExist, setIsNotExis] = useState(false) //data not exist
  const router = useRouter()
  const { address } = router.query

  const [userProfile, setUserProfile] = useState(undefined)

  useEffect(() => {
    if(!router.isReady) return
    axios.get(`/samples/userinfo/${address}.json`).then((data) => {
      setIsLoading(false)
      setUserProfile(data.data)
    }).catch((e) => {
      setIsLoading(false)
    })
  }, [router.isReady])
  
  useEffect( () => {
    if(! hasEthereum()) {
      setConnectedWalletAddressState(`MetaMask unavailable`)
      window.addEventListener('ethereum#initialized', async () => {
        console.log('window.ethereum connected by event')
        setConnectedWalletAddress()
        setWalletAddress(await requestAccount())
      }, {
        once: true,
      })
      return
    }
    setConnectedWalletAddress();
  },[])
  
  async function setConnectedWalletAddress() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await window.ethereum.enable()
    const signer = provider.getSigner()
    try {
      const signerAddress = await signer.getAddress()
      setConnectedWalletAddressState(`Connected wallet: ${signerAddress}`)
      setWalletAddress(signerAddress)
    } catch {
      setConnectedWalletAddressState('No wallet connected')
      return
    }
  }
  async function manualConnectWallet() {
    if( hasEthereum() ) {
      await window.ethereum.enable()
      const address = await requestAccount()
      setConnectedWalletAddress()
      setWalletAddress(address[0])
      console.log(address)
    }
  }

  return (
    <div className="">
      <Head>
        <title>User Profile</title>
        <meta name="description" content="Interact with a simple smart contract from the client-side." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="big">
        <Buttons />
        <div className="right">
          <div className="container-fluid">
            <div className="row">
              <div className="col-sm-12" style={{paddingLeft: '2%', paddingTop: '1%', paddingRight: '2%'}}>
                <Header title="User Profile" />
                { address } profile
                { walletAddress ? (
                  <div>
                    Wallet Connected
                  </div>
                ) : (
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white py-4 px-8 rounded-md"
                    onClick={manualConnectWallet}
                  >
                    connect Metamask
                  </button>
                )
                }
              </div>
              { isloading ? <NowLoading /> : 
                <div>
                  {userProfile ? 
                  <div>
                    <div className="profile-info-leftimg">
                      <Image 
                        src={`/samples/userinfo/${walletAddress}.png`}
                        width="120"
                        height="120"
                        alt=""
                      />
                    </div>
                    <div className="profile-info-righttext">
                      <p>이름 : {userProfile.name}</p>
                      <p>성별 : {userProfile.gender}</p>
                      <p>나이 : {userProfile.age}</p>
                      <p>미디어 : {userProfile.socialMedia ? userProfile.socialMedia.join(', ') : ''}</p>
                      <p>취향 : {userProfile.interest ? userProfile.interest.join(', ') : ''}</p>
                    </div>
                  </div>
                  :
                  <div>
                    Oops! User not exist
                  </div>
                  }
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}