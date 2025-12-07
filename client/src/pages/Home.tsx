import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check, Play } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { FAQ } from '@/components/FAQ';

export function Home() {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
      {/* Header da Landing Page */}
      <header className={`sticky top-0 z-50 ${isDark ? 'bg-slate-900/95' : 'bg-white/95'} backdrop-blur border-b ${isDark ? 'border-slate-800' : 'border-gray-200'}`}>
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {t('common.appName')}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'} transition-colors`}>
              {t('header.features')}
            </a>
            <a href="#how" className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'} transition-colors`}>
              {t('header.howItWorks')}
            </a>
            <a href="#pricing" className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'} transition-colors`}>
              {t('header.pricing')}
            </a>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login">
              <a className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'} transition-colors`}>
                {t('header.login')}
              </a>
            </Link>
            <Link href="/signup">
              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                {t('header.signup')}
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className={`relative overflow-hidden py-20 md:py-32 ${isDark ? 'bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'}`}>
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute top-0 left-1/4 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse ${isDark ? 'bg-purple-500' : 'bg-purple-300'}`}></div>
          <div className={`absolute top-0 right-1/4 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000 ${isDark ? 'bg-blue-500' : 'bg-blue-300'}`}></div>
        </div>

        <div className="relative z-10 container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <div className={`inline-block mb-6 px-4 py-2 rounded-full ${isDark ? 'bg-indigo-900/30' : 'bg-indigo-100'}`}>
              <span className={`${isDark ? 'text-indigo-400' : 'text-indigo-600'} font-semibold text-sm`}>
                {t('home.hero.badge')}
              </span>
            </div>

            <h1 className={`text-5xl md:text-6xl font-black mb-6 leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {t('home.hero.title')}
            </h1>

            <p className={`text-xl md:text-2xl mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {t('home.hero.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/signup">
                <Button className="h-14 px-8 text-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                  {t('home.hero.cta')} <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button variant="outline" className="h-14 px-8 text-lg">
                <Play className="mr-2 w-5 h-5" /> {t('home.hero.ctaSecondary')}
              </Button>
            </div>

            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {t('home.hero.noCard')}
            </p>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className={`py-16 ${isDark ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4">
          <h2 className={`text-center text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {t('home.socialProof.title')}
          </h2>
          <p className={`text-center text-lg mb-12 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {t('home.socialProof.subtitle')}
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Dr. Fernando Lemos */}
            <div className={`p-6 rounded-xl ${isDark ? 'bg-slate-700/50 border border-slate-600' : 'bg-white border border-gray-200'}`}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500"></div>
                <div>
                  <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {t('home.testimonials.testimonial1.name')}
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {t('home.testimonials.testimonial1.title')}
                  </p>
                </div>
              </div>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                "{t('home.testimonials.testimonial1.quote')}"
              </p>
            </div>

            {/* Daniel Braun */}
            <div className={`p-6 rounded-xl ${isDark ? 'bg-slate-700/50 border border-slate-600' : 'bg-white border border-gray-200'}`}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500"></div>
                <div>
                  <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {t('home.testimonials.testimonial2.name')}
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {t('home.testimonials.testimonial2.title')}
                  </p>
                </div>
              </div>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                "{t('home.testimonials.testimonial2.quote')}"
              </p>
            </div>

            {/* Josyas Borba */}
            <div className={`p-6 rounded-xl ${isDark ? 'bg-slate-700/50 border border-slate-600' : 'bg-white border border-gray-200'}`}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-red-500"></div>
                <div>
                  <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {t('home.testimonials.testimonial3.name')}
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {t('home.testimonials.testimonial3.title')}
                  </p>
                </div>
              </div>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                "{t('home.testimonials.testimonial3.quote')}"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className={`py-20 ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
        <div className="container mx-auto px-4">
          <h2 className={`text-center text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {t('home.features.title')}
          </h2>
          <p className={`text-center text-xl mb-16 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {t('home.features.subtitle')}
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className={`p-8 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mb-4">
                  <Check className="w-6 h-6 text-white" />
                          </div>
                <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {t(`home.features.feature${i}.title`)}
                </h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {t(`home.features.feature${i}.description`)}
                </p>
              </div>
            ))}
                      </div>
                      </div>
      </section>

      {/* How It Works */}
      <section id="how" className={`py-20 ${isDark ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4">
          <h2 className={`text-center text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {t('home.howItWorks.title')}
          </h2>
          <p className={`text-center text-xl mb-16 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {t('home.howItWorks.subtitle')}
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">{i}</span>
                  </div>
                <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {t(`home.howItWorks.step${i}.title`)}
                </h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {t(`home.howItWorks.step${i}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className={`py-20 ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
        <div className="container mx-auto px-4">
          <h2 className={`text-center text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {t('home.pricing.title')}
          </h2>
          <p className={`text-center text-xl mb-16 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {t('home.pricing.subtitle')}
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free */}
            <div className={`p-8 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
              <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {t('home.pricing.free.name')}
              </h3>
              <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {t('home.pricing.free.description')}
              </p>
              <div className="mb-6">
                <span className="text-4xl font-bold">{t('home.pricing.free.price')}</span>
              </div>
              <Link href="/signup">
                <Button variant="outline" className="w-full mb-6">
                  {t('home.pricing.free.cta')}
                </Button>
              </Link>
              <ul className="space-y-3">
                {(t('home.pricing.free.features', { returnObjects: true }) as string[]).map((feature: string, i: number) => (
                  <li key={i} className={`flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    <Check className="w-5 h-5 text-green-500" /> {feature}
                  </li>
                ))}
              </ul>
                </div>

            {/* Pro - Destaque */}
            <div className={`p-8 rounded-xl border-2 border-indigo-600 ${isDark ? 'bg-slate-800/50' : 'bg-white'} transform scale-105 relative`}>
              <div className="mb-4 inline-block px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm">
                  {t('home.pricing.pro.badge')}
                </span>
              </div>
              <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {t('home.pricing.pro.name')}
              </h3>
              <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {t('home.pricing.pro.description')}
              </p>
              <div className="mb-2">
                <span className="text-4xl font-bold">{t('home.pricing.pro.price')}</span>
                <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t('home.pricing.pro.period')}</span>
              </div>
              <p className="text-sm text-green-600 mb-6">{t('home.pricing.pro.bonus')}</p>
              <Link href="/signup">
                <Button className="w-full mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                  {t('home.pricing.pro.cta')}
                </Button>
              </Link>
              <ul className="space-y-3">
                {(t('home.pricing.pro.features', { returnObjects: true }) as string[]).map((feature: string, i: number) => (
                  <li key={i} className={`flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    <Check className="w-5 h-5 text-green-500" /> {feature}
                  </li>
                ))}
              </ul>
                  </div>

            {/* Premium */}
            <div className={`p-8 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
              <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {t('home.pricing.premium.name')}
              </h3>
              <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {t('home.pricing.premium.description')}
              </p>
              <div className="mb-6">
                <span className="text-4xl font-bold">{t('home.pricing.premium.price')}</span>
                <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t('home.pricing.pro.period')}</span>
              </div>
              <Link href="/signup">
                <Button variant="outline" className="w-full mb-6">
                  {t('home.pricing.premium.cta')}
                </Button>
              </Link>
              <ul className="space-y-3">
                {(t('home.pricing.premium.features', { returnObjects: true }) as string[]).map((feature: string, i: number) => (
                  <li key={i} className={`flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    <Check className="w-5 h-5 text-green-500" /> {feature}
                  </li>
                ))}
              </ul>
                </div>
                </div>
                </div>
      </section>

      {/* FAQ */}
      <section className={`py-20 ${isDark ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className={`text-center text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {t('home.faq.title')}
          </h2>
          <p className={`text-center text-xl mb-16 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {t('home.faq.subtitle')}
          </p>

          <FAQ items={(t('home.faq.questions', { returnObjects: true }) as any[]).map((item: any) => ({
            question: item.question,
            answer: item.answer
          }))} />
              </div>
      </section>

      {/* Final CTA */}
      <section className={`py-20 ${isDark ? 'bg-gradient-to-r from-indigo-900/20 to-purple-900/20' : 'bg-gradient-to-r from-indigo-50 to-purple-50'}`}>
        <div className="container mx-auto px-4 text-center">
          <h2 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {t('home.cta.title')}
          </h2>
          <p className={`text-xl mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {t('home.cta.subtitle')}
          </p>
          <Link href="/signup">
            <Button className="h-14 px-8 text-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
              {t('home.cta.button')} <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className={`${isDark ? 'bg-slate-900 border-t border-slate-800' : 'bg-gray-900 border-t border-gray-800'} text-white py-12`}>
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-4">{t('common.appName')}</h3>
              <p className="text-gray-400">{t('common.appDescription')}</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Produto</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white">{t('header.features')}</a></li>
                <li><a href="#pricing" className="hover:text-white">{t('header.pricing')}</a></li>
                <li><a href="#how" className="hover:text-white">{t('header.howItWorks')}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Empresa</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Sobre</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Contato</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Privacidade</a></li>
                <li><a href="#" className="hover:text-white">Termos</a></li>
                <li><a href="#" className="hover:text-white">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className={`border-t ${isDark ? 'border-slate-800' : 'border-gray-800'} pt-8 text-center text-gray-400`}>
            <p>&copy; 2025 {t('common.appName')}. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

