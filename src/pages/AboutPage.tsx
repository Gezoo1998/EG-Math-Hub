import React from 'react';
import { Calculator, Users, Target, Award, Mail, Globe, Github } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="glass-card p-8 slide-in text-center">
        <Calculator size={64} className="mx-auto text-blue-300 mb-6" />
        <h1 className="text-4xl font-bold text-white mb-4">About EG Math Hub</h1>
        <p className="text-xl text-white/80 max-w-2xl mx-auto">
          A modern platform dedicated to sharing cutting-edge mathematical research and discoveries
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="glass-card p-6 slide-in">
          <Target size={32} className="text-green-400 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-3">Our Mission</h2>
          <p className="text-white/80 leading-relaxed">
            To provide an accessible, beautiful platform where mathematicians and researchers 
            can share their work with the global community. We believe that mathematical knowledge 
            should be freely available and beautifully presented.
          </p>
        </div>

        <div className="glass-card p-6 slide-in">
          <Users size={32} className="text-purple-400 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-3">Our Community</h2>
          <p className="text-white/80 leading-relaxed">
            Join a growing community of mathematicians, researchers, students, and math enthusiasts. 
            Our platform serves academics, professionals, and curious minds who are passionate about 
            advancing mathematical understanding.
          </p>
        </div>
      </div>

      <div className="glass-card p-8 slide-in">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Platform Features</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calculator size={28} className="text-blue-300" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">LaTeX Support</h3>
            <p className="text-white/70 text-sm">
              Full support for mathematical equations, formulas, and complex notation
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target size={28} className="text-purple-300" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Advanced Search</h3>
            <p className="text-white/70 text-sm">
              Powerful filtering by category, tags, and content search
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award size={28} className="text-green-300" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Quality Content</h3>
            <p className="text-white/70 text-sm">
              Curated mathematical articles from verified researchers and institutions
            </p>
          </div>
        </div>
      </div>

      <div className="glass-card p-8 slide-in">
        <h2 className="text-2xl font-bold text-white mb-6">About EG Math Hub</h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-white/80 leading-relaxed mb-4">
            EG Math Hub was created to bridge the gap between complex mathematical research and 
            public understanding through beautiful, accessible presentation. Our platform focuses 
            specifically on mathematical sciences, providing specialized tools and features for 
            mathematical content.
          </p>
          <p className="text-white/80 leading-relaxed">
            We're committed to maintaining high standards of mathematical rigor while making research 
            more discoverable and engaging for readers worldwide. Whether you're a professional 
            mathematician, student, or simply curious about mathematics, EG Math Hub provides a 
            welcoming space for mathematical exploration.
          </p>
        </div>
      </div>

      <div className="glass-card p-8 slide-in">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Get In Touch</h2>
        <div className="flex flex-wrap justify-center gap-6">
          <a
            href="mailto:contact@egmathhub.demo"
            className="flex items-center space-x-2 glass-button"
          >
            <Mail size={18} />
            <span>Email Us</span>
          </a>
          <a
            href="#"
            className="flex items-center space-x-2 glass-button"
          >
            <Globe size={18} />
            <span>Website</span>
          </a>
          <a
            href="#"
            className="flex items-center space-x-2 glass-button"
          >
            <Github size={18} />
            <span>GitHub</span>
          </a>
        </div>
      </div>

      <div className="text-center">
        <p className="text-white/60">
          © 2024 EG Math Hub. Advancing mathematics through beautiful presentation.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;