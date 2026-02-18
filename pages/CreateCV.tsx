
import React, { useState, useRef } from 'react';
import { CVData, Experience, Education } from '../types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const CreateCV: React.FC = () => {
  const [cv, setCv] = useState<CVData>({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      jobTitle: '',
      summary: '',
      photo: ''
    },
    experience: [],
    education: [],
    skills: [],
    languages: []
  });

  const [activeStep, setActiveStep] = useState(0);
  const cvPreviewRef = useRef<HTMLDivElement>(null);

  const steps = [
    { label: 'Bio', icon: '👤' },
    { label: 'Work', icon: '💼' },
    { label: 'Study', icon: '🎓' },
    { label: 'Skills', icon: '⚡' },
    { label: 'Finish', icon: '📄' }
  ];

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCv(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [name]: value }
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCv(prev => ({
          ...prev,
          personalInfo: { ...prev.personalInfo, photo: reader.result as string }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addExperience = () => {
    setCv(prev => ({
      ...prev,
      experience: [...prev.experience, { company: '', position: '', startDate: '', endDate: '', description: '' }]
    }));
  };

  const updateExperience = (index: number, field: keyof Experience, value: string) => {
    const updated = [...cv.experience];
    updated[index] = { ...updated[index], [field]: value };
    setCv(prev => ({ ...prev, experience: updated }));
  };

  const addEducation = () => {
    setCv(prev => ({
      ...prev,
      education: [...prev.education, { institution: '', degree: '', graduationDate: '' }]
    }));
  };

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    const updated = [...cv.education];
    updated[index] = { ...updated[index], [field]: value };
    setCv(prev => ({ ...prev, education: updated }));
  };

  const addSkill = (skill: string) => {
    if (skill && !cv.skills.includes(skill)) {
      setCv(prev => ({ ...prev, skills: [...prev.skills, skill] }));
    }
  };

  const downloadPDF = async () => {
    if (!cvPreviewRef.current) return;
    
    const element = cvPreviewRef.current;
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${cv.personalInfo.fullName.replace(/\s/g, '_') || 'MatchCV'}_CV.pdf`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 lg:py-16">
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Editor Side */}
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-black text-white">Build your CV</h2>
            <p className="text-slate-400">Fill in the sections below to see your professional A4 resume take shape.</p>
          </div>

          {/* Stepper Control */}
          <div className="bg-slate-900 border border-slate-800 p-2 rounded-3xl shadow-lg flex items-center gap-2 overflow-x-auto no-scrollbar">
            {steps.map((step, idx) => (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`flex-1 min-w-[70px] flex flex-col items-center gap-1.5 py-4 rounded-2xl transition-all duration-300 ${
                  activeStep === idx 
                  ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/30' 
                  : 'text-slate-500 hover:bg-slate-800'
                }`}
              >
                <span className="text-xl">{step.icon}</span>
                <span className="text-[10px] font-black uppercase tracking-widest">{step.label}</span>
              </button>
            ))}
          </div>

          <div className="bg-slate-900 rounded-[2rem] p-8 border border-slate-800 shadow-xl min-h-[500px]">
            {activeStep === 0 && (
              <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-center gap-8 mb-4">
                  <div className="relative group">
                    <div className="w-28 h-28 bg-slate-800 rounded-[2rem] flex items-center justify-center overflow-hidden border-2 border-dashed border-slate-700 cursor-pointer">
                      {cv.personalInfo.photo ? (
                        <img src={cv.personalInfo.photo} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-4xl">📸</span>
                      )}
                      <input 
                        type="file" 
                        onChange={handlePhotoUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        accept="image/*"
                      />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Profile Photo</h4>
                    <p className="text-sm text-slate-400">Click to upload a headshot.</p>
                  </div>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <input type="text" name="fullName" value={cv.personalInfo.fullName} onChange={handlePersonalInfoChange} className="w-full p-4 bg-slate-800 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-white" placeholder="Full Name" />
                  <input type="text" name="jobTitle" value={cv.personalInfo.jobTitle} onChange={handlePersonalInfoChange} className="w-full p-4 bg-slate-800 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-white" placeholder="Job Title" />
                </div>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <input type="email" name="email" value={cv.personalInfo.email} onChange={handlePersonalInfoChange} className="w-full p-4 bg-slate-800 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-white" placeholder="Email Address" />
                  <input type="text" name="phone" value={cv.personalInfo.phone} onChange={handlePersonalInfoChange} className="w-full p-4 bg-slate-800 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-white" placeholder="Phone Number" />
                </div>

                <textarea name="summary" value={cv.personalInfo.summary} onChange={handlePersonalInfoChange} rows={5} className="w-full p-4 bg-slate-800 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-white resize-none" placeholder="Professional Summary..."></textarea>
                
                <button onClick={() => setActiveStep(1)} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg hover:bg-indigo-700 transition-all">Continue</button>
              </div>
            )}

            {activeStep === 1 && (
              <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-white">Work Experience</h3>
                  <button onClick={addExperience} className="text-indigo-400 font-bold px-4 py-2 hover:bg-slate-800 rounded-xl transition-all">Add Position</button>
                </div>
                <div className="space-y-4">
                  {cv.experience.map((exp, idx) => (
                    <div key={idx} className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700 relative group transition-all hover:border-indigo-500/50">
                      <button onClick={() => setCv(prev => ({ ...prev, experience: prev.experience.filter((_, i) => i !== idx) }))} className="absolute top-4 right-4 text-rose-500 hover:scale-110 transition-transform">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                      <div className="grid sm:grid-cols-2 gap-4 mb-4 mt-2">
                        <input type="text" placeholder="Company Name" value={exp.company} onChange={(e) => updateExperience(idx, 'company', e.target.value)} className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none" />
                        <input type="text" placeholder="Job Title" value={exp.position} onChange={(e) => updateExperience(idx, 'position', e.target.value)} className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="Start Date" value={exp.startDate} onChange={(e) => updateExperience(idx, 'startDate', e.target.value)} className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none" />
                        <input type="text" placeholder="End Date" value={exp.endDate} onChange={(e) => updateExperience(idx, 'endDate', e.target.value)} className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none" />
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => setActiveStep(2)} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold mt-8 shadow-lg hover:bg-indigo-700 transition-all">Continue</button>
              </div>
            )}

            {activeStep === 2 && (
              <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-white">Education History</h3>
                  <button onClick={addEducation} className="text-indigo-400 font-bold px-4 py-2 hover:bg-slate-800 rounded-xl transition-all">Add Education</button>
                </div>
                <div className="space-y-4">
                  {cv.education.map((edu, idx) => (
                    <div key={idx} className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700 relative group transition-all">
                      <button onClick={() => setCv(prev => ({ ...prev, education: prev.education.filter((_, i) => i !== idx) }))} className="absolute top-4 right-4 text-rose-500 hover:scale-110 transition-transform">
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                      <input type="text" placeholder="Institution" value={edu.institution} onChange={(e) => updateEducation(idx, 'institution', e.target.value)} className="w-full p-3 mb-4 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none" />
                      <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="Degree" value={edu.degree} onChange={(e) => updateEducation(idx, 'degree', e.target.value)} className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none" />
                        <input type="text" placeholder="Year" value={edu.graduationDate} onChange={(e) => updateEducation(idx, 'graduationDate', e.target.value)} className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none" />
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => setActiveStep(3)} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold mt-8 shadow-lg hover:bg-indigo-700 transition-all">Continue</button>
              </div>
            )}

            {activeStep === 3 && (
              <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
                <h3 className="text-xl font-bold text-white mb-4">Skills</h3>
                <div className="relative group">
                  <input 
                    type="text" 
                    id="skillInput"
                    placeholder="Type a skill and hit Enter" 
                    className="w-full p-5 pl-14 bg-slate-800 border border-slate-700 rounded-[1.5rem] outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        addSkill(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-indigo-500">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 pt-6">
                  {cv.skills.map((skill, idx) => (
                    <span key={idx} className="px-5 py-2.5 bg-indigo-600 text-white rounded-2xl font-bold text-sm flex items-center gap-2 shadow-md">
                      {skill}
                      <button onClick={() => setCv(prev => ({ ...prev, skills: prev.skills.filter((_, i) => i !== idx) }))} className="hover:text-indigo-200 font-black ml-1">×</button>
                    </span>
                  ))}
                </div>
                <button onClick={() => setActiveStep(4)} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold mt-8 shadow-lg hover:bg-indigo-700 transition-all">Final Result</button>
              </div>
            )}

            {activeStep === 4 && (
              <div className="flex flex-col items-center justify-center py-20 text-center animate-in zoom-in-95 duration-500">
                <div className="w-24 h-24 bg-emerald-500/10 text-emerald-500 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-2xl">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-4xl font-black text-white mb-4">Complete!</h3>
                <p className="text-slate-400 mb-12 max-w-sm">Your professional CV is ready for download.</p>
                <button 
                  onClick={downloadPDF}
                  className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-xl shadow-2xl shadow-indigo-600/50 hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4"
                >
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0L8 8m4-4v12" /></svg>
                  Generate PDF
                </button>
              </div>
            )}
          </div>
        </div>

        {/* UPDATED Preview Side - Improved visibility and scaling */}
        <div className="hidden lg:block sticky top-24 overflow-hidden rounded-[2rem] border border-slate-800 shadow-2xl bg-slate-900 h-[calc(100vh-140px)]">
          <div className="w-full h-full flex flex-col items-center justify-start py-10 overflow-y-auto overflow-x-hidden no-scrollbar">
            {/* The A4 Sheet Wrapper */}
            <div className="relative w-full flex justify-center py-4">
              <div 
                ref={cvPreviewRef} 
                className="bg-white text-slate-900 font-sans leading-relaxed shadow-2xl origin-top"
                style={{ 
                  width: '210mm', 
                  minHeight: '297mm', 
                  padding: '18mm',
                  // Scaled to 0.55 for better readability while fitting most screens
                  transform: 'scale(0.55)', 
                  marginBottom: 'calc(-297mm * 0.45)', // Adjust margin to pull content up after scaling
                  flexShrink: 0,
                }}
              >
                {/* CV Header */}
                <div className="flex justify-between items-start border-b-8 border-slate-900 pb-10 mb-10">
                  <div className="flex-grow pr-8">
                    <h1 className="text-6xl font-black uppercase tracking-tighter mb-4 leading-none text-slate-900">
                      {cv.personalInfo.fullName ? (
                        <>
                          {cv.personalInfo.fullName.split(' ')[0]} <br/>
                          <span className="text-indigo-600">{cv.personalInfo.fullName.split(' ').slice(1).join(' ')}</span>
                        </>
                      ) : (
                        'MatchCV'
                      )}
                    </h1>
                    <h2 className="text-xl font-bold text-slate-400 uppercase tracking-[0.3em] mb-6">
                      {cv.personalInfo.jobTitle || 'Professional Role'}
                    </h2>
                    <div className="space-y-2 text-xs font-black text-slate-500 uppercase tracking-widest">
                      <div className="flex items-center gap-3">
                         <span className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center text-[10px]">✉️</span> {cv.personalInfo.email || 'hello@matchcv.com'}
                      </div>
                      <div className="flex items-center gap-3">
                         <span className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center text-[10px]">📞</span> {cv.personalInfo.phone || '+000 000 000'}
                      </div>
                    </div>
                  </div>
                  {cv.personalInfo.photo && (
                    <div className="w-40 h-40 bg-slate-100 border-[6px] border-white shadow-xl overflow-hidden -rotate-2">
                      <img src={cv.personalInfo.photo} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                {/* Main CV Content */}
                <div className="grid grid-cols-12 gap-12">
                  <div className="col-span-8 space-y-10">
                    <section>
                      <h3 className="text-lg font-black uppercase tracking-widest border-b-4 border-slate-100 pb-3 mb-4">Profile</h3>
                      <p className="text-slate-600 text-[13px] leading-relaxed text-justify whitespace-pre-line">
                        {cv.personalInfo.summary || 'Summary text will appear here once filled in the editor.'}
                      </p>
                    </section>

                    <section>
                      <h3 className="text-lg font-black uppercase tracking-widest border-b-4 border-slate-100 pb-3 mb-6">Experience</h3>
                      <div className="space-y-8">
                        {cv.experience.length > 0 ? cv.experience.map((exp, i) => (
                          <div key={i} className="relative pl-8 border-l-4 border-indigo-100">
                            <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-indigo-600 border-[3px] border-white"></div>
                            <div className="flex justify-between items-baseline mb-1">
                              <h4 className="font-black text-slate-900 text-base uppercase tracking-tight">{exp.position || 'Position'}</h4>
                              <span className="text-[9px] font-black text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded tracking-widest">{exp.startDate} – {exp.endDate}</span>
                            </div>
                            <div className="text-[13px] font-bold text-indigo-600">{exp.company || 'Company'}</div>
                          </div>
                        )) : (
                          <p className="text-slate-400 italic text-xs">Experience list is empty.</p>
                        )}
                      </div>
                    </section>
                  </div>

                  <div className="col-span-4 space-y-10">
                    <section>
                      <h3 className="text-lg font-black uppercase tracking-widest border-b-4 border-slate-100 pb-3 mb-6">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {cv.skills.length > 0 ? cv.skills.map((skill, i) => (
                          <span key={i} className="px-3 py-1 bg-slate-900 text-white text-[8px] font-black uppercase tracking-widest">
                            {skill}
                          </span>
                        )) : (
                          <span className="text-slate-400 text-[10px] italic">Skills...</span>
                        )}
                      </div>
                    </section>

                    <section>
                      <h3 className="text-lg font-black uppercase tracking-widest border-b-4 border-slate-100 pb-3 mb-6">Education</h3>
                      <div className="space-y-6">
                        {cv.education.length > 0 ? cv.education.map((edu, i) => (
                          <div key={i}>
                            <h4 className="font-black text-slate-900 text-[13px] leading-tight uppercase">{edu.degree || 'Degree'}</h4>
                            <div className="text-[11px] font-bold text-slate-500 mt-1">{edu.institution || 'Institution'}</div>
                            <div className="text-[9px] text-indigo-500 font-black mt-1 uppercase tracking-widest">{edu.graduationDate}</div>
                          </div>
                        )) : (
                          <p className="text-slate-400 italic text-[10px]">Education list is empty.</p>
                        )}
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCV;
