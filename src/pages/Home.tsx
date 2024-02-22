import { useEffect, useState } from "react"
import { loadOperations } from "../services/Bundler"
import { Box, Skeleton, Table } from "@mantine/core"
import { Operation, getOperation } from "../services/Operations"
import { ethers } from "ethers"
import { symbolForToken, unitsForToken } from "../services/UnitsFor"

const REFRESH_INTERVAL = 1000

export function OperationRow(props: { key: number, cid: string }) {
  const { cid, key } = props

  const [op, setOp] = useState<Operation>()

  useEffect(() => {
    getOperation(cid).then(op => {
      setOp(op)
    })
  }, [cid])

  const maxPayment = op?.maxPayment && `${ethers.formatUnits(op.maxPayment, unitsForToken(op.feeToken))} ${symbolForToken(op.feeToken)}` || <Skeleton height={8} />

  return <Table.Tr key={key}>
    <Table.Td>Mempool</Table.Td>
    <Table.Td><a href={`./#/op/${cid}`}>{cid}</a></Table.Td>
    <Table.Td>{op?.entrypoint || <Skeleton height={8} />}</Table.Td>
    <Table.Td>{op?.endorser || <Skeleton height={8} />}</Table.Td>
    <Table.Td>{maxPayment || <Skeleton height={8} />}</Table.Td>
  </Table.Tr>
}

export function Home() {
  const [operations, setOperations] = useState<string[]>([])
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchOperations = async () => {
      try {
        const ops = await loadOperations()
        setOperations(ops.operations.mempool)
        setError("")
      } catch (e: any) {
        setError(e.message)
      }
    }

    fetchOperations()
    const interval = setInterval(fetchOperations, REFRESH_INTERVAL)
    return () => clearInterval(interval)
  }, [])

  return <Box>
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Source</Table.Th>
          <Table.Th>Operation</Table.Th>
          <Table.Th>Entrypoint</Table.Th>
          <Table.Th>Endorser</Table.Th>
          <Table.Th>Max fee</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {operations.map((op, i) => <OperationRow key={i} cid={op} />)}
      </Table.Tbody>
    </Table>
    {error && <div>{error}</div>}
  </Box>
}
