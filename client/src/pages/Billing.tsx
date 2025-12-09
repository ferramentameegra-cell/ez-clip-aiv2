import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { useI18n } from '@/hooks/useI18n';
import { CreditCard, Check, Loader2, Sparkles } from 'lucide-react';

export function Billing() {
  const { t } = useI18n();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const { data: plans = [], isLoading: plansLoading } = trpc.payment.getPlans.useQuery();
  const createCheckout = trpc.payment.createCheckoutSession.useMutation();

  // Verificar se há parâmetros de sucesso/cancelamento na URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const success = params.get('success');
    const canceled = params.get('canceled');

    if (success) {
      // Webhook do Stripe já processa o pagamento automaticamente
      // Apenas mostrar mensagem de sucesso
      toast.success('Pagamento confirmado! Créditos serão adicionados em breve.');
      // Limpar URL
      window.history.replaceState({}, '', '/billing');
    } else if (canceled) {
      toast.info('Pagamento cancelado');
      window.history.replaceState({}, '', '/billing');
    }
  }, []);

  const handlePurchase = async (planKey: string, interval: 'month' | 'year' = 'month') => {
    try {
      setSelectedPlan(`${planKey}-${interval}`);
      const result = await createCheckout.mutateAsync({ 
        planKey: planKey as 'starter' | 'creator' | 'pro',
        interval: interval,
      });
      
      if (result.url) {
        // Redirecionar para checkout do Stripe
        window.location.href = result.url;
      } else {
        toast.error('Erro ao criar sessão de checkout');
      }
    } catch (error: any) {
      toast.error(error.message || 'Erro ao processar pagamento');
    } finally {
      setSelectedPlan(null);
    }
  };

  // Obter créditos do usuário
  const user = localStorage.getItem('user');
  const userCredits = user ? JSON.parse(user).credits || 0 : 0;

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('billing.title')}</h1>
        <p className="text-muted-foreground">{t('billing.subtitle')}</p>
        
        {/* Mostrar créditos atuais */}
        <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-800 font-medium">{t('billing.currentCredits')}</p>
              <p className="text-2xl font-bold text-purple-900">{userCredits} {t('billing.credits')}</p>
            </div>
            <Sparkles className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {plansLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card
              key={plan.key}
              className={`relative overflow-hidden transition-all hover:shadow-lg ${
                plan.key === 'creator' ? 'border-purple-500 border-2' : ''
              }`}
            >
              {plan.key === 'creator' && (
                <div className="absolute top-0 right-0 bg-purple-600 text-white px-3 py-1 text-xs font-semibold">
                  {t('billing.popular')}
                </div>
              )}
              
              <CardHeader>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.monthlyCredits} {t('billing.credits')}/mês</CardDescription>
              </CardHeader>
              
              <CardContent>
                {/* Mostrar preços mensais e anuais */}
                <div className="mb-6 space-y-4">
                  <div>
                    <div className="flex items-baseline">
                      <span className="text-2xl font-bold">R$</span>
                      <span className="text-3xl font-bold ml-1">{plan.prices.month.amount.toFixed(2).replace('.', ',')}</span>
                      <span className="text-sm text-muted-foreground ml-2">/mês</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      R$ {(plan.prices.month.amount / plan.monthlyCredits).toFixed(2).replace('.', ',')} por crédito
                    </p>
                  </div>
                  
                  <div className="pt-2 border-t">
                    <div className="flex items-baseline">
                      <span className="text-xl font-bold">R$</span>
                      <span className="text-2xl font-bold ml-1">{plan.prices.year.amount.toFixed(2).replace('.', ',')}</span>
                      <span className="text-sm text-muted-foreground ml-2">/ano</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Economize {Math.round((1 - (plan.prices.year.amount / (plan.prices.month.amount * 12))) * 100)}%
                    </p>
                  </div>
                </div>

                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-green-600 mr-2" />
                    {plan.monthlyCredits} {t('billing.clipsToProcess')}/mês
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-green-600 mr-2" />
                    {t('billing.unlimitedTime')}
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-green-600 mr-2" />
                    {t('billing.highQuality')}
                  </li>
                </ul>

                <div className="space-y-2">
                  <Button
                    className="w-full"
                    variant={plan.key === 'creator' ? 'default' : 'outline'}
                    onClick={() => handlePurchase(plan.key, 'month')}
                    disabled={createCheckout.isPending && selectedPlan === `${plan.key}-month`}
                  >
                    {createCheckout.isPending && selectedPlan === `${plan.key}-month` ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('billing.processing')}
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Assinar Mensal
                      </>
                    )}
                  </Button>
                  
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => handlePurchase(plan.key, 'year')}
                    disabled={createCheckout.isPending && selectedPlan === `${plan.key}-year`}
                  >
                    {createCheckout.isPending && selectedPlan === `${plan.key}-year` ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('billing.processing')}
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Assinar Anual
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Informações adicionais */}
      <div className="mt-8 p-6 bg-muted rounded-lg">
        <h3 className="font-semibold mb-2">{t('billing.infoTitle')}</h3>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>• {t('billing.info1')}</li>
          <li>• {t('billing.info2')}</li>
          <li>• {t('billing.info3')}</li>
        </ul>
      </div>
    </div>
  );
}

