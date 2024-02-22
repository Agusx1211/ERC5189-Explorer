
import axios from 'axios'


// const ipfsBaseUrl = 'https://ipfs.io/ipfs/<cid>'
const ipfsBaseUrl = 'http://192.168.122.23:9091/api/v0/cat?arg=<cid>'

let supportedIpfs = true

// TODO: Try to use `ipfs://` first, then fallback to `https://ipfs.io/ipfs/`
export async function getIpfsData(cid: string): Promise<Object> {
  if (supportedIpfs) {
    try {
      return await getIpfsDataLocal(cid)
    } catch (e) {
      supportedIpfs = false
      console.warn("Local IPFS failed, falling back to gateway", e)
    }
  }

  return getIpfsDataGateway(cid)
}

export async function getIpfsDataLocal(cid: string): Promise<Object> {
  const res = await fetch(`ipfs://${cid}`)
  return res.json()
}

export async function getIpfsDataGateway(cid: string): Promise<Object> {
  const res = await axios.get(`${ipfsBaseUrl.replace('<cid>', cid)}`)
  return res.data
}
