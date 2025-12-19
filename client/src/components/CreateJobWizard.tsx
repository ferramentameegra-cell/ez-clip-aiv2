import { useState } from 'react';
import { VerticalType, VERTICAIS_LIST } from 'shared/verticais';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, ArrowLeft, Check, Loader2, Youtube, Scissors, Target, Video, Type, Eye } from 'lucide-react';
import { VideoPreviewSelector } from './VideoPreviewSelector';
import { RetentionVideoLibrary } from './RetentionVideoLibrary';
import { VideoStyleSelector } from './VideoStyleSelector';
import { FinalPreview } from './FinalPreview';
import { toast } from 'sonner';

type PackageSize = '5' | '10' | '50' | '100';

const PACKAGE_PRESETS: Record<PackageSize, { duration: number; label: string; description: string }> = {
  '5': { duration: 90, label: 'Pack 5', description: '5 clipes de ~90s cada' },
  '10': { duration: 60, label: 'Pack 10', description: '10 clipes de ~60s cada' },
  '50': { duration: 45, label: 'Pack 50', description: '50 clipes de ~45s cada' },
  '100': { duration: 30, label: 'Pack 100', description: '100 clipes de ~30s cada' },
};

interface CreateJobWizardProps {
  onComplete: (data: JobData) => void;
  isSubmitting?: boolean;
}

export interface JobData {
  youtubeUrl: string;
  packageSize?: PackageSize;
  clipDuration?: number;
  startTime?: number;
  endTime?: number;
  vertical: VerticalType;
  retentionVideoId?: string | null;
  randomizeRetention?: boolean;
  headline?: string;
  withSubtitles: boolean;
  fontStyle?: string;
  subtitleStyle?: string;
}

type Step = 'video' | 'trim' | 'niche' | 'retention' | 'style' | 'preview';

