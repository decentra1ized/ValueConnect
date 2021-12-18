import Head from 'next/head'
import { useEffect, useState, useRef } from 'react'
import { ethers } from 'ethers'
import { hasEthereum } from '../../utils/ethereum'

import Buttons from '../../components/leftButtons'
import Header from '../../components/header'

export default function Home() {
  const [connectedWalletAddress, setConnectedWalletAddressState] = useState('Waiting for the wallet connect......')
  const [walletAddress, setWalletAddress] = useState('')
  
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
        <div>
          <title>Transaction</title>
          {/* <div className="big">
            <Buttons />
            <div className="right">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-sm-12" style={{paddingLeft: '2%', paddingTop: '1%', paddingRight: '2%'}}>
                    <Header title="Networking"/>
                    <br />
                    <br />
                    <br />  
                    <div className="row">
                      <div className="col-sm-12">         
                        <div className="branch" id="b1" style={{marginLeft: '5%'}}>
                          <img src="img/circle-blue.png" style={{visibility: 'hidden', width: '70%', marginLeft: '0%'}} alt="" />
                        </div>
                        <div className="branch" id="b2">
                          <img src="img/circle-purple.png" style={{visibility: 'hidden', width: '70%', marginRight: '0'}} alt="" />
                        </div>
                        <div className="branch" id="b3">
                          <img src="img/circle-green.png" style={{visibility: 'hidden', marginRight: '0'}} alt="" />
                        </div>
                        <div className="branch" id="b4">
                          <img src="img/circle-yellow.png" style={{visibility: 'hidden', width: '70%', marginRight: '0'}} alt="" />
                        </div>
                        <div className="branch" id="b5">
                          <img src="img/circle-red.png" style={{visibility: 'hidden', marginRight: '0'}} alt="" />
                        </div>
                      </div>
                    </div>
                    <br /><br />
                    <div className="row">
                      <div className="col-sm-12">
                        <div className="branch" id="b1" style={{marginLeft: '5%'}}>
                          <img src="img/blue-branch.png" alt="" />
                        </div>
                        <div className="branch" id="b2">
                          <img src="img/purple-branch.png" alt="" />
                        </div>
                        <div className="branch" id="b3">
                          <img src="img/green-branch.png" alt="" />
                        </div>
                        <div className="branch" id="b4">
                          <img src="img/yellow-branch.png" alt="" />
                        </div>
                        <div className="branch" id="b5">
                          <img src="img/red-branch.png" alt="" />
                        </div>
                      </div>
                    </div>
                    <br /><br /><br />
                    <div className="row">
                      <div className="col-sm-12">
                        <div className="branch" id="b1" style={{visibility: 'hidden', marginLeft: '5%'}}>
                          <img src="img/result-blue.png" alt="" />
                        </div>
                        <div className="branch" id="b2">
                          <img src="img/result-purple.png" style={{visibility: 'hidden'}} alt="" />
                        </div>
                        <div className="branch" id="b3">
                          <img src="img/result-green.png" style={{visibility: 'hidden'}} alt="" />
                        </div>
                        <div className="branch" id="b4">
                          <img src="img/result-yellow.png" style={{visibility: 'hidden'}} alt="" />
                        </div>
                        <div className="branch" id="b5">
                          <img src="img/result-red.png" style={{visibility: 'hidden'}} alt="" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        </div>
  )
}