import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { trpc } from '@/lib/trpc';

interface EmojiGalleryProps {
  selectedEmojiId: string | null;
  onEmojiSelect: (emojiId: string | null) => void;
}

export function EmojiGallery({
  selectedEmojiId,
  onEmojiSelect
}: EmojiGalleryProps) {
  const { data: emojis = [], isLoading, error } = trpc.userContent.listGenericEmojis.useQuery(undefined, {
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
    // Erro ao carregar emojis - silenciosamente mostrar mensagem ao usuário
    return (
      <div className="p-4 text-center text-sm text-destructive">
        Erro ao carregar emojis. Tente novamente mais tarde.
      </div>
    );
  }

  if (!emojis || emojis.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        Nenhum emoji 3D disponível.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Selecione um emoji 3D:</h3>
      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
        {emojis.map((emoji: any) => (
          <Card
            key={emoji.id}
            className={`cursor-pointer transition-all ${
              selectedEmojiId === emoji.id
                ? 'ring-2 ring-primary'
                : 'hover:shadow-md'
            }`}
            onClick={() => onEmojiSelect(emoji.id)}
          >
            <CardContent className="p-4">
              <div className="relative aspect-square flex items-center justify-center">
                {emoji.videoUrl ? (
                  <video
                    src={emoji.videoUrl}
                    loop
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-contain"
                  />
                ) : emoji.emoji ? (
                  <span className="text-4xl">{emoji.emoji}</span>
                ) : (
                  <span className="text-4xl">✨</span>
                )}
                {selectedEmojiId === emoji.id && (
                  <div className="absolute inset-0 bg-primary/20 flex items-center justify-center rounded">
                    <div className="bg-primary text-primary-foreground rounded-full p-1 text-xs">
                      ✓
                    </div>
                  </div>
                )}
              </div>
              {emoji.name && (
                <p className="text-xs text-center mt-2 truncate">{emoji.name}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      {selectedEmojiId && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEmojiSelect(null)}
        >
          Limpar seleção
        </Button>
      )}
    </div>
  );
}


