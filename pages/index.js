import Head from 'next/head'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import { ethers } from 'ethers'
import { hasEthereum } from '../utils/ethereum'
import Greeter from '../src/artifacts/contracts/Greeter.sol/Greeter.json'

export default function Home() {
  const [greeting, setGreetingState] = useState('')
  const [newGreeting, setNewGreetingState] = useState('')
  const [newGreetingMessage, setNewGreetingMessageState] = useState('')
  const [connectedWalletAddress, setConnectedWalletAddressState] = useState('Waiting for the wallet connect......')
  const [walletAddress, setWalletAddress] = useState('')
  const newGreetingInputRef = useRef()

  const router = useRouter()

  // If wallet is already connected...
  useEffect( () => {
    if(! hasEthereum()) {
      setConnectedWalletAddressState(`MetaMask unavailable`)
      window.addEventListener('ethereum#initialized', async () => {
        console.log('window.ethereum connected by event')
        setConnectedWalletAddress()
        router.push('/profile')
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
      router.push('/profile')
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
      router.push('/profile')
      setWalletAddress(address[0])
      console.log(address)
    }
  }

  // Request access to MetaMask account
  async function requestAccount() {
    return await window.ethereum.request({ method: 'eth_requestAccounts' } )
  }

  // Call smart contract, fetch current value
  async function fetchGreeting() {
    if ( ! hasEthereum() ) {
      setConnectedWalletAddressState(`MetaMask unavailable`)
      return
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const contract = new ethers.Contract(process.env.NEXT_PUBLIC_GREETER_ADDRESS, Greeter.abi, provider)
    try {
      const data = await contract.greet()
      setGreetingState(data)
    } catch(error) {
      console.log(error)
    }
  }

  // Call smart contract, set new value
  async function setGreeting() {
    if ( ! hasEthereum() ) {
      setConnectedWalletAddressState(`MetaMask unavailable`)
      return
    }
    if(! newGreeting ) {
      setNewGreetingMessageState('Add a new greeting first.')
      return
    }
    await requestAccount()
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner()
    const signerAddress = await signer.getAddress()
    setConnectedWalletAddressState(`Connected wallet: ${signerAddress}`)
    const contract = new ethers.Contract(process.env.NEXT_PUBLIC_GREETER_ADDRESS, Greeter.abi, signer)
    const transaction = await contract.setGreeting(newGreeting)
    await transaction.wait()
    setNewGreetingMessageState(`Greeting updated to ${newGreeting} from ${greeting}.`)
    newGreetingInputRef.current.value = ''
    setNewGreetingState('')
  }

  return (
    <div className="index max-w-lg mt-36 mx-auto text-center px-4">
      <Head>
        <title>Solidity Next.js Starter</title>
        <meta name="description" content="Interact with a simple smart contract from the client-side." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="space-y-8">
        <h1 className="text-4xl font-semibold mb-8">
          Solidity Next.js Starter
        </h1>
        <div className="space-y-8">
          <div className="space-y-8">
            <div className="flex flex-col space-y-4">
              <div className="h-2">
                { newGreetingMessage && <span className="text-sm text-gray-500 italic">{newGreetingMessage}</span> }
              </div>
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
          </div>
          <div className="h-4">
            { connectedWalletAddress && <p className="text-md">{connectedWalletAddress}</p> }
          </div>
        </div>
      </main>
    </div>
  )
}
