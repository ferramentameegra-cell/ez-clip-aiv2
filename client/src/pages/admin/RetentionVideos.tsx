import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { Link } from 'wouter';
import { ArrowLeft, Upload, Trash2, Video, Loader2 } from 'lucide-react';
import { VERTICAIS_LIST } from 'shared/verticais';

export function AdminRetentionVideos() {
  const [page, setPage] = useState(1);
  const [selectedVertical, setSelectedVertical] = useState<string>('all');
  const [uploading, setUploading] = useState(false);

  const { data, isLoading, refetch } = trpc.admin.listPlatformRetentionVideos.useQuery({
    vertical: selectedVertical !== 'all' ? selectedVertical : undefined,
    page,
    limit: 20,
  });

  const uploadMutation = trpc.admin.uploadPlatformRetentionVideo.useMutation({
    onSuccess: () => {
      toast.success('Vídeo enviado com sucesso!');
      setUploading(false);
      refetch();
      // Reset form
      const fileInput = document.getElementById('video-file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    },
    onError: (error) => {
      toast.error(error.message || 'Erro ao enviar vídeo');
      setUploading(false);
    },
  });

  const deleteMutation = trpc.admin.deletePlatformRetentionVideo.useMutation({
    onSuccess: () => {
      toast.success('Vídeo deletado com sucesso!');
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || 'Erro ao deletar vídeo');
    },
  });

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const fileInput = e.currentTarget.querySelector('input[type="file"]') as HTMLInputElement;
    const file = fileInput?.files?.[0];
    const vertical = formData.get('vertical') as string;
    const name = formData.get('name') as string;

    if (!file || !vertical || !name) {
      toast.error('Preencha todos os campos');
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      toast.error('Arquivo muito grande. Máximo: 100MB');
      return;
    }

    setUploading(true);
    uploadMutation.mutate({
      file,
      vertical,
      name,
    });
  };

  const videos = data?.videos || [];
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
          <h1 className="text-3xl font-bold mb-2">Vídeos de Retenção da Plataforma</h1>
          <p className="text-gray-600">Gerenciar vídeos disponíveis para todos os usuários</p>
        </div>
      </div>

      {/* Formulário de Upload */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Upload de Novo Vídeo</CardTitle>
          <CardDescription>
            Vídeos enviados aqui ficam disponíveis para TODOS os usuários
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="video-file">Arquivo de Vídeo</Label>
                <Input
                  id="video-file"
                  name="file"
                  type="file"
                  accept="video/*"
                  required
                  disabled={uploading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vertical">Vertical/Nicho</Label>
                <select
                  id="vertical"
                  name="vertical"
                  required
                  disabled={uploading}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Selecione o vertical</option>
                  {VERTICAIS_LIST.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.emoji} {v.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nome do Vídeo</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Ex: Vídeo motivacional"
                  required
                  disabled={uploading}
                />
              </div>
            </div>

            <Button type="submit" disabled={uploading}>
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Enviar Vídeo
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Filtros */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-4 flex-wrap">
            <div>
              <Label className="text-sm font-medium mr-2">Vertical:</Label>
              <select
                value={selectedVertical}
                onChange={(e) => {
                  setSelectedVertical(e.target.value);
                  setPage(1);
                }}
                className="flex h-10 w-[200px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="all">Todos</option>
                {VERTICAIS_LIST.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.emoji} {v.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Vídeos */}
      <Card>
        <CardHeader>
          <CardTitle>Vídeos da Plataforma ({pagination.total})</CardTitle>
          <CardDescription>
            Página {page} de {pagination.totalPages}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-purple-600" />
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Video className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum vídeo encontrado</p>
            </div>
          ) : (
            <div className="space-y-4">
              {videos.map((video: any) => (
                <div
                  key={video.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-16 bg-gray-200 rounded flex items-center justify-center">
                      <Video className="h-8 w-8 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{video.name || 'Sem nome'}</h3>
                      <p className="text-sm text-gray-600">
                        Vertical: {video.vertical || 'N/A'} • 
                        Duração: {video.duration ? `${video.duration}s` : 'N/A'} • 
                        Criado: {video.createdAt ? new Date(video.createdAt).toLocaleDateString('pt-BR') : 'N/A'}
                      </p>
                      {video.videoUrl && (
                        <a
                          href={video.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Ver vídeo
                        </a>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (confirm('Tem certeza que deseja deletar este vídeo?')) {
                        deleteMutation.mutate({ videoId: video.id });
                      }
                    }}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              ))}
            </div>
          )}

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

