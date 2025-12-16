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
    // Em desenvolvimento local, usar Railway
    const backendUrl = import.meta.env?.VITE_BACKEND_URL || 'https://ez-clip-ai-production.up.railway.app';
    const trpcUrl = `${backendUrl}/trpc`;
    
    console.log('[tRPC] Configurando cliente com URL:', trpcUrl);
    
    return trpc.createClient({
      links: [
        httpBatchLink({
          url: trpcUrl,
          headers: () => {
            const token = localStorage.getItem('token');
            return token ? { authorization: `Bearer ${token}` } : {};
          },
          fetch: async (url, options) => {
            console.log('[tRPC] Fazendo requisição para:', url);
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 60000);
            
            try {
              const response = await fetch(url, {
                ...options,
                signal: controller.signal,
                credentials: 'include', // Adicionar para cookies
              });
              
              clearTimeout(timeoutId);
              
              console.log('[tRPC] Resposta recebida:', response.status, response.statusText);
              
              if (!response.ok && response.status >= 500) {
                const cloned = response.clone();
                const text = await cloned.text();
                console.error('[tRPC] Erro do servidor:', text.substring(0, 200));
              }
              
              return response;
            } catch (error: any) {
              clearTimeout(timeoutId);
              console.error('[tRPC] Erro na requisição:', error);
              if (error.name === 'AbortError') {
                throw new Error('Timeout: A requisição demorou mais de 60 segundos. Isso pode indicar problema de conexão com o banco de dados.');
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
