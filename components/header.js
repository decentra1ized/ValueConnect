
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'

export default function Buttons(props) {
  const router = useRouter()

  useEffect(() => {
    if(!router.isReady) return
  }, [router.isReady])
  
  return(
    <div className="">
      <h2>ValueConnect</h2>
      <h1>{props.title}</h1>
      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
        <button id="bt" type="button" className="btn btn-secondary btn-sm">Wallet address</button> 
        <button id="bt" type="button" className="btn btn-secondary btn-sm" style={{marginRight: '9vw', background: 'url("/img/metamask.png")', backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%'}}>&nbsp;&nbsp;&nbsp;&nbsp;</button> 
        <div style={{backgroundColor: 'rgb(221, 221, 221)', position: 'absolute', width: '90%', height: '2px', marginLeft: '1%', marginRight: '2.5%'}} /> 
      </div>
    </div>
  )
}
