
import { useRouter } from 'next/router'
import { useEffect, useState, useRef } from 'react'
import { ethers } from 'ethers'
import {checkAccountExist, hasEthereum} from '../../../utils/ethereum'
import ERCABI from '../../../constants/abi/new-erc1155.json'
import { TokenContract } from '../../../constants/contracts'

function TokenInfo({tokenInfo}) {
  if(!tokenInfo) {
    return ( <div></div> )
  }
  const tokenKeys = Object.keys(tokenInfo)
  return (
    <div>
      thisistokeninfocomponent
      {tokenKeys.map(t => {
        return (<p key={t}>{t + ': ' + tokenInfo[t]}</p>)
      })}
    </div>
  )
}

export default function Home() {
  const [walletAddress, setWalletAddress] = useState('')
  const [accountExist, setAccountExist] = useState(false)
  const [pageTokenList, setPageTokenList] = useState([])
  const [tokenInfoList] = useState({})
  const router = useRouter()
  const {address} = router.query
  
  useEffect(() => {
    if(!router.isReady) return
    if(! hasEthereum()) {
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
  }, [router.isReady])
  
  async function setConnectedWalletAddress() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await window.ethereum.enable()
    const signer = provider.getSigner()
    try {
      const signerAddress = await signer.getAddress()
      setWalletAddress(signerAddress)
      setAccountExist(await checkAccountExist(signerAddress))

    } catch (e) {
      console.error(e)
      return
    }
    const contract = new ethers.Contract(TokenContract, ERCABI, provider.getSigner())
    console.log('before call contract')
    const tokenList = (await contract.functions.getlist(address)).map(e => Number.parseInt(e))
    for await(const tokenId of tokenList) {
      // get token infos to show user token list...
      const tokenInfo = await contract.functions.getnftdatamapping(tokenId)
      const parsed = ethers.utils.parseBytes32String(tokenInfo[0])
      tokenInfoList[tokenId] = JSON.parse(parsed)
    }
    setPageTokenList(tokenList)
    console.log(tokenList, tokenInfoList)
  }

  return (
    <div>
      {pageTokenList.map(t => {
        return (
          <TokenInfo key={t} tokenInfo={tokenInfoList[t]} />
        )
      })}
    </div>
  )
}
