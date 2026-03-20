import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Zap, Lock, FolderOpen, Copy, ExternalLink, ArrowRight, Check, Key, Hash, Code, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] as const } },
};

const steps = [
  { icon: FolderOpen, title: 'Crie projetos', desc: 'Organize por cliente, empresa ou contexto.' },
  { icon: Lock, title: 'Adicione acessos', desc: 'Links, logins, senhas, API keys e tokens — tudo encriptado.' },
  { icon: Copy, title: 'Copie com 1 clique', desc: 'Acesse qualquer credencial instantaneamente.' },
];

const benefits = [
  'Encriptação AES-256 client-side',
  'Organização por projetos',
  'Copiar senha com 1 clique',
  'Guardar API Keys e Tokens',
  'Armazenar Hashes seguros',
  'Acesso de qualquer dispositivo',
  'App PWA — instale no celular',
  'Interface dark premium',
];

const limits = [
  { label: 'Projetos', value: 'Ilimitados' },
  { label: 'Acessos por projeto', value: 'Ilimitados' },
  { label: 'API Keys / Tokens', value: 'Ilimitados' },
  { label: 'Dispositivos', value: 'Ilimitados' },
];

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background noise-bg">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container flex items-center justify-between h-14 md:h-16 px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg text-foreground">VaultLink</span>
          </Link>
          <div className="flex items-center gap-2 md:gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground text-xs md:text-sm">Entrar</Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="gradient-bg text-primary-foreground border-0 hover:opacity-90 text-xs md:text-sm">Começar</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 md:pt-32 pb-16 md:pb-20 px-4">
        <motion.div variants={container} initial="hidden" animate="show" className="container max-w-4xl text-center">
          <motion.div variants={item} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-xs text-primary mb-6">
            <Zap className="w-3 h-3" />
            Gerenciador de acessos inteligente
          </motion.div>

          <motion.h1 variants={item} className="font-display text-3xl md:text-6xl font-bold leading-tight mb-6">
            Seu inventário digital,{' '}
            <span className="gradient-text">sob controle.</span>
          </motion.h1>

          <motion.p variants={item} className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto mb-4 leading-relaxed">
            Chega de perder tempo procurando senha em bloco de notas ou e-mail antigo.
            O VaultLink guarda todos os seus acessos digitais — links, logins, senhas, API keys e tokens —
            organizados por projeto, acessíveis com 1 clique.
          </motion.p>

          <motion.p variants={item} className="text-sm text-muted-foreground mb-10">
            Centralize sistemas, clientes, ferramentas e plataformas. Copie senhas, abra links e gerencie tudo sem estresse.
          </motion.p>

          <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="gradient-bg text-primary-foreground border-0 hover:opacity-90 px-8 text-base h-12 glow-shadow">
                Começar agora — R$14,99/mês
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>

          {/* Mock vault preview */}
          <motion.div variants={item} className="mt-12 md:mt-16 glass-card p-1 max-w-2xl mx-auto">
            <div className="rounded-xl bg-background/50 p-3 md:p-4 space-y-2">
              {[
                { name: 'Gmail Empresa', icon: '📧' },
                { name: 'AWS Console', icon: '☁️' },
                { name: 'OpenAI API Key', icon: '🔑' },
              ].map((entry, i) => (
                <div key={i} className="flex items-center justify-between py-2.5 md:py-3 px-3 md:px-4 rounded-lg bg-card border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md gradient-bg flex items-center justify-center text-sm">
                      {entry.icon}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-foreground">{entry.name}</p>
                      <p className="text-xs text-muted-foreground">••••••••••••</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="p-1.5 rounded-md bg-muted"><Copy className="w-3 h-3 text-muted-foreground" /></div>
                    <div className="p-1.5 rounded-md bg-muted"><ExternalLink className="w-3 h-3 text-muted-foreground" /></div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* How it works */}
      <section className="py-16 md:py-20 border-t border-border/50">
        <div className="container max-w-4xl px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12 md:mb-14">
            <h2 className="font-display text-2xl md:text-4xl font-bold mb-3">Como funciona</h2>
            <p className="text-muted-foreground">Três passos simples para nunca mais perder um acesso.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            {steps.map((step, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass-card-hover p-6 text-center">
                <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features: API Keys, Tokens, Hashes */}
      <section className="py-16 md:py-20 border-t border-border/50">
        <div className="container max-w-4xl px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="font-display text-2xl md:text-4xl font-bold mb-3">Mais que senhas</h2>
            <p className="text-muted-foreground">Guarde API Keys, Tokens e Hashes com a mesma segurança.</p>
          </motion.div>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: Key, title: 'API Keys', desc: 'Armazene chaves de API de forma segura com encriptação AES-256.' },
              { icon: Code, title: 'Tokens', desc: 'JWT, Bearer tokens, access tokens — tudo organizado por projeto.' },
              { icon: Hash, title: 'Hashes', desc: 'Guarde hashes, secrets e valores sensíveis com segurança.' },
            ].map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass-card-hover p-6 text-center">
                <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mx-auto mb-4">
                  <f.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="font-display font-semibold text-base mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 md:py-20 border-t border-border/50">
        <div className="container max-w-4xl px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="font-display text-2xl md:text-4xl font-bold mb-3">Tudo que você precisa</h2>
            <p className="text-muted-foreground">Funcionalidades pensadas para produtividade.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-3 max-w-lg mx-auto">
            {benefits.map((b, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="flex items-center gap-3 py-2">
                <div className="w-5 h-5 rounded-full gradient-bg flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
                <span className="text-sm text-foreground">{b}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 md:py-20 border-t border-border/50">
        <div className="container max-w-md text-center px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-display text-2xl md:text-4xl font-bold mb-3">Preço simples</h2>
            <p className="text-muted-foreground mb-8 md:mb-10">Um plano, acesso completo.</p>

            <div className="glass-card p-6 md:p-8 border-primary/20">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full gradient-bg text-xs text-primary-foreground font-medium mb-4">
                VaultLink Pro
              </div>
              <div className="flex items-baseline justify-center gap-1 mb-2">
                <span className="text-4xl font-display font-bold">R$14,99</span>
                <span className="text-muted-foreground">/mês</span>
              </div>
              <p className="text-sm text-muted-foreground mb-6">Acesso completo · Encriptação total · PWA Mobile</p>

              <div className="space-y-2 mb-6 text-left">
                {limits.map((l, i) => (
                  <div key={i} className="flex justify-between items-center text-sm py-1.5 border-b border-border/50 last:border-0">
                    <span className="text-muted-foreground">{l.label}</span>
                    <span className="text-foreground font-medium">{l.value}</span>
                  </div>
                ))}
              </div>

              <Link to="/register">
                <Button size="lg" className="w-full gradient-bg text-primary-foreground border-0 hover:opacity-90 h-12 glow-shadow">
                  Proteja seus acessos
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 md:py-10 border-t border-border/50">
        <div className="container text-center px-4">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-md gradient-bg flex items-center justify-center">
              <Shield className="w-3 h-3 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-foreground">VaultLink</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 VaultLink. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
