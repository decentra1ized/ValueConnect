
import { useRouter } from 'next/router'
import { useEffect, useState, useRef } from 'react'

export default function Home() {
  const router = useRouter()
  
  useEffect(() => {
    if(!router.isReady) return
    router.push('/')
  }, [router.isReady])
  return (<div></div>)
}
