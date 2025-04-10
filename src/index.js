// src/index.js
import React from "react";
import ReactDOM from "react-dom/client"; // Use 'react-dom/client' for React 18
import App from "./App";
import "./index.css";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { config } from './config'




// Find the root element in the HTML
const rootElement = document.getElementById("root");



// Create a root using React 18's createRoot
const root = ReactDOM.createRoot(rootElement);
const queryClient = new QueryClient()
// Render the App component
root.render(
  <React.StrictMode>
     <WagmiProvider config={config}>
     <QueryClientProvider client={queryClient}>
     
      <App />

    </QueryClientProvider> 
    </WagmiProvider>
   
  </React.StrictMode>
);
