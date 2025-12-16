/**
 * Página de Login - Nova Estrutura Simplificada
 * Sem complexidade desnecessária, foco em funcionalidade
 */

import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '@/contexts/ThemeContext';

const FRONTEND_TIMEOUT = 10000; // 10 segundos

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

export function Login() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const [, setLocation] = useLocation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isSubmittingRef = useRef(false);

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

    if (isSubmittingRef.current || isLoading) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    // Limpar requisição anterior
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Nova requisição
    const controller = new AbortController();
    abortControllerRef.current = controller;
    isSubmittingRef.current = true;
    setIsLoading(true);

    const startTime = Date.now();

    // Timeout do frontend
    timeoutRef.current = setTimeout(() => {
      if (!controller.signal.aborted) {
        controller.abort();
        setIsLoading(false);
        isSubmittingRef.current = false;
        toast.error('A requisição demorou muito. Verifique sua conexão e tente novamente.');
      }
    }, FRONTEND_TIMEOUT);

    try {
      // Obter URL do backend
      // @ts-ignore
      const backendUrl = import.meta.env?.VITE_TRPC_URL?.replace('/trpc', '') || 
                        (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001');

      const response = await fetch(`${backendUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
        signal: controller.signal,
      });

      // Limpar timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      const duration = Date.now() - startTime;
      console.log(`[Login] Resposta recebida: ${response.status} (${duration}ms)`);

      // Verificar cancelamento
      if (controller.signal.aborted) {
        return;
      }

      const data: LoginResponse = await response.json();

      // Verificar cancelamento novamente
      if (controller.signal.aborted) {
        return;
      }

      if (!response.ok || !data.success || !data.data) {
        const errorMessage = data.error || 'Erro ao fazer login';
        setIsLoading(false);
        isSubmittingRef.current = false;
        toast.error(errorMessage);
        return;
      }

      // Sucesso - salvar dados
      if (controller.signal.aborted) {
        return;
      }

      try {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
      } catch (storageError) {
        console.error('[Login] Erro ao salvar no localStorage:', storageError);
        toast.error('Erro ao salvar dados. Tente novamente.');
        setIsLoading(false);
        isSubmittingRef.current = false;
        return;
      }

      setIsLoading(false);
      isSubmittingRef.current = false;
      toast.success(t('login.loginSuccess'));

      // Redirecionar
      setTimeout(() => {
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

      setIsLoading(false);
      isSubmittingRef.current = false;

      // Tratar AbortError
      if (error.name === 'AbortError' || error.message?.includes('aborted')) {
        // Timeout já mostrou mensagem
        if (Date.now() - startTime < FRONTEND_TIMEOUT) {
          toast.error('A requisição foi cancelada. Tente novamente.');
        }
        return;
      }

      // Outros erros
      console.error('[Login] Erro na requisição:', error);
      toast.error('Erro de conexão. Verifique sua internet e tente novamente.');
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
