import { useState } from 'react';
import { VerticalType } from 'shared/verticais';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Video, Shuffle, X } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { Checkbox } from '@/components/ui/checkbox';

interface RetentionVideoLibraryProps {
  vertical: VerticalType;
  selectedVideoId: string | null;
  onVideoSelect: (videoId: string | null) => void;
  onRandomizeChange: (enabled: boolean) => void;
  randomizeEnabled: boolean;
}

export function RetentionVideoLibrary({
  vertical,
  selectedVideoId,
  onVideoSelect,
  onRandomizeChange,
  randomizeEnabled,
}: RetentionVideoLibraryProps) {
  const { data: videos = [], isLoading, error } = trpc.userContent.listRetentionVideos.useQuery(
    { vertical },
    {
      enabled: !!vertical,
      retry: 1,
    }
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-sm text-destructive">
        Erro ao carregar vídeos. Tente novamente mais tarde.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Opção: Nenhum (não recomendado) */}
      <Card
        className={`cursor-pointer transition-all ${
          selectedVideoId === null && !randomizeEnabled
            ? 'ring-2 ring-yellow-500 bg-yellow-50'
            : 'hover:border-yellow-300'
        }`}
        onClick={() => {
          onVideoSelect(null);
          onRandomizeChange(false);
        }}
      >
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <X className="w-5 h-5 text-muted-foreground" />
            <div>
              <div className="font-semibold">Nenhum vídeo de retenção</div>
              <div className="text-sm text-muted-foreground">
                Não recomendado - reduz retenção visual
              </div>
            </div>
          </div>
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
            Não recomendado
          </Badge>
        </CardContent>
      </Card>

      {/* Opção: Randomizar */}
      <Card
        className={`cursor-pointer transition-all ${
          randomizeEnabled
            ? 'ring-2 ring-primary bg-primary/5'
            : 'hover:border-primary/50'
        }`}
        onClick={() => {
          onRandomizeChange(true);
          onVideoSelect(null);
        }}
      >
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shuffle className="w-5 h-5 text-primary" />
            <div>
              <div className="font-semibold">Randomizar por corte</div>
              <div className="text-sm text-muted-foreground">
                Cada parte usará um vídeo diferente da biblioteca
              </div>
            </div>
          </div>
          {randomizeEnabled && (
            <Badge className="bg-primary">Ativo</Badge>
          )}
        </CardContent>
      </Card>

      {/* Grid de Vídeos */}
      {videos && videos.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Vídeos Disponíveis</h3>
            <Badge variant="secondary">{videos.length} vídeos</Badge>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {videos.map((video: any) => (
              <Card
                key={video.id}
                className={`cursor-pointer transition-all group ${
                  selectedVideoId === video.id
                    ? 'ring-2 ring-primary bg-primary/5'
                    : 'hover:shadow-lg hover:border-primary/50'
                }`}
                onClick={() => {
                  onVideoSelect(video.id);
                  onRandomizeChange(false);
                }}
              >
                <CardContent className="p-0">
                  {/* Preview em Loop */}
                  <div className="relative aspect-[9/16] bg-muted rounded-t-lg overflow-hidden">
                    {video.videoUrl ? (
                      <video
                        src={video.videoUrl}
                        className="w-full h-full object-cover"
                        autoPlay
                        loop
                        muted
                        playsInline
                      />
                    ) : video.thumbnailUrl ? (
                      <img
                        src={video.thumbnailUrl}
                        alt={video.name || 'Vídeo de retenção'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100">
                        <Video className="w-12 h-12 text-muted-foreground" />
                      </div>
                    )}
                    
                    {/* Overlay de seleção */}
                    {selectedVideoId === video.id && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <div className="bg-primary text-primary-foreground rounded-full p-3">
                          <Video className="w-6 h-6" />
                        </div>
                      </div>
                    )}

                    {/* Tags */}
                    <div className="absolute top-2 right-2 flex flex-col gap-1">
                      <Badge className="bg-green-500 text-white text-xs">Alta retenção</Badge>
                      <Badge className="bg-purple-500 text-white text-xs">Hipnótico</Badge>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <p className="text-sm font-medium truncate">
                      {video.name || 'Vídeo sem nome'}
                    </p>
                    {video.duration && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {Math.floor(video.duration / 60)}:
                        {(video.duration % 60).toString().padStart(2, '0')}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {(!videos || videos.length === 0) && !randomizeEnabled && selectedVideoId === null && (
        <div className="p-8 text-center border-2 border-dashed rounded-lg">
          <Video className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-2">
            Nenhum vídeo de retenção disponível para este nicho
          </p>
          <p className="text-sm text-muted-foreground">
            Você pode fazer upload de seus próprios vídeos ou usar a opção de randomizar
          </p>
        </div>
      )}
    </div>
  );
}

