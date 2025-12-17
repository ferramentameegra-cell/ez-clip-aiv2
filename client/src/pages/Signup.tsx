/**
 * Página de Signup - Completamente Refeita
 * Design moderno, funcionalidade robusta, sem loading infinito
 * Usa tRPC corretamente com timeout e tratamento de erros
 */

import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Loader2, Mail, Lock, User, Check, Sparkles, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '@/contexts/ThemeContext';
import { trpc } from '@/lib/trpc';

export function Signup() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const [, setLocation] = useLocation();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
  }>({});

  const isSubmittingRef = useRef(false);

  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: (result) => {
      console.log('[Signup] ✅ Cadastro bem-sucedido:', { userId: result.user.id, email: result.user.email });
      
      try {
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
      } catch (storageError) {
        console.error('[Signup] Erro ao salvar no localStorage:', storageError);
        toast.error('Erro ao salvar dados. Tente novamente.');
        isSubmittingRef.current = false;
        return;
      }

      isSubmittingRef.current = false;
      toast.success(t('signup.signupSuccess'));

      // Redirecionar
      setTimeout(() => {
        setLocation('/onboarding');
      }, 200);
    },
    onError: (error) => {
      console.error('[Signup] ❌ Erro no cadastro:', error);
      isSubmittingRef.current = false;
      
      // Mensagens de erro específicas
      if (error.message?.includes('já cadastrado') || error.message?.includes('already')) {
        toast.error('Este email já está cadastrado. Tente fazer login.');
      } else if (error.message?.includes('mínimo 8')) {
        toast.error('A senha deve ter no mínimo 8 caracteres.');
      } else if (error.message?.includes('timeout') || error.message?.includes('Timeout')) {
        toast.error('A requisição demorou muito. Verifique sua conexão e tente novamente.');
      } else {
        toast.error(error.message || t('signup.signupError'));
      }
    },
  });

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      isSubmittingRef.current = false;
    };
  }, []);

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!name.trim()) {
      newErrors.name = t('signup.validation.nameRequired');
    } else if (name.trim().length < 2) {
      newErrors.name = t('signup.validation.nameMinLength');
    }

    if (!email.trim()) {
      newErrors.email = t('signup.validation.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = t('signup.validation.emailInvalid');
    }

    if (!password) {
      newErrors.password = t('signup.validation.passwordRequired');
    } else if (password.length < 8) {
      newErrors.password = t('signup.validation.passwordMinLength');
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = t('signup.validation.confirmPasswordRequired');
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = t('signup.validation.passwordMismatch');
    }

    if (!agreedTerms) {
      newErrors.terms = t('signup.validation.termsRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmittingRef.current || registerMutation.isPending) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    isSubmittingRef.current = true;
    
    console.log('[Signup] Iniciando cadastro...');
    console.log('[Signup] Email:', email.trim().toLowerCase());
    console.log('[Signup] Nome:', name.trim());

    registerMutation.mutate({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      language: 'pt-BR',
    });
  };

  const isLoading = registerMutation.isPending;

  return (
    <div className={`min-h-screen flex ${isDark ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50'}`}>
      {/* Layout em duas colunas - Design Moderno */}
      <div className="flex-1 flex">
        {/* Coluna Esquerda - Ilustração/Branding */}
        <div className="hidden lg:flex flex-1 items-center justify-center p-12">
          <div className="max-w-md space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-2xl">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Viral Clips AI
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Crie vídeos virais com IA</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
                <span>Cadastro rápido e simples</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                <span>3 créditos grátis ao se cadastrar</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
                <span>Comece a criar vídeos em minutos</span>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna Direita - Formulário de Signup */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className={`w-full max-w-md ${isDark ? 'bg-slate-800/90 backdrop-blur-xl' : 'bg-white/90 backdrop-blur-xl'} rounded-3xl shadow-2xl border ${isDark ? 'border-slate-700' : 'border-gray-200'} p-8 lg:p-10`}>
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 mb-4 shadow-lg">
                <User className="h-8 w-8 text-white" />
              </div>
              <h2 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {t('signup.title')}
              </h2>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {t('signup.subtitle')}
              </p>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Nome */}
              <div className="space-y-2">
                <Label htmlFor="name" className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('signup.form.name')}
                </Label>
                <div className="relative">
                  <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors({ ...errors, name: undefined });
                    }}
                    className={`pl-12 h-12 rounded-xl ${errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''} ${isDark ? 'bg-slate-700/50 border-slate-600 text-white' : 'bg-gray-50 border-gray-200'}`}
                    placeholder={t('signup.form.namePlaceholder')}
                    disabled={isLoading}
                  />
                </div>
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('signup.form.email')}
                </Label>
                <div className="relative">
                  <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: undefined });
                    }}
                    className={`pl-12 h-12 rounded-xl ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''} ${isDark ? 'bg-slate-700/50 border-slate-600 text-white' : 'bg-gray-50 border-gray-200'}`}
                    placeholder={t('signup.form.emailPlaceholder')}
                    disabled={isLoading}
                    autoComplete="email"
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                )}
              </div>

              {/* Senha */}
              <div className="space-y-2">
                <Label htmlFor="password" className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('signup.form.password')}
                </Label>
                <div className="relative">
                  <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors({ ...errors, password: undefined });
                    }}
                    className={`pl-12 pr-12 h-12 rounded-xl ${errors.password ? 'border-red-500 focus-visible:ring-red-500' : ''} ${isDark ? 'bg-slate-700/50 border-slate-600 text-white' : 'bg-gray-50 border-gray-200'}`}
                    placeholder={t('signup.form.passwordPlaceholder')}
                    disabled={isLoading}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500 mt-1">{errors.password}</p>
                )}
              </div>

              {/* Confirmar Senha */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('signup.form.confirmPassword')}
                </Label>
                <div className="relative">
                  <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
                    }}
                    className={`pl-12 pr-12 h-12 rounded-xl ${errors.confirmPassword ? 'border-red-500 focus-visible:ring-red-500' : ''} ${isDark ? 'bg-slate-700/50 border-slate-600 text-white' : 'bg-gray-50 border-gray-200'}`}
                    placeholder={t('signup.form.confirmPasswordPlaceholder')}
                    disabled={isLoading}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={`absolute right-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Termos */}
              <div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedTerms}
                    onChange={(e) => {
                      setAgreedTerms(e.target.checked);
                      if (errors.terms) setErrors({ ...errors, terms: undefined });
                    }}
                    className="mt-1 w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    disabled={isLoading}
                  />
                  <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('signup.form.agreeTerms')}{' '}
                    <Link href="/terms" className={`${isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'} underline`}>
                      {t('signup.form.terms')}
                    </Link>
                  </span>
                </label>
                {errors.terms && (
                  <p className="text-sm text-red-500 mt-1">{errors.terms}</p>
                )}
              </div>

              {/* Botão Submit */}
              <Button
                type="submit"
                className="w-full h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {t('signup.loading')}
                  </>
                ) : (
                  <>
                    {t('signup.form.submit')}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>

            {/* Divisor */}
            <div className="relative my-8">
              <div className={`absolute inset-0 flex items-center ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
                <div className={`w-full border-t ${isDark ? 'border-slate-700' : 'border-gray-200'}`}></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className={`px-4 ${isDark ? 'bg-slate-800 text-gray-400' : 'bg-white text-gray-500'}`}>
                  ou
                </span>
              </div>
            </div>

            {/* Link para Login */}
            <div className={`text-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {t('signup.alreadyHaveAccount')}{' '}
              <Link 
                href="/login" 
                className={`font-semibold ${isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'} transition-colors`}
              >
                {t('signup.loginLink')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