export function CreateJobWizard({ onComplete, isSubmitting = false }: CreateJobWizardProps) {
  const [currentStep, setCurrentStep] = useState<Step>('video');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [packageSize, setPackageSize] = useState<PackageSize | ''>('');
  const [startTime, setStartTime] = useState<number | undefined>(undefined);
  const [endTime, setEndTime] = useState<number | undefined>(undefined);
  const [vertical, setVertical] = useState<VerticalType | ''>('');
  const [retentionVideoId, setRetentionVideoId] = useState<string | null>(null);
  const [randomizeRetention, setRandomizeRetention] = useState(false);
  const [headline, setHeadline] = useState('');
  const [withSubtitles, setWithSubtitles] = useState(true);
  const [fontStyle, setFontStyle] = useState('default');
  const [subtitleStyle, setSubtitleStyle] = useState('default');

  const steps: { id: Step; label: string; icon: any }[] = [
    { id: 'video', label: 'Vídeo', icon: Youtube },
    { id: 'trim', label: 'Trim', icon: Scissors },
    { id: 'niche', label: 'Nicho', icon: Target },
    { id: 'retention', label: 'Retenção', icon: Video },
    { id: 'style', label: 'Estilo', icon: Type },
    { id: 'preview', label: 'Preview', icon: Eye },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);
  const canGoNext = () => {
    switch (currentStep) {
      case 'video':
        return !!youtubeUrl;
      case 'trim':
        return true; // Trim é opcional
      case 'niche':
        return !!vertical;
      case 'retention':
        return retentionVideoId !== null || randomizeRetention;
      case 'style':
        return true; // Estilo tem defaults
      case 'preview':
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!canGoNext()) {
      toast.error('Complete os campos obrigatórios antes de continuar');
      return;
    }

    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].id);
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].id);
    }
  };

  const handleComplete = () => {
    if (!vertical) {
      toast.error('Selecione um nicho');
      return;
    }

    const jobData: JobData = {
      youtubeUrl,
      packageSize: packageSize || undefined,
      clipDuration: packageSize ? undefined : 60,
      startTime,
      endTime,
      vertical: vertical as VerticalType,
      retentionVideoId: randomizeRetention ? null : retentionVideoId,
      randomizeRetention,
      headline: headline || undefined,
      withSubtitles,
      fontStyle,
      subtitleStyle,
    };

    onComplete(jobData);
  };

  // Calcular estimativa de partes
  const estimatedParts = packageSize ? parseInt(packageSize) : null;

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStepIndex;
            const isCompleted = index < currentStepIndex;
            
            return (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                      isActive
                        ? 'bg-primary text-primary-foreground border-primary'
                        : isCompleted
                        ? 'bg-green-500 text-white border-green-500'
                        : 'bg-muted text-muted-foreground border-muted'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <Icon className="w-6 h-6" />
                    )}
                  </div>
                  <span className={`mt-2 text-xs font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${isCompleted ? 'bg-green-500' : 'bg-muted'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <Card className="min-h-[500px]">
        <CardContent className="p-8">
          {/* Step 1: Seleção de Vídeo */}
          {currentStep === 'video' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Selecione o Vídeo</h2>
                <p className="text-muted-foreground">Cole a URL do YouTube ou faça upload do seu vídeo</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">URL do YouTube</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Dica:</strong> Você também pode fazer upload de vídeos próprios na próxima etapa.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Trim + Estimativa */}
          {currentStep === 'trim' && youtubeUrl && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Trim e Estimativa</h2>
                <p className="text-muted-foreground">
                  Defina o trecho do vídeo e veja quantas partes serão geradas
                </p>
              </div>

              <VideoPreviewSelector
                youtubeUrl={youtubeUrl}
                onTimeRangeChange={(start, end) => {
                  setStartTime(start);
                  setEndTime(end);
                }}
                disabled={!youtubeUrl}
              />

              {packageSize && (
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl font-bold text-purple-600">{estimatedParts}</div>
                    <div>
                      <p className="font-semibold">Partes estimadas</p>
                      <p className="text-sm text-muted-foreground">
                        {PACKAGE_PRESETS[packageSize].description}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <label className="text-sm font-medium">Pacote de Clipes</label>
                <select
                  className="w-full px-4 py-2 border rounded-lg"
                  value={packageSize}
                  onChange={(e) => setPackageSize(e.target.value as PackageSize)}
                >
                  <option value="">Selecione um pacote</option>
                  <option value="5">Pack 5 - 5 créditos</option>
                  <option value="10">Pack 10 - 10 créditos</option>
                  <option value="50">Pack 50 - 50 créditos</option>
                  <option value="100">Pack 100 - 100 créditos</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 3: Escolha do Nicho (TELA OBRIGATÓRIA) */}
          {currentStep === 'niche' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Escolha o Nicho do Conteúdo</h2>
                <p className="text-muted-foreground">
                  Cada nicho possui vídeos de retenção testados para maximizar watch time
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {VERTICAIS_LIST.map((v) => (
                  <Card
                    key={v.id}
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      vertical === v.id
                        ? 'ring-2 ring-primary bg-primary/5'
                        : 'hover:border-primary/50'
                    }`}
                    onClick={() => setVertical(v.id)}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl mb-2">{v.emoji}</div>
                      <div className="font-semibold">{v.name}</div>
                      {vertical === v.id && (
                        <Badge className="mt-2">Selecionado</Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Biblioteca de Vídeos de Retenção */}
          {currentStep === 'retention' && vertical && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Biblioteca de Vídeos de Retenção</h2>
                <p className="text-muted-foreground">
                  Escolha vídeos hipnóticos que mantêm atenção contínua enquanto seu conteúdo principal acontece
                </p>
              </div>

              <RetentionVideoLibrary
                vertical={vertical as VerticalType}
                selectedVideoId={retentionVideoId}
                onVideoSelect={setRetentionVideoId}
                onRandomizeChange={setRandomizeRetention}
                randomizeEnabled={randomizeRetention}
              />
            </div>
          )}

          {/* Step 5: Estilo Visual */}
          {currentStep === 'style' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Estilo Visual</h2>
                <p className="text-muted-foreground">
                  Escolha fontes e estilos de legenda para seus clipes
                </p>
              </div>

              <VideoStyleSelector
                fontStyle={fontStyle}
                subtitleStyle={subtitleStyle}
                onFontStyleChange={setFontStyle}
                onSubtitleStyleChange={setSubtitleStyle}
                headline={headline}
                onHeadlineChange={setHeadline}
                withSubtitles={withSubtitles}
                onSubtitlesChange={setWithSubtitles}
              />
            </div>
          )}

          {/* Step 6: Pré-visualização Final */}
          {currentStep === 'preview' && vertical && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Pré-visualização Final</h2>
                <p className="text-muted-foreground">
                  Este layout será aplicado a toda a série
                </p>
              </div>

              <FinalPreview
                youtubeUrl={youtubeUrl}
                vertical={vertical as VerticalType}
                retentionVideoId={retentionVideoId}
                headline={headline}
                withSubtitles={withSubtitles}
                fontStyle={fontStyle}
                subtitleStyle={subtitleStyle}
                partNumber={1}
                totalParts={estimatedParts || 10}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStepIndex === 0}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        {currentStepIndex < steps.length - 1 ? (
          <Button onClick={handleNext} disabled={!canGoNext()}>
            Próximo
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleComplete} disabled={!canGoNext() || isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Criando...
              </>
            ) : (
              <>
                Criar Série
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

