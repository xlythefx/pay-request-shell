import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import { BackgroundAnimation } from "@/components/BackgroundAnimation";
import { ArrowRight, CheckCircle, Shield, Zap } from "lucide-react";
import { isAuthenticated } from "@/lib/auth";
import heroImage from "@/assets/hero-corporate.jpg";
import logoImage from "@/assets/feature-digital-logo.png";

export default function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });

    // Redirect if already logged in
    if (isAuthenticated()) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const features = [
    {
      icon: Zap,
      title: "Fast Approval Workflow",
      description: "Streamline your payment request process with automated workflows and instant notifications.",
    },
    {
      icon: Shield,
      title: "Secure & Compliant",
      description: "Enterprise-grade security with role-based access control and audit trails.",
    },
    {
      icon: CheckCircle,
      title: "Multi-Template Support",
      description: "Choose from various templates for different payment types including salary, tools, and vendors.",
    },
  ];

  return (
    <div className="min-h-screen">
      <BackgroundAnimation />
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <img src={logoImage} alt="Feature Digital LTD logo" className="h-10 w-10" />
            <span className="text-xl font-bold">Feature Digital LTD</span>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                <span className="gradient-text">Simplify Your</span>
                <br />
                Payment Requests
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Streamline your financial workflows with our comprehensive payment request management system.
                Fast, secure, and built for modern businesses.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/login">
                  <Button size="lg" className="group">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={heroImage}
                  alt="Professional business team"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            data-aos="fade-up"
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 gradient-text">
              Why Choose Feature Digital?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built for efficiency, designed for scale
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                  className="glass-effect rounded-xl p-8 hover:border-primary/50 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="glass-effect rounded-2xl p-12" data-aos="zoom-in">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <h3 className="text-5xl font-bold gradient-text mb-2">99%</h3>
                <p className="text-muted-foreground">Approval Rate</p>
              </div>
              <div>
                <h3 className="text-5xl font-bold gradient-text mb-2">2hrs</h3>
                <p className="text-muted-foreground">Average Processing Time</p>
              </div>
              <div>
                <h3 className="text-5xl font-bold gradient-text mb-2">500+</h3>
                <p className="text-muted-foreground">Companies Trust Us</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            data-aos="fade-up"
            className="glass-effect rounded-2xl p-12 text-center"
          >
            <h2 className="text-4xl font-bold mb-4 gradient-text">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join hundreds of companies streamlining their payment workflows
            </p>
            <Link to="/login">
              <Button size="lg" className="group">
                Start Now
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2024 Feature Digital. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
