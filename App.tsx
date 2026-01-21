
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
  RenderStyle,
  AssetStyle
} from './types';
import { ArrowRight, ArrowLeft, Clipboard, CheckCircle, Sparkles, RefreshCcw, Download, FileText, ExternalLink, Moon, Sun, Rocket, Copy, Check } from 'lucide-react';

const App: React.FC = () => {
  const [data, setData] = useState<FormData>(INITIAL_DATA);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  
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
    const safeTitle = (data.title || 'game_blueprint').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    link.download = `${safeTitle}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    if (!generatedPrompt) return;
    navigator.clipboard.writeText(generatedPrompt);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
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
    
    if (hasAnyType([ProjectType.App, ProjectType.Calendar, ProjectType.Email, ProjectType.FileManager, ProjectType.NoteTaking])) {
        flow.push(StepId.AppDetails);
    }
    
    const isFull = data.speedMode === SpeedMode.Full;
    const isCustom = data.speedMode === SpeedMode.Custom;
    const hasSection = (id: string) => isFull || (isCustom && data.customSections.includes(id));

    if (hasSection('multiplayer')) flow.push(StepId.Multiplayer);
    if (hasSection('progression')) flow.push(StepId.Progression);
    if (hasSection('safety')) flow.push(StepId.ContentLimits);

    flow.push(StepId.Finish);
    return flow;
  }, [data.projectType, data.speedMode, data.customSections]);

  const currentStepId = steps[currentStepIndex];
  const progressPercent = Math.round(((currentStepIndex + 1) / steps.length) * 100);

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
    
    let allGenreDetails = '';
    const types = data.projectType;
    const hasType = (t: ProjectType) => types.includes(t);
    const hasAnyType = (list: ProjectType[]) => list.some(t => hasType(t));

    const getLibraryRecs = () => {
      let recs: string[] = [];
      if (data.renderStyle === RenderStyle.ThreeJS) recs.push('Three.js', 'React Three Fiber', 'Cannon.js (Physics)');
      else if (data.renderStyle === RenderStyle.Canvas) recs.push('Phaser 3', 'HTML5 Canvas API', 'Howler.js (Audio)');
      else if (data.renderStyle === RenderStyle.DOM) recs.push('React', 'Tailwind CSS', 'Framer Motion');
      else if (data.renderStyle === RenderStyle.SVG) recs.push('Lucide React', 'Rough.js (for sketchy style)');
      
      if (data.assetStyle === AssetStyle.Icons) recs.push('Lucide React');
      if (data.includeSound) recs.push('Web Audio API', 'Tone.js');
      return recs.join(', ');
    };

    const getMermaidDiagram = () => {
      if (hasAnyType([ProjectType.App, ProjectType.Calendar, ProjectType.Email, ProjectType.NoteTaking])) {
        return `graph TD
  User((User)) --> View[React Views]
  View --> Controller[Action Handlers]
  Controller --> Store[State Management / Storage]
  Store --> View
  Store -.-> LocalStorage[(Local Storage)]`;
      }
      return `graph TD
  InputLayer[User Input Handlers] --> GameLoop{Core Game Loop}
  GameLoop --> UpdateSystem[Logic / Physics System]
  UpdateSystem --> State[Global Game State]
  State --> RenderSystem[Rendering Engine / Layer]
  RenderSystem --> View[Canvas/DOM Display]
  GameLoop -.-> RenderSystem`;
    };

    const getPseudocodeSnippet = () => {
      const mainInterest = data.authorInterests[0] || 'Player';
      if (hasAnyType([ProjectType.Action, ProjectType.Survival, ProjectType.Fighting])) {
        return `function gameLoop(timestamp) {
  const dt = timestamp - lastTime;
  handleInputs();
  update${mainInterest}Physics(dt);
  checkCollisions();
  renderFrame();
  requestAnimationFrame(gameLoop);
}`;
      }
      return `const useProjectStore = () => {
  const [data, setData] = useState(initialState);
  const addEntity = (item) => setData(prev => [...prev, item]);
  const syncToStorage = () => localStorage.set('data', JSON.stringify(data));
  return { data, addEntity, syncToStorage };
};`;
    };

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

## DEEP TECHNICAL SPECIFICATION
- **Recommended Libraries:** ${getLibraryRecs()}
- **Architectural Pattern:** ${hasAnyType([ProjectType.App, ProjectType.NoteTaking]) ? 'Model-View-Controller / State-Observer' : 'Entity-Component System / Game Loop'}

### SYSTEM DIAGRAM (Mermaid.js)
\`\`\`mermaid
${getMermaidDiagram()}
\`\`\`

### CORE LOGIC PSEUDOCODE
\`\`\`javascript
${getPseudocodeSnippet()}
\`\`\`

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
    if (generatedPrompt) {
      return (
        <div className="space-y-12 animate-fade-in max-w-5xl mx-auto pb-32">
          {/* Header & Success */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center p-4 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full shadow-lg border-4 border-white dark:border-slate-900 animate-bounce">
                <CheckCircle size={48} />
            </div>
            <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">Blueprint Finalized</h2>
            <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                Your technical brief is optimized for <strong>Gemini 3 Pro</strong>. Copy the code below and paste it into AI Studio to generate your project.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: How to use */}
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-8 rounded-3xl border-2 border-indigo-100 dark:border-indigo-800 shadow-sm">
                    <h3 className="text-xl font-bold text-indigo-900 dark:text-indigo-200 mb-6 flex items-center gap-2">
                        <Rocket size={20} /> Next Steps
                    </h3>
                    <ol className="space-y-6">
                        <li className="flex gap-4">
                            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">1</span>
                            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                                Click the <strong>Copy Prompt</strong> button on the right to grab your brief.
                            </p>
                        </li>
                        <li className="flex gap-4">
                            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">2</span>
                            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                                Open <strong>Google AI Studio</strong> via the link below.
                            </p>
                        </li>
                        <li className="flex gap-4">
                            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">3</span>
                            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                                Paste the prompt into a <strong>New Chat</strong> and let Gemini build your masterpiece!
                            </p>
                        </li>
                    </ol>
                    <a 
                        href="https://aistudio.google.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-8 flex items-center justify-center gap-3 w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        Go to AI Studio <ExternalLink size={20} />
                    </a>
                </div>

                <button 
                    onClick={() => {
                        setGeneratedPrompt(null);
                        setCurrentStepIndex(0);
                        setData(INITIAL_DATA);
                    }}
                    className="flex items-center justify-center gap-2 w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border-2 border-transparent"
                >
                    <RefreshCcw size={20} /> Build Another Brief
                </button>
            </div>

            {/* Right: The Prompt */}
            <div className="lg:col-span-2">
                <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden h-full flex flex-col">
                    <div className="bg-slate-900 dark:bg-slate-800 px-8 py-5 flex justify-between items-center text-white border-b border-slate-800 dark:border-slate-700">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                                <FileText size={18} />
                            </div>
                            <span className="font-bold tracking-tight">Technical Brief Markdown</span>
                        </div>
                        <div className="flex gap-3">
                            <button 
                                onClick={handleDownload}
                                className="p-2.5 hover:bg-slate-700 rounded-xl transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-300 hover:text-white"
                                title="Download Markdown"
                            >
                                <Download size={18} />
                            </button>
                            <button 
                                onClick={handleCopy}
                                className={`
                                    flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all
                                    ${copySuccess 
                                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20'}
                                `}
                            >
                                {copySuccess ? <Check size={18} /> : <Copy size={18} />}
                                {copySuccess ? 'Copied!' : 'Copy Prompt'}
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 p-8 overflow-hidden bg-slate-50 dark:bg-slate-950/50">
                        <div className="h-full rounded-2xl border-2 border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
                            <pre className="flex-1 p-8 whitespace-pre-wrap font-mono text-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 leading-relaxed overflow-y-auto custom-scrollbar">
                                {generatedPrompt}
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      );
    }

    const stepProps = { data, update: updateData, errors };

    switch (currentStepId) {
      case StepId.Start: return <StepStart {...stepProps} />;
      case StepId.AboutYou: return <StepAboutYou {...stepProps} />;
      case StepId.CoreIdentity: return <StepCoreIdentity {...stepProps} />;
      case StepId.Visuals: return <StepVisuals {...stepProps} />;
      case StepId.ActionDetails: return <StepActionDetails {...stepProps} />;
      case StepId.PuzzleDetails: return <StepPuzzleDetails {...stepProps} />;
      case StepId.RPGDetails: return <StepRPGDetails {...stepProps} />;
      case StepId.StrategyDetails: return <StepStrategyDetails {...stepProps} />;
      case StepId.PartyDetails: return <StepPartyDetails {...stepProps} />;
      case StepId.CreativeDetails: return <StepCreativeDetails {...stepProps} />;
      case StepId.AppDetails: return <StepAppDetails {...stepProps} />;
      case StepId.Multiplayer: return <StepMultiplayer {...stepProps} />;
      case StepId.Progression: return <StepProgression {...stepProps} />;
      case StepId.ContentLimits: return <StepContentLimits {...stepProps} />;
      case StepId.Finish: return <StepFinish {...stepProps} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col max-w-7xl mx-auto bg-white dark:bg-slate-900 shadow-2xl min-[800px]:my-8 min-[800px]:rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-800 ring-1 ring-slate-900/5 dark:ring-white/10 transition-colors duration-300">
      
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-10 py-6 transition-colors duration-300">
        <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-3 tracking-tight">
                <div className="bg-indigo-600 dark:bg-indigo-500 p-2.5 rounded-2xl text-white shadow-lg shadow-indigo-500/20">
                    <Sparkles size={24} />
                </div>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-indigo-600 dark:from-white dark:to-indigo-400">
                    Game Builder Brief
                </span>
            </h1>
            <div className="flex items-center gap-4">
               <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                  aria-label="Toggle Dark Mode"
               >
                  {darkMode ? <Sun size={20} /> : <Moon size={20} />}
               </button>
               {deferredPrompt && (
                   <button 
                    onClick={handleInstallClick}
                    className="flex items-center gap-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-6 py-3 rounded-2xl text-sm font-black hover:bg-slate-700 dark:hover:bg-slate-200 transition-all shadow-xl shadow-slate-900/10"
                   >
                     <Download size={18}/> <span className="hidden sm:inline">Install App</span>
                   </button>
               )}
               <span className="text-xs font-black bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 px-4 py-1.5 rounded-full uppercase tracking-[0.1em] border border-indigo-100 dark:border-indigo-800">
                   {generatedPrompt ? 'Blueprint Ready' : `Step ${currentStepIndex + 1} of ${steps.length}`}
               </span>
            </div>
        </div>
        <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
            <div 
                className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-700 ease-out rounded-full shadow-[0_0_15px_rgba(79,70,229,0.5)]"
                style={{ width: `${generatedPrompt ? 100 : progressPercent}%` }}
            />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 px-10 py-12 overflow-y-auto bg-white dark:bg-slate-900 transition-colors duration-300 custom-scrollbar">
        {renderStep()}
      </main>

      {/* Footer */}
      {!generatedPrompt && (
        <div className="sticky bottom-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 px-10 py-6 flex justify-between items-center gap-6 transition-colors duration-300">
          <button
            onClick={handleBack}
            disabled={currentStepIndex === 0}
            className={`
              px-8 py-4 rounded-2xl font-black transition-all flex items-center gap-3 border-2
              ${currentStepIndex === 0 
                  ? 'text-slate-300 dark:text-slate-700 border-slate-50 dark:border-slate-800 cursor-not-allowed' 
                  : 'text-slate-600 dark:text-slate-300 border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}
            `}
          >
            <ArrowLeft size={22} />
            Back
          </button>

          <button
            onClick={handleNext}
            className="flex-1 max-w-[280px] bg-slate-900 dark:bg-indigo-600 hover:bg-indigo-600 dark:hover:bg-indigo-500 text-white px-8 py-4 rounded-[1.25rem] font-black shadow-2xl shadow-indigo-600/10 dark:shadow-indigo-500/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
          >
            {currentStepIndex === steps.length - 1 ? 'Generate Brief' : 'Next Step'}
            <ArrowRight size={22} className={currentStepIndex === steps.length - 1 ? 'hidden' : 'block'} />
            {currentStepIndex === steps.length - 1 && <Sparkles size={22} />}
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
