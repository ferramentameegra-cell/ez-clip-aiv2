import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { trpc } from './trpc';

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  }));

  const [trpcClient] = useState(() => {
    // Usar variável de ambiente no build, ou fallback para URL relativa/produção
    // @ts-ignore - import.meta.env é injetado pelo Vite
    const trpcUrl = import.meta.env?.VITE_TRPC_URL || 
                    (typeof window !== 'undefined' ? window.location.origin + '/trpc' : 'http://localhost:3001/trpc');
    
    return trpc.createClient({
      links: [
        httpBatchLink({
          url: trpcUrl,
          headers: () => {
            const token = localStorage.getItem('token');
            return token ? { authorization: `Bearer ${token}` } : {};
          },
          fetch: async (url, options) => {
            try {
              const response = await fetch(url, options);
              // Verificar se a resposta é válida
              if (!response.ok && response.status >= 500) {
                const text = await response.text();
                console.error('[tRPC] Server error:', text);
              }
              return response;
            } catch (error) {
              console.error('[tRPC] Fetch error:', error);
              throw error;
            }
          },
        }),
      ],
    });
  });

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
