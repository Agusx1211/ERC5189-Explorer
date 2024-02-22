import { ethers } from "ethers"

export function parseBigInt(value: string): bigint {
  if (value.startsWith("0x")) {
    if (value.length == 2) {
      return BigInt(0)
    }

    return BigInt(value)
  }

  return BigInt(value)
}

export function parseArray(value: string): Uint8Array {
  if (value.startsWith("0x") && value.length === 2) {
    return new Uint8Array()
  }

  return ethers.toBeArray(value)
}
