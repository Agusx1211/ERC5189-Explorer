
import { ethers } from 'ethers'
import { Operation } from '../pages/Operation'
import { getIpfsData } from './Ipfs'
import { parseArray, parseBigInt } from '../utils/Math'

export type OperationProto = {
  entrypoint: string,
  callData: string,
  gasLimit: string,
  feeToken: string,
  endorser: string,
  endorserCallData: string,
  endorserGasLimit: string,
  maxFeePerGas: string,
  priorityFeePerGas: string,
  baseFeeScalingFactor: string,
  baseFeeNormalizationFactor: string,
  hasUntrustedContext: boolean
}

export type Operation = {
  entrypoint: string
  callData: Uint8Array
  gasLimit: bigint
  feeToken: string
  endorser: string
  endorserCallData: Uint8Array
  endorserGasLimit: bigint
  maxFeePerGas: bigint
  priorityFeePerGas: bigint
  baseFeeScalingFactor: bigint
  baseFeeNormalizationFactor: bigint
  hasUntrustedContext: boolean
  maxPayment: bigint
}

export function isOperationProto(data: any): data is OperationProto {
  return (
    typeof data.entrypoint === 'string' &&
    typeof data.callData === 'string' &&
    typeof data.gasLimit === 'string' &&
    typeof data.feeToken === 'string' &&
    typeof data.endorser === 'string' &&
    typeof data.endorserCallData === 'string' &&
    typeof data.endorserGasLimit === 'string' &&
    typeof data.maxFeePerGas === 'string' &&
    typeof data.priorityFeePerGas === 'string' &&
    typeof data.baseFeeScalingFactor === 'string' &&
    typeof data.baseFeeNormalizationFactor === 'string' &&
    typeof data.hasUntrustedContext === 'boolean'
  )
}

export function protoToOperation(proto: OperationProto): Operation {
  const parsed = {
    entrypoint: proto.entrypoint,
    callData: parseArray(proto.callData),
    gasLimit: parseBigInt(proto.gasLimit),
    feeToken: proto.feeToken,
    endorser: proto.endorser,
    endorserCallData: parseArray(proto.endorserCallData),
    endorserGasLimit: parseBigInt(proto.endorserGasLimit),
    maxFeePerGas: parseBigInt(proto.maxFeePerGas),
    priorityFeePerGas: parseBigInt(proto.priorityFeePerGas),
    baseFeeScalingFactor: parseBigInt(proto.baseFeeScalingFactor),
    baseFeeNormalizationFactor: parseBigInt(proto.baseFeeNormalizationFactor),
    hasUntrustedContext: proto.hasUntrustedContext
  }

  const maxPayment = (parsed.maxFeePerGas * parsed.gasLimit * parsed.baseFeeScalingFactor) / parsed.baseFeeNormalizationFactor

  return {
    ...parsed,
    maxPayment
  }
}

export function operationToProto(operation: Operation): OperationProto {
  return {
    entrypoint: operation.entrypoint,
    callData: ethers.hexlify(operation.callData),
    gasLimit: operation.gasLimit.toString(),
    feeToken: operation.feeToken,
    endorser: operation.endorser,
    endorserCallData: ethers.hexlify(operation.endorserCallData),
    endorserGasLimit: operation.endorserGasLimit.toString(),
    maxFeePerGas: operation.maxFeePerGas.toString(),
    priorityFeePerGas: operation.priorityFeePerGas.toString(),
    baseFeeScalingFactor: operation.baseFeeScalingFactor.toString(),
    baseFeeNormalizationFactor: operation.baseFeeNormalizationFactor.toString(),
    hasUntrustedContext: operation.hasUntrustedContext
  }
}

export async function getOperation(cid: string): Promise<Operation> {
  const data = await getIpfsData(cid)

  if (!isOperationProto(data)) {
    throw new Error('Invalid operation data')
  }

  return protoToOperation(data)
}