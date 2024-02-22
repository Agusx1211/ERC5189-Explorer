import { ethers } from "ethers";

export function unitsForToken(token: string) {
  if (token === 'ETH' || token === ethers.ZeroAddress) {
    return 18
  }

  return 0
}

export function symbolForToken(token: string) {
  if (token === 'ETH' || token === ethers.ZeroAddress) {
    return 'ETH'
  }

  return token
}
