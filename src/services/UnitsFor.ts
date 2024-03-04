import { ethers } from "ethers";

export function unitsForToken(token: string) {
  if (token === 'ETH' || token === ethers.ZeroAddress) {
    return 18
  }

  if (token.toLowerCase() === "0x750ba8b76187092B0D1E87E28daaf484d1b5273b".toLowerCase()) {
    return 6
  }

  return 0
}

export function symbolForToken(token: string) {
  if (token === 'ETH' || token === ethers.ZeroAddress) {
    return 'ETH'
  }

  if (token.toLowerCase() === "0x750ba8b76187092B0D1E87E28daaf484d1b5273b".toLowerCase()) {
    return 'USDC'
  }

  return token
}
