////copy this file for easy web3 connect initialize.

import Head from 'next/head'
import { useEffect, useState, useRef } from 'react'
import { ethers } from 'ethers'
import { hasEthereum } from '../../utils/ethereum'

import ERC1155ABI from '../../constants/abi/erc1155.json'
import { TokenContract } from '../../constants/contracts'

export default function Home() {
  const [connectedWalletAddress, setConnectedWalletAddressState] = useState('Waiting for the wallet connect......')
  const [walletAddress, setWalletAddress] = useState('')

  const erc1155DataInput = useRef()
  const erc1155MintingCountInput = useRef()
  
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
    const provider = new ethers.providers.Web3Provider(window.ethereum)
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

  async function onClickMinting () {
    console.warn('mock minting')
    if(!hasEthereum || !walletAddress) {
      return
    }
    
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const contract = new ethers.Contract(TokenContract, ERC1155ABI, provider.getSigner())
    const contractResult = await contract.balanceOf(walletAddress, 0)
    console.log(contractResult)
  }

  return (
    <div className="max-w-lg mt-36 mx-auto text-center px-4">
      <Head>
        <title>Minting page</title>
        <meta name="description" content="Interact with a simple smart contract from the client-side." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="space-y-8">
        <div className="space-y-8">
          <div className="flex flex-col space-y-4">
            this is profile index page
            { walletAddress ? (
              <div>
                <div>
                  Wallet Connected
                </div>
                <div>
                  <input
                    className="border p-4 text-center"
                    onChange={ e => setNewGreetingState(e.target.value)}
                    placeholder="token additional data"
                    ref={erc1155DataInput}
                  />
                </div>
                <div>
                  <input
                    className="border p-4 text-center"
                    onChange={ e => setNewGreetingState(e.target.value)}
                    placeholder="token minting count"
                    type="number"
                    ref={erc1155MintingCountInput}
                  />
                </div>
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white py-4 px-8 rounded-md"
                  onClick={onClickMinting}
                >
                  Minting
                </button>
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
      </main>
    </div>
  )
}