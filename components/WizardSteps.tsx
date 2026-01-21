
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
  Rocket, Search, Trophy, Hammer, Sparkles, Car, Bot, TestTube, PawPrint,
  Flame, Crosshair, Map, MousePointerClick, LayoutPanelLeft,
  Calendar, Mail, Folder, FileText, Check
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
    { type: ProjectType.Action, icon: <Gamepad2 size={24}/>, desc: "Fast-paced platformers, retro arcade shooters, and action games." },
    { type: ProjectType.Strategy, icon: <TrendingUp size={24}/>, desc: "Real-time strategy, tower defense, and tactical turn-based games." },
    { type: ProjectType.Simulation, icon: <Calculator size={24}/>, desc: "Business tycoons, city builders, and life simulation systems." },
    { type: ProjectType.Puzzle, icon: <Brain size={24}/>, desc: "Logic challenges, match-3 mechanics, and physics puzzles." },
    { type: ProjectType.RPG, icon: <Sword size={24}/>, desc: "Story-driven adventures, character stats, and deep narratives." },
    { type: ProjectType.Survival, icon: <Flame size={24}/>, desc: "Resource management, crafting, and scavenging mechanics." },
    { type: ProjectType.Fighting, icon: <Crosshair size={24}/>, desc: "Close-quarters combat, duels, and martial arts logic." },
    { type: ProjectType.Sandbox, icon: <Map size={24}/>, desc: "Open worlds, physics playgrounds, and creative sandbox tools." },
    { type: ProjectType.Idle, icon: <MousePointerClick size={24}/>, desc: "Incremental games, clickers, and progression loops." },
    { type: ProjectType.Tabletop, icon: <LayoutPanelLeft size={24}/>, desc: "Digital card games, board games, and strategy tabletop." },
    { type: ProjectType.VisualNovel, icon: <BookOpen size={24}/>, desc: "Interactive fiction, branching dialogue, and character arcs." },
    { type: ProjectType.Music, icon: <Music size={24}/>, desc: "Rhythm action games and audio-reactive experiences." },
    { type: ProjectType.Educational, icon: <GraduationCap size={24}/>, desc: "Interactive learning tools, quizzes, and trivia software." },
    { type: ProjectType.Calendar, icon: <Calendar size={24}/>, desc: "Schedules, event planners, and time management apps." },
    { type: ProjectType.Email, icon: <Mail size={24}/>, desc: "Communication tools, messaging clients, and inboxes." },
    { type: ProjectType.FileManager, icon: <Folder size={24}/>, desc: "Cloud storage interfaces, asset browsers, and explorers." },
    { type: ProjectType.NoteTaking, icon: <FileText size={24}/>, desc: "Knowledge bases, rich text editors, and snippet managers." },
    { type: ProjectType.Party, icon: <Users size={24}/>, desc: "Couch co-op, local multiplayer, and mini-game collections." },
    { type: ProjectType.Creative, icon: <Palette size={24}/>, desc: "Art/drawing tools, sequencers, and music creation kits." },
    { type: ProjectType.App, icon: <Smartphone size={24}/>, desc: "General utility apps, productivity tools, and dashboards." },
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
      <QuestionGroup 
        label="What are we building?" 
        required 
        helpText="Select multiple to create a Hybrid (e.g. Action + RPG)." 
        error={errors.projectType} 
        tooltip="This selection tells the AI which 'Mental Model' to use. It decides whether the code should follow a high-performance Game Loop (Action/Sim) or a reactive, event-driven architecture (Apps/Visual Novels)."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
          {typeOptions.map((opt) => {
            const isSelected = data.projectType.includes(opt.type);
            return (
              <div
                key={opt.type}
                onClick={() => toggleType(opt.type)}
                className={`
                  cursor-pointer group relative p-6 rounded-2xl border-2 transition-all duration-300
                  flex flex-col gap-4 min-h-[160px] justify-between
                  ${isSelected
                    ? 'border-indigo-500 dark:border-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/20 shadow-lg ring-1 ring-indigo-500/30 translate-y-[-2px]' 
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:shadow-md'}
                `}
              >
                <div className="flex items-center justify-between">
                  <div className={`
                    p-3 rounded-xl flex-shrink-0 transition-all duration-300
                    ${isSelected
                      ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-indigo-500/20 shadow-lg' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'}
                  `}>
                    {opt.icon}
                  </div>
                  {isSelected && <div className="w-5 h-5 bg-indigo-500 rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center animate-scale-in">
                    <Check size={10} className="text-white" strokeWidth={4} />
                  </div>}
                </div>
                <div>
                  <h3 className={`font-bold text-xl mb-1 ${isSelected ? 'text-indigo-900 dark:text-indigo-100' : 'text-slate-800 dark:text-slate-200'}`}>
                    {opt.type.split('/')[0].trim()}
                  </h3>
                  <p className={`text-sm leading-relaxed transition-colors duration-300 ${isSelected ? 'text-indigo-700 dark:text-indigo-300/80' : 'text-slate-500 dark:text-slate-400'}`}>
                    {opt.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </QuestionGroup>

      <QuestionGroup 
        label="Depth Mode" 
        required 
        error={errors.speedMode} 
        tooltip="Quick: Generates the MVP (Minimum Viable Product) focus. Full: Instructs the AI to plan for long-term systems like persistence and advanced logic. Custom: Gives you granular control over the blueprint structure."
      >
        <div className="space-y-4">
          <SelectionGrid>
             <ChoiceCard 
               label="Quick Brief (2 min)" 
               description="Core ideas only. Good for quick prototypes focused on immediate functionality."
               selected={data.speedMode === SpeedMode.Quick} 
               onClick={() => update({ speedMode: SpeedMode.Quick })}
               icon={<Zap size={20}/>}
             />
             <ChoiceCard 
               label="Full Specification (5 min)" 
               description="Includes all advanced systems like multiplayer, detailed progression, and edge cases."
               selected={data.speedMode === SpeedMode.Full} 
               onClick={() => update({ speedMode: SpeedMode.Full })}
               icon={<Layers size={20}/>}
             />
             <ChoiceCard 
               label="Custom (Build Your Own)" 
               description="Select exactly which architectural modules to include in your technical prompt."
               selected={data.speedMode === SpeedMode.Custom} 
               onClick={() => update({ speedMode: SpeedMode.Custom })}
               icon={<Settings size={20}/>}
             />
          </SelectionGrid>
          
          {data.speedMode === SpeedMode.Custom && (
            <div className="bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-xl p-6 animate-fade-in mt-6">
              <h4 className="text-base font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-2">
                <ListChecks size={20} /> Select Modules
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
       <QuestionGroup 
         label="What is your Builder Name?" 
         required 
         error={errors.authorName} 
         tooltip="This name will be credited in the generated code as the 'Author'. It makes the final project feel like your own official creation!"
       >
         <TextInput 
            placeholder="e.g. MasterBuilder99, Captain Code, Sarah" 
            value={data.authorName} 
            onChange={(e) => update({ authorName: e.target.value })} 
         />
       </QuestionGroup>

       <QuestionGroup 
         label="What do you love?" 
         required 
         helpText="Pick as many as you like!" 
         error={errors.authorInterests} 
         tooltip="The AI uses these keywords to customize the theme. For example, selecting 'Robots' might turn your player character into a droid and change health kits to 'batteries'."
       >
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

       <QuestionGroup 
         label="What kind of player are you?" 
         required 
         error={errors.playerType} 
         tooltip="This tells the AI how to balance the 'Core Loop'. 'Explorers' get larger maps, 'Champions' get score systems, and 'Builders' get crafting or customization features."
       >
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
      <QuestionGroup 
        label="Title" 
        required 
        error={errors.title} 
        tooltip="The official name of your project. The AI will use this in headers and code metadata."
      >
        <TextInput 
          placeholder="e.g. Cyber Garden Tycoon" 
          value={data.title} 
          onChange={(e) => update({ title: e.target.value })} 
        />
      </QuestionGroup>

      <QuestionGroup 
        label="High Concept Pitch" 
        required 
        helpText="Describe the project in one compelling sentence." 
        error={errors.pitch} 
        tooltip="This is the most important field. It acts as the primary instruction. Focus on the verb (action): 'A game where you [DO SOMETHING] to [ACHIEVE GOAL].'"
      >
        <TextInput 
          placeholder="A farming sim where you grow neon plants in a space station..." 
          value={data.pitch} 
          onChange={(e) => update({ pitch: e.target.value })} 
        />
      </QuestionGroup>
      
      <QuestionGroup 
        label="World Theme" 
        helpText="Select broad settings (you can pick multiple)." 
        tooltip="Themes set the 'flavor' of the environment. If you pick Cyberpunk, the AI will prioritize neon colors and metallic assets."
      >
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

      <QuestionGroup 
        label="Vibe Tags (Select 2-4)" 
        required 
        error={errors.vibes} 
        tooltip="Vibes influence the feel of the UI. 'Chaotic' might result in screen shakes and fast transitions, while 'Zen' leads to smooth fades and minimal noise."
      >
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

      <QuestionGroup 
        label="Intensity Level" 
        required 
        tooltip="Affects the 'Tick Rate' and physics speeds. Level 1 is static/idle. Level 5 is high-speed action where precision timing is required."
      >
        <IntensitySlider value={data.intensity} onChange={(val) => update({ intensity: val })} />
      </QuestionGroup>
    </SectionWrapper>
  );
};

// ... Rest of the file matches current behavior but maintains improved StepStart structure
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
      <QuestionGroup label="Rendering Engine" required error={errors.renderStyle} tooltip="DOM is easiest for UI apps. Canvas is mandatory for fast-moving action games. SVG is perfect for vector-style puzzles.">
        <SelectionGrid>
           <ChoiceCard 
              label={RenderStyle.DOM} 
              description="Standard HTML/CSS. Best for UI-heavy Apps, Visual Novels, and Text adventures."
              selected={data.renderStyle === RenderStyle.DOM} 
              onClick={() => update({ renderStyle: RenderStyle.DOM })}
              icon={<Monitor size={20}/>}
           />
           <ChoiceCard 
              label={RenderStyle.Canvas} 
              description="HTML5 Canvas. High performance for moving objects. Best for Action, Rhythm, Simulations."
              selected={data.renderStyle === RenderStyle.Canvas} 
              onClick={() => update({ renderStyle: RenderStyle.Canvas })}
              icon={<Layers size={20}/>}
           />
           {!isApp && (
             <ChoiceCard 
                label={RenderStyle.ThreeJS} 
                description="3D Engine. Best for immersive worlds. Higher complexity."
                selected={data.renderStyle === RenderStyle.ThreeJS} 
                onClick={() => update({ renderStyle: RenderStyle.ThreeJS })}
                icon={<Box size={20}/>}
             />
           )}
           <ChoiceCard 
              label={RenderStyle.SVG} 
              description="Vector Graphics. Crisp at any size. Good for Card games, Puzzles, and Strategy maps."
              selected={data.renderStyle === RenderStyle.SVG} 
              onClick={() => update({ renderStyle: RenderStyle.SVG })}
              icon={<Palette size={20}/>}
           />
        </SelectionGrid>
      </QuestionGroup>

      <QuestionGroup label="Visual Assets" required error={errors.assetStyle} tooltip="AI must code the graphics. 'Pixel Art' will generate grid drawing logic, while 'Shapes' uses pure CSS.">
        <SelectionGrid>
           <ChoiceCard label={AssetStyle.Shapes} description="Clean geometry. Modern and abstract." selected={data.assetStyle === AssetStyle.Shapes} onClick={() => update({ assetStyle: AssetStyle.Shapes })} icon={<Square size={20}/>} />
           <ChoiceCard label={AssetStyle.Emojis} description="Uses system emojis. Expressive and lightweight." selected={data.assetStyle === AssetStyle.Emojis} onClick={() => update({ assetStyle: AssetStyle.Emojis })} icon={<Smile size={20}/>} />
           <ChoiceCard label={AssetStyle.Icons} description="Lucide icons. Clean, professional app aesthetic." selected={data.assetStyle === AssetStyle.Icons} onClick={() => update({ assetStyle: AssetStyle.Icons })} icon={<Type size={20}/>} />
           <ChoiceCard label={AssetStyle.Pixel} description="Procedural pixel art. Retro gaming nostalgia." selected={data.assetStyle === AssetStyle.Pixel} onClick={() => update({ assetStyle: AssetStyle.Pixel })} icon={<Box size={20}/>} />
        </SelectionGrid>
      </QuestionGroup>

      <QuestionGroup label="Color Theme" required error={errors.colorTheme} tooltip="Defines global CSS variables for colors.">
        <SelectionGrid>
          {Object.values(ColorTheme).map(theme => (
            <ChoiceCard key={theme} label={theme} selected={data.colorTheme === theme} onClick={() => update({ colorTheme: theme })} previewColor={colorPreviewMap[theme]} />
          ))}
        </SelectionGrid>
      </QuestionGroup>

      <QuestionGroup label="Audio System" required tooltip="Procedural audio creates sound waves directly in code.">
        <SelectionGrid>
          <ChoiceCard label="Sound On" description="Enable procedural audio engine." selected={data.includeSound === true} onClick={() => update({ includeSound: true })} icon={<Volume2 size={20}/>} />
          <ChoiceCard label="Silent" description="No audio code in project." selected={data.includeSound === false} onClick={() => update({ includeSound: false })} icon={<VolumeX size={20}/>} />
        </SelectionGrid>
        {data.includeSound && (
          <div className="mt-6 animate-fade-in">
             <label className="text-sm font-bold text-slate-600 dark:text-slate-400 mb-2 block">Audio Style</label>
             <Select options={['Retro / 8-bit (Chiptune)', 'Lo-Fi / Chill (Soft Synths)', 'Sci-Fi / Futuristic (Beeps & Drones)', 'Realistic / Foley (Percussive)', 'Chaotic / Glitch', 'Orchestral / Synth (Procedural)']} value={data.audioStyle} onChange={(e) => update({ audioStyle: e.target.value })} />
          </div>
        )}
      </QuestionGroup>
    </SectionWrapper>
  );
};

export const StepActionDetails: React.FC<StepProps> = ({ data, update, errors }) => (
  <SectionWrapper title="Action Mechanics" description="Reflexes, physics, and combat.">
     <QuestionGroup label="Sub-Genre" required error={errors.actionGenre} tooltip="Specifying the sub-genre tells the AI which gravity and collision rules to apply.">
        <Select options={['Platformer', 'Top-Down Shooter', 'Twin Stick', 'Endless Runner', 'Beat \'em up', 'Arena Survival', 'Rhythm Action', 'Bullet Hell', 'Survival Horror', 'Fighting Game']} value={data.actionGenre} onChange={(e) => update({ actionGenre: e.target.value })} />
     </QuestionGroup>
     <QuestionGroup label="Perspective" required error={errors.actionView} tooltip="Affects how player movement is handled. Side-View uses gravity on Y; Top-Down uses free XY movement.">
        <Select options={['Side View (2D)', 'Top Down', 'Isometric', 'First Person (Raycasting/3D)']} value={data.actionView} onChange={(e) => update({ actionView: e.target.value })} />
     </QuestionGroup>
     <QuestionGroup label="Core Mechanics (Select multiple)" required helpText="What actions does the player perform?" tooltip="This selection generates the specific logic loops for player abilities.">
         <SelectionGrid>
             {[{ l: 'Jumping / Gravity', d: 'Platformer physics.' }, { l: 'Shooting', d: 'Projectiles or hitscan.' }, { l: 'Dashing', d: 'Quick movement bursts.' }, { l: 'Melee Combat', d: 'Close range attacks.' }, { l: 'Stealth', d: 'Vision cones and hiding.' }, { l: 'Rhythm Timing', d: 'Actions on beat.' }, { l: 'Physics Objects', d: 'Pushing crates, ragdolls.' }, { l: 'Inventory / Crafting', d: 'Collecting and making.' }].map(m => (
                 <ChoiceCard type="checkbox" key={m.l} label={m.l} description={m.d} selected={data.actionMechanics?.includes(m.l)} onClick={() => { const list = data.actionMechanics || []; update({ actionMechanics: list.includes(m.l) ? list.filter(i=>i!==m.l) : [...list, m.l] }) }} />
             ))}
         </SelectionGrid>
     </QuestionGroup>
  </SectionWrapper>
);

export const StepPuzzleDetails: React.FC<StepProps> = ({ data, update, errors }) => (
  <SectionWrapper title="Logic & Educational" description="Brain teasers and learning systems.">
     <QuestionGroup label="Puzzle Type" required error={errors.puzzleType} tooltip="Determines the 'Win Condition' logic. Match-3 requires color-matching code.">
        <Select options={['Match-3 / Grid', 'Physics / Gravity', 'Word / Logic', 'Sokoban / Pushing', 'Hidden Object', 'Maze', 'Quiz / Trivia', 'Flashcards', 'Typing', 'Card Strategy', 'Board Game']} value={data.puzzleType} onChange={(e) => update({ puzzleType: e.target.value })} />
     </QuestionGroup>
     <QuestionGroup label="Primary Mechanic" required helpText="e.g. Swapping tiles, drawing lines, answering questions" error={errors.puzzleMechanic} tooltip="The specific interaction the player repeats.">
        <TextInput value={data.puzzleMechanic} onChange={(e) => update({ puzzleMechanic: e.target.value })} placeholder="Describe the main interaction..." />
     </QuestionGroup>
     <QuestionGroup label="Level Generation" required error={errors.puzzleLevelGen} tooltip="Procedural generation allows for infinite replayability. Handcrafted is for story-driven puzzles.">
        <Select options={['Procedural (Infinite)', 'Handcrafted (Fixed List)', 'Daily Challenge', 'User Input (Quiz Data)']} value={data.puzzleLevelGen} onChange={(e) => update({ puzzleLevelGen: e.target.value })} />
     </QuestionGroup>
  </SectionWrapper>
);

export const StepRPGDetails: React.FC<StepProps> = ({ data, update, errors }) => (
  <SectionWrapper title="RPG & Narrative" description="Stats, stories, and worlds.">
     <QuestionGroup label="Setting Style" required error={errors.rpgSetting} tooltip="Influences the dialogue style and names generated for items/places.">
        <Select options={['High Fantasy', 'Cyberpunk / Sci-Fi', 'Post-Apocalyptic', 'Modern Mystery', 'Eldritch Horror', 'School / Slice of Life']} value={data.rpgSetting} onChange={(e) => update({ rpgSetting: e.target.value })} />
     </QuestionGroup>
     <QuestionGroup label="Combat System" required error={errors.rpgCombat} tooltip="Turn-based requires state-switching code. Real-time requires hitbox detection.">
        <Select options={['Turn-Based (Menu)', 'Real-Time Action', 'Tactical Grid', 'Auto-Battler', 'No Combat (Story/Visual Novel)']} value={data.rpgCombat} onChange={(e) => update({ rpgCombat: e.target.value })} />
     </QuestionGroup>
     <QuestionGroup label="Class / Progression" required error={errors.rpgClassSystem} tooltip="Determines the player's data structure (Stats like HP, MP, XP).">
        <Select options={['Class-based (Warrior/Mage)', 'Skill Tree', 'Loot based (Gear is power)', 'Simple Leveling', 'Relationship Levels (VN)']} value={data.rpgClassSystem} onChange={(e) => update({ rpgClassSystem: e.target.value })} />
     </QuestionGroup>
  </SectionWrapper>
);

export const StepStrategyDetails: React.FC<StepProps> = ({ data, update, errors }) => (
  <SectionWrapper title="Simulation & Strategy" description="Management and growth.">
     <QuestionGroup label="Sim Type" required error={errors.simType} tooltip="Tycoons focus on profit; Tower Defense focuses on placement; Idle games focus on exponential growth math.">
        <Select options={['Tycoon / Business', 'City Builder', 'Farming / Life Sim', 'Tower Defense', 'Idle / Clicker', 'God Game', 'RTS (Real Time Strategy)', 'Biology / Evolution Sim', 'Physics Sandbox']} value={data.simType} onChange={(e) => update({ simType: e.target.value })} />
     </QuestionGroup>
     <QuestionGroup label="Primary Resource" required helpText="What do players collect? e.g. Gold, Energy, Happiness." error={errors.simGoal} tooltip="The main 'Number' that the player wants to increase.">
        <TextInput value={data.simGoal} onChange={(e) => update({ simGoal: e.target.value })} placeholder="Resource name..." />
     </QuestionGroup>
     <QuestionGroup label="Economy Complexity" required error={errors.simEconomy} tooltip="Simple economies use direct addition. Market economies require value fluctuation logic.">
        <Select options={['Simple (Number goes up)', 'Resource Chains (Wood -> Plank -> House)', 'Market Driven (Supply/Demand)']} value={data.simEconomy} onChange={(e) => update({ simEconomy: e.target.value })} />
     </QuestionGroup>
  </SectionWrapper>
);

export const StepCreativeDetails: React.FC<StepProps> = ({ data, update, errors }) => (
  <SectionWrapper title="Creative Tool" description="Empower the user to make art.">
     <QuestionGroup label="Tool Type" required error={errors.creativeToolType} tooltip="Generates specific canvas interaction tools (e.g., 'Brush' for Pixel art).">
        <Select options={['Pixel Art Editor', 'Vector / Shape Designer', 'Music / Sequencer', 'Generative Art', 'Text / Poetry Maker']} value={data.creativeToolType} onChange={(e) => update({ creativeToolType: e.target.value })} />
     </QuestionGroup>
     <QuestionGroup label="Output / Share" required error={errors.creativeOutput} tooltip="Decides if the AI should implement image export code or playback features.">
        <TextInput value={data.creativeOutput} onChange={(e) => update({ creativeOutput: e.target.value })} placeholder="e.g. Save as PNG, Playback loop..." />
     </QuestionGroup>
  </SectionWrapper>
);

export const StepAppDetails: React.FC<StepProps> = ({ data, update, errors }) => (
  <SectionWrapper title="App Specifications" description="Define the architecture and logic of your application utility.">
     <QuestionGroup label="App Archetype" required error={errors.appType} tooltip="Drives the high-level layout. A 'Dashboard' results in grids; a 'Feed' follows vertical patterns.">
        <Select options={['Calendar / Scheduler', 'Email Client / Messaging', 'File Manager / Asset Explorer', 'Note Taking / Knowledge Base', 'Dashboard / Data Analytics', 'To-Do / Progress Tracker', 'Social / Content Feed', 'Calculator / Unit Converter', 'Flashcards / Adaptive Learning']} value={data.appType} onChange={(e) => update({ appType: e.target.value })} />
     </QuestionGroup>
     <QuestionGroup label="Data Model" required error={errors.appDataModel} tooltip="Local Storage persists on device. Session clears on refresh.">
        <Select options={['Local Storage (Persist on device)', 'Session only (Clears on refresh)', 'Mock API (Simulated Backend)']} value={data.appDataModel} onChange={(e) => update({ appDataModel: e.target.value })} />
     </QuestionGroup>
     <QuestionGroup label="UI Density" required error={errors.appUiDensity} tooltip="Affects CSS spacing. 'Spacious' is good for mobile; 'Dense' is better for pro tools.">
        <Select options={['Comfortable / Spacious', 'Dense / Data Heavy', 'Minimalist']} value={data.appUiDensity} onChange={(e) => update({ appUiDensity: e.target.value })} />
     </QuestionGroup>
  </SectionWrapper>
);

export const StepPartyDetails: React.FC<StepProps> = ({ data, update, errors }) => {
    const updateMinigame = (index: number, field: keyof Minigame, val: string) => {
        const newMinigames = [...data.partyMinigames];
        newMinigames[index] = { ...newMinigames[index], [field]: val };
        update({ partyMinigames: newMinigames });
    };
    return (
        <SectionWrapper title="Party Mechanics" description="Chaos for the couch.">
             <QuestionGroup label="Player Count" required error={errors.partyPlayers} tooltip="Sets input listener count. More players require split-keyboard or Gamepad API.">
                <SelectionGrid>{['2', '3', '4'].map(p => (<ChoiceCard key={p} label={`${p} Players`} selected={data.partyPlayers === p} onClick={() => update({ partyPlayers: p })} />))}</SelectionGrid>
            </QuestionGroup>
            <QuestionGroup label="Round Length" required error={errors.partyRoundLength} tooltip="Affects the pace of minigame transitions.">
                <Select options={['30s Blitz', '60s Standard', '90s Long']} value={data.partyRoundLength} onChange={(e) => update({ partyRoundLength: e.target.value })} />
            </QuestionGroup>
            <QuestionGroup label="Match Format" required error={errors.partyMatchFormat} tooltip="Determines how the scoreboard tracks winners.">
                <Select options={['Best of 3', 'Best of 5', 'Mario Party Style (Board + Minigames)']} value={data.partyMatchFormat} onChange={(e) => update({ partyMatchFormat: e.target.value })} />
            </QuestionGroup>
            <QuestionGroup label="Chaos Rule" required helpText="e.g. Controls swap every 10s" error={errors.partyChaosRule} tooltip="A special modifier that breaks the rules periodically.">
                 <TextInput value={data.partyChaosRule} onChange={(e) => update({ partyChaosRule: e.target.value })} placeholder="Describe the chaos..." />
            </QuestionGroup>
             <QuestionGroup label="Minigame Ideas" required helpText="List 3 concepts" tooltip="Provides thematic direction for challenges.">
                 {data.partyMinigames.map((mg, idx) => (<div key={idx} className="mb-2"><TextInput placeholder={`Minigame ${idx+1}: e.g. Tank Sumo`} value={mg.name} onChange={(e) => updateMinigame(idx, 'name', e.target.value)} /></div>))}
            </QuestionGroup>
        </SectionWrapper>
    );
};

export const StepMultiplayer: React.FC<StepProps> = ({ data, update, errors }) => {
    const toggleStyle = (style: string) => { const newStyles = data.mpStyle.includes(style) ? data.mpStyle.filter(s => s !== style) : [...data.mpStyle, style]; update({ mpStyle: newStyles }); };
    return (
        <SectionWrapper title="Multiplayer & Controls" description="Input and Socials.">
            <QuestionGroup label="Max Players" required error={errors.mpPlayerCount} tooltip="Impacts initialization of entity arrays and input listeners.">
                 <SelectionGrid>{['1', '2', '3', '4'].map(p => (<ChoiceCard key={p} label={p} selected={data.mpPlayerCount === p} onClick={() => update({ mpPlayerCount: p })} />))}</SelectionGrid>
            </QuestionGroup>
            <QuestionGroup label="Mode" error={errors.mpStyle} tooltip="Defines collision rules.">
                <SelectionGrid>{[{ l: 'Couch Co-op', d: 'Same screen, working together.' }, { l: 'Versus (PvP)', d: 'Fighting against each other.' }, { l: 'Team-based', d: '2v2 or Team vs Environment.' }, { l: 'Leaderboards only', d: 'Async competition via scores.' }].map(s => (<ChoiceCard key={s.l} label={s.l} description={s.d} type="checkbox" selected={data.mpStyle.includes(s.l)} onClick={() => toggleStyle(s.l)} />))}</SelectionGrid>
            </QuestionGroup>
            <QuestionGroup label="Control Scheme" required error={errors.mpControls} tooltip="Gamepad support requires specialized polling code.">
                 <Select options={['Keyboard (WASD/Arrows)', 'Mouse / Touch', 'Gamepad Support', 'Hybrid (All)']} value={data.mpControls} onChange={(e) => update({ mpControls: e.target.value })} />
            </QuestionGroup>
        </SectionWrapper>
    );
};

export const StepProgression: React.FC<StepProps> = ({ data, update, errors }) => {
     const toggleProg = (item: string) => { const list = data.progressionFeatures.includes(item) ? data.progressionFeatures.filter(i => i !== item) : [...data.progressionFeatures, item]; update({ progressionFeatures: list }); };
    return (
        <SectionWrapper title="Progression System" description="Hooks to keep them playing.">
            <QuestionGroup label="Features (Select at least 1)" required error={errors.progressionFeatures} tooltip="Generates state management for persistence.">
                <SelectionGrid>{[{ l: 'Levels/Stages', d: 'Linear progression from A to B.' }, { l: 'XP & Leveling', d: 'Stats increase over time.' }, { l: 'Unlockable Skins', d: 'Cosmetic rewards.' }, { l: 'High Score Chasing', d: 'Arcade style loops.' }, { l: 'Story Chapters', d: 'Narrative unlock.' }, { l: 'Currency Shop', d: 'Buy upgrades with gold.' }].map(opt => (<ChoiceCard key={opt.l} label={opt.l} description={opt.d} type="checkbox" selected={data.progressionFeatures.includes(opt.l)} onClick={() => toggleProg(opt.l)} />))}</SelectionGrid>
            </QuestionGroup>
            <QuestionGroup label="Persistence" required error={errors.saveProgress} tooltip="'Auto-Save' generates JSON serialization.">
                <SelectionGrid>
                    <ChoiceCard label="Auto-Save (Local Storage)" description="Remember progress after close." selected={data.saveProgress === 'Yes'} onClick={() => update({ saveProgress: 'Yes' })} />
                    <ChoiceCard label="Roguelike (Wipe on Death)" description="Fresh start every run." selected={data.saveProgress === 'No'} onClick={() => update({ saveProgress: 'No' })} />
                </SelectionGrid>
            </QuestionGroup>
        </SectionWrapper>
    );
};

export const StepContentLimits: React.FC<StepProps> = ({ data, update, errors }) => {
     const toggleAllow = (item: string) => { const list = data.allowedVibes.includes(item) ? data.allowedVibes.filter(i => i !== item) : [...data.allowedVibes, item]; update({ allowedVibes: list }); };
     const toggleDisallow = (item: string) => { const list = data.notAllowed.includes(item) ? data.notAllowed.filter(i => i !== item) : [...(data.notAllowed || []), item]; update({ notAllowed: list }); };
    return (
        <SectionWrapper title="Safety & Boundaries" description="Define the tone constraints.">
            <QuestionGroup label="Allowed Tone" required error={errors.allowedVibes} tooltip="Safety filter instructions for content generation.">
                 <SelectionGrid>{['Tense', 'Spooky (no gore)', 'Action (cartoony)', 'Comedy', 'Competitive'].map(opt => (<ChoiceCard key={opt} label={opt} type="checkbox" selected={data.allowedVibes.includes(opt)} onClick={() => toggleAllow(opt)} />))}</SelectionGrid>
            </QuestionGroup>
            <QuestionGroup label="Strictly Forbidden" required error={errors.notAllowed} tooltip="Hard constraints for AI content filtering.">
                 <SelectionGrid>{['Gore', 'Graphic violence', 'Extreme jump scares', 'Realistic horror'].map(opt => (<ChoiceCard key={opt} label={opt} type="checkbox" selected={data.notAllowed.includes(opt)} onClick={() => toggleDisallow(opt)} />))}</SelectionGrid>
                <div className="mt-4"><TextInput placeholder="Other restrictions..." value={data.notAllowedOther} onChange={(e) => update({ notAllowedOther: e.target.value })} /></div>
            </QuestionGroup>
        </SectionWrapper>
    );
};

export const StepFinish: React.FC<StepProps> = ({ data, update }) => {
    const toggleAccess = (item: string) => { const list = data.accessibilityFeatures?.includes(item) ? data.accessibilityFeatures.filter(i => i !== item) : [...(data.accessibilityFeatures || []), item]; update({ accessibilityFeatures: list }); }
    const showAccessibility = data.speedMode === SpeedMode.Full || (data.speedMode === SpeedMode.Custom && data.customSections?.includes('accessibility'));
    return (
        <SectionWrapper title="Review" description="Final touches.">
            {showAccessibility && (<div className="animate-fade-in"><QuestionGroup label="Accessibility Features" tooltip="Best-practice features for inclusive design."><SelectionGrid>{[{ l: 'Colorblind Friendly', d: 'High contrast, distinct patterns.' }, { l: 'Reduced Motion', d: 'Disable screen shake/flashing.' }, { l: 'Screen Reader Support', d: 'ARIA labels for UI elements.' }, { l: 'One-Handed Mode', d: 'Controls accessible with one hand.' }, { l: 'Game Speed Control', d: 'Slow down for easier reaction.' }].map(opt => (<ChoiceCard key={opt.l} label={opt.l} description={opt.d} type="checkbox" selected={data.accessibilityFeatures?.includes(opt.l)} onClick={() => toggleAccess(opt.l)} />))}</SelectionGrid></QuestionGroup></div>)}
            <QuestionGroup label="Extra Requirements" helpText="Ranked mode, achievements, specific libraries?" tooltip="Any specialized code requirements."><TextArea placeholder="List any other requirements..." value={data.extras} onChange={(e) => update({ extras: e.target.value })} /></QuestionGroup>
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-8 rounded-2xl shadow-lg text-center text-white mt-8"><h3 className="text-2xl font-bold mb-2">Ready to Generate</h3><p className="opacity-90">We will compile a professional-grade prompt for Gemini 3 Pro.</p></div>
        </SectionWrapper>
    );
};
