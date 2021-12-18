////copy this file for easy web3 connect initialize.

import Head from 'next/head'
import { useCallback, useEffect, useState, useRef, createRef } from 'react'
import { ethers } from 'ethers'
import axios from 'axios'
import { hasEthereum } from '../../utils/ethereum'

import {UiFileInputButton} from '../../components/uiFileInput'
import Buttons from '../../components/leftButtons'
import Header from '../../components/header'
import router from 'next/router'

export default function Home() {
  const [connectedWalletAddress, setConnectedWalletAddressState] = useState('Waiting for the wallet connect......')
  const [walletAddress, setWalletAddress] = useState('')
  const [thumb, setThumb] = useState([]);
  const [registerStatus, setRegisterStatus] = useState('')

  const nameRef = useRef()
  const genderRef = useRef()
  const ageRef = useRef()
  const [socialMediaState, setSocialMediaState] = useState([useRef()])
  const [interestState, setInterestState] = useState([useRef()])

  const [sendImage, setSendImage] = useState()
  
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
  async function onClickSignin() {
    const userData = {
      name: nameRef.current.value,
      gender: genderRef.current.value,
      age: ageRef.current.value,
      socialMedia: socialMediaState.map(e => e.current.value),
      interest: interestState.map(e => e.current.value),
      address: walletAddress,
    }
    console.log(sendImage, userData)
    if(!sendImage) {
      setRegisterStatus('Must Select your Profile Image')
    }
    axios.post("/api/signin", userData).then(() => {
      const config = {
        headers: {
          "content-type": "multipart/form-data",
          "x-user-address": walletAddress,
        },
      }
      axios.post("/api/uploadimg", sendImage, config).then((res) => {
        router.push('/profile')
      })
    })
  }
  async function onChange (formData) {
    console.log('image form changed', formData)
    setSendImage(formData)
  }
  async function onMoreMedia () {
    socialMediaState.push(createRef())
    setSocialMediaState([...socialMediaState])
    console.log('more media', socialMediaState)
  }
  async function onRemoveMedia () {
    socialMediaState.pop(createRef())
    setSocialMediaState([...socialMediaState])
  }
  async function onMoreInterest () {
    interestState.push(createRef())
    setInterestState([...interestState])
  }
  async function onRemoveInterest () {
    interestState.pop(createRef())
    setInterestState([...interestState])
  }

  return (
    <div className="">
      <Head>
        <title>Solidity Next.js Starter</title>
        <meta name="description" content="Interact with a simple smart contract from the client-side." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="big">
        <Buttons />
        <div className="right">
          <div className="container-fluid">
            <div className="row">
              <div className="col-sm-12" style={{paddingLeft: '2%', paddingTop: '1%', paddingRight: '2%'}}>
                <Header title="Sign In" />
                <br/>
                <div className="signin-body">
                  { walletAddress ? (
                    <div></div>
                  ) : (
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white py-4 px-8 rounded-md"
                      onClick={manualConnectWallet}
                    >
                      connect Metamask
                    </button>
                  )
                  }
                  <div className="signin-label">
                    <div className="signin-label-circle">
                      1
                    </div>
                    <div className="signin-label-text">
                      name
                    </div>
                  </div>
                  <div className="signin-input">
                    <input className="signin-input-input" type="text" ref={nameRef}></input>
                  </div>
                  <div className="signin-label">
                    <div className="signin-label-circle">
                      2
                    </div>
                    <div className="signin-label-text">
                      Gender
                    </div>
                  </div>
                  <div className="signin-input">
                    <input className="signin-input-input" type="text" ref={genderRef}></input>
                  </div>
                  <div className="signin-label">
                    <div className="signin-label-circle">
                      3
                    </div>
                    <div className="signin-label-text">
                      Age
                    </div>
                  </div>
                  <div className="signin-input">
                    <input className="signin-input-input" type="number" ref={ageRef}></input>
                  </div>
                  <div className="signin-label">
                    <div className="signin-label-circle">
                      4
                    </div>
                    <div className="signin-label-text">
                      Social Media (Twitter, Discord, Telegram... etc)
                    </div>
                  </div>
                  <div className="signin-input">
                    {socialMediaState.map((s, i) => {
                      return (
                        <input className="signin-input-input" type="text" ref={s} key={i}></input>
                      )
                    })}
                    <div className="signin-morebutton" onClick={onMoreMedia}>
                    + More
                    </div>
                    <div className="signin-morebutton" onClick={onRemoveMedia}>
                    - Remove
                    </div>
                  </div>
                  <div className="signin-label">
                    <div className="signin-label-circle">
                      5
                    </div>
                    <div className="signin-label-text">
                      which you`re interested in (Optional)
                    </div>
                  </div>
                  <div className="signin-input">
                    {interestState.map((s, i) => {
                      return (
                        <input className="signin-input-input" type="text" ref={s} key={i}></input>
                      )
                    })}
                    <div className="signin-morebutton" onClick={onMoreInterest}>
                    + More
                    </div>
                    <div className="signin-morebutton" onClick={onRemoveInterest}>
                    - Remove
                    </div>
                  </div>
                  <UiFileInputButton
                    label="Upload Profile Image"
                    // allowMultipleFiles 가 false 일경우, 하나씩만 올릴 수 있다.
                    allowMultipleFiles={false}
                    uploadFileName='file'
                    userAddress={walletAddress}
                    onChange={onChange}
                  />
                  <button className="signin-input-input" onClick={onClickSignin}>
                    Create my account
                  </button>
                  <div className="signin-error">
                    {registerStatus}
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