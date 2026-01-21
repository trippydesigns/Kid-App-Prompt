
import React from 'react';
import { 
  SectionWrapper, 
  QuestionGroup, 
  SelectionGrid, 
  ChoiceCard, 
  TextInput, 
  TextArea, 
  Select, 
  IntensitySlider 
} from './UI';
import { FormData, ProjectType, SpeedMode, Minigame, RenderStyle, AssetStyle, ColorTheme } from '../types';
import { 
  Box, Smile, Type, Volume2, VolumeX, Monitor, Square, Layers, 
  Gamepad2, Brain, Sword, TrendingUp, Users, Palette, Smartphone, Zap, Eye, Accessibility,
  Music, BookOpen, GraduationCap, Calculator, Settings, ListChecks, Globe,
  Rocket, Search, Trophy, Hammer, Sparkles, Car, Bot, TestTube, PawPrint
} from 'lucide-react';

interface StepProps {
  data: FormData;
  update: (fields: Partial<FormData>) => void;
  errors: Record<string, string>;
}

export const CUSTOM_SECTIONS_OPTS = [
  { id: 'multiplayer', label: 'Multiplayer & Social', desc: 'Player count, networking mode, controls.' },
  { id: 'progression', label: 'Progression & Economy', desc: 'Leveling, saving, unlockables.' },
  { id: 'safety', label: 'Safety & Limits', desc: 'Content boundaries and filters.' },
  { id: 'accessibility', label: 'Accessibility', desc: 'Inclusive design features.' },
];

// --- Section 1: Start ---

