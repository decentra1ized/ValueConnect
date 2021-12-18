import Head from 'next/head'
import { useEffect, useState, useRef } from 'react'
import { ethers } from 'ethers'
import { hasEthereum } from '../../utils/ethereum'

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
          <meta charSet="UTF-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.2/dist/css/bootstrap.min.css" rel="stylesheet" />
          <title>Networking</title>
          <style dangerouslySetInnerHTML={{__html: "\n    img{\n        width:100%;\n    }\n    div.branch{\n        display: inline-block;\n        width:16%;\n    }\n    div.big {\n        width: 100%;\n    }\n    div.left {\n        width: 4%;\n        float: left;\n        box-sizing: border-box;\n    }\n    div.right {\n        width: 96%;\n        float: right;\n    }\n    div.branch{\n        text-align: center;\n    }\n    h1{\n        font-size:1.3em;\n    }\n    h2{\n        font-size: 0.5em;\n    }\n    #bt{\n        z-index: 2;\n        position: fixed;\n    }\n" }} />
          <div className="big">
            <div className="left">
              <span style={{padding: 0, display: 'inline'}}>
                <img className="menu" src="../../img/m1.png" alt="" /><br />
                <img className="menu" src="../../img/m2.png" alt="" /><br />
                <img className="menu" src="../../img/m3.png" alt="" /> 
              </span>
            </div>
            <div className="right">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-sm-12" style={{paddingLeft: '2%', paddingTop: '1%', paddingRight: '2%'}}>
                    <h2>ValueConnect</h2>
                    <h1>Networking</h1>
                    <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                      <button id="bt" type="button" className="btn btn-secondary btn-sm">Wallet address</button> 
                      <button id="bt" type="button" className="btn btn-secondary btn-sm" style={{marginRight: '9vw', background: 'url("img/metamask.png")', backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%'}}>&nbsp;&nbsp;&nbsp;&nbsp;</button> 
                      <div style={{backgroundColor: 'rgb(221, 221, 221)', position: 'absolute', width: '90%', height: '2px', marginLeft: '1%', marginRight: '2.5%'}} /> 
                    </div>
                    <br />
                    <br />
                    <br />  
                    <div className="row">
                      <div className="col-sm-12">         
                        <div className="branch" id="b1" style={{marginLeft: '5%'}}>
                          <img src="../../img/circle-blue.png" style={{display: 'none', width: '80%'}} alt="" />
                        </div>
                        <div className="branch" id="b2">
                          <img src="../../img/circle-purple.png" style={{width: '70%'}} alt="" />
                        </div>
                        <div className="branch" id="b3">
                          <img src="../../img/circle-green.png" style={{display: 'none'}} alt="" />
                        </div>
                        <div className="branch" id="b4">
                          <img src="../../img/circle-yellow.png" style={{width: '70%'}} alt="" />
                        </div>
                        <div className="branch" id="b5">
                          <img src="../../img/circle-red.png" style={{display: 'none'}} alt="" />
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
                        <div className="branch" id="b1" style={{marginLeft: '5%'}}>
                          <img src="../../img/result-blue.png" alt="" />
                        </div>
                        <div className="branch" id="b2">
                          <img src="../../img/result-purple.png" style={{display: 'none'}} alt="" />
                        </div>
                        <div className="branch" id="b3">
                          <img src="../../img/result-green.png" alt="" />
                        </div>
                        <div className="branch" id="b4">
                          <img src="../../img/result-yellow.png" style={{display: 'none'}} alt="" />
                        </div>
                        <div className="branch" id="b5">
                          <img src="../../img/result-red.png" alt="" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  )
}