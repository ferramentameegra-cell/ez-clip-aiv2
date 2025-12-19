import { useEffect, useRef, useState } from 'react';
import { VerticalType } from 'shared/verticais';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Play, Pause } from 'lucide-react';
import { trpc } from '@/lib/trpc';

interface FinalPreviewProps {
  youtubeUrl: string;
  vertical: VerticalType;
  retentionVideoId: string | null;
  headline?: string;
  withSubtitles: boolean;
  fontStyle?: string;
  subtitleStyle?: string;
  partNumber: number;
  totalParts: number;
}

export function FinalPreview({
  youtubeUrl,
  vertical,
  retentionVideoId,
  headline,
  withSubtitles,
  fontStyle,
  subtitleStyle,
  partNumber,
  totalParts,
}: FinalPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [retentionVideoUrl, setRetentionVideoUrl] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // Buscar URL do vídeo de retenção
  const { data: videos = [] } = trpc.userContent.listRetentionVideos.useQuery(
    { vertical },
    {
      enabled: !!vertical && !!retentionVideoId,
      retry: 1,
    }
  );

  useEffect(() => {
    if (retentionVideoId && videos.length > 0) {
      const video = videos.find((v: any) => v.id === retentionVideoId);
      if (video) {
        setRetentionVideoUrl(video.videoUrl);
      }
    }
  }, [retentionVideoId, videos]);

  return (
    <div className="space-y-6">
      {/* Texto Fixo */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm font-semibold text-blue-900">
          ⚠️ Este layout será aplicado a toda a série
        </p>
        <p className="text-xs text-blue-700 mt-1">
          A numeração PARTE {partNumber}/{totalParts} será adicionada automaticamente em cada clipe
        </p>
      </div>

      {/* Player Vertical 9:16 */}
      <Card className="bg-black">
        <CardContent className="p-0">
          <div
            ref={previewRef}
            className="relative aspect-[9/16] max-w-[300px] mx-auto bg-black rounded-lg overflow-hidden"
          >
            {/* Vídeo Principal (Topo) */}
            <div className="absolute top-0 left-0 right-0 h-[36.46%] bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              {youtubeUrl ? (
                <div className="text-white text-center p-4">
                  <div className="text-2xl mb-2">📹</div>
                  <div className="text-xs">Vídeo Principal</div>
                  <div className="text-xs text-white/70 mt-1">(Topo)</div>
                </div>
              ) : (
                <div className="text-white/50 text-center">
                  <div className="text-4xl mb-2">🎬</div>
                  <div className="text-sm">Vídeo Principal</div>
                </div>
              )}
            </div>

            {/* Headline (Centro) */}
            {headline && (
              <div className="absolute top-[36.46%] left-0 right-0 h-[2.08%] flex items-center justify-center bg-black/50">
                <div
                  className={`text-white font-bold text-sm px-4 ${
                    fontStyle === 'bold' ? 'font-black' :
                    fontStyle === 'rounded' ? 'font-normal' :
                    fontStyle === 'serif' ? 'font-serif' :
                    'font-semibold'
                  }`}
                >
                  {headline}
                </div>
              </div>
            )}

            {/* Vídeo de Retenção (Inferior) */}
            <div className="absolute bottom-[5.21%] left-0 right-0 h-[35.42%] bg-gradient-to-br from-green-600 to-teal-600 flex items-center justify-center overflow-hidden">
              {retentionVideoUrl ? (
                <video
                  src={retentionVideoUrl}
                  className="w-full h-full object-cover"
                  autoPlay={isPlaying}
                  loop
                  muted
                  playsInline
                />
              ) : (
                <div className="text-white/50 text-center">
                  <div className="text-4xl mb-2">🎥</div>
                  <div className="text-sm">Vídeo Retenção</div>
                  <div className="text-xs text-white/70 mt-1">(Inferior)</div>
                </div>
              )}
            </div>

            {/* Legendas (Sobreposição) */}
            {withSubtitles && (
              <div className="absolute bottom-[10.42%] left-0 right-0 h-[5.21%] flex items-center justify-center">
                <div
                  className={`text-white text-sm font-semibold px-4 text-center ${
                    subtitleStyle === 'outline' ? 'text-stroke' :
                    subtitleStyle === 'shadow' ? 'drop-shadow-lg' :
                    ''
                  }`}
                >
                  Exemplo de legenda animada
                </div>
              </div>
            )}

            {/* Numeração PARTE X/Y (Sempre visível) */}
            <div className="absolute top-4 right-4">
              <Badge className="bg-black/70 text-white border border-white/30">
                PARTE {partNumber}/{totalParts}
              </Badge>
            </div>

            {/* Controles de Play/Pause */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="bg-white/90 rounded-full p-4 hover:bg-white transition-all"
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8 text-black" />
                ) : (
                  <Play className="w-8 h-8 text-black ml-1" />
                )}
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informações do Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-semibold mb-1">Vídeo Principal</div>
            <div className="text-xs text-muted-foreground">Topo (36.46%)</div>
          </CardContent>
        </Card>
        {headline && (
          <Card>
            <CardContent className="p-4">
              <div className="text-sm font-semibold mb-1">Headline</div>
              <div className="text-xs text-muted-foreground">Centro (2.08%)</div>
            </CardContent>
          </Card>
        )}
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-semibold mb-1">Vídeo Retenção</div>
            <div className="text-xs text-muted-foreground">Inferior (35.42%)</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

