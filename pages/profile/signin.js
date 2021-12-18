////copy this file for easy web3 connect initialize.

import Head from 'next/head'
import { useCallback, useEffect, useState, useRef } from 'react'
import { ethers } from 'ethers'
import axios from 'axios'
import { hasEthereum } from '../../utils/ethereum'

import {UiFileInputButton} from '../../components/uiFileInput'

export default function Home() {
  const [connectedWalletAddress, setConnectedWalletAddressState] = useState('Waiting for the wallet connect......')
  const [walletAddress, setWalletAddress] = useState('')
  const [thumb, setThumb] = useState([]);
  
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
  const onChange = useCallback(
    async (formData) => {
      const config = {
        headers: {
          "content-type": "multipart/form-data",
          "x-user-address": walletAddress,
        },
      }
      axios.post("/api/uploadimg", formData, config).then((res) => {
        setThumb([...thumb, ...res.data]);
      })
    },
    [thumb]
  )

  return (
    <div className="max-w-lg mt-36 mx-auto text-center px-4">
      <Head>
        <title>Solidity Next.js Starter</title>
        <meta name="description" content="Interact with a simple smart contract from the client-side." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="space-y-8">
        <div className="space-y-8">
          <div className="flex flex-col space-y-4">
            this is profile index page
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
          <UiFileInputButton
            label="Upload Single File"
            // allowMultipleFiles 가 false 일경우, 하나씩만 올릴 수 있다.
            allowMultipleFiles={false}
            uploadFileName='file'
            userAddress={walletAddress}
            onChange={onChange}
          />
        </div>
      </main>
    </div>
  )
}