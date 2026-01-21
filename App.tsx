
import React, { useState, useMemo, useEffect } from 'react';
import { 
  StepStart, 
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
import { ArrowRight, ArrowLeft, Clipboard, CheckCircle, Sparkles, RefreshCcw, Download, FileText, ExternalLink } from 'lucide-react';

const App: React.FC = () => {
  const [data, setData] = useState<FormData>(INITIAL_DATA);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  
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
      StepId.CoreIdentity,
      StepId.Visuals 
    ];

    // Branching based on Type
    switch (data.projectType) {
      case ProjectType.Action: flow.push(StepId.ActionDetails); break;
      case ProjectType.Puzzle: flow.push(StepId.PuzzleDetails); break;
      case ProjectType.RPG: flow.push(StepId.RPGDetails); break;
      case ProjectType.Strategy: flow.push(StepId.StrategyDetails); break;
      case ProjectType.Party: flow.push(StepId.PartyDetails); break;
      case ProjectType.Creative: flow.push(StepId.CreativeDetails); break;
      case ProjectType.App: flow.push(StepId.AppDetails); break;
      default: flow.push(StepId.ActionDetails); // Fallback
    }

    // Extended Features for Full Mode
    if (data.speedMode !== SpeedMode.Quick) {
      flow.push(StepId.Multiplayer);
      flow.push(StepId.Progression);
      flow.push(StepId.ContentLimits);
    }

    flow.push(StepId.Finish);
    return flow;
  }, [data.projectType, data.speedMode]);

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
        requireField('projectType', 'Required');
        requireField('speedMode', 'Required');
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
        const emptyMinigames = data.partyMinigames.some(m => !m.name); // Simpler check
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
    
    // Construct Genre Specific Section
    let genreDetails = '';
    if (data.projectType === ProjectType.Action) {
        genreDetails = `
### ACTION SPECS
- **Genre:** ${data.actionGenre}
- **Perspective:** ${data.actionView}
- **Mechanics:** ${data.actionMechanics?.join(', ')}
        `;
    } else if (data.projectType === ProjectType.Puzzle) {
        genreDetails = `
### PUZZLE SPECS
- **Type:** ${data.puzzleType}
- **Core Mechanic:** ${data.puzzleMechanic}
- **Level Generation:** ${data.puzzleLevelGen}
        `;
    } else if (data.projectType === ProjectType.RPG) {
        genreDetails = `
### RPG SPECS
- **Setting:** ${data.rpgSetting}
- **Combat:** ${data.rpgCombat}
- **Progression:** ${data.rpgClassSystem}
        `;
    } else if (data.projectType === ProjectType.Strategy) {
        genreDetails = `
### SIMULATION SPECS
- **Type:** ${data.simType}
- **Main Resource:** ${data.simGoal}
- **Economy:** ${data.simEconomy}
        `;
    } else if (data.projectType === ProjectType.App) {
        genreDetails = `
### APP SPECS
- **Archetype:** ${data.appType}
- **Data Strategy:** ${data.appDataModel}
- **UI Density:** ${data.appUiDensity}
        `;
    } else if (data.projectType === ProjectType.Party) {
        genreDetails = `
### PARTY SPECS
- **Players:** ${data.partyPlayers}
- **Format:** ${data.partyMatchFormat}
- **Chaos Rule:** ${data.partyChaosRule}
- **Minigame Concepts:** ${data.partyMinigames.map(m => m.name).join(', ')}
        `;
    }

    const prompt = `
# PROJECT BLUEPRINT: ${data.projectType?.toUpperCase()}
**Target Model:** Gemini 3 Pro (Expert Reasoning)
**Title:** ${data.title}
**Pitch:** ${data.pitch}

## VISUAL IDENTITY
- **Vibe:** ${data.vibes.join(', ')} ${data.vibeOther ? `(${data.vibeOther})` : ''}
- **Theme:** ${data.theme || 'N/A'}
- **Color Palette:** ${data.colorTheme}
- **Intensity:** ${data.intensity}/5

## TECHNICAL ARCHITECTURE
- **Render Engine:** ${data.renderStyle}
- **Asset Strategy:** ${data.assetStyle} (Self-contained, NO external URLs)
- **Audio:** ${data.includeSound ? `Procedural Web Audio (${data.audioStyle})` : 'None'}
- **Deployment:** Single-file HTML/JS/CSS or Standard Vite React.

${genreDetails}

${isFull ? `
## EXTENDED SYSTEMS
- **Multiplayer:** ${data.mpPlayerCount} Players (${data.mpStyle.join(', ')})
- **Input:** ${data.mpControls}
- **Progression:** ${data.progressionFeatures.join(', ')}
- **Persistence:** ${data.saveProgress}
- **Content Boundary:** Allow [${data.allowedVibes.join(', ')}], BAN [${data.notAllowed.join(', ')}]
- **Accessibility:** ${data.accessibilityFeatures?.join(', ') || 'Standard'}
` : ''}

## SPECIAL INSTRUCTIONS
${data.extras || 'Ensure code is clean, commented, and performant.'}
    `.trim();
    
    setGeneratedPrompt(prompt);
  };

  const renderStep = () => {
    const props = { data, update: updateData, errors };
    switch (currentStepId) {
      case StepId.Start: return <StepStart {...props} />;
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
    <div className="min-h-screen flex flex-col max-w-3xl mx-auto bg-white shadow-2xl min-[800px]:my-8 min-[800px]:rounded-3xl overflow-hidden border border-slate-100 ring-1 ring-slate-900/5">
      
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 px-8 py-5">
        <div className="flex justify-between items-center mb-3">
            <h1 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                    <Sparkles size={20} />
                </div>
                Game Builder Brief
            </h1>
            <div className="flex items-center gap-4">
               {deferredPrompt && (
                   <button 
                    onClick={handleInstallClick}
                    className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-700 transition-colors animate-pulse"
                   >
                     <Download size={16}/> Install App
                   </button>
               )}
               <span className="text-xs font-bold bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full uppercase tracking-wider">
                   Step {currentStepIndex + 1} of {steps.length}
               </span>
            </div>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div 
                className="h-full bg-indigo-600 transition-all duration-500 ease-out rounded-full"
                style={{ width: `${progressPercent}%` }}
            />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 px-8 py-8 overflow-y-auto">
        {renderStep()}
      </main>

      {/* Footer */}
      <div className="sticky bottom-0 bg-white border-t border-slate-100 p-8 pt-4 flex justify-between items-center gap-4">
        <button
          onClick={handleBack}
          disabled={currentStepIndex === 0}
          className={`
            px-6 py-4 rounded-xl font-bold transition-colors flex items-center gap-2
            ${currentStepIndex === 0 
                ? 'text-slate-300 cursor-not-allowed' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
          `}
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <button
          onClick={handleNext}
          className="flex-1 max-w-[240px] bg-slate-900 hover:bg-indigo-600 text-white px-6 py-4 rounded-xl font-bold shadow-xl shadow-slate-200 hover:shadow-indigo-200 transition-all transform active:scale-[0.98] flex items-center justify-center gap-3"
        >
          {currentStepIndex === steps.length - 1 ? 'Generate' : 'Continue'}
          {currentStepIndex !== steps.length - 1 && <ArrowRight size={20} />}
        </button>
      </div>
    </div>
  );
};

export default App;
