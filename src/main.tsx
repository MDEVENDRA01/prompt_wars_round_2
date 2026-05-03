/**
 * @file main.tsx
 * @description Application entry point. Initializes the React root and provides global providers.
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App } from './App';
import './index.css';

/**
 * Global QueryClient instance for TanStack Query.
 */
const globalQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
});

const rootHtmlElement = document.getElementById('root');
if (!rootHtmlElement) {
  throw new Error('Root element not found.');
}

createRoot(rootHtmlElement).render(
  <StrictMode>
    <QueryClientProvider client={globalQueryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);

