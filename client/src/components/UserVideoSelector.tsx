import { VerticalType } from 'shared/verticais';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Link } from 'wouter';
import { trpc } from '@/lib/trpc';

interface UserVideoSelectorProps {
  vertical: VerticalType;
  selectedVideoId: string | null;
  onVideoSelect: (videoId: string | null) => void;
}

export function UserVideoSelector({
  vertical,
  selectedVideoId,
  onVideoSelect
}: UserVideoSelectorProps) {
  const { data: videos = [], isLoading, error } = trpc.userContent.listRetentionVideos.useQuery({
    vertical: vertical,
  }, {
    enabled: !!vertical,
    retry: 1,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (error) {
    // Erro ao carregar vídeos - silenciosamente mostrar mensagem ao usuário
    return (
      <div className="p-4 text-center space-y-2">
        <p className="text-sm text-destructive">
          Erro ao carregar seus vídeos. Tente novamente mais tarde.
        </p>
        <Link href="/my-retention-videos">
          <Button variant="outline" size="sm">
            Fazer upload de vídeos
          </Button>
        </Link>
      </div>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <div className="p-4 text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          Você ainda não tem vídeos de retenção para este vertical.
        </p>
        <Link href="/my-retention-videos">
          <Button variant="outline" size="sm">
            Fazer upload de vídeos
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Selecione um dos seus vídeos:</h3>
        <Link href="/my-retention-videos">
          <Button variant="outline" size="sm">
            Gerenciar vídeos
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {videos.map((video: any) => (
          <Card
            key={video.id}
            className={`cursor-pointer transition-all ${
              selectedVideoId === video.id
                ? 'ring-2 ring-primary'
                : 'hover:shadow-md'
            }`}
            onClick={() => onVideoSelect(video.id)}
          >
            <CardContent className="p-0">
              <div className="relative aspect-video bg-muted rounded-t-lg overflow-hidden">
                {video.thumbnailUrl ? (
                  <img
                    src={video.thumbnailUrl}
                    alt={video.name || 'Meu vídeo'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-4xl">📹</span>
                  </div>
                )}
                {selectedVideoId === video.id && (
                  <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                    <div className="bg-primary text-primary-foreground rounded-full p-2">
                      ✓
                    </div>
                  </div>
                )}
              </div>
              <div className="p-2">
                <p className="text-xs font-medium truncate">
                  {video.name || 'Vídeo sem nome'}
                </p>
                {video.duration && (
                  <p className="text-xs text-muted-foreground">
                    {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {selectedVideoId && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onVideoSelect(null)}
        >
          Limpar seleção
        </Button>
      )}
    </div>
  );
}

