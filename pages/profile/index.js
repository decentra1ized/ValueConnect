import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState, useRef } from 'react'
import { ethers } from 'ethers'
import { hasEthereum } from '../../utils/ethereum'
import axios from 'axios'

export default function Home() {
  const [connectedWalletAddress, setConnectedWalletAddressState] = useState('Waiting for the wallet connect......')
  const [walletAddress, setWalletAddress] = useState('')
  const [userProfile, setUserProfile] = useState({
    name: '',
    funFact: '',
    hobby: '',
    interest: '',
    job: ''
  })
  const router = useRouter()
  
  useEffect( () => {
    if(! hasEthereum()) {
      setConnectedWalletAddressState(`MetaMask unavailable`)
      window.addEventListener('ethereum#initialized', async () => {
        console.log('window.ethereum connected by event')
        setConnectedWalletAddress()
      }, {
        once: true,
      })
      return
    }
    setConnectedWalletAddress();
  },[])
  useEffect(() => {
    if(walletAddress) {
      getUserProfileFromServer()
    }
  }, [walletAddress])
  
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
      getUserProfile()
      console.log(address)
    }
  }

  async function getUserProfileFromServer () {
    try {
      const userProfileFile = (await axios.get(`/samples/userinfo/${walletAddress}.json`)).data
      setUserProfile(userProfileFile)
    } catch(e) {
      console.error(e)
      router.push('/')
    }
  }

  return (
    <div className="profile max-w-lg mt-36 mx-auto text-center px-4">
      <Head>
        <title>Solidity Next.js Starter</title>
        <meta name="description" content="Interact with a simple smart contract from the client-side." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="space-y-8">
        <div className="profile-header flex flex-col space-y-4">
          this is profile index page
          { walletAddress ? (
            <div>
              <div>
                Wallet Connected
              </div>
              
              <div className="profile-info flex space-y-2">
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
                  <p>소개 : {userProfile.funFact}</p>
                  <p>취미 : {userProfile.hobby}</p>
                  <p>취향 : {userProfile.interest}</p>
                  <p>직업 : {userProfile.job}</p>
                </div>
              </div>
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
      </main>
    </div>
  )
}