import axios from "axios"
import { ethers } from "ethers"

const BASE_URL = "https://www.4byte.directory/api/v1/signatures/?hex_signature="

/*
{"count":1,"next":null,"previous":null,"results":[{"id":1115316,"created_at":"2024-02-22T08:34:11.823680Z","text_signature":"_addSupportToken(address,uint8)","hex_signature":"0x9b908620","bytes_signature":" "}]}
*/

type Bytes4Result = {
  id: number
  created_at: string
  text_signature: string
  hex_signature: string
  bytes_signature: string
}

type Bytes4Response = {
  count: number
  results: Bytes4Result[]
}

export async function signatureFor(calldata: Uint8Array): Promise<string | undefined> {
  if (calldata.length < 4) {
    return undefined
  }

  const selector = ethers.hexlify(calldata.slice(0, 4)).replace("0x", "")
  const res = await axios.get(`${BASE_URL}${selector}`) as { data: Bytes4Response }
  if (res.data.count === 0) {
    return undefined
  }

  // Find the shortest signature, if there are multiple
  // with the same length, just pick the one with the lower id
  let shortest = res.data.results[0]

  for (let i = 1; i < res.data.results.length; i++) {
    if (res.data.results[i].hex_signature.length < shortest.hex_signature.length) {
      shortest = res.data.results[i]
    }
  }

  return shortest.text_signature
}

export type ParsedCall = {
  name: string
  args: {
    type: string
    value: string
  }[]
}

export function parseCalldata(calldata: Uint8Array, signature: string): ParsedCall {
  const parts = signature.split("(")
  const name = parts[0]
  const args = parts[1].split(")")[0].split(",")

  const res = ethers.AbiCoder.defaultAbiCoder().decode(args, calldata.slice(4))
  return {
    name,
    args: res.map((value, i) => ({
      type: args[i],
      value: value.toString()
    }))
  }
}
