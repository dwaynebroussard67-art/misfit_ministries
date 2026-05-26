import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Heart, MessageCircle, Shield, ArrowRight } from 'lucide-react';
import { SEO } from '../components/SEO';
import { ImageHero } from '../components/ImageHero';
import { ImageSection } from '../components/ImageSection';
import { ImageGallery } from '../components/ImageGallery';

export default function Home() {
  const { data: siteCopy } = useQuery({
    queryKey: ['siteCopy'],
    queryFn: async () => {
      const res = await axios.get('/api/site-copy');
      return res.data;
    },
  });

  return (
    <>
      <SEO />
      <div className="min-h-screen bg-black text-white">
      {/* Hero Section - With Image Background */}
      <ImageHero
        imageSrc="/manus-storage/C6eLlgSFDzVK_8038cc19.jpg"
        overlayOpacity={0.5}
        overlayColor="from-black/70 to-black/50"
      >
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          {/* Eyebrow */}
          <div className="inline-block mb-6">
            <span className="text-amber-400 text-sm font-semibold tracking-widest uppercase">
              {siteCopy?.['home.hero.eyebrow'] || 'A Sanctuary for the Broken'}
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="text-white">Welcome to</span>
            <br />
            <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
              Misfit Ministries
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            {siteCopy?.['home.hero.heading'] || 'You\'ve been written off. Forgotten. Left behind. But God hasn\'t forgotten you.'}
          </p>

          {/* Description */}
          <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto">
            {siteCopy?.['home.community.description'] || 'We are a community for people who have been written off. A hospital for the broken. A place where your pain is heard, your story matters, and your redemption is possible.'}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a
              href="/prayer"
              className="group relative px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold rounded-lg hover:from-amber-400 hover:to-amber-500 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Heart className="w-5 h-5" />
              Submit a Prayer
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="/nura"
              className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 border border-slate-700"
            >
              <MessageCircle className="w-5 h-5" />
              Talk to Nura
            </a>
          </div>

          {/* Crisis Alert */}
          <div className="bg-red-950 border-l-4 border-red-500 p-6 rounded-lg inline-block">
            <p className="text-red-200 font-semibold mb-2">🚨 In Crisis?</p>
            <p className="text-red-100">
              <a href="tel:988" className="font-bold text-red-400 hover:text-red-300">Call 988</a>
              {' '}(Suicide & Crisis Lifeline) or{' '}
              <a href="sms:741741?body=HOME" className="font-bold text-red-400 hover:text-red-300">text HOME to 741741</a>
            </p>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
            <div className="animate-bounce">
              <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
      </ImageHero>

      {/* Compassion Gallery Section */}
      <section className="py-24 bg-black relative">
        <div className="max-w-6xl mx-auto px-6 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-white">Jesus</span>
              <br />
              <span className="bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent">Showed Us Compassion</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              His love reaches the broken, the forgotten, and the lost.
            </p>
          </div>
          <ImageGallery
            images={[
              { src: '/manus-storage/s505VAhPOKHQ_8e340907.jpg', alt: 'Jesus compassion and healing' },
              { src: '/manus-storage/TXxy6TRRe5Rv_0451480f.jpg', alt: 'Jesus loves people' },
              { src: '/manus-storage/GRUVSobI0iN1_f687f1ce.jpg', alt: 'Jesus healing compassion' },
            ]}
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-950 relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-white">How We</span>
              <br />
              <span className="bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent">Help You Heal</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Every tool here is designed with one purpose: to help you find hope, connection, and redemption.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Prayer Wall */}
            <a
              href="/prayer"
              className="group relative bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-xl border border-slate-700 hover:border-amber-500 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/20"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-amber-500/0 group-hover:from-amber-500/5 group-hover:to-amber-500/10 rounded-xl transition-all duration-300" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-amber-500/30 transition-colors">
                  <Heart className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Prayer Wall</h3>
                <p className="text-slate-400 mb-4">
                  Share your deepest prayers with a community that cares. Every prayer is heard. Every heart matters.
                </p>
                <div className="flex items-center text-amber-400 font-semibold group-hover:gap-2 transition-all">
                  Submit a Prayer
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>
            </a>

            {/* Testimonies */}
            <a
              href="/testimonies"
              className="group relative bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-xl border border-slate-700 hover:border-amber-500 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/20"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-amber-500/0 group-hover:from-amber-500/5 group-hover:to-amber-500/10 rounded-xl transition-all duration-300" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-amber-500/30 transition-colors">
                  <Shield className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Testimonies</h3>
                <p className="text-slate-400 mb-4">
                  Real stories of transformation. Real people who found redemption. Your story could be next.
                </p>
                <div className="flex items-center text-amber-400 font-semibold group-hover:gap-2 transition-all">
                  Read Stories
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>
            </a>

            {/* Nura AI */}
            <a
              href="/nura"
              className="group relative bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-xl border border-slate-700 hover:border-amber-500 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/20"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-amber-500/0 group-hover:from-amber-500/5 group-hover:to-amber-500/10 rounded-xl transition-all duration-300" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-amber-500/30 transition-colors">
                  <MessageCircle className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Talk to Nura</h3>
                <p className="text-slate-400 mb-4">
                  A motherly AI companion grounded in Ethiopian Orthodox theology. Someone to listen. Always.
                </p>
                <div className="flex items-center text-amber-400 font-semibold group-hover:gap-2 transition-all">
                  Start Conversation
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Community Section with Image */}
      <ImageSection
        imageSrc="/manus-storage/RLdeerKMOR1Y_6d074f7c.jpg"
        imagePosition="left"
        title="We Are a Community"
        description="You've been written off. Forgotten. Left behind. But God hasn't forgotten you. We are a community of misfits—people who have been written off, left behind, and forgotten. But God hasn't forgotten us. And neither have we forgotten each other. In this community, your pain is heard, your story matters, and your redemption is possible."
      />

      {/* Crisis Resources Section */}
      <section className="py-24 bg-black relative overflow-hidden">
        {/* Background accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600 rounded-full mix-blend-multiply filter blur-3xl opacity-5" />
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-white">Crisis</span>
              <br />
              <span className="bg-gradient-to-r from-red-400 to-red-500 bg-clip-text text-transparent">Resources</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Help is available right now. You are not alone. Reach out.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 988 */}
            <div className="bg-gradient-to-br from-red-950 to-red-900 border border-red-800 p-6 rounded-lg hover:border-red-600 transition-all">
              <h3 className="text-xl font-bold text-red-300 mb-2">988 Suicide & Crisis Lifeline</h3>
              <p className="text-red-100 mb-4">Call or text 988. Available 24/7.</p>
              <a href="tel:988" className="text-red-400 hover:text-red-300 font-semibold flex items-center gap-2">
                Call Now <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Crisis Text Line */}
            <div className="bg-gradient-to-br from-red-950 to-red-900 border border-red-800 p-6 rounded-lg hover:border-red-600 transition-all">
              <h3 className="text-xl font-bold text-red-300 mb-2">Crisis Text Line</h3>
              <p className="text-red-100 mb-4">Text HOME to 741741. Free, 24/7.</p>
              <a href="sms:741741?body=HOME" className="text-red-400 hover:text-red-300 font-semibold flex items-center gap-2">
                Text Now <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* SAMHSA */}
            <div className="bg-gradient-to-br from-red-950 to-red-900 border border-red-800 p-6 rounded-lg hover:border-red-600 transition-all">
              <h3 className="text-xl font-bold text-red-300 mb-2">SAMHSA National Helpline</h3>
              <p className="text-red-100 mb-4">Substance abuse & mental health support.</p>
              <a href="tel:1-800-662-4357" className="text-red-400 hover:text-red-300 font-semibold flex items-center gap-2">
                1-800-662-4357 <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* DV Hotline */}
            <div className="bg-gradient-to-br from-red-950 to-red-900 border border-red-800 p-6 rounded-lg hover:border-red-600 transition-all">
              <h3 className="text-xl font-bold text-red-300 mb-2">National Domestic Violence Hotline</h3>
              <p className="text-red-100 mb-4">Confidential support. Always available.</p>
              <a href="tel:1-800-799-7233" className="text-red-400 hover:text-red-300 font-semibold flex items-center gap-2">
                1-800-799-7233 <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section with Image */}
      <ImageSection
        imageSrc="/manus-storage/tymo5IS5Pp3i_4212c05c.jpg"
        imagePosition="right"
        title="Our Mission"
        description="Misfit Ministries exists to serve people in crisis with compassion and grace. We believe that every person has infinite worth in God's eyes, regardless of their past, their pain, or their circumstances. We are a community of misfits—people who have been written off, left behind, and forgotten. But God hasn't forgotten us. And neither have we forgotten each other."
      />

      {/* Strength Section */}
      <section className="py-24 bg-slate-950 relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-white">Find Your</span>
              <br />
              <span className="bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent">Strength</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              In God, we find the courage to face our struggles and the strength to overcome.
            </p>
          </div>
          <ImageGallery
            images={[
              { src: '/manus-storage/tymo5IS5Pp3i_4212c05c.jpg', alt: 'Fiery lion strength' },
              { src: '/manus-storage/IPHRvuzn4lO9_2c7eafe7.jpg', alt: 'Flaming lion spirit' },
              { src: '/manus-storage/0V7dS5dioNgN_e2d720ec.jpg', alt: 'Stages of faith journey' },
            ]}
          />
        </div>
      </section>
      </div>
    </>
  );
}
