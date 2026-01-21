
import React, { useState, useMemo, useEffect } from 'react';
import { 
  StepStart, 
  StepAboutYou,
  StepCoreIdentity,
  StepVisuals,
  StepActionDetails,
  StepPuzzleDetails,
  StepRPGDetails,
  StepStrategyDetails,
  StepPartyDetails,
  StepCreativeDetails,
  StepAppDetails,
  StepMultiplayer,
  StepProgression,
  StepContentLimits,
  StepFinish
} from './components/WizardSteps';
import { 
  ProjectType, 
  SpeedMode, 
  StepId, 
  FormData, 
  INITIAL_DATA,
  RenderStyle
} from './types';
import { ArrowRight, ArrowLeft, Clipboard, CheckCircle, Sparkles, RefreshCcw, Download, FileText, ExternalLink, Moon, Sun } from 'lucide-react';

const App: React.FC = () => {
  const [data, setData] = useState<FormData>(INITIAL_DATA);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  
  // Dark Mode State
  const [darkMode, setDarkMode] = useState(() => {
     if (typeof window !== 'undefined') {
        return localStorage.getItem('theme') === 'dark' || 
               (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
     }
     return false;
  });

  // Dark Mode Effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // PWA Install Prompt State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          setDeferredPrompt(null);
        }
      });
    }
  };

  const handleDownload = () => {
    if (!generatedPrompt) return;
    const blob = new Blob([generatedPrompt], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    // Sanitize filename
    const safeTitle = (data.title || 'game_blueprint').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    link.download = `${safeTitle}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // --- Dynamic Flow Logic ---
  const steps = useMemo(() => {
    const flow: StepId[] = [
      StepId.Start, 
      StepId.AboutYou, 
      StepId.CoreIdentity,
      StepId.Visuals 
    ];

    const types = data.projectType;
    const hasType = (t: ProjectType) => types.includes(t);
    const hasAnyType = (list: ProjectType[]) => list.some(t => hasType(t));

    // Hybrid Genre Logic: Add all relevant steps based on selection
    if (hasAnyType([ProjectType.Action, ProjectType.Music, ProjectType.Survival, ProjectType.Fighting])) {
        flow.push(StepId.ActionDetails);
    }
    if (hasAnyType([ProjectType.Puzzle, ProjectType.Educational, ProjectType.Tabletop])) {
        flow.push(StepId.PuzzleDetails);
    }
    if (hasAnyType([ProjectType.RPG, ProjectType.VisualNovel])) {
        flow.push(StepId.RPGDetails);
    }
    if (hasAnyType([ProjectType.Strategy, ProjectType.Simulation, ProjectType.Sandbox, ProjectType.Idle])) {
        flow.push(StepId.StrategyDetails);
    }
    
    if (hasType(ProjectType.Party)) flow.push(StepId.PartyDetails);
    if (hasType(ProjectType.Creative)) flow.push(StepId.CreativeDetails);
    
    // Group all specialized apps into the AppDetails step
    if (hasAnyType([ProjectType.App, ProjectType.Calendar, ProjectType.Email, ProjectType.FileManager, ProjectType.NoteTaking])) {
        flow.push(StepId.AppDetails);
    }
    
    // Module Checks
    const isFull = data.speedMode === SpeedMode.Full;
    const isCustom = data.speedMode === SpeedMode.Custom;
    
    // Helper to check if a custom section is selected
    const hasSection = (id: string) => isFull || (isCustom && data.customSections.includes(id));

    if (hasSection('multiplayer')) flow.push(StepId.Multiplayer);
    if (hasSection('progression')) flow.push(StepId.Progression);
    if (hasSection('safety')) flow.push(StepId.ContentLimits);

    flow.push(StepId.Finish);
    return flow;
  }, [data.projectType, data.speedMode, data.customSections]);

  const currentStepId = steps[currentStepIndex];
  const progressPercent = Math.round(((currentStepIndex + 1) / steps.length) * 100);

  // --- Actions ---
  const updateData = (fields: Partial<FormData>) => {
    setData((prev) => ({ ...prev, ...fields }));
    const newErrors = { ...errors };
    Object.keys(fields).forEach((k) => delete newErrors[k]);
    setErrors(newErrors);
  };

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;
    const requireField = (key: keyof FormData, msg: string) => {
      if (!data[key] || (Array.isArray(data[key]) && (data[key] as any[]).length === 0)) {
        newErrors[key] = msg;
        isValid = false;
      }
    };

    switch (currentStepId) {
      case StepId.Start:
        requireField('projectType', 'Select at least one type');
        requireField('speedMode', 'Required');
        if (data.speedMode === SpeedMode.Custom && data.customSections.length === 0) {
            newErrors['speedMode'] = 'Please select at least one module for Custom mode.';
            isValid = false;
        }
        break;
      case StepId.AboutYou:
        requireField('authorName', 'Required');
        requireField('authorInterests', 'Pick at least one!');
        requireField('playerType', 'Required');
        break;
      case StepId.CoreIdentity:
        requireField('title', 'Required');
        requireField('pitch', 'Required');
        requireField('vibes', 'Required');
        break;
      case StepId.Visuals:
        requireField('renderStyle', 'Required');
        requireField('assetStyle', 'Required');
        requireField('colorTheme', 'Required');
        break;
      
      // Genre Validations
      case StepId.ActionDetails:
        requireField('actionGenre', 'Required');
        requireField('actionView', 'Required');
        requireField('actionMechanics', 'Pick at least one mechanic');
        break;
      case StepId.PuzzleDetails:
        requireField('puzzleType', 'Required');
        requireField('puzzleMechanic', 'Required');
        break;
      case StepId.RPGDetails:
        requireField('rpgSetting', 'Required');
        requireField('rpgCombat', 'Required');
        break;
      case StepId.StrategyDetails:
        requireField('simType', 'Required');
        requireField('simGoal', 'Required');
        break;
      case StepId.CreativeDetails:
        requireField('creativeToolType', 'Required');
        break;
      case StepId.AppDetails:
        requireField('appType', 'Required');
        requireField('appDataModel', 'Required');
        break;
      case StepId.PartyDetails:
        requireField('partyPlayers', 'Required');
        const emptyMinigames = data.partyMinigames.some(m => !m.name); 
        if (emptyMinigames) {
           newErrors['partyMinigames'] = 'Please name your minigames.';
           isValid = false;
        }
        break;

      case StepId.Multiplayer:
        requireField('mpPlayerCount', 'Required');
        requireField('mpControls', 'Required');
        break;
      case StepId.Progression:
        requireField('progressionFeatures', 'Required');
        requireField('saveProgress', 'Required');
        break;
      case StepId.ContentLimits:
        requireField('allowedVibes', 'Required');
        requireField('notAllowed', 'Required');
        break;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStepIndex < steps.length - 1) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setCurrentStepIndex((prev) => prev + 1);
      } else {
        generateFinalPrompt();
      }
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const generateFinalPrompt = () => {
    const isFull = data.speedMode === SpeedMode.Full;
    const isCustom = data.speedMode === SpeedMode.Custom;
    const hasSection = (id: string) => isFull || (isCustom && data.customSections.includes(id));
    
    // Construct Genre Specific Sections
    let allGenreDetails = '';
    const types = data.projectType;
    const hasType = (t: ProjectType) => types.includes(t);
    const hasAnyType = (list: ProjectType[]) => list.some(t => hasType(t));

    if (hasAnyType([ProjectType.Action, ProjectType.Music, ProjectType.Survival, ProjectType.Fighting])) {
        allGenreDetails += `
### ACTION / RHYTHM / COMBAT SPECS
- **Sub-Genre:** ${data.actionGenre}
- **Perspective:** ${data.actionView}
- **Mechanics:** ${data.actionMechanics?.join(', ')}
        `;
    }
    if (hasAnyType([ProjectType.Puzzle, ProjectType.Educational, ProjectType.Tabletop])) {
        allGenreDetails += `
### PUZZLE / LOGIC / TABLETOP SPECS
- **Type:** ${data.puzzleType}
- **Core Mechanic:** ${data.puzzleMechanic}
- **Level Generation:** ${data.puzzleLevelGen}
        `;
    }
    if (hasAnyType([ProjectType.RPG, ProjectType.VisualNovel])) {
        allGenreDetails += `
### RPG / NARRATIVE SPECS
- **Setting:** ${data.rpgSetting}
- **Combat:** ${data.rpgCombat}
- **Progression:** ${data.rpgClassSystem}
        `;
    }
    if (hasAnyType([ProjectType.Strategy, ProjectType.Simulation, ProjectType.Sandbox, ProjectType.Idle])) {
        allGenreDetails += `
### SIMULATION / STRATEGY / SANDBOX SPECS
- **Type:** ${data.simType}
- **Main Resource:** ${data.simGoal}
- **Economy:** ${data.simEconomy}
        `;
    }
    
    // App Specs (including specialized sub-types)
    if (hasAnyType([ProjectType.App, ProjectType.Calendar, ProjectType.Email, ProjectType.FileManager, ProjectType.NoteTaking])) {
        allGenreDetails += `
### APP SPECS
- **Archetype:** ${data.appType}
- **Data Strategy:** ${data.appDataModel}
- **UI Density:** ${data.appUiDensity}
        `;
    }
    
    if (hasType(ProjectType.Party)) {
        allGenreDetails += `
### PARTY SPECS
- **Players:** ${data.partyPlayers}
- **Format:** ${data.partyMatchFormat}
- **Chaos Rule:** ${data.partyChaosRule}
- **Minigame Concepts:** ${data.partyMinigames.map(m => m.name).join(', ')}
        `;
    }
    if (hasType(ProjectType.Creative)) {
        allGenreDetails += `
### CREATIVE TOOL SPECS
- **Tool Type:** ${data.creativeToolType}
- **Output:** ${data.creativeOutput}
        `;
    }

    const themeString = [...(data.themes || []), data.customTheme].filter(Boolean).join(' + ');

    const prompt = `
# PROJECT BLUEPRINT: ${data.projectType.map(t => t.split('/')[0].trim()).join(' + ').toUpperCase()}
**Target Model:** Gemini 3 Pro (Expert Reasoning)
**Title:** ${data.title}
**Pitch:** ${data.pitch}

## CREATOR PROFILE
- **Builder Name:** ${data.authorName}
- **Player Personality:** ${data.playerType}
- **Interests:** ${data.authorInterests.join(', ')}
*System Note: Infuse the game's flavor text, easter eggs, and visual details with these interests.*

## VISUAL IDENTITY
- **Vibe:** ${data.vibes.join(', ')} ${data.vibeOther ? `(${data.vibeOther})` : ''}
- **Theme/Setting:** ${themeString || 'N/A'}
- **Color Palette:** ${data.colorTheme}
- **Intensity:** ${data.intensity}/5

## TECHNICAL ARCHITECTURE
- **Render Engine:** ${data.renderStyle}
- **Asset Strategy:** ${data.assetStyle} (Self-contained, NO external URLs)
- **Audio:** ${data.includeSound ? `Procedural Web Audio (${data.audioStyle})` : 'None'}
- **Deployment:** Single-file HTML/JS/CSS or Standard Vite React.

${allGenreDetails}

## EXTENDED SYSTEMS
${hasSection('multiplayer') ? `- **Multiplayer:** ${data.mpPlayerCount} Players (${data.mpStyle.join(', ')})\n- **Input:** ${data.mpControls}` : ''}
${hasSection('progression') ? `- **Progression:** ${data.progressionFeatures.join(', ')}\n- **Persistence:** ${data.saveProgress}` : ''}
${hasSection('safety') ? `- **Content Boundary:** Allow [${data.allowedVibes.join(', ')}], BAN [${data.notAllowed.join(', ')}]` : ''}
${hasSection('accessibility') ? `- **Accessibility:** ${data.accessibilityFeatures?.join(', ') || 'Standard'}` : ''}

## SPECIAL INSTRUCTIONS
${data.extras || 'Ensure code is clean, commented, and performant.'}
    `.trim();
    
    setGeneratedPrompt(prompt);
  };

  const renderStep = () => {
    const props = { data, update: updateData, errors };
    switch (currentStepId) {
      case StepId.Start: return <StepStart {...props} />;
      case StepId.AboutYou: return <StepAboutYou {...props} />;
      case StepId.CoreIdentity: return <StepCoreIdentity {...props} />;
      case StepId.Visuals: return <StepVisuals {...props} />;
      
      case StepId.ActionDetails: return <StepActionDetails {...props} />;
      case StepId.PuzzleDetails: return <StepPuzzleDetails {...props} />;
      case StepId.RPGDetails: return <StepRPGDetails {...props} />;
      case StepId.StrategyDetails: return <StepStrategyDetails {...props} />;
      case StepId.PartyDetails: return <StepPartyDetails {...props} />;
      case StepId.CreativeDetails: return <StepCreativeDetails {...props} />;
      case StepId.AppDetails: return <StepAppDetails {...props} />;

      case StepId.Multiplayer: return <StepMultiplayer {...props} />;
      case StepId.Progression: return <StepProgression {...props} />;
      case StepId.ContentLimits: return <StepContentLimits {...props} />;
      case StepId.Finish: return <StepFinish {...props} />;
      default: return null;
    }
  };

  if (generatedPrompt) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
        <div className="max-w-4xl w-full bg-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700 animate-fade-in flex flex-col h-[90vh]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
                <div className="bg-emerald-500 p-3 rounded-xl text-slate-900 shadow-lg shadow-emerald-500/20">
                    <CheckCircle size={32} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Blueprint Ready</h1>
                    <p className="text-slate-400">Optimized for Gemini 3 Pro</p>
                </div>
            </div>
            <button 
                onClick={() => {
                   setGeneratedPrompt(null);
                   setCurrentStepIndex(0);
                   setData(INITIAL_DATA);
                }}
                className="text-slate-400 hover:text-white flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors"
            >
                <RefreshCcw size={16}/> New Project
            </button>
          </div>
          
          <div className="flex-1 bg-slate-950 p-6 rounded-xl border border-slate-700 font-mono text-sm leading-relaxed overflow-y-auto whitespace-pre-wrap text-emerald-50 shadow-inner">
            {generatedPrompt}
          </div>

          <div className="mt-6 flex flex-col md:flex-row gap-4">
            <button 
                onClick={() => {
                    navigator.clipboard.writeText(generatedPrompt);
                    alert("Copied to clipboard!");
                }}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/25 active:scale-[0.99]"
            >
                <Clipboard /> Copy Blueprint
            </button>
            
            <button
                onClick={handleDownload}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.99]"
            >
                <FileText /> Download File
            </button>

            <a
                href="https://aistudio.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.99] shadow-blue-500/25"
            >
                <ExternalLink /> Open AI Studio
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col max-w-3xl mx-auto bg-white dark:bg-slate-900 shadow-2xl min-[800px]:my-8 min-[800px]:rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 ring-1 ring-slate-900/5 dark:ring-white/10 transition-colors duration-300">
      
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-8 py-5 transition-colors duration-300">
        <div className="flex justify-between items-center mb-3">
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
                <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg text-indigo-600 dark:text-indigo-400">
                    <Sparkles size={20} />
                </div>
                Game Builder Brief
            </h1>
            <div className="flex items-center gap-3">
               <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  aria-label="Toggle Dark Mode"
               >
                  {darkMode ? <Sun size={18} /> : <Moon size={18} />}
               </button>
               {deferredPrompt && (
                   <button 
                    onClick={handleInstallClick}
                    className="flex items-center gap-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-700 dark:hover:bg-slate-200 transition-colors animate-pulse"
                   >
                     <Download size={16}/> Install App
                   </button>
               )}
               <span className="text-xs font-bold bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 px-3 py-1 rounded-full uppercase tracking-wider">
                   Step {currentStepIndex + 1} of {steps.length}
               </span>
            </div>
        </div>
        <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
                className="h-full bg-indigo-600 dark:bg-indigo-500 transition-all duration-500 ease-out rounded-full"
                style={{ width: `${progressPercent}%` }}
            />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 px-8 py-8 overflow-y-auto bg-white dark:bg-slate-900 transition-colors duration-300">
        {renderStep()}
      </main>

      {/* Footer */}
      <div className="sticky bottom-0 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 p-8 pt-4 flex justify-between items-center gap-4 transition-colors duration-300">
        <button
          onClick={handleBack}
          disabled={currentStepIndex === 0}
          className={`
            px-6 py-4 rounded-xl font-bold transition-colors flex items-center gap-2
            ${currentStepIndex === 0 
                ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed' 
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}
          `}
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <button
          onClick={handleNext}
          className="flex-1 max-w-[240px] bg-slate-900 dark:bg-indigo-600 hover:bg-indigo-600 dark:hover:bg-indigo-500 text-white px-6 py-4 rounded-xl font-bold shadow-xl shadow-slate-200 dark:shadow-none hover:shadow-indigo-200 transition-all transform active:scale-[0.98] flex items-center justify-center gap-3"
        >
          {currentStepIndex === steps.length - 1 ? 'Generate' : 'Continue'}
          {currentStepIndex !== steps.length - 1 && <ArrowRight size={20} />}
        </button>
      </div>
    </div>
  );
};

export default App;
