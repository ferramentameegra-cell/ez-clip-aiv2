import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireOnboarding?: boolean;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ 
  children, 
  requireOnboarding = false,
  requireAdmin = false 
}: ProtectedRouteProps) {
  const [, setLocation] = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [redirectTo, setRedirectTo] = useState<string | null>(null);

  // Verificar autenticação
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  
  // Verificar onboarding se necessário
  const { data: onboardingData, isLoading: isLoadingOnboarding, error: onboardingError } = trpc.onboarding.check.useQuery(undefined, {
    enabled: requireOnboarding && !!token,
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Verificar perfil (para role admin)
  const { data: profileData, isLoading: isLoadingProfile, error: profileError } = trpc.auth.getProfile.useQuery(undefined, {
    enabled: requireAdmin && !!token,
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    setIsChecking(true);

    // Se não está autenticado
    if (!token || !userStr) {
      setRedirectTo('/login');
      setIsChecking(false);
      return;
    }

    // Se precisa de onboarding, aguardar query terminar
    if (requireOnboarding) {
      if (isLoadingOnboarding) {
        // Ainda carregando, aguardar
        return;
      }
      
      if (onboardingError) {
        console.error('[ProtectedRoute] Erro ao verificar onboarding:', onboardingError);
        // Se der erro, redirecionar para onboarding para garantir
        setRedirectTo('/onboarding');
        setIsChecking(false);
        return;
      }
      
      if (onboardingData && !onboardingData.completed) {
        setRedirectTo('/onboarding');
        setIsChecking(false);
        return;
      }
    }

    // Se precisa ser admin, aguardar query terminar
    if (requireAdmin) {
      if (isLoadingProfile) {
        // Ainda carregando, aguardar
        return;
      }
      
      if (profileError) {
        console.error('[ProtectedRoute] Erro ao verificar perfil:', profileError);
        setRedirectTo('/');
        setIsChecking(false);
        return;
      }
      
      if (profileData && profileData.role !== 'admin') {
        setRedirectTo('/');
        setIsChecking(false);
        return;
      }
    }

    // Tudo OK, permitir acesso
    setIsChecking(false);
    setRedirectTo(null);
  }, [token, userStr, requireOnboarding, requireAdmin, onboardingData, profileData, isLoadingOnboarding, isLoadingProfile, onboardingError, profileError]);

  useEffect(() => {
    if (redirectTo) {
      setLocation(redirectTo);
    }
  }, [redirectTo, setLocation]);

  // Timeout para evitar travamento infinito
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isChecking) {
        console.warn('[ProtectedRoute] Timeout na verificação, redirecionando para login');
        setRedirectTo('/login');
        setIsChecking(false);
      }
    }, 10000); // 10 segundos de timeout

    return () => clearTimeout(timeout);
  }, [isChecking]);

  if (isChecking || redirectTo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <div>Carregando...</div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

