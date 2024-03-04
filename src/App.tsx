import { AppShell, MantineProvider } from "@mantine/core"
import { HashRouter as Router, Route, Routes } from "react-router-dom"

import "./App.css"
import "@mantine/core/styles.css"

import { Topbar } from "./components/Topbar"
import { Home } from "./pages/Home"
import { Operation } from "./pages/Operation"
import { Search } from "./pages/Search"

function App() {

  return (
    <MantineProvider>
      <Router>
        <AppShell
          header={{ height: 60 }}
        >
          <AppShell.Header >
            <div style={{ margin: "0 2rem 0 2rem" }}>
              <Topbar />
            </div>
          </AppShell.Header>
          <AppShell.Main style={{
            textAlign: "left",
            width: "100%",
          }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/op/:id" element={<Operation />} />
              <Route path="/search/:val" element={<Search />} />
            </Routes>
          </AppShell.Main>
        </AppShell>
      </Router>
    </MantineProvider>
  )
}

export default App
