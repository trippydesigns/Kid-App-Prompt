
import React, { useState } from 'react';
import { ChevronRight, Check, AlertCircle, Info } from 'lucide-react';

// --- Tooltip ---

export const InfoTooltip: React.FC<{ text: string }> = ({ text }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block ml-2 align-middle">
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="text-slate-400 hover:text-indigo-500 transition-colors"
        aria-label="More info"
      >
        <Info size={18} />
      </button>
      {isOpen && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-800 dark:bg-slate-700 text-white text-xs rounded-lg shadow-xl z-50 animate-fade-in pointer-events-none">
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-800 dark:border-t-slate-700" />
        </div>
      )}
    </div>
  );
};

// --- Layout Wrappers ---

export const SectionWrapper: React.FC<{
  title: string;
  description?: string;
  children: React.ReactNode;
}> = ({ title, description, children }) => (
  <div className="space-y-6 animate-fade-in pb-24">
    <div className="space-y-2 border-b border-slate-200 dark:border-slate-700 pb-4">
      <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{title}</h2>
      {description && <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">{description}</p>}
    </div>
    <div className="space-y-8">{children}</div>
  </div>
);

export const QuestionGroup: React.FC<{
  label: string;
  required?: boolean;
  helpText?: string;
  tooltip?: string;
  error?: string;
  children: React.ReactNode;
}> = ({ label, required, helpText, tooltip, error, children }) => (
  <div className={`p-5 rounded-xl border-2 transition-colors duration-200 ${error ? 'border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-800' : 'border-transparent bg-white dark:bg-slate-800 shadow-sm hover:border-slate-200 dark:hover:border-slate-600'}`}>
    <div className="flex items-center gap-2 mb-3 flex-wrap">
      <label className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center">
        {label}
        {required && <span className="text-indigo-500 ml-1">*</span>}
      </label>
      {tooltip && <InfoTooltip text={tooltip} />}
      {error && <span className="text-sm font-bold text-red-500 dark:text-red-400 flex items-center gap-1 ml-auto"><AlertCircle size={14}/> {error}</span>}
    </div>
    {children}
    {helpText && <p className="text-slate-400 dark:text-slate-500 text-sm mt-2 italic flex items-center gap-2">💡 {helpText}</p>}
  </div>
);

// --- Inputs ---

export const TextInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input
    {...props}
    className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-lg placeholder:text-slate-400 dark:placeholder:text-slate-600"
  />
);

export const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
  <textarea
    {...props}
    className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-lg min-h-[100px] placeholder:text-slate-400 dark:placeholder:text-slate-600"
  />
);

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { options: string[] }> = ({ options, ...props }) => (
  <div className="relative">
    <select
      {...props}
      className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-lg appearance-none cursor-pointer"
    >
      <option value="" disabled className="text-slate-400">Select an option...</option>
      {options.map((opt) => (
        <option key={opt} value={opt} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">{opt}</option>
      ))}
    </select>
    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
      <ChevronRight className="rotate-90" size={20} />
    </div>
  </div>
);

// --- Selection Cards (Radio/Checkbox) ---

export const SelectionGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
    {children}
  </div>
);

interface ChoiceCardProps {
  label: string;
  description?: string;
  selected: boolean;
  onClick: () => void;
  type?: 'radio' | 'checkbox';
  previewColor?: string;
  icon?: React.ReactNode;
}

export const ChoiceCard: React.FC<ChoiceCardProps> = ({ label, description, selected, onClick, type = 'radio', previewColor, icon }) => (
  <div
    onClick={onClick}
    className={`
      cursor-pointer group relative flex items-start gap-3 p-4 rounded-xl border-2 transition-all duration-200
      ${selected 
        ? 'border-indigo-500 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 shadow-md scale-[1.01]' 
        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50'}
    `}
  >
    <div className={`
      mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0
      ${selected ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-600 dark:bg-indigo-500 text-white' : 'border-slate-300 dark:border-slate-600 group-hover:border-slate-400'}
      ${type === 'checkbox' ? 'rounded-md' : 'rounded-full'}
    `}>
      {selected && <Check size={14} strokeWidth={4} />}
    </div>
    
    {previewColor && (
      <div 
        className="w-6 h-6 rounded-full border border-slate-200 dark:border-slate-600 shadow-sm flex-shrink-0 mt-1" 
        style={{ background: previewColor }} 
      />
    )}
    
    {icon && <div className={`text-slate-500 dark:text-slate-400 mt-1 ${selected ? 'text-indigo-600 dark:text-indigo-400' : ''}`}>{icon}</div>}

    <div className="flex-1">
      <span className={`font-bold block ${selected ? 'text-indigo-900 dark:text-indigo-200' : 'text-slate-700 dark:text-slate-200'}`}>{label}</span>
      {description && (
        <span className={`text-xs block mt-1 leading-relaxed ${selected ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-500 dark:text-slate-400'}`}>
            {description}
        </span>
      )}
    </div>
  </div>
);

// --- Intensity Slider ---

export const IntensitySlider: React.FC<{ value: number; onChange: (val: number) => void }> = ({ value, onChange }) => (
  <div className="w-full px-2 py-4">
    <input
      type="range"
      min="1"
      max="5"
      step="1"
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value))}
      className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:accent-indigo-500"
    />
    <div className="flex justify-between text-sm font-bold text-slate-500 dark:text-slate-400 mt-2 uppercase tracking-wider">
      <span className="flex flex-col items-center">
        <span>Chill 🧘</span>
        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">Relaxing</span>
      </span>
      <span className="text-indigo-600 dark:text-indigo-300 text-lg bg-indigo-50 dark:bg-indigo-900/50 px-3 py-1 rounded-lg">{value}</span>
      <span className="flex flex-col items-center">
        <span>Intense 🔥</span>
        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">Fast-Paced</span>
      </span>
    </div>
  </div>
);
