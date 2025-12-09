import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { Link } from 'wouter';
import { ArrowLeft, Upload, Trash2, Smile, Loader2 } from 'lucide-react';

export function AdminEmojis() {
  const [page, setPage] = useState(1);
  const [uploading, setUploading] = useState(false);

  const { data, isLoading, refetch } = trpc.admin.listEmojis.useQuery({
    page,
    limit: 20,
  });

  const uploadMutation = trpc.admin.uploadEmoji.useMutation({
    onSuccess: () => {
      toast.success('Emoji enviado com sucesso!');
      setUploading(false);
      refetch();
      // Reset form
      const fileInput = document.getElementById('emoji-file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      const nameInput = document.getElementById('emoji-name') as HTMLInputElement;
      if (nameInput) nameInput.value = '';
      const emojiInput = document.getElementById('emoji-emoji') as HTMLInputElement;
      if (emojiInput) emojiInput.value = '';
    },
    onError: (error) => {
      toast.error(error.message || 'Erro ao enviar emoji');
      setUploading(false);
    },
  });

  const deleteMutation = trpc.admin.deleteEmoji.useMutation({
    onSuccess: () => {
      toast.success('Emoji deletado com sucesso!');
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || 'Erro ao deletar emoji');
    },
  });

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = (formData.get('file') as File);
    const name = formData.get('name') as string;
    const emoji = formData.get('emoji') as string;
    const category = formData.get('category') as string;

    if (!file || !name || !emoji) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      toast.error('Arquivo muito grande. Máximo: 50MB');
      return;
    }

    setUploading(true);
    uploadMutation.mutate({
      file,
      name,
      emoji,
      category: category || undefined,
    });
  };

  const emojis = data?.emojis || [];
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
          <h1 className="text-3xl font-bold mb-2">Emojis 3D</h1>
          <p className="text-gray-600">Gerenciar emojis 3D disponíveis para todos os usuários</p>
        </div>
      </div>

      {/* Formulário de Upload */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Upload de Novo Emoji 3D</CardTitle>
          <CardDescription>
            Emojis enviados aqui ficam disponíveis para TODOS os usuários
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emoji-file">Arquivo de Vídeo (3D)</Label>
                <Input
                  id="emoji-file"
                  name="file"
                  type="file"
                  accept="video/*"
                  required
                  disabled={uploading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emoji-name">Nome</Label>
                <Input
                  id="emoji-name"
                  name="name"
                  placeholder="Ex: Coração animado"
                  required
                  disabled={uploading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emoji-emoji">Emoji</Label>
                <Input
                  id="emoji-emoji"
                  name="emoji"
                  placeholder="❤️"
                  required
                  maxLength={10}
                  disabled={uploading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emoji-category">Categoria (opcional)</Label>
                <Input
                  id="emoji-category"
                  name="category"
                  placeholder="Ex: Emoções"
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
                  Enviar Emoji
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Lista de Emojis */}
      <Card>
        <CardHeader>
          <CardTitle>Emojis da Plataforma ({pagination.total})</CardTitle>
          <CardDescription>
            Página {page} de {pagination.totalPages}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-purple-600" />
            </div>
          ) : emojis.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Smile className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum emoji encontrado</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {emojis.map((emoji: any) => (
                <Card key={emoji.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">{emoji.emoji || '😀'}</div>
                        <div>
                          <h3 className="font-semibold">{emoji.name || 'Sem nome'}</h3>
                          {emoji.category && (
                            <p className="text-sm text-gray-600">Categoria: {emoji.category}</p>
                          )}
                          {emoji.videoUrl && (
                            <a
                              href={emoji.videoUrl}
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
                          if (confirm('Tem certeza que deseja deletar este emoji?')) {
                            deleteMutation.mutate({ emojiId: emoji.id });
                          }
                        }}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
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

