import { useEffect, useState } from "react";
import { ParsedCall, parseCalldata, signatureFor } from "../services/4bytes";
import { Loader, Table } from "@mantine/core";

export function DecodedCalldata(props: { calldata?: Uint8Array }) {
  const [parsedCalldata, setParsedCalldata] = useState<ParsedCall | undefined>()
  const [message, setMessage] = useState<string | undefined>()

  const loading = !parsedCalldata && !message

  useEffect(() => {
    const calldata = props.calldata
    if (!calldata) {
      return
    }

    signatureFor(calldata).then(sig => {
      if (calldata.length < 4) {
        setMessage("Empty calldata")
        return
      }

      if (!sig) {
        setMessage("Unknown signature")
        return
      }

      try {
        const parsed = parseCalldata(calldata, sig)
        setParsedCalldata(parsed)
      } catch (e: any) {
        setMessage(e.message)
      }
    }).catch(e => {
      setMessage(e.message)
    })
  }, [props.calldata])

  return <>
    { loading && <Loader /> }
    { message && <div>{message}</div> }
    { parsedCalldata && <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Arg</Table.Th>
            <Table.Th>Type</Table.Th>
            <Table.Th>Value</Table.Th>
          </Table.Tr>
          <Table.Tr>
            <Table.Th />
            <Table.Th>Name</Table.Th>
            <Table.Td>{parsedCalldata.name}</Table.Td>
          </Table.Tr>
            { parsedCalldata.args.map((arg, i) =>
              <Table.Tr key={i}>
                <Table.Th>{i}</Table.Th>
                <Table.Th>{arg.type}</Table.Th>
                <Table.Td className="code-mono">{arg.value}</Table.Td>
              </Table.Tr>)
            }
        </Table.Thead>
      </Table>
    }
  </>
}

