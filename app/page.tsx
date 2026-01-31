
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { Dumbbell, Users, Activity, Trophy, ArrowRight, CheckCircle2, Star, Zap, ShieldCheck } from "lucide-react";
import { useTranslations } from 'next-intl';
import { motion } from "framer-motion";

export default function Home() {
  const t = useTranslations('Landing');
  const tAuth = useTranslations('Auth');
  const tFooter = useTranslations('Footer');

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Navigation */}
      <header className="px-6 md:px-12 h-20 flex items-center justify-between border-b border-slate-100 dark:border-slate-900 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-2 font-black text-2xl tracking-tighter group cursor-pointer">
          <div className="bg-blue-600 p-1.5 rounded-lg group-hover:rotate-12 transition-transform duration-300">
            <Dumbbell className="text-white h-6 w-6" />
          </div>
          <span className="bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">FitTracker</span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-400">
          <a href="#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t('features.title')}</a>
          <a href="#how-it-works" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors uppercase text-[10px] tracking-widest">{t('features_extra.how_it_works')}</a>
          <a href="#pricing" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors lowercase italic">{t('features_extra.pricing')}</a>
        </nav>

        <div className="flex items-center gap-3">
          <ModeToggle />
          <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2 hidden sm:block" />
          <Link href="/login" className="hidden sm:block">
            <Button variant="ghost" className="text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 font-semibold">
              {t('nav.signin')}
            </Button>
          </Link>
          <Link href="/register">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95">
              {t('nav.signup')}
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 px-6 overflow-hidden">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-blue-500/10 dark:bg-blue-500/5 blur-[120px] rounded-full -z-10" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[400px] h-[400px] bg-indigo-500/10 dark:bg-indigo-500/5 blur-[100px] rounded-full -z-10" />

          <div className="max-w-6xl mx-auto flex flex-col items-center text-center space-y-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-100 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-300 text-xs font-bold tracking-wider uppercase"
            >
              <Zap className="h-3.5 w-3.5 fill-current" />
              <span>{t('hero.badge')}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-8xl font-black tracking-tight text-slate-950 dark:text-white leading-[1.1]"
            >
              {t('hero.title_start')} <br />
              <span className="text-blue-600 underline decoration-blue-500/30 underline-offset-8">{t('hero.title_highlight')}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
            >
              {t('hero.description')}
            </motion.p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
              <Link href="/register">
                <Button size="lg" className="h-14 px-10 text-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 rounded-2xl w-full sm:w-auto shadow-xl transition-all hover:-translate-y-1">
                  {t('hero.cta_primary')} <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="h-14 px-10 text-lg rounded-2xl w-full sm:w-auto border-2 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all">
                  {t('hero.cta_secondary')}
                </Button>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="pt-10 flex flex-col items-center gap-4 animate-in fade-in duration-1000 delay-500">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-950 bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-xs">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-950 bg-blue-600 text-white flex items-center justify-center font-bold text-xs ring-2 ring-blue-600/30">
                  +5k
                </div>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-500 flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-slate-700 dark:text-slate-300">4.9/5</span> {t('features_extra.testimonials')}
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 px-6 bg-slate-50/50 dark:bg-slate-900/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20 space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-950 dark:text-white leading-tight">
                {t('features.title')}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
                {t('features.subtitle')}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-10">
              {[
                { title: t('features.card_1_title'), desc: t('features.card_1_desc'), icon: Users, color: 'text-blue-600', bg: 'bg-blue-100/50 dark:bg-blue-900/20' },
                { title: t('features.card_2_title'), desc: t('features.card_2_desc'), icon: Dumbbell, color: 'text-indigo-600', bg: 'bg-indigo-100/50 dark:bg-indigo-900/20' },
                { title: t('features.card_3_title'), desc: t('features.card_3_desc'), icon: Activity, color: 'text-purple-600', bg: 'bg-purple-100/50 dark:bg-purple-900/20' }
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="group relative p-8 rounded-3xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 hover:border-blue-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/5"
                >
                  <div className={`h-14 w-14 rounded-2xl ${feature.bg} flex items-center justify-center ${feature.color} mb-8 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white uppercase tracking-tight">{feature.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section id="how-it-works" className="py-24 px-6 border-y border-slate-100 dark:border-slate-900">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-950 dark:text-white">
                {t('features_extra.how_it_works')}
              </h2>
              <div className="space-y-6">
                {[
                  { step: "01", text: t('features_extra.step_1'), icon: ShieldCheck },
                  { step: "02", text: t('features_extra.step_2'), icon: CheckCircle2 },
                  { step: "03", text: t('features_extra.step_3'), icon: Trophy }
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                  >
                    <div className="text-2xl font-black text-blue-600/20 dark:text-blue-400/10 tabular-nums">
                      {item.step}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="font-bold text-lg flex items-center gap-2">
                        <item.icon className="h-5 w-5 text-blue-600" />
                        {item.text}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="relative aspect-square md:aspect-auto md:h-[500px] rounded-3xl bg-slate-100 dark:bg-slate-900 overflow-hidden shadow-inner flex items-center justify-center group">
              {/* Mock UI/Illustration placeholder */}
              <div className="w-4/5 h-4/5 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl relative animate-pulse">
                <div className="h-10 border-b border-slate-100 dark:border-slate-900 flex items-center px-4 gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="p-6 space-y-4">
                  <div className="w-1/3 h-4 bg-slate-100 dark:bg-slate-900 rounded" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-24 bg-blue-50 dark:bg-blue-900/20 rounded-xl" />
                    <div className="h-24 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl" />
                  </div>
                  <div className="w-full h-32 bg-slate-50 dark:bg-slate-900/50 rounded-xl" />
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 to-transparent pointer-events-none" />
            </div>
          </div>
        </section>

        {/* Pricing / CTA Section */}
        <section id="pricing" className="py-24 px-6 relative overflow-hidden">
          <div className="max-w-4xl mx-auto text-center space-y-10 relative z-10">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white mix-blend-difference">
              {t('features_extra.pricing')}
            </h2>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 md:p-12 rounded-[2.5rem] bg-blue-600 text-white shadow-2xl shadow-blue-500/40 space-y-8 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-[100px] group-hover:bg-white/20 transition-all duration-700" />
              <div className="space-y-2 relative z-10">
                <p className="uppercase tracking-[0.2em] font-bold text-blue-200 text-sm">Professional Plan</p>
                <h3 className="text-5xl md:text-7xl font-black">R$ 0<span className="text-2xl font-medium opacity-70"> /mo</span></h3>
                <p className="text-blue-100">Gratuito para começar durante o Beta</p>
              </div>
              <ul className="grid sm:grid-cols-2 gap-4 text-left max-w-sm mx-auto font-medium relative z-10">
                {["Alunos Ilimitados", "Treinos Ilimitados", "Dashboard Analítico", "Suporte VIP"].map((feat, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle2 className="h-5 w-5 text-blue-300" />
                    {feat}
                  </motion.li>
                ))}
              </ul>
              <Link href="/register" className="block relative z-10">
                <Button size="lg" className="h-16 px-12 text-xl bg-white text-blue-600 hover:bg-slate-100 rounded-2xl w-full sm:w-auto font-black transition-all hover:scale-105 active:scale-95 shadow-xl shadow-black/10">
                  {t('hero.cta_primary')}
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 px-6 md:px-12 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 font-black text-xl tracking-tighter">
            <Dumbbell className="text-blue-600 h-5 w-5" />
            <span>FitTracker</span>
          </div>

          <p className="text-slate-500 text-sm order-3 md:order-2">
            © 2024 FitTracker. {t('features.card_3_desc').split('.')[0]}.
          </p>

          <div className="flex gap-6 text-sm font-semibold text-slate-600 dark:text-slate-400 order-2 md:order-3">
            <a href="#" className="hover:text-blue-600 transition-colors">{tFooter('privacy')}</a>
            <a href="#" className="hover:text-blue-600 transition-colors">{tFooter('terms')}</a>
            <a href="#" className="hover:text-blue-600 transition-colors">{tFooter('contact')}</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
