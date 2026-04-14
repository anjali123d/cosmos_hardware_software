import React from 'react'
import Items from "./pages/Items";
import Labs from "./pages/Labs";
import Transactions from "./pages/Transactions";
function App() {
  return (
    <div>
      <h1>Hardware Stock System</h1>

      <Items />
      <Labs />
      <Transactions />
    </div>
  )
}

export default App