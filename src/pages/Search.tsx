import { Box, Divider, Title } from "@mantine/core"
import { useParams } from "react-router-dom"

export function Search() {
  const { val } = useParams()

  return <Box>
    <Title order={3}>Results for {val}:</Title>
    <Divider variant="dashed" />
  </Box>
}
