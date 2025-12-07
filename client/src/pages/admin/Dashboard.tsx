import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Video, FileVideo, CreditCard, TrendingUp, AlertCircle } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { Link } from 'wouter';

export function AdminDashboard() {
  const { data, isLoading, error } = trpc.admin.getDashboard.useQuery();

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">Carregando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center text-red-600">
          Erro ao carregar dados: {error.message}
        </div>
      </div>
    );
  }

  const stats = data || {
    users: { total: 0, newLast7Days: 0 },
    jobs: { total: 0, completed: 0, failed: 0 },
    clips: { total: 0 },
    credits: { total: 0 },
  };

  const successRate = stats.jobs.total > 0
    ? ((stats.jobs.completed / stats.jobs.total) * 100).toFixed(1)
    : '0';

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Painel Administrativo</h1>
        <p className="text-gray-600">Visão geral do sistema</p>
      </div>

      {/* Navegação */}
      <div className="mb-6 flex gap-4 flex-wrap">
        <Link href="/admin/users">
          <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
            Usuários
          </button>
        </Link>
        <Link href="/admin/jobs">
          <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
            Jobs
          </button>
        </Link>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.users.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.users.newLast7Days} novos nos últimos 7 dias
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Jobs</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.jobs.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.jobs.completed} concluídos • {stats.jobs.failed} falhados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{successRate}%</div>
            <p className="text-xs text-muted-foreground">
              Jobs completados com sucesso
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Clipes</CardTitle>
            <FileVideo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.clips.total}</div>
            <p className="text-xs text-muted-foreground">
              Clipes gerados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Créditos Totais</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.credits.total}</div>
            <p className="text-xs text-muted-foreground">
              Créditos em circulação
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jobs Falhados</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.jobs.failed}</div>
            <p className="text-xs text-muted-foreground">
              Requerem atenção
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

