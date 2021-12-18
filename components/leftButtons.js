
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'

export default function Buttons() {
  const router = useRouter()

  useEffect(() => {
    if(!router.isReady) return
  }, [router.isReady])

  const onClickNetworking = () => {
    // router.push()
  }
  const onClickTransaction = () => {
    router.push('/relate')
  }
  const onClickProfile = () => {
    router.push('/profile')
  }
  
  return(
    <div className="left">
      <span style={{padding: 0, display: 'inline'}}>
        <img className="menu" src="/img/m1.png" alt="" onClick={onClickNetworking} />
        <img className="menu" src="/img/m2.png" alt="" onClick={onClickTransaction} />
        <img className="menu" src="/img/m3.png" alt="" onClick={onClickProfile} /> 
      </span>
    </div>
  )
}
