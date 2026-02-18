
import React from 'react';
import { Page } from '../types';

interface LandingProps {
  onNavigate: (page: Page) => void;
}

const Landing: React.FC<LandingProps> = ({ onNavigate }) => {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 pt-20 pb-16 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6">
          Your Career, <span className="text-indigo-600 underline underline-offset-8 decoration-indigo-200 dark:decoration-indigo-800/50">Optimized</span>.
        </h1>
        <p className="max-w-2xl mx-auto text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
          Create a professional CV in minutes or upload your existing one for an AI-powered deep dive into how recruiters see you.
        </p>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-16">
          {/* Card: Create CV */}
          <div 
            onClick={() => onNavigate(Page.CREATE)}
            className="group relative bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-600 transition-all cursor-pointer text-left"
          >
            <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-950/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">CV Builder</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">Create a stunning, ATS-friendly resume from scratch with our intuitive builder. PDF export ready.</p>
            <div className="inline-flex items-center text-indigo-600 font-semibold group-hover:gap-2 transition-all">
              Build my CV <span className="ml-1">→</span>
            </div>
          </div>

          {/* Card: Analyze CV */}
          <div 
            onClick={() => onNavigate(Page.ANALYZE)}
            className="group relative bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-600 transition-all cursor-pointer text-left"
          >
            <div className="w-14 h-14 bg-purple-50 dark:bg-purple-950/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">CV Analyzer</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">Upload your CV and let our AI find errors, suggest improvements, and analyze your professional photo suitability.</p>
            <div className="inline-flex items-center text-purple-600 font-semibold group-hover:gap-2 transition-all">
              Analyze my CV <span className="ml-1">→</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative background blur */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100 dark:bg-indigo-900/20 blur-[100px] -z-10 rounded-full opacity-50"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-100 dark:bg-purple-900/20 blur-[100px] -z-10 rounded-full opacity-50"></div>
    </div>
  );
};

export default Landing;
