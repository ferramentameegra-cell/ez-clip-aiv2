/**
 * Sistema de Login - Completamente Refeito
 * Frontend com timeout e cancelamento de requisição
 * Nunca fica em loading infinito
 */

import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '@/contexts/ThemeContext';

const LOGIN_TIMEOUT_MS = 10000; // 10 segundos (frontend dá margem para backend de 3s)

interface LoginResponse {
  success: boolean;
  data?: {
    user: {
      id: number;
      email: string;
      name: string;
      credits: number;
      language: string;
      avatarUrl: string | null;
    };
    token: string;
  };
  error?: string;
  requestId?: string;
}

export function LoginNew() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const [, setLocation] = useLocation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  // Ref para AbortController (cancelar requisição)
  const abortControllerRef = useRef<AbortController | null>(null);
  // Ref para timeout
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  // Flag para evitar múltiplos submits
  const isSubmittingRef = useRef<boolean>(false);

  // Limpar apenas timeout ao desmontar (NÃO cancelar requisição ativa)
  useEffect(() => {
    return () => {
      // Limpar apenas timeout, não cancelar requisição
      // A requisição deve completar mesmo se o componente for desmontado
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!email.trim()) {
      newErrors.email = t('login.validation.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = t('login.validation.emailInvalid');
    }

    if (!password) {
      newErrors.password = t('login.validation.passwordRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[LoginNew] 📝 Formulário submetido');

    // Prevenir múltiplos submits simultâneos
    if (isSubmittingRef.current || isLoading) {
      console.log('[LoginNew] ⚠️ Submit já em andamento, ignorando...');
      return;
    }

    if (!validateForm()) {
      console.log('[LoginNew] ⚠️ Validação falhou');
      return;
    }

    // Marcar como submetendo
    isSubmittingRef.current = true;

    // Cancelar requisição anterior se existir (limpeza)
    if (abortControllerRef.current && !abortControllerRef.current.signal.aborted) {
      console.log('[LoginNew] 🧹 Cancelando requisição anterior...');
      abortControllerRef.current.abort();
    }

    // Limpar timeout anterior se existir
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Criar novo AbortController
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    const startTime = Date.now();

    console.log('[LoginNew] 📤 Iniciando requisição de login...', {
      email: email.trim().toLowerCase(),
      timestamp: new Date().toISOString(),
    });

    // Timeout do frontend (10 segundos - mais tempo que backend para dar margem)
    timeoutRef.current = setTimeout(() => {
      if (!controller.signal.aborted) {
        const duration = Date.now() - startTime;
        console.error(`[LoginNew] ❌ TIMEOUT do frontend após ${duration}ms`);
        controller.abort();
        setIsLoading(false);
        isSubmittingRef.current = false;
        toast.error('A requisição demorou muito. Verifique sua conexão e tente novamente.');
      }
    }, LOGIN_TIMEOUT_MS); // 10 segundos (backend tem 3s, então 10s é seguro)

    try {
      // Obter URL do backend
      // @ts-ignore - import.meta.env é injetado pelo Vite
      const backendUrl = import.meta.env?.VITE_TRPC_URL?.replace('/trpc', '') || 
                        (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001');

      const response = await fetch(`${backendUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
        signal: controller.signal,
      });

      // Limpar timeout se resposta chegou
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      const duration = Date.now() - startTime;
      console.log(`[LoginNew] 📥 Resposta recebida: ${response.status} (${duration}ms)`, {
        ok: response.ok,
        statusText: response.statusText,
      });

      // Verificar se a requisição foi cancelada antes de ler o body
      if (controller.signal.aborted) {
        console.log('[LoginNew] ⚠️ Requisição foi cancelada antes de processar resposta');
        return;
      }

      const data: LoginResponse = await response.json();
      console.log('[LoginNew] 📦 Dados recebidos:', {
        success: data.success,
        hasData: !!data.data,
        hasError: !!data.error,
        requestId: data.requestId,
      });

      // Verificar novamente se foi cancelada após ler o body
      if (controller.signal.aborted) {
        console.log('[LoginNew] ⚠️ Requisição foi cancelada após ler resposta');
        return;
      }

      if (!response.ok) {
        // Erro do servidor (400, 401, 500)
        const errorMessage = data.error || 'Erro ao fazer login';
        console.error(`[LoginNew] ❌ Erro ${response.status}:`, {
          error: errorMessage,
          requestId: data.requestId,
        });
        setIsLoading(false);
        isSubmittingRef.current = false;
        toast.error(errorMessage);
        return;
      }

      if (!data.success || !data.data) {
        console.error('[LoginNew] ❌ Resposta inválida:', data);
        setIsLoading(false);
        isSubmittingRef.current = false;
        toast.error('Resposta inválida do servidor');
        return;
      }

      // Sucesso!
      console.log('[LoginNew] ✅ Login bem-sucedido:', {
        userId: data.data.user.id,
        email: data.data.user.email,
        duration: `${duration}ms`,
      });

      // Verificar novamente antes de salvar dados
      if (controller.signal.aborted) {
        console.log('[LoginNew] ⚠️ Requisição foi cancelada antes de salvar dados');
        return;
      }

      // Salvar dados
      try {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        console.log('[LoginNew] ✅ Dados salvos no localStorage');
      } catch (storageError) {
        console.error('[LoginNew] ❌ Erro ao salvar no localStorage:', storageError);
        toast.error('Erro ao salvar dados. Tente novamente.');
        setIsLoading(false);
        isSubmittingRef.current = false;
        return;
      }

      setIsLoading(false);
      isSubmittingRef.current = false;
      toast.success(t('login.loginSuccess'));

      // Redirecionar após pequeno delay (garantir que dados foram salvos)
      setTimeout(() => {
        console.log('[LoginNew] 🔄 Redirecionando para /onboarding...');
        // Não cancelar se já foi redirecionado
        if (!controller.signal.aborted) {
          setLocation('/onboarding');
        }
      }, 200);

    } catch (error: any) {
      // Limpar timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      const duration = Date.now() - startTime;
      setIsLoading(false);
      isSubmittingRef.current = false;

      // Tratamento específico para AbortError (cancelamento)
      if (error.name === 'AbortError' || error.message?.includes('aborted')) {
        console.error(`[LoginNew] ❌ Requisição cancelada após ${duration}ms`, {
          reason: 'AbortController.abort() foi chamado',
          duration: `${duration}ms`,
        });
        
        // Não mostrar toast se foi cancelado pelo timeout (já mostrou)
        if (duration < LOGIN_TIMEOUT_MS) {
          toast.error('A requisição foi cancelada. Tente novamente.');
        }
        return;
      }

      // Outros erros de rede
      console.error('[LoginNew] ❌ Erro na requisição:', {
        name: error.name,
        message: error.message,
        stack: error.stack?.substring(0, 300),
        duration: `${duration}ms`,
      });
      
      let errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
      if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
        errorMessage = 'Erro de conexão com o servidor. Verifique sua internet.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <Card className={`w-full max-w-md ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white'}`}>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
            <Lock className="h-6 w-6 text-white" />
          </div>
          <CardTitle className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {t('login.title')}
          </CardTitle>
          <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {t('login.subtitle')}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <Label htmlFor="email" className={isDark ? 'text-gray-300' : ''}>
                {t('login.form.email')}
              </Label>
              <div className="relative mt-1">
                <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: undefined });
                  }}
                  className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                  placeholder={t('login.form.emailPlaceholder')}
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Senha */}
            <div>
              <Label htmlFor="password" className={isDark ? 'text-gray-300' : ''}>
                {t('login.form.password')}
              </Label>
              <div className="relative mt-1">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: undefined });
                  }}
                  className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                  placeholder={t('login.form.passwordPlaceholder')}
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Esqueci a senha */}
            <div className="text-right">
              <Link href="/forgot-password" className={`text-sm ${isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'}`}>
                {t('login.forgotPassword')}
              </Link>
            </div>

            {/* Botão Submit */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('login.loading')}
                </>
              ) : (
                t('login.form.submit')
              )}
            </Button>
          </form>

          {/* Link para Signup */}
          <div className={`mt-6 text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {t('login.noAccount')}{' '}
            <Link href="/signup" className="text-indigo-600 hover:underline font-semibold">
              {t('login.signupLink')}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

