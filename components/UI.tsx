
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
        className="text-slate-400 hover:text-indigo-500 transition-colors p-1"
        aria-label="More info"
      >
        <Info size={18} />
      </button>
      {isOpen && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-72 p-5 bg-slate-900 dark:bg-slate-800 text-white text-sm rounded-[1.25rem] shadow-2xl z-50 animate-fade-in pointer-events-none border border-slate-700 dark:border-slate-600 leading-relaxed">
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-[10px] border-transparent border-t-slate-900 dark:border-t-slate-800" />
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
  <div className="space-y-10 animate-fade-in pb-12">
    <div className="space-y-4 border-b border-slate-100 dark:border-slate-800 pb-8">
      <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight">{title}</h2>
      {description && <p className="text-xl text-slate-500 dark:text-slate-400 font-medium max-w-3xl leading-relaxed">{description}</p>}
    </div>
    <div className="space-y-12">{children}</div>
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
  <div className={`p-10 rounded-[2rem] border-2 transition-all duration-300 ${error ? 'border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-800 shadow-lg shadow-red-500/5' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:border-indigo-100 dark:hover:border-indigo-900/50 hover:shadow-xl hover:shadow-indigo-500/5'}`}>
    <div className="flex items-center gap-2 mb-8 flex-wrap">
      <label className="text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center tracking-tight">
        {label}
        {required && <span className="text-indigo-500 ml-1 font-black">*</span>}
      </label>
      {tooltip && <InfoTooltip text={tooltip} />}
      {error && <span className="text-sm font-bold text-red-500 dark:text-red-400 flex items-center gap-1.5 ml-auto bg-red-100 dark:bg-red-900/30 px-3 py-1 rounded-full"><AlertCircle size={16}/> {error}</span>}
    </div>
    <div className="w-full">{children}</div>
    {helpText && <p className="text-slate-500 dark:text-slate-400 text-sm mt-6 italic flex items-center gap-2 font-medium bg-slate-50 dark:bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-700 w-fit">💡 {helpText}</p>}
  </div>
);

// --- Inputs ---

export const TextInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input
    {...props}
    className="w-full px-6 py-5 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-8 focus:ring-indigo-500/5 outline-none transition-all text-xl placeholder:text-slate-400 dark:placeholder:text-slate-700 shadow-inner font-medium"
  />
);

export const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
  <textarea
    {...props}
    className="w-full px-6 py-5 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-8 focus:ring-indigo-500/5 outline-none transition-all text-xl min-h-[140px] placeholder:text-slate-400 dark:placeholder:text-slate-700 shadow-inner font-medium leading-relaxed"
  />
);

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { options: string[] }> = ({ options, ...props }) => (
  <div className="relative">
    <select
      {...props}
      className="w-full px-6 py-5 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-8 focus:ring-indigo-500/5 outline-none transition-all text-xl appearance-none cursor-pointer shadow-inner font-medium"
    >
      <option value="" disabled className="text-slate-400">Select an option...</option>
      {options.map((opt) => (
        <option key={opt} value={opt} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">{opt}</option>
      ))}
    </select>
    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
      <ChevronRight className="rotate-90" size={26} />
    </div>
  </div>
);

// --- Selection Cards (Radio/Checkbox) ---

export const SelectionGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      cursor-pointer group relative flex flex-col gap-5 p-7 rounded-3xl border-2 transition-all duration-500 h-full
      ${selected 
        ? 'border-indigo-500 dark:border-indigo-400 bg-indigo-50/30 dark:bg-indigo-900/20 shadow-xl shadow-indigo-500/10 scale-[1.03] ring-2 ring-indigo-500/20' 
        : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-200 dark:hover:border-indigo-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:shadow-xl hover:shadow-indigo-500/5'}
    `}
  >
    <div className="flex items-center justify-between w-full">
        <div className={`
          w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500
          ${selected ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-600 dark:bg-indigo-500 text-white shadow-lg' : 'border-slate-300 dark:border-slate-700 group-hover:border-indigo-400'}
          ${type === 'checkbox' ? 'rounded-xl' : 'rounded-full'}
        `}>
          {selected && <Check size={18} strokeWidth={4} />}
        </div>
        
        {previewColor && (
          <div 
            className="w-10 h-10 rounded-2xl border-4 border-white dark:border-slate-700 shadow-xl flex-shrink-0 transition-transform group-hover:scale-110" 
            style={{ background: previewColor }} 
          />
        )}
        
        {icon && <div className={`transition-all duration-500 group-hover:scale-110 ${selected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-600 group-hover:text-indigo-400'}`}>{icon}</div>}
    </div>

    <div className="space-y-3">
      <span className={`font-black text-xl block leading-tight tracking-tight ${selected ? 'text-indigo-900 dark:text-indigo-100' : 'text-slate-800 dark:text-slate-200'}`}>{label}</span>
      {description && (
        <p className={`text-[0.925rem] leading-relaxed transition-colors duration-500 ${selected ? 'text-indigo-700/90 dark:text-indigo-300/90' : 'text-slate-500 dark:text-slate-400'}`}>
            {description}
        </p>
      )}
    </div>
  </div>
);

// --- Intensity Slider ---

export const IntensitySlider: React.FC<{ value: number; onChange: (val: number) => void }> = ({ value, onChange }) => (
  <div className="w-full px-6 py-8">
    <div className="relative h-6 bg-slate-200 dark:bg-slate-800 rounded-full mb-10 shadow-inner group overflow-hidden border-4 border-slate-100 dark:border-slate-800">
        <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500" 
            style={{ width: `${((value - 1) / 4) * 100}%` }}
        >
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
        </div>
        <input
          type="range"
          min="1"
          max="5"
          step="1"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
    </div>
    <div className="flex justify-between text-base font-black text-slate-500 dark:text-slate-400 mt-2 uppercase tracking-widest px-2">
      <span className="flex flex-col items-center gap-2">
        <span className="text-3xl filter grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all">🧘</span>
        <span>Chill</span>
      </span>
      <div className="relative">
          <span className="text-indigo-600 dark:text-indigo-400 text-5xl font-black bg-indigo-50 dark:bg-indigo-900/40 w-24 h-24 flex items-center justify-center rounded-[2rem] shadow-2xl border-4 border-white dark:border-slate-800 transition-transform duration-500 hover:scale-110">
              {value}
          </span>
      </div>
      <span className="flex flex-col items-center gap-2">
        <span className="text-3xl filter grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all">🔥</span>
        <span>Intense</span>
      </span>
    </div>
  </div>
);
