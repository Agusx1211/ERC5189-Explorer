import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Container, Grid, Loader, NumberFormatter, Pill, Table, Title, Space, Box } from "@mantine/core"

import JsonView from '@uiw/react-json-view'
import { Operation, getOperation, operationToProto } from "../services/Operations"
import { ethers, formatUnits } from "ethers"
import { symbolForToken, unitsForToken } from "../services/UnitsFor"
import { DecodedCalldata } from "../components/Calldata"

export function Operation() {
  const { id } = useParams()
  const [op, setOp] = useState<Operation>()
  const [error, setError] = useState("")

  useEffect(() => {
    if (!id) {
      setError("No ID provided")
      return
    }

    getOperation(id).then(data => {
      setOp(data)
    }).catch(e => {
      setError(e.message)
    })
  }, [])

  return <Box>
    <Title order={3}>Operation {id}</Title>
    <Space h="xl" />
    { (!op && !error) && <Loader /> }
    { error && <Container>{error}</Container> }
    { op && <>
      <Grid grow>
        <Grid.Col span={2}>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Entrypoint</Table.Th>
                <Table.Td>{op.entrypoint}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th>Endorser</Table.Th>
                <Table.Td>{op.endorser}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th>Gas limit</Table.Th>
                <Table.Td>
                  <NumberFormatter thousandSeparator value={op.gasLimit.toString()} />
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th>Fee token</Table.Th>
                <Table.Td>{symbolForToken(op.feeToken)}</Table.Td>
              </Table.Tr>
              {
                op.feeToken !== ethers.ZeroAddress && <Table.Tr>
                <Table.Th>Token rate</Table.Th>
                <Table.Td>
                  <NumberFormatter thousandSeparator value={
                    Number(op.baseFeeScalingFactor) / Number(op.baseFeeNormalizationFactor)
                  } />
                </Table.Td>
              </Table.Tr>
              }
              <Table.Tr>
                <Table.Th>Max fee per gas</Table.Th>
                <Table.Td>
                  <NumberFormatter thousandSeparator value={formatUnits(op.maxFeePerGas, "gwei")} /> GWEI
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th>Priority per gas</Table.Th>
                <Table.Td>
                  <NumberFormatter thousandSeparator value={formatUnits(op.priorityFeePerGas, "gwei")} /> GWEI
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th>Max fee payment</Table.Th>
                <Table.Td>
                  <NumberFormatter thousandSeparator suffix={` ${symbolForToken(op.feeToken)}`} value={
                    ethers.formatUnits(op.maxPayment, unitsForToken(op.feeToken))
                  } />
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th>Min fee payment</Table.Th>
                <Table.Td>
                  <NumberFormatter thousandSeparator suffix={` ${symbolForToken(op.feeToken)} + basefee`} value={
                    ethers.formatUnits((op.priorityFeePerGas * op.gasLimit * op.baseFeeScalingFactor) / op.baseFeeNormalizationFactor, unitsForToken(op.feeToken))
                  } />
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th>Properties</Table.Th>
                <Table.Td>
                  { !op.hasUntrustedContext ? <Pill>Trusted context</Pill> : <></>}
                  { op.hasUntrustedContext ? <Pill color="red">Untrusted context</Pill> : <></>}
                </Table.Td>
              </Table.Tr>
            </Table.Thead>
          </Table>
          <Space h="xl" />
          <Title order={3}>Entrypoint calldata</Title>
          <DecodedCalldata calldata={op.callData} />
          <Space h="xl" />
          <Title order={3}>Endorser calldata</Title>
          <DecodedCalldata calldata={op.endorserCallData} />
        </Grid.Col>
        <Grid.Col span={4}>
          <Container style={{
              lineBreak: "anywhere",
            }}
          >
            <JsonView
              shortenTextAfterLength={0}
              displayDataTypes={false}
              value={operationToProto(op)}
              />
          </Container>
        </Grid.Col>
      </Grid>
    </>}
  </Box>
}
