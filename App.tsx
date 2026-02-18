
import React, { useState, useEffect } from 'react';
import Landing from './pages/Landing';
import CreateCV from './pages/CreateCV';
import AnalyzeCV from './pages/AnalyzeCV';
import { Page } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.LANDING);

  // Permanently force Dark Mode
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <div className="dark min-h-screen flex flex-col font-sans bg-slate-950 text-slate-100 transition-colors duration-300">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Full Brand Logo */}
            <div 
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => navigateTo(Page.LANDING)}
            >
              <div className="relative">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/20 group-hover:rotate-6 transition-transform duration-300">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-900 animate-pulse"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tighter text-white uppercase leading-none">
                  Match<span className="text-indigo-500">CV</span>
                </span>
                <span className="text-[10px] font-bold text-slate-500 tracking-[0.2em] uppercase">AI Assistant</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 sm:gap-6">
              {/* Navigation Segmented Control */}
              <div className="flex bg-slate-800 p-1 rounded-2xl border border-slate-700 shadow-inner">
                <button 
                  onClick={() => navigateTo(Page.CREATE)}
                  className={`px-6 py-2 text-sm font-bold rounded-xl transition-all duration-300 ${
                    currentPage === Page.CREATE 
                    ? 'bg-indigo-600 text-white shadow-lg' 
                    : 'text-slate-400 hover:text-indigo-300'
                  }`}
                >
                  Create
                </button>
                <button 
                  onClick={() => navigateTo(Page.ANALYZE)}
                  className={`px-6 py-2 text-sm font-bold rounded-xl transition-all duration-300 ${
                    currentPage === Page.ANALYZE 
                    ? 'bg-indigo-600 text-white shadow-lg' 
                    : 'text-slate-400 hover:text-indigo-300'
                  }`}
                >
                  Analyze
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        {currentPage === Page.LANDING && (
          <Landing onNavigate={navigateTo} />
        )}
        {currentPage === Page.CREATE && (
          <CreateCV />
        )}
        {currentPage === Page.ANALYZE && (
          <AnalyzeCV />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-600 font-bold text-xl tracking-[0.3em] uppercase opacity-70">
            sedra Naqeshbandi
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
