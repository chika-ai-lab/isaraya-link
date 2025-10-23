import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sparkles,
  Smartphone,
  Share2,
  Palette,
  QrCode,
  TrendingUp,
  Users,
  Globe,
  Zap,
  Shield,
  Heart,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: Smartphone,
      title: "Profil Mobile-First",
      description: "Une page web optimisée pour mobile qui présente votre entreprise de manière professionnelle",
    },
    {
      icon: Palette,
      title: "Personnalisation Totale",
      description: "Choisissez parmi 29 thèmes ou créez votre propre palette de couleurs unique",
    },
    {
      icon: Share2,
      title: "Réseaux Sociaux",
      description: "Centralisez tous vos réseaux sociaux en un seul endroit : Facebook, Instagram, TikTok, YouTube...",
    },
    {
      icon: QrCode,
      title: "QR Code Intégré",
      description: "Générez un QR code personnalisé pour partager votre profil facilement",
    },
    {
      icon: TrendingUp,
      title: "Produits & Services",
      description: "Présentez vos produits, services et promotions avec des visuels attractifs",
    },
    {
      icon: Globe,
      title: "Multi-Profils",
      description: "Gérez plusieurs entreprises avec un seul compte",
    },
  ];

  const stats = [
    { value: "99.9%", label: "Disponibilité" },
    { value: "< 1s", label: "Temps de chargement" },
    { value: "100%", label: "Mobile-friendly" },
    { value: "∞", label: "Profils possibles" },
  ];

  const plans = [
    {
      name: "Gratuit",
      price: "0",
      description: "Parfait pour commencer",
      features: [
        "1 profil d'entreprise",
        "Tous les thèmes disponibles",
        "Upload de logo",
        "Réseaux sociaux illimités",
        "Produits & Services",
        "QR Code",
      ],
      cta: "Commencer gratuitement",
      popular: false,
    },
    {
      name: "Premium",
      price: "1 500",
      description: "Pour les professionnels",
      features: [
        "Profils illimités",
        "Tous les thèmes + Custom",
        "Upload de logo HD",
        "Statistiques avancées",
        "Support prioritaire",
        "Sous-domaine personnalisé",
        "Sans publicité",
      ],
      cta: "Essayer Premium",
      popular: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 py-20 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6 border border-primary/20">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Nouvelle plateforme lancée !</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Votre entreprise,
              <br />
              une seule page
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Créez votre page professionnelle en quelques minutes. Partagez vos produits, services et réseaux sociaux
              avec un design unique qui vous ressemble.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/auth">
                <Button size="lg" className="text-lg px-8 group">
                  Commencer gratuitement
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/isaraya">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Voir un exemple
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Tout ce dont vous avez besoin</h2>
            <p className="text-xl text-muted-foreground">
              Une plateforme complète pour gérer votre présence en ligne
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow border-2 hover:border-primary/50">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Tarifs simples et transparents</h2>
            <p className="text-xl text-muted-foreground">
              Commencez gratuitement, passez à Premium quand vous êtes prêt
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <Card
                  className={`h-full ${
                    plan.popular ? "border-primary border-2 shadow-xl relative" : ""
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                      Plus populaire
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      {plan.price !== "0" && <span className="text-muted-foreground"> FCFA/mois</span>}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link to="/auth" className="block">
                      <Button
                        className="w-full"
                        variant={plan.popular ? "default" : "outline"}
                        size="lg"
                      >
                        {plan.cta}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-primary via-secondary to-accent p-1 rounded-2xl"
          >
            <div className="bg-background rounded-xl p-12 text-center">
              <Zap className="w-16 h-16 mx-auto mb-6 text-primary" />
              <h2 className="text-4xl font-bold mb-4">Prêt à commencer ?</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Rejoignez des centaines d'entreprises qui utilisent déjà iLink
              </p>
              <Link to="/auth">
                <Button size="lg" className="text-lg px-12">
                  Créer mon profil gratuitement
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">iLink</h3>
              <p className="text-sm text-muted-foreground">
                La plateforme tout-en-un pour votre présence digitale
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produit</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/auth" className="hover:text-primary transition-colors">
                    Fonctionnalités
                  </Link>
                </li>
                <li>
                  <Link to="/auth" className="hover:text-primary transition-colors">
                    Tarifs
                  </Link>
                </li>
                <li>
                  <Link to="/isaraya" className="hover:text-primary transition-colors">
                    Exemples
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Légal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Confidentialité
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    CGU
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 iLink. Tous droits réservés.
            </p>
            <div className="flex gap-4">
              <Heart className="w-5 h-5 text-primary fill-primary" />
              <span className="text-sm text-muted-foreground">Made in Senegal</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
