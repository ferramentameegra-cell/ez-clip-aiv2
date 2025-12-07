import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { Link } from 'wouter';
import { ArrowLeft, RefreshCw } from 'lucide-react';

type JobStatus = 'pending' | 'downloading' | 'transcribing' | 'cutting' | 'rendering' | 'completed' | 'failed';

export function AdminJobs() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<JobStatus | 'all'>('all');

  const { data, isLoading, refetch } = trpc.admin.getJobs.useQuery({
    page,
    limit: 20,
    status: statusFilter !== 'all' ? statusFilter : undefined,
  });

  const reprocessMutation = trpc.admin.reprocessJob.useMutation({
    onSuccess: () => {
      toast.success('Job será reprocessado!');
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || 'Erro ao reprocessar job');
    },
  });

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    downloading: 'bg-blue-100 text-blue-800',
    transcribing: 'bg-purple-100 text-purple-800',
    cutting: 'bg-indigo-100 text-indigo-800',
    rendering: 'bg-pink-100 text-pink-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">Carregando...</div>
      </div>
    );
  }

  const jobs = data?.jobs || [];
  const pagination = data?.pagination || { totalPages: 1, total: 0 };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold mb-2">Jobs</h1>
          <p className="text-gray-600">Gerenciar jobs de processamento</p>
        </div>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-4 flex-wrap">
            <div>
              <label className="text-sm font-medium mr-2">Status:</label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as JobStatus | 'all');
                  setPage(1);
                }}
                className="border rounded px-3 py-2"
              >
                <option value="all">Todos</option>
                <option value="pending">Pending</option>
                <option value="downloading">Downloading</option>
                <option value="transcribing">Transcribing</option>
                <option value="cutting">Cutting</option>
                <option value="rendering">Rendering</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Jobs ({pagination.total})</CardTitle>
          <CardDescription>
            Página {page} de {pagination.totalPages}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">ID</th>
                  <th className="text-left p-2">Usuário</th>
                  <th className="text-left p-2">URL</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Progresso</th>
                  <th className="text-left p-2">Clipes</th>
                  <th className="text-left p-2">Erro</th>
                  <th className="text-left p-2">Criado em</th>
                  <th className="text-left p-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job: any) => (
                  <tr key={job.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{job.id}</td>
                    <td className="p-2">
                      <div className="text-sm">
                        <div className="font-medium">{job.user?.name || '-'}</div>
                        <div className="text-gray-500 text-xs">{job.user?.email || '-'}</div>
                      </div>
                    </td>
                    <td className="p-2">
                      <a
                        href={job.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm truncate max-w-xs block"
                      >
                        {job.sourceUrl}
                      </a>
                    </td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded text-xs ${statusColors[job.status] || 'bg-gray-100'}`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="p-2">
                      {job.progress !== null ? `${job.progress}%` : '-'}
                    </td>
                    <td className="p-2">
                      {job.totalClips || '-'}
                    </td>
                    <td className="p-2 text-sm text-red-600 max-w-xs truncate">
                      {job.errorMessage || '-'}
                    </td>
                    <td className="p-2 text-sm text-gray-600">
                      {job.createdAt ? new Date(job.createdAt).toLocaleDateString('pt-BR') : '-'}
                    </td>
                    <td className="p-2">
                      {job.status === 'failed' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => reprocessMutation.mutate({ jobId: job.id })}
                          disabled={reprocessMutation.isPending}
                        >
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Reprocessar
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Anterior
              </Button>
              <span className="px-4 py-2">
                Página {page} de {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
              >
                Próxima
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

