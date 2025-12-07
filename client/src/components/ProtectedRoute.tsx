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
  const { data: onboardingData } = trpc.onboarding.check.useQuery(undefined, {
    enabled: requireOnboarding && !!token,
    retry: false,
  });

  // Verificar perfil (para role admin)
  const { data: profileData } = trpc.auth.getProfile.useQuery(undefined, {
    enabled: requireAdmin && !!token,
    retry: false,
  });

  useEffect(() => {
    setIsChecking(true);

    // Se não está autenticado
    if (!token || !userStr) {
      setRedirectTo('/login');
      setIsChecking(false);
      return;
    }

    // Se precisa de onboarding e não completou
    if (requireOnboarding && onboardingData && !onboardingData.completed) {
      setRedirectTo('/onboarding');
      setIsChecking(false);
      return;
    }

    // Se precisa ser admin e não é
    if (requireAdmin && profileData && profileData.role !== 'admin') {
      setRedirectTo('/');
      setIsChecking(false);
      return;
    }

    setIsChecking(false);
    setRedirectTo(null);
  }, [token, userStr, requireOnboarding, requireAdmin, onboardingData, profileData]);

  useEffect(() => {
    if (redirectTo) {
      setLocation(redirectTo);
    }
  }, [redirectTo, setLocation]);

  if (isChecking || redirectTo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Carregando...</div>
      </div>
    );
  }

  return <>{children}</>;
}

