
import React, { useState, useRef } from 'react';
import { analyzeCV } from '../services/geminiService';
import { AnalysisResult } from '../types';

const AnalyzeCV: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
      setResult(null); 
    }
  };

  const handleAnalyze = async () => {
    if (!preview || !file) return;
    
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeCV(preview, file.type);
      setResult(analysis);
    } catch (error) {
      console.error("Analysis failed", error);
      alert("Failed to analyze CV. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Deep CV Analysis</h2>
        <p className="text-slate-600 dark:text-slate-400">Get instant feedback on your resume's structure, content, and professional appearance.</p>
      </div>

      {!result && !isAnalyzing && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center transition-colors hover:border-indigo-300 dark:hover:border-indigo-600">
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,application/pdf"
            className="hidden"
          />
          {preview ? (
            <div className="w-full flex flex-col items-center">
              <div className="w-48 h-64 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 mb-6 shadow-sm">
                {file?.type.includes('image') ? (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-300 mb-8">{file?.name}</p>
              <div className="flex gap-4">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Change File
                </button>
                <button 
                  onClick={handleAnalyze}
                  className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-colors"
                >
                  Start Analysis
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-950/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <p className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Upload your resume</p>
              <p className="text-slate-500 dark:text-slate-400 mb-8">PDF or Image formats supported</p>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-colors"
              >
                Choose File
              </button>
            </div>
          )}
        </div>
      )}

      {isAnalyzing && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-16 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-8"></div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Our AI is reading your CV...</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm">Checking for layout, keywords, and professional impact.</p>
        </div>
      )}

      {result && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Match Score</p>
              <div className={`text-6xl font-black mb-4 ${
                result.score > 80 ? 'text-emerald-500' : 
                result.score > 50 ? 'text-amber-500' : 'text-rose-500'
              }`}>
                {result.score}%
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-600 transition-all duration-1000" 
                  style={{ width: `${result.score}%` }}
                ></div>
              </div>
            </div>

            <div className="md:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg flex items-center justify-center text-indigo-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Photo Suitability</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed italic border-l-4 border-indigo-200 dark:border-indigo-800 pl-4">
                "{result.photoFeedback}"
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-xl font-bold text-emerald-700 dark:text-emerald-500 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Strengths
              </h3>
              <ul className="space-y-3">
                {result.strengths.map((s, idx) => (
                  <li key={idx} className="flex gap-3 text-slate-600 dark:text-slate-400">
                    <span className="text-emerald-500 font-bold">•</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-xl font-bold text-rose-700 dark:text-rose-500 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Areas to Improve
              </h3>
              <ul className="space-y-3">
                {result.weaknesses.map((w, idx) => (
                  <li key={idx} className="flex gap-3 text-slate-600 dark:text-slate-400">
                    <span className="text-rose-500 font-bold">•</span>
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Content Refinement</h3>
            <div className="prose dark:prose-invert prose-slate max-w-none text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
              {result.contentImprovements}
            </div>
          </div>

          <div className="bg-indigo-900 dark:bg-indigo-950 p-8 rounded-3xl shadow-xl text-white">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <svg className="w-8 h-8 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Next Steps to Success
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {result.suggestedActionItems.map((item, idx) => (
                <div key={idx} className="bg-indigo-800/50 dark:bg-indigo-900/50 p-4 rounded-xl flex gap-4 items-start border border-indigo-700/30">
                  <span className="bg-indigo-400 text-indigo-900 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-indigo-50 font-medium leading-tight">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center pt-8">
            <button 
              onClick={() => setResult(null)}
              className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
            >
              ← Analyze another resume
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyzeCV;
