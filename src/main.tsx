import React from 'react'
import ReactDOM from 'react-dom/client'
import { WagmiProvider } from 'wagmi';
import { wagmiConfig } from "./utils/config";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.tsx'

const client = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={client}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
)
