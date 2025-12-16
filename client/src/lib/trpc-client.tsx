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
        staleTime: 5 * 60 * 1000,
      },
      mutations: {
        retry: false,
      },
    },
  }));

  const [trpcClient] = useState(() => {
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
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 segundos
            
            try {
              const response = await fetch(url, {
                ...options,
                signal: controller.signal,
              });
              
              clearTimeout(timeoutId);
              
              if (!response.ok && response.status >= 500) {
                const cloned = response.clone();
                const text = await cloned.text();
                console.error('[tRPC] Erro do servidor:', text.substring(0, 200));
              }
              
              return response;
            } catch (error: any) {
              clearTimeout(timeoutId);
              if (error.name === 'AbortError') {
                throw new Error('Timeout: A requisição demorou mais de 30 segundos');
              }
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
