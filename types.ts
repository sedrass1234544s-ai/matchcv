
export interface CVData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    jobTitle: string;
    summary: string;
    photo?: string;
  };
  experience: Experience[];
  education: Education[];
  skills: string[];
  languages: string[];
}

export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  institution: string;
  degree: string;
  graduationDate: string;
}

export interface AnalysisResult {
  score: number;
  strengths: string[];
  weaknesses: string[];
  photoFeedback: string;
  contentImprovements: string;
  suggestedActionItems: string[];
}

export enum Page {
  LANDING = 'landing',
  CREATE = 'create',
  ANALYZE = 'analyze'
}
