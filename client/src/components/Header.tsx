import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  Sparkles,
  User,
  Settings,
  BookOpen,
  Video,
  ListTodo,
  LogOut,
  Menu,
  X,
  Home,
  Shield,
} from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import { trpc } from '@/lib/trpc';

export function Header() {
  const [location, setLocation] = useLocation();
  const { t } = useI18n();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Buscar perfil para verificar role
  const { data: profile } = trpc.auth.getProfile.useQuery(undefined, {
    enabled: isLoggedIn,
    retry: false,
  });

  const isAdmin = profile?.role === 'admin' || user?.role === 'admin';

  // Verificar se usuário está logado
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        setIsLoggedIn(true);
        try {
          setUser(JSON.parse(userData));
        } catch (e) {
          setIsLoggedIn(false);
          setUser(null);
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    checkAuth();
    
    // Listener para mudanças no localStorage (quando login/logout acontece em outra aba)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token' || e.key === 'user') {
        checkAuth();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Re-verificar quando a rota mudar
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [location]);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    if (!showDropdown) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-dropdown]')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    setShowDropdown(false);
    setShowMobileMenu(false);
    setLocation('/');
  };

  const menuItems = [
    { path: '/', label: 'Início', icon: Home },
    { path: '/jobs', label: 'Meus Jobs', icon: ListTodo },
    { path: '/my-retention-videos', label: 'Meus Vídeos', icon: Video },
    { path: '/education', label: 'Educação', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                EZ CLIP AI
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {isLoggedIn ? (
              <>
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-purple-100 text-purple-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </>
            ) : (
              <>
                <a href="/#features" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                  Características
                </a>
                <a href="/#how" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                  Como Funciona
                </a>
                <a href="/#pricing" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                  Preços
                </a>
              </>
            )}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                {/* Desktop: Avatar Dropdown */}
                <div className="hidden md:block relative" data-dropdown>
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <Avatar className="h-9 w-9 border-2 border-purple-200">
                      <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </button>

                  {/* Dropdown Menu */}
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50" data-dropdown>
                        <div className="py-1">
                          <div className="px-4 py-3 border-b">
                            <p className="text-sm font-medium text-gray-900">
                              {user?.name || 'Usuário'}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {user?.email}
                            </p>
                            {user?.credits !== undefined && (
                              <p className="text-xs text-purple-600 mt-1 font-medium">
                                {user.credits} créditos disponíveis
                              </p>
                            )}
                          </div>
                          
                          <Link
                            to="/profile"
                            onClick={() => setShowDropdown(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <User className="h-4 w-4" />
                            {t('profile.title')}
                          </Link>
                          
                          <Link
                            to="/settings"
                            onClick={() => setShowDropdown(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Settings className="h-4 w-4" />
                            {t('settings.title')}
                          </Link>
                          
                          {isAdmin && (
                            <Link
                              to="/admin"
                              onClick={() => setShowDropdown(false)}
                              className="flex items-center gap-3 px-4 py-2 text-sm text-purple-700 hover:bg-purple-50"
                            >
                              <Shield className="h-4 w-4" />
                              Admin
                            </Link>
                          )}
                          
                          <div className="border-t my-1" />
                          
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <LogOut className="h-4 w-4" />
                            Sair
                          </button>
                        </div>
                    </div>
                  )}
                </div>

                {/* Mobile: Menu Button */}
                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
                >
                  {showMobileMenu ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              </>
            ) : (
              <Link to="/login">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  {t('login.enter')}
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isLoggedIn && showMobileMenu && (
          <div className="md:hidden border-t py-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setShowMobileMenu(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
            
            <div className="border-t pt-2 mt-2">
              <Link
                to="/profile"
                onClick={() => setShowMobileMenu(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                <User className="h-5 w-5" />
                {t('profile.title')}
              </Link>
              
              <Link
                to="/settings"
                onClick={() => setShowMobileMenu(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                <Settings className="h-5 w-5" />
                {t('settings.title')}
              </Link>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-md text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-5 w-5" />
                Sair
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

