import React from 'react'
import ReactDOM from 'react-dom/client'
import { WagmiProvider } from 'wagmi';
import { wagmiConfig } from "./utils";
import App from './App.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <App />
    </WagmiProvider>
  </React.StrictMode>,
)
