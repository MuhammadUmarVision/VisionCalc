import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Upload, 
  Sparkles, 
  BookOpen, 
  Bot, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Search, 
  Trash2,
  FileCheck
} from 'lucide-react';
import { SAMPLE_STUDY_MATERIALS } from '../../data/sampleStudyMaterials';
import { StudyDocument } from '../../types';

interface StudyMaterialViewProps {
  onNavigateToTutorWithDoc: (docName: string, prompt: string) => void;
}

export const StudyMaterialView: React.FC<StudyMaterialViewProps> = ({
  onNavigateToTutorWithDoc,
}) => {
  const [documents, setDocuments] = useState<StudyDocument[]>(SAMPLE_STUDY_MATERIALS);
  const [selectedDocId, setSelectedDocId] = useState<string>(SAMPLE_STUDY_MATERIALS[0].id);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedDoc = documents.find((d) => d.id === selectedDocId) || documents[0];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setTimeout(() => {
      const newDoc: StudyDocument = {
        id: `doc-${Date.now()}`,
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        pageCount: Math.floor(Math.random() * 40) + 15,
        uploadDate: 'Just now',
        extractedTopics: [
          'Section 1: Core Definitions & Formulas',
          'Section 2: Worked Problem Examples',
          'Section 3: Exercise Questions & Theorems',
          'Section 4: Computational Rules & Summary'
        ],
        summary: `Extracted mathematics textbook content from ${file.name}. Indexed symbols, equations, and chapter structure for AI Tutor grounding.`
      };

      setDocuments((prev) => [newDoc, ...prev]);
      setSelectedDocId(newDoc.id);
      setIsUploading(false);
      setUploadSuccessMessage(`Successfully processed & indexed "${file.name}"`);
      setTimeout(() => setUploadSuccessMessage(null), 3000);
    }, 1200);
  };

  return (
    <div className="flex-1 h-full overflow-y-auto p-4 lg:p-6 flex flex-col max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <FileText className="w-5 h-5" />
            </span>
            <span>Study Material & PDF Hub</span>
          </h2>
          <p className="text-xs text-slate-500">
            Upload your math textbooks, lecture notes, or syllabi. The AI Tutor grounds explanations in your specific curriculum.
          </p>
        </div>

        {/* Upload Trigger */}
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".pdf,.docx,.tex"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition-all hover:scale-105 disabled:opacity-50"
          >
            <Upload className="w-4 h-4" />
            <span>{isUploading ? 'Indexing PDF...' : 'Upload Math PDF'}</span>
          </button>
        </div>
      </div>

      {/* Upload Success Alert */}
      {uploadSuccessMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-medium text-emerald-800 dark:text-emerald-200 flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>{uploadSuccessMessage}</span>
        </div>
      )}

      {/* Main Grid: Document Library List on Left, Document Index on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Documents Directory (Cols 1-4) */}
        <div className="lg:col-span-4 space-y-3">
          
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block px-1">
            Indexed Study Materials ({documents.length})
          </span>

          <div className="space-y-2">
            {documents.map((doc) => {
              const isSelected = doc.id === selectedDocId;
              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDocId(doc.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800 shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 mt-0.5">
                      <FileCheck className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                        {doc.name}
                      </h3>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                        <span>{doc.size}</span>
                        <span>•</span>
                        <span>{doc.pageCount} Pages</span>
                        <span>•</span>
                        <span>{doc.uploadDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Workflow Diagram Card */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
            <span className="font-bold text-slate-800 dark:text-slate-200 block">
              How VisionCalc PDF Grounding Works:
            </span>
            <div className="space-y-1.5 text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
              <p>1. <strong>Upload PDF</strong>: Math book, assignment sheet, or lecture slides.</p>
              <p>2. <strong>Semantic Indexing</strong>: Equations, formulas, and proofs are parsed.</p>
              <p>3. <strong>Contextual AI Tutor</strong>: Ask: <em>"Explain the limits chapter in simple words"</em>.</p>
            </div>
          </div>

        </div>

        {/* Right Column: Active Document Content & Quick Question Generator (Cols 5-12) */}
        <div className="lg:col-span-8 space-y-4">
          
          {selectedDoc && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-md space-y-5">
              
              {/* Document Title Bar */}
              <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                    Active Study Resource
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                    {selectedDoc.name}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {selectedDoc.summary}
                  </p>
                </div>
              </div>

              {/* Extracted Chapters / Topics */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-blue-500" />
                  <span>Extracted Chapters & Key Topics</span>
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedDoc.extractedTopics.map((topic, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs group"
                    >
                      <span className="text-slate-700 dark:text-slate-300 font-medium truncate pr-2">
                        {topic}
                      </span>
                      <button
                        onClick={() =>
                          onNavigateToTutorWithDoc(
                            selectedDoc.name,
                            `Explain ${topic} from ${selectedDoc.name} in simple words with step-by-step examples.`
                          )
                        }
                        className="p-1 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 hover:scale-105 transition-transform flex-shrink-0"
                        title="Ask Tutor about this section"
                      >
                        <Bot className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick AI Tutor Prompt Generators */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-900 to-blue-950 text-white space-y-3 shadow-md">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                  <span className="text-xs font-bold">Ask AI Tutor from this Book</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={() =>
                      onNavigateToTutorWithDoc(
                        selectedDoc.name,
                        `Explain the limits and derivatives chapter in ${selectedDoc.name} in simple words.`
                      )
                    }
                    className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-left text-xs text-indigo-100 transition-colors flex items-center justify-between"
                  >
                    <span>"Explain limits chapter in simple words"</span>
                    <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" />
                  </button>

                  <button
                    onClick={() =>
                      onNavigateToTutorWithDoc(
                        selectedDoc.name,
                        `Extract all key formulas and theorem statements from ${selectedDoc.name}.`
                      )
                    }
                    className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-left text-xs text-indigo-100 transition-colors flex items-center justify-between"
                  >
                    <span>"Summarize all formulas in this book"</span>
                    <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" />
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
