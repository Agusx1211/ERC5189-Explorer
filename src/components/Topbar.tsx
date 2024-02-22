import { Center, Input, Grid } from "@mantine/core"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export function Topbar() {
  const [search, setSearch] = useState<string | undefined>()

  const navigate = useNavigate()

  return (
    <Grid align="center" style={{ padding: "10px 0" }}>
      <Grid.Col span="content" style={{
        cursor: "pointer"
      }} onClick={() => {
        navigate("/")
      }}>
        <h2 style={{ margin: 0 }}>ERC 5189 Explorer 🔭</h2>
      </Grid.Col>
      <Grid.Col span="auto" />
      <Grid.Col span={4}>
          <Input placeholder="Search..." onChange={(e) => {
            setSearch(e.currentTarget.value)
          }}
          onKeyDown={(e) => {
            if (search?.trim() !== "" && e.key === "Enter") {
              navigate(`/op/${search}`)
            }
          }}
          />
      </Grid.Col>
    </Grid>
  )
}
