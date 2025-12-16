import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'wouter';
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
import { RetentionVideoGallery } from '@/components/RetentionVideoGallery';
import { UserVideoSelector } from '@/components/UserVideoSelector';
import { EmojiGallery } from '@/components/EmojiGallery';
import { VideoPreviewSelector } from '@/components/VideoPreviewSelector';
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
  const [, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const [packageSize, setPackageSize] = useState<PackageSize | ''>('');
  const [vertical, setVertical] = useState<VerticalType | ''>('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [clipDuration, setClipDuration] = useState('60');
  const [addSubtitles, setAddSubtitles] = useState(true);
  const [secondaryType, setSecondaryType] = useState<SecondaryContentType>('none');
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [headline, setHeadline] = useState('');
  const [videoStartTime, setVideoStartTime] = useState<number | undefined>(undefined);
  const [videoEndTime, setVideoEndTime] = useState<number | undefined>(undefined);

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
      toast.success('Job criado com sucesso!');
      // Limpar formulário
      setYoutubeUrl('');
      setVertical('');
      setPackageSize('');
      setClipDuration('60');
      setAddSubtitles(true);
      setSecondaryType('none');
      setSelectedVideo(null);
      setSelectedEmoji(null);
      setHeadline('');
      setVideoStartTime(undefined);
      setVideoEndTime(undefined);
    },
    onError: (error) => {
      toast.error(error.message || 'Erro ao criar job');
    },
  });

  const handleCreateJob = () => {
    if (!youtubeUrl) {
      toast.error('Por favor, insira a URL do YouTube');
      return;
    }
    if (!vertical) {
      toast.error('Por favor, selecione um nicho');
      return;
    }

    // Verificação de créditos removida - acesso direto sem autenticação
    // const creditsNeeded = packageSize ? parseInt(packageSize) : 1;
    // if (userProfile && userProfile.credits < creditsNeeded) {
    //   toast.error(`Você precisa de ${creditsNeeded} crédito(s). Você tem ${userProfile.credits}.`);
    //   return;
    // }

    createJob.mutate({
      youtubeUrl,
      packageSize: packageSize || undefined,
      clipDuration: packageSize ? undefined : Number(clipDuration),
      withSubtitles: addSubtitles,
      vertical: vertical as VerticalType,
      secondaryContentType: secondaryType !== 'none' ? secondaryType : undefined,
      secondaryContentId: secondaryType !== 'none' && (selectedVideo || selectedEmoji) ? (selectedVideo || selectedEmoji || undefined) : undefined,
      headline: headline || undefined,
      startTime: videoStartTime !== undefined ? videoStartTime : undefined,
      endTime: videoEndTime !== undefined ? videoEndTime : undefined,
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
          <Card className={isDark ? 'bg-slate-800 border-slate-700' : ''}>
            <CardHeader>
              <CardTitle className={isDark ? 'text-white' : ''}>
                {t('dashboard.newClip')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Créditos */}
              {userProfile && (
                <div className={`p-4 rounded-lg ${userProfile.credits > 0 ? (isDark ? 'bg-green-900/30 border border-green-800' : 'bg-green-50 border border-green-200') : (isDark ? 'bg-red-900/30 border border-red-800' : 'bg-red-50 border border-red-200')}`}>
                  <p className={`text-sm font-medium ${userProfile.credits > 0 ? (isDark ? 'text-green-400' : 'text-green-800') : (isDark ? 'text-red-400' : 'text-red-800')}`}>
                    Créditos disponíveis: <span className="font-bold">{userProfile.credits}</span>
                  </p>
                </div>
              )}

              {/* URL do YouTube */}
              <div>
                <Label className={`${isDark ? 'text-gray-300' : ''} flex items-center gap-2`}>
                  <Youtube className="h-5 w-5 text-red-600" />
                  URL do YouTube
                </Label>
                <Input
                  className="mt-1"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={youtubeUrl}
                  onChange={(e) => {
                    setYoutubeUrl(e.target.value);
                    setVideoStartTime(undefined);
                    setVideoEndTime(undefined);
                  }}
                />
              </div>

              {/* Preview e Seleção de Trecho */}
              {youtubeUrl && (
                <VideoPreviewSelector
                  youtubeUrl={youtubeUrl}
                  onTimeRangeChange={(start, end) => {
                    setVideoStartTime(start);
                    setVideoEndTime(end);
                  }}
                  disabled={!youtubeUrl}
                />
              )}

              {/* Pacote de Clipes */}
              <div>
                <Label className={isDark ? 'text-gray-300' : ''}>Pacote de Clipes</Label>
                <Select
                  value={packageSize}
                  onValueChange={(value) => {
                    setPackageSize(value as PackageSize);
                    if (value && PACKAGE_PRESETS[value as PackageSize]) {
                      const preset = PACKAGE_PRESETS[value as PackageSize];
                      setClipDuration(preset.duration.toString());
                    }
                  }}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecione um pacote" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">Pack 5 - 5 créditos</SelectItem>
                    <SelectItem value="10">Pack 10 - 10 créditos</SelectItem>
                    <SelectItem value="50">Pack 50 - 50 créditos</SelectItem>
                    <SelectItem value="100">Pack 100 - 100 créditos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Duração */}
              {!packageSize && (
                <div>
                  <Label className={`${isDark ? 'text-gray-300' : ''} flex items-center gap-2`}>
                    <Clock className="h-5 w-5" />
                    Duração (segundos)
                  </Label>
                  <Input
                    type="number"
                    className="mt-1"
                    value={clipDuration}
                    onChange={(e) => setClipDuration(e.target.value)}
                    min="30"
                    max="180"
                  />
                </div>
              )}

              {/* Legendas */}
              <div className={`flex items-center space-x-3 p-4 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-purple-50'}`}>
                <Checkbox
                  id="subtitles"
                  checked={addSubtitles}
                  onCheckedChange={(checked) => setAddSubtitles(checked === true)}
                />
                <Label htmlFor="subtitles" className="flex-1 cursor-pointer">
                  Adicionar Legendas
                </Label>
                <Badge>+40% retenção</Badge>
              </div>

              {/* Nicho */}
              <div>
                <Label className={isDark ? 'text-gray-300' : ''}>Escolha o Nicho</Label>
                <Select value={vertical} onValueChange={(value) => setVertical(value as VerticalType)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecione o nicho" />
                  </SelectTrigger>
                  <SelectContent>
                    {VERTICAIS_LIST.map((v) => (
                      <SelectItem key={v.id} value={v.id}>
                        {v.emoji} {v.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Conteúdo Secundário */}
              <div>
                <Label className={isDark ? 'text-gray-300' : ''}>Tipo de Conteúdo Secundário</Label>
                <RadioGroup
                  value={secondaryType}
                  onValueChange={(value) => {
                    setSecondaryType(value as SecondaryContentType);
                    setSelectedVideo(null);
                    setSelectedEmoji(null);
                  }}
                  className="mt-2 space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="none" id="none" />
                    <Label htmlFor="none" className="cursor-pointer">Nenhum</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="platform" id="platform" />
                    <Label htmlFor="platform" className="cursor-pointer">Vídeos da Plataforma</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="user" id="user" />
                    <Label htmlFor="user" className="cursor-pointer">Meus Vídeos</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="emoji" id="emoji" />
                    <Label htmlFor="emoji" className="cursor-pointer">Emojis 3D</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Galerias Condicionais */}
              {secondaryType === 'platform' && vertical && (
                <RetentionVideoGallery
                  vertical={vertical as VerticalType}
                  selectedVideoId={selectedVideo}
                  onVideoSelect={setSelectedVideo}
                />
              )}

              {secondaryType === 'user' && vertical && (
                <UserVideoSelector
                  vertical={vertical as VerticalType}
                  selectedVideoId={selectedVideo}
                  onVideoSelect={setSelectedVideo}
                />
              )}

              {secondaryType === 'emoji' && (
                <EmojiGallery
                  selectedEmojiId={selectedEmoji}
                  onEmojiSelect={setSelectedEmoji}
                />
              )}

              {/* Headline */}
              <div>
                <Label className={`${isDark ? 'text-gray-300' : ''} flex items-center gap-2`}>
                  <Type className="h-5 w-5" />
                  Headline (opcional)
                </Label>
                <Input
                  className="mt-1"
                  placeholder="Ex: Como Ganhar R$ 10k/mês"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  maxLength={100}
                />
              </div>

              {/* Botão Submit */}
              <Button
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                onClick={handleCreateJob}
                disabled={!youtubeUrl || !vertical || createJob.isPending}
              >
                {createJob.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Criar Clipe
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}