export const StepStart: React.FC<StepProps> = ({ data, update, errors }) => {
  const typeOptions = [
    { type: ProjectType.Action, icon: <Gamepad2 size={20}/>, desc: "Platformers, Shooters, Arcade." },
    { type: ProjectType.Strategy, icon: <TrendingUp size={20}/>, desc: "RTS, Tower Defense, Tactics." },
    { type: ProjectType.Simulation, icon: <Calculator size={20}/>, desc: "Tycoons, City Builders, Life Sims." },
    { type: ProjectType.Puzzle, icon: <Brain size={20}/>, desc: "Logic, Match-3, Physics." },
    { type: ProjectType.RPG, icon: <Sword size={20}/>, desc: "Story, Adventure, Turn-based." },
    { type: ProjectType.VisualNovel, icon: <BookOpen size={20}/>, desc: "Interactive Fiction, Story-driven." },
    { type: ProjectType.Music, icon: <Music size={20}/>, desc: "Rhythm games, Audio reactive." },
    { type: ProjectType.Educational, icon: <GraduationCap size={20}/>, desc: "Quizzes, Learning tools, Trivia." },
    { type: ProjectType.Party, icon: <Users size={20}/>, desc: "Couch Co-op, Minigames." },
    { type: ProjectType.Creative, icon: <Palette size={20}/>, desc: "Drawing Tools, Music Makers." },
    { type: ProjectType.App, icon: <Smartphone size={20}/>, desc: "Productivity, Tools, Dashboards." },
  ];

  const toggleType = (type: ProjectType) => {
    const current = data.projectType;
    const next = current.includes(type)
      ? current.filter(t => t !== type)
      : [...current, type];
    update({ projectType: next });
  };

  const toggleSection = (id: string) => {
    const current = data.customSections || [];
    const next = current.includes(id) ? current.filter(x => x !== id) : [...current, id];
    update({ customSections: next });
  };

  return (
    <SectionWrapper title="Start" description="Select your blueprint type to begin.">
      <QuestionGroup label="What are we building?" required helpText="Select multiple to create a Hybrid (e.g. Action + Puzzle)." error={errors.projectType} tooltip="This determines the core architecture (Game Loop vs Event Driven) and logic the AI will use.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {typeOptions.map((opt) => {
            const isSelected = data.projectType.includes(opt.type);
            return (
              <div
                key={opt.type}
                onClick={() => toggleType(opt.type)}
                className={`
                  cursor-pointer group relative p-4 rounded-xl border-2 transition-all duration-200
                  flex items-center gap-4
                  ${isSelected
                    ? 'border-indigo-500 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 shadow-md ring-1 ring-indigo-500/50' 
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-700/50'}
                `}
              >
                <div className={`
                  p-3 rounded-lg flex-shrink-0 transition-colors
                  ${isSelected
                    ? 'bg-indigo-600 dark:bg-indigo-500 text-white' 
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 group-hover:bg-white dark:group-hover:bg-slate-600'}
                `}>
                  {opt.icon}
                  {isSelected && <div className="absolute top-2 right-2 w-3 h-3 bg-indigo-500 rounded-full border-2 border-white dark:border-slate-900 animate-scale-in" />}
                </div>
                <div>
                  <h3 className={`font-bold ${isSelected ? 'text-indigo-900 dark:text-indigo-200' : 'text-slate-800 dark:text-slate-200'}`}>
                    {opt.type}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-tight mt-1">{opt.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </QuestionGroup>

      <QuestionGroup label="Depth Mode" required error={errors.speedMode} tooltip="Quick: Core only. Full: Everything. Custom: Pick your modules.">
        <div className="space-y-4">
          <SelectionGrid>
             <ChoiceCard 
               label="Quick Brief (2 min)" 
               description="Core ideas only. Good for prototypes."
               selected={data.speedMode === SpeedMode.Quick} 
               onClick={() => update({ speedMode: SpeedMode.Quick })}
               icon={<Zap size={18}/>}
             />
             <ChoiceCard 
               label="Full Specification (5 min)" 
               description="Includes all advanced systems."
               selected={data.speedMode === SpeedMode.Full} 
               onClick={() => update({ speedMode: SpeedMode.Full })}
               icon={<Layers size={18}/>}
             />
             <ChoiceCard 
               label="Custom (Build Your Own)" 
               description="Select exactly which modules to include."
               selected={data.speedMode === SpeedMode.Custom} 
               onClick={() => update({ speedMode: SpeedMode.Custom })}
               icon={<Settings size={18}/>}
             />
          </SelectionGrid>
          
          {data.speedMode === SpeedMode.Custom && (
            <div className="bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-xl p-4 animate-fade-in">
              <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <ListChecks size={16} /> Select Modules
              </h4>
              <SelectionGrid>
                {CUSTOM_SECTIONS_OPTS.map(opt => (
                  <ChoiceCard 
                    key={opt.id}
                    label={opt.label}
                    description={opt.desc}
                    type="checkbox"
                    selected={data.customSections?.includes(opt.id)}
                    onClick={() => toggleSection(opt.id)}
                  />
                ))}
              </SelectionGrid>
            </div>
          )}
        </div>
      </QuestionGroup>
    </SectionWrapper>
  );
};

// --- Section 1.5: About You ---

export const StepAboutYou: React.FC<StepProps> = ({ data, update, errors }) => {
  const INTERESTS = [
    { label: 'Space', icon: <Rocket size={20} />, desc: 'Rockets, stars, aliens.' },
    { label: 'Animals', icon: <PawPrint size={20} />, desc: 'Cats, dogs, wild beasts.' },
    { label: 'Robots', icon: <Bot size={20} />, desc: 'Beeps, boops, lasers.' },
    { label: 'Magic', icon: <Sparkles size={20} />, desc: 'Spells, potions, wands.' },
    { label: 'Sports', icon: <Trophy size={20} />, desc: 'Winning, running, team.' },
    { label: 'Speed', icon: <Car size={20} />, desc: 'Racing, fast cars.' },
    { label: 'Science', icon: <TestTube size={20} />, desc: 'Experiments, slime.' },
    { label: 'Art', icon: <Palette size={20} />, desc: 'Colors, drawing.' },
  ];

  const PERSONALITIES = [
    { label: 'The Explorer', icon: <Search size={20} />, desc: 'I like finding hidden secrets.' },
    { label: 'The Champion', icon: <Trophy size={20} />, desc: 'I like winning and high scores.' },
    { label: 'The Builder', icon: <Hammer size={20} />, desc: 'I like creating and fixing things.' },
    { label: 'The Solver', icon: <Brain size={20} />, desc: 'I like tricky puzzles.' },
    { label: 'The Speedster', icon: <Zap size={20} />, desc: 'I gotta go fast!' },
  ];

  const toggleInterest = (interest: string) => {
    const current = data.authorInterests || [];
    const next = current.includes(interest) 
      ? current.filter(i => i !== interest) 
      : [...current, interest];
    update({ authorInterests: next });
  };

  return (
    <SectionWrapper title="About The Creator" description="Tell us about the person making this game!">
       <QuestionGroup label="What is your Builder Name?" required error={errors.authorName} tooltip="This name will be credited in the game's code!">
         <TextInput 
            placeholder="e.g. MasterBuilder99, Captain Code, Sarah" 
            value={data.authorName} 
            onChange={(e) => update({ authorName: e.target.value })} 
         />
       </QuestionGroup>

       <QuestionGroup label="What do you love?" required helpText="Pick as many as you like!" error={errors.authorInterests} tooltip="The AI will add easter eggs related to these things.">
          <SelectionGrid>
             {INTERESTS.map(item => (
                <ChoiceCard
                   key={item.label}
                   label={item.label}
                   description={item.desc}
                   icon={item.icon}
                   type="checkbox"
                   selected={data.authorInterests.includes(item.label)}
                   onClick={() => toggleInterest(item.label)}
                />
             ))}
          </SelectionGrid>
       </QuestionGroup>

       <QuestionGroup label="What kind of player are you?" required error={errors.playerType} tooltip="This helps set the difficulty and goals of the game.">
          <SelectionGrid>
            {PERSONALITIES.map(p => (
              <ChoiceCard 
                key={p.label}
                label={p.label}
                description={p.desc}
                icon={p.icon}
                selected={data.playerType === p.label}
                onClick={() => update({ playerType: p.label })}
              />
            ))}
          </SelectionGrid>
       </QuestionGroup>
    </SectionWrapper>
  );
};

// --- Section 2: Core Identity ---

const VIBE_OPTIONS = [
  { label: 'Tactical', desc: 'Requires thinking ahead.' },
  { label: 'Chaotic', desc: 'Unpredictable fun.' },
  { label: 'Cozy', desc: 'Relaxing, low stakes.' },
  { label: 'Funny', desc: 'Humorous or silly.' },
  { label: 'Competitive', desc: 'Player vs Player focus.' },
  { label: 'Dark', desc: 'Spooky or serious tone.' },
  { label: 'Fast', desc: 'High APM, speed focused.' },
  { label: 'Zen', desc: 'Satisfying, flow state.' },
  { label: 'Educational', desc: 'Learning focused.' },
  { label: 'Emotional', desc: 'Story driven.' },
];

const THEME_OPTIONS = [
  { label: 'Sci-Fi / Space', desc: 'Stars, ships, lasers.' },
  { label: 'Fantasy / Magic', desc: 'Spells, swords, dragons.' },
  { label: 'Modern / Urban', desc: 'Cities, daily life.' },
  { label: 'Cyberpunk', desc: 'Neon, hackers, dystopian.' },
  { label: 'Historical', desc: 'Past eras, castles, wars.' },
  { label: 'Post-Apocalyptic', desc: 'Survival, ruins.' },
  { label: 'Horror / Spooky', desc: 'Ghosts, dark, eerie.' },
  { label: 'Retro / Arcade', desc: '8-bit, glitchy, old-school.' },
  { label: 'Abstract / Minimal', desc: 'Shapes, pure geometry.' },
  { label: 'Nature / Organic', desc: 'Plants, animals, landscapes.' },
];

export const StepCoreIdentity: React.FC<StepProps> = ({ data, update, errors }) => {
  const toggleVibe = (vibe: string) => {
    const newVibes = data.vibes.includes(vibe)
      ? data.vibes.filter((v) => v !== vibe)
      : [...data.vibes, vibe];
    update({ vibes: newVibes });
  };

  const toggleTheme = (theme: string) => {
    const newThemes = data.themes.includes(theme)
      ? data.themes.filter(t => t !== theme)
      : [...data.themes, theme];
    update({ themes: newThemes });
  };

  return (
    <SectionWrapper title="Core Identity" description="Define the soul of the project.">
      <QuestionGroup label="Title" required error={errors.title} tooltip="Used for the HTML <title> tag and the main menu header text.">
        <TextInput 
          placeholder="e.g. Cyber Garden Tycoon" 
          value={data.title} 
          onChange={(e) => update({ title: e.target.value })} 
        />
      </QuestionGroup>

      <QuestionGroup label="High Concept Pitch" required helpText="Describe the project in one compelling sentence." error={errors.pitch} tooltip="This is the 'System Instruction' for the AI. Be specific about the core loop (e.g. 'A game where you plant seeds to fight pollution').">
        <TextInput 
          placeholder="A farming sim where you grow neon plants in a space station..." 
          value={data.pitch} 
          onChange={(e) => update({ pitch: e.target.value })} 
        />
      </QuestionGroup>
      
      <QuestionGroup label="World Theme" helpText="Select broad settings (you can pick multiple)." tooltip="Helps the AI choose asset styles and flavor text.">
        <SelectionGrid>
          {THEME_OPTIONS.map((t) => (
             <ChoiceCard
                key={t.label}
                label={t.label}
                description={t.desc}
                type="checkbox"
                selected={data.themes.includes(t.label)}
                onClick={() => toggleTheme(t.label)}
                icon={<Globe size={16} />}
             />
          ))}
        </SelectionGrid>
        <div className="mt-4">
             <label className="text-sm font-bold text-slate-600 dark:text-slate-400 mb-2 block">Specific Setting Details</label>
            <TextInput 
                placeholder="e.g. Victorian London, Inside a computer, Underwater base..." 
                value={data.customTheme}
                onChange={(e) => update({ customTheme: e.target.value })}
            />
        </div>
      </QuestionGroup>

      <QuestionGroup label="Vibe Tags (Select 2-4)" required error={errors.vibes} tooltip="These tags help the AI decide on visual flair (CSS animations) and gameplay pacing (Tick rate).">
        <SelectionGrid>
          {VIBE_OPTIONS.map((v) => (
            <ChoiceCard
              key={v.label}
              label={v.label}
              description={v.desc}
              type="checkbox"
              selected={data.vibes.includes(v.label)}
              onClick={() => toggleVibe(v.label)}
            />
          ))}
        </SelectionGrid>
        <div className="mt-4">
            <TextInput 
                placeholder="Other vibe..." 
                value={data.vibeOther}
                onChange={(e) => update({ vibeOther: e.target.value })}
            />
        </div>
      </QuestionGroup>

      <QuestionGroup label="Intensity Level" required tooltip="Influences game speed, difficulty curve, and visual noise. 1 = Idle/Zen, 5 = Bullet Hell.">
        <IntensitySlider value={data.intensity} onChange={(val) => update({ intensity: val })} />
      </QuestionGroup>
    </SectionWrapper>
  );
};

// --- Section 2.5: Visuals & Tech ---

export const StepVisuals: React.FC<StepProps> = ({ data, update, errors }) => {
  const colorPreviewMap: Record<string, string> = {
    [ColorTheme.Default]: '#3b82f6',
    [ColorTheme.DarkNeon]: '#a855f7',
    [ColorTheme.Pastel]: '#fca5a5',
    [ColorTheme.Retro]: '#16a34a',
    [ColorTheme.Monochrome]: '#1e293b',
    [ColorTheme.Professional]: '#475569',
  };

  const isApp = data.projectType.includes(ProjectType.App) && data.projectType.length === 1;

  return (
    <SectionWrapper title="Tech Stack" description="How should the AI build the visuals?">
      
      <QuestionGroup label="Rendering Engine" required error={errors.renderStyle} tooltip="Choose the technology based on performance needs. DOM is accessible/responsive, Canvas is performant for many objects.">
        <SelectionGrid>
           <ChoiceCard 
              label={RenderStyle.DOM} 
              description="Standard HTML/CSS. Best for UI-heavy Apps, Visual Novels, and Text adventures."
              selected={data.renderStyle === RenderStyle.DOM} 
              onClick={() => update({ renderStyle: RenderStyle.DOM })}
              icon={<Monitor size={18}/>}
           />
           <ChoiceCard 
              label={RenderStyle.Canvas} 
              description="HTML5 Canvas. High performance for moving objects. Best for Action, Rhythm, Simulations."
              selected={data.renderStyle === RenderStyle.Canvas} 
              onClick={() => update({ renderStyle: RenderStyle.Canvas })}
              icon={<Layers size={18}/>}
           />
           {!isApp && (
             <ChoiceCard 
                label={RenderStyle.ThreeJS} 
                description="3D Engine. Best for immersive worlds. Higher complexity."
                selected={data.renderStyle === RenderStyle.ThreeJS} 
                onClick={() => update({ renderStyle: RenderStyle.ThreeJS })}
                icon={<Box size={18}/>}
             />
           )}
           <ChoiceCard 
              label={RenderStyle.SVG} 
              description="Vector Graphics. Crisp at any size. Good for Card games, Puzzles, and Strategy maps."
              selected={data.renderStyle === RenderStyle.SVG} 
              onClick={() => update({ renderStyle: RenderStyle.SVG })}
              icon={<Palette size={18}/>}
           />
        </SelectionGrid>
      </QuestionGroup>

      <QuestionGroup label="Visual Assets" required error={errors.assetStyle} tooltip="We use code-generated assets to keep the app self-contained (no broken image links). The AI will draw these using the chosen method.">
        <SelectionGrid>
           <ChoiceCard 
              label={AssetStyle.Shapes} 
              description="Clean geometry (Circles, Rects). Modern and abstract."
              selected={data.assetStyle === AssetStyle.Shapes} 
              onClick={() => update({ assetStyle: AssetStyle.Shapes })}
              icon={<Square size={18}/>}
           />
           <ChoiceCard 
              label={AssetStyle.Emojis} 
              description="Uses system emojis. Expressive, colorful, and very lightweight."
              selected={data.assetStyle === AssetStyle.Emojis} 
              onClick={() => update({ assetStyle: AssetStyle.Emojis })}
              icon={<Smile size={18}/>}
           />
           <ChoiceCard 
              label={AssetStyle.Icons} 
              description="Lucide/Feather icons. Clean, professional app aesthetic."
              selected={data.assetStyle === AssetStyle.Icons} 
              onClick={() => update({ assetStyle: AssetStyle.Icons })}
              icon={<Type size={18}/>}
           />
           <ChoiceCard 
              label={AssetStyle.Pixel} 
              description="Procedural pixel art. Retro gaming nostalgia."
              selected={data.assetStyle === AssetStyle.Pixel} 
              onClick={() => update({ assetStyle: AssetStyle.Pixel })}
              icon={<Box size={18}/>}
           />
        </SelectionGrid>
      </QuestionGroup>

      <QuestionGroup label="Color Theme" required error={errors.colorTheme} tooltip="Sets the CSS variables for the root palette. Can be tweaked in the code later.">
        <SelectionGrid>
          {Object.values(ColorTheme).map(theme => (
            <ChoiceCard
              key={theme}
              label={theme}
              selected={data.colorTheme === theme}
              onClick={() => update({ colorTheme: theme })}
              previewColor={colorPreviewMap[theme]}
            />
          ))}
        </SelectionGrid>
      </QuestionGroup>

      <QuestionGroup label="Audio System" required tooltip="Procedural audio uses Web Audio API to generate sound waves (Oscillators) without external files.">
        <SelectionGrid>
          <ChoiceCard 
            label="Sound On" 
            description="Enable audio engine."
            selected={data.includeSound === true} 
            onClick={() => update({ includeSound: true })}
            icon={<Volume2 size={18}/>}
          />
          <ChoiceCard 
            label="Silent" 
            description="No audio code."
            selected={data.includeSound === false} 
            onClick={() => update({ includeSound: false })}
            icon={<VolumeX size={18}/>}
          />
        </SelectionGrid>
        
        {data.includeSound && (
          <div className="mt-4 animate-fade-in">
             <label className="text-sm font-bold text-slate-600 dark:text-slate-400 mb-2 block">Audio Style</label>
             <Select 
                options={[
                  'Retro / 8-bit (Chiptune)', 
                  'Lo-Fi / Chill (Soft Synths)', 
                  'Sci-Fi / Futuristic (Beeps & Drones)', 
                  'Realistic / Foley (Percussive)', 
                  'Chaotic / Glitch',
                  'Orchestral / Synth (Procedural)'
                ]} 
                value={data.audioStyle} 
                onChange={(e) => update({ audioStyle: e.target.value })} 
             />
          </div>
        )}
      </QuestionGroup>

    </SectionWrapper>
  );
};

// --- GENRE DETAILS STEPS ---

// 1. Action Details
export const StepActionDetails: React.FC<StepProps> = ({ data, update, errors }) => (
  <SectionWrapper title="Action Mechanics" description="Reflexes, physics, and combat.">
     <QuestionGroup label="Sub-Genre" required error={errors.actionGenre} tooltip="Defines the physics engine constraints (e.g. Platformer needs gravity, Top-Down needs XY movement).">
        <Select options={[
          'Platformer', 'Top-Down Shooter', 'Twin Stick', 'Endless Runner', 'Beat \'em up', 
          'Arena Survival', 'Rhythm Action', 'Bullet Hell'
        ]} value={data.actionGenre} onChange={(e) => update({ actionGenre: e.target.value })} />
     </QuestionGroup>
     <QuestionGroup label="Perspective" required error={errors.actionView} tooltip="Determines the rendering context (2D Canvas vs Raycasting vs DOM).">
        <Select options={['Side View (2D)', 'Top Down', 'Isometric', 'First Person (Raycasting/3D)']} value={data.actionView} onChange={(e) => update({ actionView: e.target.value })} />
     </QuestionGroup>
     <QuestionGroup label="Core Mechanics (Select multiple)" required helpText="What actions does the player perform?" tooltip="Adds specific input listeners and physics logic for each selected mechanic.">
         <SelectionGrid>
             {[
               { l: 'Jumping / Gravity', d: 'Platformer physics.' },
               { l: 'Shooting', d: 'Projectiles or hitscan.' },
               { l: 'Dashing', d: 'Quick movement bursts.' },
               { l: 'Melee Combat', d: 'Close range attacks.' },
               { l: 'Stealth', d: 'Vision cones and hiding.' },
               { l: 'Rhythm Timing', d: 'Actions on beat.' },
               { l: 'Physics Objects', d: 'Pushing crates, ragdolls.' }
             ].map(m => (
                 <ChoiceCard 
                    type="checkbox" 
                    key={m.l} 
                    label={m.l} 
                    description={m.d}
                    selected={data.actionMechanics?.includes(m.l)} 
                    onClick={() => {
                        const list = data.actionMechanics || [];
                        update({ actionMechanics: list.includes(m.l) ? list.filter(i=>i!==m.l) : [...list, m.l] })
                    }} 
                 />
             ))}
         </SelectionGrid>
     </QuestionGroup>
  </SectionWrapper>
);

// 2. Puzzle Details
export const StepPuzzleDetails: React.FC<StepProps> = ({ data, update, errors }) => (
  <SectionWrapper title="Logic & Educational" description="Brain teasers and learning systems.">
     <QuestionGroup label="Puzzle Type" required error={errors.puzzleType} tooltip="Sets the grid logic or physics engine requirements.">
        <Select options={[
          'Match-3 / Grid', 'Physics / Gravity', 'Word / Logic', 'Sokoban / Pushing', 
          'Hidden Object', 'Maze', 'Quiz / Trivia', 'Flashcards', 'Typing'
        ]} value={data.puzzleType} onChange={(e) => update({ puzzleType: e.target.value })} />
     </QuestionGroup>
     <QuestionGroup label="Primary Mechanic" required helpText="e.g. Swapping tiles, drawing lines, answering questions" error={errors.puzzleMechanic} tooltip="The primary user interaction listener (click, drag, type).">
        <TextInput value={data.puzzleMechanic} onChange={(e) => update({ puzzleMechanic: e.target.value })} placeholder="Describe the main interaction..." />
     </QuestionGroup>
     <QuestionGroup label="Level Generation" required error={errors.puzzleLevelGen} tooltip="Procedural means infinite levels created by code algorithms. Handcrafted means fixed data arrays.">
        <Select options={['Procedural (Infinite)', 'Handcrafted (Fixed List)', 'Daily Challenge', 'User Input (Quiz Data)']} value={data.puzzleLevelGen} onChange={(e) => update({ puzzleLevelGen: e.target.value })} />
     </QuestionGroup>
  </SectionWrapper>
);

// 3. RPG Details
export const StepRPGDetails: React.FC<StepProps> = ({ data, update, errors }) => (
  <SectionWrapper title="RPG & Narrative" description="Stats, stories, and worlds.">
     <QuestionGroup label="Setting Style" required error={errors.rpgSetting} tooltip="Influences the generated text descriptions, names, and visual asset style.">
        <Select options={[
          'High Fantasy', 'Cyberpunk / Sci-Fi', 'Post-Apocalyptic', 'Modern Mystery', 
          'Eldritch Horror', 'School / Slice of Life'
        ]} value={data.rpgSetting} onChange={(e) => update({ rpgSetting: e.target.value })} />
     </QuestionGroup>
     <QuestionGroup label="Combat System" required error={errors.rpgCombat} tooltip="Determines if we need a separate battle loop state or if conflict happens in the overworld.">
        <Select options={[
          'Turn-Based (Menu)', 'Real-Time Action', 'Tactical Grid', 'Auto-Battler', 
          'No Combat (Story/Visual Novel)'
        ]} value={data.rpgCombat} onChange={(e) => update({ rpgCombat: e.target.value })} />
     </QuestionGroup>
     <QuestionGroup label="Class / Progression" required error={errors.rpgClassSystem} tooltip="Defines the data structure for player stats and how they update over time.">
        <Select options={[
          'Class-based (Warrior/Mage)', 'Skill Tree', 'Loot based (Gear is power)', 
          'Simple Leveling', 'Relationship Levels (VN)'
        ]} value={data.rpgClassSystem} onChange={(e) => update({ rpgClassSystem: e.target.value })} />
     </QuestionGroup>
  </SectionWrapper>
);

// 4. Strategy Details
export const StepStrategyDetails: React.FC<StepProps> = ({ data, update, errors }) => (
  <SectionWrapper title="Simulation & Strategy" description="Management and growth.">
     <QuestionGroup label="Sim Type" required error={errors.simType} tooltip="Sets the core update loop (tick rate vs event driven) and entity management.">
        <Select options={[
          'Tycoon / Business', 'City Builder', 'Farming / Life Sim', 'Tower Defense', 
          'Idle / Clicker', 'God Game', 'RTS (Real Time Strategy)', 'Biology / Evolution Sim'
        ]} value={data.simType} onChange={(e) => update({ simType: e.target.value })} />
     </QuestionGroup>
     <QuestionGroup label="Primary Resource" required helpText="What do players collect? e.g. Gold, Energy, Happiness." error={errors.simGoal} tooltip="The main variable that drives the economy and win condition.">
        <TextInput value={data.simGoal} onChange={(e) => update({ simGoal: e.target.value })} placeholder="Resource name..." />
     </QuestionGroup>
     <QuestionGroup label="Economy Complexity" required error={errors.simEconomy} tooltip="How resource values are calculated. Simple = Linear accumulation. Market = Values fluctuate.">
        <Select options={['Simple (Number goes up)', 'Resource Chains (Wood -> Plank -> House)', 'Market Driven (Supply/Demand)']} value={data.simEconomy} onChange={(e) => update({ simEconomy: e.target.value })} />
     </QuestionGroup>
  </SectionWrapper>
);

// 5. Creative Details
export const StepCreativeDetails: React.FC<StepProps> = ({ data, update, errors }) => (
  <SectionWrapper title="Creative Tool" description="Empower the user to make art.">
     <QuestionGroup label="Tool Type" required error={errors.creativeToolType} tooltip="The primary canvas interaction mode and data structure (grid vs vector vs audio buffer).">
        <Select options={['Pixel Art Editor', 'Vector / Shape Designer', 'Music / Sequencer', 'Generative Art', 'Text / Poetry Maker']} value={data.creativeToolType} onChange={(e) => update({ creativeToolType: e.target.value })} />
     </QuestionGroup>
     <QuestionGroup label="Output / Share" required error={errors.creativeOutput} tooltip="How the user saves their creation (DataURL, LocalStorage, or JSON export).">
        <TextInput value={data.creativeOutput} onChange={(e) => update({ creativeOutput: e.target.value })} placeholder="e.g. Save as PNG, Playback loop..." />
     </QuestionGroup>
  </SectionWrapper>
);

// 6. App Details (Enhanced)
export const StepAppDetails: React.FC<StepProps> = ({ data, update, errors }) => (
  <SectionWrapper title="App Specifications" description="Define the utility.">
     <QuestionGroup label="App Archetype" required error={errors.appType} tooltip="Defines the layout structure (Sidebar, Grid, Feed) and navigation flow.">
        <Select options={['Dashboard / Analytics', 'To-Do / Tracker', 'Note Taking / Knowledge', 'Social / Feed', 'Calculator / Converter', 'Flashcards / Learning']} value={data.appType} onChange={(e) => update({ appType: e.target.value })} />
     </QuestionGroup>
     <QuestionGroup label="Data Model" required error={errors.appDataModel} tooltip="Local Storage persists on device. Session clears on refresh. Mock API structures code for future backend integration.">
        <Select options={['Local Storage (Persist on device)', 'Session only (Clears on refresh)', 'Mock API (Simulated Backend)']} value={data.appDataModel} onChange={(e) => update({ appDataModel: e.target.value })} />
     </QuestionGroup>
     <QuestionGroup label="UI Density" required error={errors.appUiDensity} tooltip="Controls CSS padding, font sizes, and information density per screen.">
        <Select options={['Comfortable / Spacious', 'Dense / Data Heavy', 'Minimalist']} value={data.appUiDensity} onChange={(e) => update({ appUiDensity: e.target.value })} />
     </QuestionGroup>
  </SectionWrapper>
);

// 7. Party Details (Existing but kept for Party type)
export const StepPartyDetails: React.FC<StepProps> = ({ data, update, errors }) => {
    const updateMinigame = (index: number, field: keyof Minigame, val: string) => {
        const newMinigames = [...data.partyMinigames];
        newMinigames[index] = { ...newMinigames[index], [field]: val };
        update({ partyMinigames: newMinigames });
    };

    return (
        <SectionWrapper title="Party Mechanics" description="Chaos for the couch.">
             <QuestionGroup label="Player Count" required error={errors.partyPlayers} tooltip="Determines input handling (multiple key bindings vs gamepad indices).">
                <SelectionGrid>
                    {['2', '3', '4'].map(p => (
                        <ChoiceCard key={p} label={`${p} Players`} selected={data.partyPlayers === p} onClick={() => update({ partyPlayers: p })} />
                    ))}
                </SelectionGrid>
            </QuestionGroup>
            <QuestionGroup label="Round Length" required error={errors.partyRoundLength} tooltip="Sets the timer logic for the game loop.">
                <Select options={['30s Blitz', '60s Standard', '90s Long']} value={data.partyRoundLength} onChange={(e) => update({ partyRoundLength: e.target.value })} />
            </QuestionGroup>
            <QuestionGroup label="Match Format" required error={errors.partyMatchFormat} tooltip="How the win condition is evaluated across multiple sessions.">
                <Select options={['Best of 3', 'Best of 5', 'Mario Party Style (Board + Minigames)']} value={data.partyMatchFormat} onChange={(e) => update({ partyMatchFormat: e.target.value })} />
            </QuestionGroup>
            <QuestionGroup label="Chaos Rule" required helpText="e.g. Controls swap every 10s" error={errors.partyChaosRule} tooltip="A global modifier that affects the game loop periodically.">
                 <TextInput value={data.partyChaosRule} onChange={(e) => update({ partyChaosRule: e.target.value })} placeholder="Describe the chaos..." />
            </QuestionGroup>
             <QuestionGroup label="Minigame Ideas" required helpText="List 3 concepts" tooltip="Give the AI a starting point for generating minigame logic.">
                 {data.partyMinigames.map((mg, idx) => (
                    <div key={idx} className="mb-2">
                        <TextInput 
                            placeholder={`Minigame ${idx+1}: e.g. Tank Sumo`} 
                            value={mg.name} 
                            onChange={(e) => updateMinigame(idx, 'name', e.target.value)}
                        />
                    </div>
                 ))}
            </QuestionGroup>
        </SectionWrapper>
    );
};


// --- Section 4: Multiplayer ---

const MP_STYLES = [
  { l: 'Couch Co-op', d: 'Same screen, working together.' },
  { l: 'Versus (PvP)', d: 'Fighting against each other.' },
  { l: 'Team-based', d: '2v2 or Team vs Environment.' },
  { l: 'Leaderboards only', d: 'Async competition via scores.' }
];

export const StepMultiplayer: React.FC<StepProps> = ({ data, update, errors }) => {
    const toggleStyle = (style: string) => {
        const newStyles = data.mpStyle.includes(style) 
            ? data.mpStyle.filter(s => s !== style) 
            : [...data.mpStyle, style];
        update({ mpStyle: newStyles });
    };

    return (
        <SectionWrapper title="Multiplayer & Controls" description="Input and Socials.">
            <QuestionGroup label="Max Players" required error={errors.mpPlayerCount} tooltip="Affects the number of entities and input listeners initialized.">
                 <SelectionGrid>
                    {['1', '2', '3', '4'].map(p => (
                        <ChoiceCard key={p} label={p} selected={data.mpPlayerCount === p} onClick={() => update({ mpPlayerCount: p })} />
                    ))}
                 </SelectionGrid>
            </QuestionGroup>

            <QuestionGroup label="Mode" error={errors.mpStyle} tooltip="Defines the interaction rules (Collision between players, shared score vs individual).">
                <SelectionGrid>
                    {MP_STYLES.map(s => (
                        <ChoiceCard 
                           key={s.l} 
                           label={s.l} 
                           description={s.d}
                           type="checkbox" 
                           selected={data.mpStyle.includes(s.l)} 
                           onClick={() => toggleStyle(s.l)} 
                        />
                    ))}
                </SelectionGrid>
            </QuestionGroup>

            <QuestionGroup label="Control Scheme" required error={errors.mpControls} tooltip="Gamepads need the Gamepad API. Touch needs on-screen joysticks. Keyboard uses simple event listeners.">
                 <Select 
                    options={['Keyboard (WASD/Arrows)', 'Mouse / Touch', 'Gamepad Support', 'Hybrid (All)']} 
                    value={data.mpControls} 
                    onChange={(e) => update({ mpControls: e.target.value })} 
                 />
            </QuestionGroup>
        </SectionWrapper>
    );
};

// --- Section 5: Progression ---

const PROGRESSION_OPTS = [
  { l: 'Levels/Stages', d: 'Linear progression from A to B.' },
  { l: 'XP & Leveling', d: 'Stats increase over time.' },
  { l: 'Unlockable Skins', d: 'Cosmetic rewards.' },
  { l: 'High Score Chasing', d: 'Arcade style loops.' },
  { l: 'Story Chapters', d: 'Narrative unlock.' },
  { l: 'Currency Shop', d: 'Buy upgrades with gold.' }
];

export const StepProgression: React.FC<StepProps> = ({ data, update, errors }) => {
     const toggleProg = (item: string) => {
        const list = data.progressionFeatures.includes(item)
            ? data.progressionFeatures.filter(i => i !== item)
            : [...data.progressionFeatures, item];
        update({ progressionFeatures: list });
    };

    return (
        <SectionWrapper title="Progression System" description="Hooks to keep them playing.">
            <QuestionGroup label="Features (Select at least 1)" required error={errors.progressionFeatures} tooltip="Adds specific systems to the state management (e.g. 'XP' adds a leveling formula).">
                <SelectionGrid>
                    {PROGRESSION_OPTS.map(opt => (
                        <ChoiceCard 
                            key={opt.l} 
                            label={opt.l} 
                            description={opt.d}
                            type="checkbox" 
                            selected={data.progressionFeatures.includes(opt.l)} 
                            onClick={() => toggleProg(opt.l)} 
                        />
                    ))}
                </SelectionGrid>
            </QuestionGroup>

            <QuestionGroup label="Persistence" required error={errors.saveProgress} tooltip="Auto-save uses localStorage. Roguelike means resets on death.">
                <SelectionGrid>
                    <ChoiceCard label="Auto-Save (Local Storage)" description="Remember progress after close." selected={data.saveProgress === 'Yes'} onClick={() => update({ saveProgress: 'Yes' })} />
                    <ChoiceCard label="Roguelike (Wipe on Death)" description="Fresh start every run." selected={data.saveProgress === 'No'} onClick={() => update({ saveProgress: 'No' })} />
                </SelectionGrid>
            </QuestionGroup>
        </SectionWrapper>
    );
};

// --- Section 6: Content Limits ---

const ALLOWED_VIBES = ['Tense', 'Spooky (no gore)', 'Action (cartoony)', 'Comedy', 'Competitive'];
const NOT_ALLOWED = ['Gore', 'Graphic violence', 'Extreme jump scares', 'Realistic horror'];

export const StepContentLimits: React.FC<StepProps> = ({ data, update, errors }) => {
     const toggleAllow = (item: string) => {
        const list = data.allowedVibes.includes(item)
            ? data.allowedVibes.filter(i => i !== item)
            : [...data.allowedVibes, item];
        update({ allowedVibes: list });
    };
     const toggleDisallow = (item: string) => {
        const list = data.notAllowed.includes(item)
            ? data.notAllowed.filter(i => i !== item)
            : [...data.notAllowed, item];
        update({ notAllowed: list });
    };

    return (
        <SectionWrapper title="Safety & Boundaries" description="Define the tone constraints.">
            <QuestionGroup label="Allowed Tone" required error={errors.allowedVibes} tooltip="Guidelines for text generation and visual atmosphere.">
                 <SelectionGrid>
                    {ALLOWED_VIBES.map(opt => (
                        <ChoiceCard key={opt} label={opt} type="checkbox" selected={data.allowedVibes.includes(opt)} onClick={() => toggleAllow(opt)} />
                    ))}
                </SelectionGrid>
            </QuestionGroup>

            <QuestionGroup label="Strictly Forbidden" required error={errors.notAllowed} tooltip="Hard constraints for the AI generation safety filter.">
                 <SelectionGrid>
                    {NOT_ALLOWED.map(opt => (
                        <ChoiceCard key={opt} label={opt} type="checkbox" selected={data.notAllowed.includes(opt)} onClick={() => toggleDisallow(opt)} />
                    ))}
                </SelectionGrid>
                <div className="mt-4">
                     <TextInput placeholder="Other restrictions..." value={data.notAllowedOther} onChange={(e) => update({ notAllowedOther: e.target.value })} />
                </div>
            </QuestionGroup>
        </SectionWrapper>
    );
};

// --- Section 7: Finish ---

const ACCESSIBILITY_OPTS = [
    { l: 'Colorblind Friendly', d: 'High contrast, distinct patterns.' },
    { l: 'Reduced Motion', d: 'Disable screen shake/flashing.' },
    { l: 'Screen Reader Support', d: 'ARIA labels for UI elements.' },
    { l: 'One-Handed Mode', d: 'Controls accessible with one hand.' },
    { l: 'Game Speed Control', d: 'Slow down for easier reaction.' }
];

export const StepFinish: React.FC<StepProps> = ({ data, update }) => {
    
    const toggleAccess = (item: string) => {
        const list = data.accessibilityFeatures?.includes(item) 
             ? data.accessibilityFeatures.filter(i => i !== item)
             : [...(data.accessibilityFeatures || []), item];
        update({ accessibilityFeatures: list });
    }

    const showAccessibility = data.speedMode === SpeedMode.Full || 
                             (data.speedMode === SpeedMode.Custom && data.customSections?.includes('accessibility'));

    return (
        <SectionWrapper title="Review" description="Final touches.">
            {showAccessibility && (
              <div className="animate-fade-in">
                <QuestionGroup label="Accessibility Features" tooltip="Good practices to make your game playable by everyone. These will be added as requirements in the prompt.">
                    <SelectionGrid>
                        {ACCESSIBILITY_OPTS.map(opt => (
                            <ChoiceCard 
                                key={opt.l} 
                                label={opt.l} 
                                description={opt.d}
                                type="checkbox" 
                                selected={data.accessibilityFeatures?.includes(opt.l)} 
                                onClick={() => toggleAccess(opt.l)} 
                            />
                        ))}
                    </SelectionGrid>
                </QuestionGroup>
              </div>
            )}

            <QuestionGroup label="Extra Requirements" helpText="Ranked mode, achievements, specific libraries?" tooltip="Any final instructions to override previous settings or add specific features.">
                <TextArea 
                    placeholder="List any other requirements..." 
                    value={data.extras} 
                    onChange={(e) => update({ extras: e.target.value })} 
                />
            </QuestionGroup>
            
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-8 rounded-2xl shadow-lg text-center text-white mt-8">
                <h3 className="text-2xl font-bold mb-2">Ready to Generate</h3>
                <p className="opacity-90">We will compile a professional-grade prompt for Gemini 3 Pro.</p>
            </div>
        </SectionWrapper>
    );
};
