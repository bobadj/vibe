import React from 'react'
import ReactDOM from 'react-dom/client'
import { WagmiProvider } from 'wagmi';
import { wagmiConfig } from "./utils/confit";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={new QueryClient()}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
)
