import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Loader2, Mail, Lock, User, Check } from 'lucide-react';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';
import { useTheme } from '@/contexts/ThemeContext';

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

  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: (result) => {
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      toast.success(t('signup.signupSuccess'));
      setLocation('/dashboard');
    },
    onError: (error) => {
      toast.error(error.message || t('signup.signupError'));
    },
  });

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!name.trim()) {
      newErrors.name = t('signup.validation.nameRequired');
    } else if (name.trim().length < 3) {
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

    if (!validateForm()) {
      return;
    }

    registerMutation.mutate({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    });
  };

  const isLoading = registerMutation.isPending;

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <Card className={`w-full max-w-md ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white'}`}>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
            <User className="h-6 w-6 text-white" />
          </div>
          <CardTitle className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {t('signup.title')}
          </CardTitle>
          <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {t('signup.subtitle')}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nome */}
            <div>
              <Label htmlFor="name" className={isDark ? 'text-gray-300' : ''}>
                {t('signup.form.name')}
              </Label>
              <div className="relative mt-1">
                <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors({ ...errors, name: undefined });
                  }}
                  className={`pl-10 ${errors.name ? 'border-red-500' : ''}`}
                  placeholder={t('signup.form.namePlaceholder')}
                  disabled={isLoading}
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className={isDark ? 'text-gray-300' : ''}>
                {t('signup.form.email')}
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
                  placeholder={t('signup.form.emailPlaceholder')}
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Senha */}
            <div>
              <Label htmlFor="password" className={isDark ? 'text-gray-300' : ''}>
                {t('signup.form.password')}
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
                  placeholder={t('signup.form.passwordPlaceholder')}
                  disabled={isLoading}
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

            {/* Confirmar Senha */}
            <div>
              <Label htmlFor="confirmPassword" className={isDark ? 'text-gray-300' : ''}>
                {t('signup.form.confirmPassword')}
              </Label>
              <div className="relative mt-1">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
                  }}
                  className={`pl-10 pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  placeholder={t('signup.form.confirmPasswordPlaceholder')}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
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
                  <Link href="/terms" className="text-indigo-600 hover:underline">
                    {t('signup.form.terms')}
                  </Link>
                </span>
              </label>
              {errors.terms && (
                <p className="mt-1 text-sm text-red-500">{errors.terms}</p>
              )}
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
                  {t('signup.loading')}
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  {t('signup.form.submit')}
                </>
              )}
            </Button>
          </form>

          {/* Link para Login */}
          <div className={`mt-6 text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {t('signup.alreadyHaveAccount')}{' '}
            <Link href="/login" className="text-indigo-600 hover:underline font-semibold">
              {t('signup.loginLink')}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

