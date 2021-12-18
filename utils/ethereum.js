import axios from 'axios'

// Check for MetaMask wallet browser extension
function hasEthereum () {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined'
}

//check account profile exist in fs db
async function checkAccountExist (address) {
  try {
    const userProfileFile = (await axios.get(`/samples/userinfo/${address}.json`)).data
    return true
  } catch(e) {
    return false
  }
}

export { 
  hasEthereum,
  checkAccountExist,
}