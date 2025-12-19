import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Type, Subtitles } from 'lucide-react';

interface VideoStyleSelectorProps {
  fontStyle: string;
  subtitleStyle: string;
  onFontStyleChange: (style: string) => void;
  onSubtitleStyleChange: (style: string) => void;
  headline: string;
  onHeadlineChange: (headline: string) => void;
  withSubtitles: boolean;
  onSubtitlesChange: (enabled: boolean) => void;
}

const FONT_STYLES = [
  { id: 'default', name: 'Padrão', description: 'Fonte clara e legível' },
  { id: 'bold', name: 'Negrito', description: 'Impacto máximo' },
  { id: 'rounded', name: 'Arredondada', description: 'Estilo moderno' },
  { id: 'serif', name: 'Serifada', description: 'Elegante e clássica' },
];

const SUBTITLE_STYLES = [
  { id: 'default', name: 'Padrão', description: 'Legendas simples' },
  { id: 'karaoke', name: 'Karaokê', description: 'Destaque por palavra' },
  { id: 'outline', name: 'Contorno', description: 'Contorno destacado' },
  { id: 'shadow', name: 'Sombra', description: 'Sombra profunda' },
];

export function VideoStyleSelector({
  fontStyle,
  subtitleStyle,
  onFontStyleChange,
  onSubtitleStyleChange,
  headline,
  onHeadlineChange,
  withSubtitles,
  onSubtitlesChange,
}: VideoStyleSelectorProps) {
  return (
    <div className="space-y-6">
      {/* Headline */}
      <div className="space-y-3">
        <Label className="text-base font-semibold flex items-center gap-2">
          <Type className="w-5 h-5" />
          Headline (Opcional)
        </Label>
        <Input
          placeholder="Ex: Como Ganhar R$ 10k/mês"
          value={headline}
          onChange={(e) => onHeadlineChange(e.target.value)}
          maxLength={100}
        />
        <p className="text-sm text-muted-foreground">
          Texto curto e forte que aparece no centro do vídeo
        </p>
      </div>

      {/* Legendas */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <Checkbox
              id="subtitles"
              checked={withSubtitles}
              onCheckedChange={(checked) => onSubtitlesChange(checked === true)}
            />
            <Label htmlFor="subtitles" className="flex-1 cursor-pointer flex items-center gap-2">
              <Subtitles className="w-5 h-5" />
              <span className="font-semibold">Adicionar Legendas</span>
            </Label>
            <Badge className="bg-green-500 text-white">+40% retenção</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Estilo de Fonte */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Estilo de Fonte (Headline)</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {FONT_STYLES.map((style) => (
            <Card
              key={style.id}
              className={`cursor-pointer transition-all ${
                fontStyle === style.id
                  ? 'ring-2 ring-primary bg-primary/5'
                  : 'hover:border-primary/50'
              }`}
              onClick={() => onFontStyleChange(style.id)}
            >
              <CardContent className="p-4 text-center">
                <div className="font-semibold mb-1">{style.name}</div>
                <div className="text-xs text-muted-foreground">{style.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Estilo de Legendas */}
      {withSubtitles && (
        <div className="space-y-3">
          <Label className="text-base font-semibold">Estilo de Legendas</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {SUBTITLE_STYLES.map((style) => (
              <Card
                key={style.id}
                className={`cursor-pointer transition-all ${
                  subtitleStyle === style.id
                    ? 'ring-2 ring-primary bg-primary/5'
                    : 'hover:border-primary/50'
                }`}
                onClick={() => onSubtitleStyleChange(style.id)}
              >
                <CardContent className="p-4 text-center">
                  <div className="font-semibold mb-1">{style.name}</div>
                  <div className="text-xs text-muted-foreground">{style.description}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Preview Animado */}
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="text-sm font-semibold text-muted-foreground">
              Preview do Estilo
            </div>
            <div className="relative aspect-[9/16] max-w-[200px] mx-auto bg-black rounded-lg overflow-hidden">
              {/* Simulação de preview */}
              <div className="absolute inset-0 flex flex-col justify-between p-4">
                {/* Topo - Vídeo principal */}
                <div className="h-1/3 bg-gradient-to-br from-purple-500 to-blue-500 rounded" />
                
                {/* Centro - Headline */}
                {headline && (
                  <div className="text-center">
                    <div
                      className={`text-white font-bold text-lg ${
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
                
                {/* Inferior - Vídeo retenção */}
                <div className="h-1/3 bg-gradient-to-br from-green-500 to-teal-500 rounded" />
                
                {/* Legendas */}
                {withSubtitles && (
                  <div className="absolute bottom-4 left-0 right-0 text-center">
                    <div
                      className={`text-white text-sm ${
                        subtitleStyle === 'outline' ? 'text-stroke' :
                        subtitleStyle === 'shadow' ? 'drop-shadow-lg' :
                        'font-semibold'
                      }`}
                    >
                      Exemplo de legenda
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

