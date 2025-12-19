import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';
import { 
  Sparkles, Youtube, Clock, CheckCircle, Type, 
  ArrowRight, Loader2, Video, Film, TrendingUp, BarChart3, 
  Menu, X, Settings, User, ListTodo
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateJobWizard, JobData } from '@/components/CreateJobWizard';
import { VerticalType, VERTICAIS_LIST } from 'shared/verticais';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';
import { useTheme } from '@/contexts/ThemeContext';

type SecondaryContentType = 'none' | 'platform' | 'user' | 'emoji';
type PackageSize = '5' | '10' | '50' | '100';

const PACKAGE_PRESETS: Record<PackageSize, { duration: number; label: string; description: string }> = {
  '5': { duration: 90, label: 'Pack 5', description: '5 clipes de ~90s cada' },
  '10': { duration: 60, label: 'Pack 10', description: '10 clipes de ~60s cada' },
  '50': { duration: 45, label: 'Pack 50', description: '50 clipes de ~45s cada' },
  '100': { duration: 30, label: 'Pack 100', description: '100 clipes de ~30s cada' },
};

export function Dashboard() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const [showWizard, setShowWizard] = useState(false);

  // Remover verificação de autenticação - acesso direto
  // const { data: userProfile } = trpc.auth.getProfile.useQuery();
  // const { data: jobs } = trpc.video.list.useQuery();
  
  // Dados opcionais (não bloqueiam o acesso)
  const { data: userProfile } = trpc.auth.getProfile.useQuery(undefined, {
    enabled: false, // Desabilitado - não precisa de autenticação
    retry: false,
  });
  const { data: jobs } = trpc.video.list.useQuery(undefined, {
    enabled: false, // Desabilitado - não precisa de autenticação
    retry: false,
  });

  const createJob = trpc.video.create.useMutation({
    onSuccess: () => {
      toast.success('Série criada com sucesso!');
      setShowWizard(false);
    },
    onError: (error) => {
      toast.error(error.message || 'Erro ao criar série');
    },
  });

  const handleWizardComplete = (data: JobData) => {
    // Converter dados do wizard para o formato esperado pela API
    createJob.mutate({
      youtubeUrl: data.youtubeUrl,
      packageSize: data.packageSize,
      clipDuration: data.clipDuration,
      withSubtitles: data.withSubtitles,
      vertical: data.vertical,
      secondaryContentType: data.retentionVideoId ? 'platform' : undefined,
      secondaryContentId: data.retentionVideoId || undefined,
      headline: data.headline,
      startTime: data.startTime,
      endTime: data.endTime,
    });
  };

  const totalClips = jobs?.length || 0;
  const completedClips = jobs?.filter(j => j.status === 'completed').length || 0;

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-gray-50'} flex`}>
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:static inset-y-0 left-0 z-40 w-64 ${isDark ? 'bg-slate-800' : 'bg-white'} border-r ${isDark ? 'border-slate-700' : 'border-gray-200'} transition-transform`}>
        <div className="h-full flex flex-col p-4">
          <div className="mb-8">
            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {t('common.appName')}
            </h2>
          </div>
          <nav className="flex-1 space-y-2">
            <Link href="/dashboard">
              <a className={`flex items-center gap-3 px-4 py-2 rounded-lg ${isDark ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-600'}`}>
                <BarChart3 className="w-5 h-5" />
                {t('dashboard.title')}
              </a>
            </Link>
            <Link href="/jobs">
              <a className={`flex items-center gap-3 px-4 py-2 rounded-lg ${isDark ? 'text-gray-300 hover:bg-slate-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                <ListTodo className="w-5 h-5" />
                Meus Jobs
              </a>
            </Link>
            <Link href="/my-retention-videos">
              <a className={`flex items-center gap-3 px-4 py-2 rounded-lg ${isDark ? 'text-gray-300 hover:bg-slate-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                <Video className="w-5 h-5" />
                Meus Vídeos
              </a>
            </Link>
            <Link href="/profile">
              <a className={`flex items-center gap-3 px-4 py-2 rounded-lg ${isDark ? 'text-gray-300 hover:bg-slate-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                <User className="w-5 h-5" />
                {t('dashboard.profile')}
              </a>
            </Link>
            <Link href="/settings">
              <a className={`flex items-center gap-3 px-4 py-2 rounded-lg ${isDark ? 'text-gray-300 hover:bg-slate-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                <Settings className="w-5 h-5" />
                {t('dashboard.settings')}
              </a>
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border-b px-4 py-4 flex items-center justify-between`}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {t('dashboard.title')}
          </h1>
          <div></div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {/* Welcome Section */}
          <div className={`mb-8 p-6 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
            <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {t('dashboard.welcome')}! 👋
            </h2>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              Crie seus clipes virais em minutos
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className={isDark ? 'bg-slate-800 border-slate-700' : ''}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className={`text-sm font-medium ${isDark ? 'text-gray-300' : ''}`}>
                  {t('dashboard.totalClips')}
                </CardTitle>
                <Film className={`h-4 w-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {totalClips}
                </div>
              </CardContent>
            </Card>

            <Card className={isDark ? 'bg-slate-800 border-slate-700' : ''}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className={`text-sm font-medium ${isDark ? 'text-gray-300' : ''}`}>
                  Concluídos
                </CardTitle>
                <CheckCircle className={`h-4 w-4 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {completedClips}
                </div>
              </CardContent>
            </Card>

            <Card className={isDark ? 'bg-slate-800 border-slate-700' : ''}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className={`text-sm font-medium ${isDark ? 'text-gray-300' : ''}`}>
                  Créditos
                </CardTitle>
                <Sparkles className={`h-4 w-4 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {userProfile?.credits || 0}
                </div>
              </CardContent>
            </Card>

            <Card className={isDark ? 'bg-slate-800 border-slate-700' : ''}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className={`text-sm font-medium ${isDark ? 'text-gray-300' : ''}`}>
                  Taxa de Sucesso
                </CardTitle>
                <TrendingUp className={`h-4 w-4 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {totalClips > 0 ? Math.round((completedClips / totalClips) * 100) : 0}%
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Form Section */}
          {!showWizard ? (
            <Card className={isDark ? 'bg-slate-800 border-slate-700' : ''}>
              <CardHeader>
                <CardTitle className={isDark ? 'text-white' : ''}>
                  {t('dashboard.newClip')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center py-8">
                  <p className={`text-lg mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Crie séries virais sequenciais com vídeos de retenção hipnóticos
                  </p>
                  <Button
                    size="lg"
                    onClick={() => setShowWizard(true)}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  >
                    <Sparkles className="mr-2 h-5 w-5" />
                    Criar Nova Série
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <CreateJobWizard
              onComplete={handleWizardComplete}
              isSubmitting={createJob.isPending}
            />
          )}

        </main>
      </div>
    </div>
  );
}

