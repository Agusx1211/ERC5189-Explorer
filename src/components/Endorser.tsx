import { useReadContract } from "wagmi"
import { Operation } from "../services/Operations"
import { ENDORSER_ABI } from "../services/Endorser"
import { ethers } from "ethers"
import JsonView from "@uiw/react-json-view"

export function Endorser(props: { operation: Operation }) {
  const res = useReadContract({
    chainId: Number(props.operation.chainId),
    address: props.operation.endorser,
    abi: ENDORSER_ABI,
    functionName: "isOperationReady",
    args: [
      props.operation.entrypoint,
      ethers.hexlify(props.operation.callData),
      ethers.hexlify(props.operation.endorserCallData),
      props.operation.gasLimit,
      props.operation.maxFeePerGas,
      props.operation.priorityFeePerGas,
      props.operation.feeToken,
      props.operation.baseFeeScalingFactor,
      props.operation.baseFeeNormalizationFactor,
      props.operation.hasUntrustedContext
    ]
  })

  return <div>
    <JsonView
      shortenTextAfterLength={0}
      displayDataTypes={false}
      value={res.data ?? {}}
      />
  </div>
}

