
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
  Gamepad2, Brain, Sword, TrendingUp, Users, Palette, Smartphone, Zap, Eye, Accessibility
} from 'lucide-react';

interface StepProps {
  data: FormData;
  update: (fields: Partial<FormData>) => void;
  errors: Record<string, string>;
}

// --- Section 1: Start ---

export const StepStart: React.FC<StepProps> = ({ data, update, errors }) => {
  const typeOptions = [
    { type: ProjectType.Action, icon: <Gamepad2 size={20}/>, desc: "Platformers, Shooters, Arcade. High speed." },
    { type: ProjectType.Puzzle, icon: <Brain size={20}/>, desc: "Logic, Match-3, Physics. Mental challenges." },
    { type: ProjectType.RPG, icon: <Sword size={20}/>, desc: "Story, Adventure, Turn-based. Character growth." },
    { type: ProjectType.Strategy, icon: <TrendingUp size={20}/>, desc: "Sims, Tycoons, City Builders. Management." },
    { type: ProjectType.Party, icon: <Users size={20}/>, desc: "Couch Co-op, Minigames. Multiplayer fun." },
    { type: ProjectType.Creative, icon: <Palette size={20}/>, desc: "Drawing Tools, Music Makers. Sandbox." },
    { type: ProjectType.App, icon: <Smartphone size={20}/>, desc: "Productivity, Tools, Dashboards. Utility." },
  ];

  return (
    <SectionWrapper title="Start" description="Select your blueprint type to begin.">
      <QuestionGroup label="What are we building?" required error={errors.projectType} tooltip="This determines the core architecture and logic the AI will use.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {typeOptions.map((opt) => (
            <div
              key={opt.type}
              onClick={() => update({ projectType: opt.type })}
              className={`
                cursor-pointer group relative p-4 rounded-xl border-2 transition-all duration-200
                flex items-center gap-4
                ${data.projectType === opt.type 
                  ? 'border-indigo-500 bg-indigo-50 shadow-md ring-1 ring-indigo-500/50' 
                  : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50'}
              `}
            >
              <div className={`
                p-3 rounded-lg flex-shrink-0 transition-colors
                ${data.projectType === opt.type ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-white'}
              `}>
                {opt.icon}
              </div>
              <div>
                <h3 className={`font-bold ${data.projectType === opt.type ? 'text-indigo-900' : 'text-slate-800'}`}>
                  {opt.type}
                </h3>
                <p className="text-xs text-slate-500 font-medium leading-tight mt-1">{opt.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </QuestionGroup>

      <QuestionGroup label="Depth Mode" required error={errors.speedMode} tooltip="Quick mode skips deeper customization for a faster start.">
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
             description="Includes multiplayer, progression, and safety."
             selected={data.speedMode === SpeedMode.Full} 
             onClick={() => update({ speedMode: SpeedMode.Full })}
             icon={<Layers size={18}/>}
           />
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
];

export const StepCoreIdentity: React.FC<StepProps> = ({ data, update, errors }) => {
  const toggleVibe = (vibe: string) => {
    const newVibes = data.vibes.includes(vibe)
      ? data.vibes.filter((v) => v !== vibe)
      : [...data.vibes, vibe];
    update({ vibes: newVibes });
  };

  return (
    <SectionWrapper title="Core Identity" description="Define the soul of the project.">
      <QuestionGroup label="Title" required error={errors.title}>
        <TextInput 
          placeholder="e.g. Cyber Garden Tycoon" 
          value={data.title} 
          onChange={(e) => update({ title: e.target.value })} 
        />
      </QuestionGroup>

      <QuestionGroup label="High Concept Pitch" required helpText="Describe the project in one compelling sentence." error={errors.pitch}>
        <TextInput 
          placeholder="A farming sim where you grow neon plants in a space station..." 
          value={data.pitch} 
          onChange={(e) => update({ pitch: e.target.value })} 
        />
      </QuestionGroup>

      <QuestionGroup label="Vibe Tags (Select 2-4)" required error={errors.vibes} tooltip="These tags help the AI decide on visual flair and gameplay pacing.">
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

      <QuestionGroup label="Intensity Level" required tooltip="How much attention does the user need to pay?">
        <IntensitySlider value={data.intensity} onChange={(val) => update({ intensity: val })} />
      </QuestionGroup>

      <QuestionGroup label="Theme / Setting" helpText="e.g. Victorian London, Inside a Computer, Abstract Geometry">
        <TextInput 
          placeholder="Describe the world..." 
          value={data.theme} 
          onChange={(e) => update({ theme: e.target.value })} 
        />
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

  return (
    <SectionWrapper title="Tech Stack" description="How should the AI build the visuals?">
      
      <QuestionGroup label="Rendering Engine" required error={errors.renderStyle} tooltip="Choose the technology based on performance needs.">
        <SelectionGrid>
           <ChoiceCard 
              label={RenderStyle.DOM} 
              description="Standard HTML/CSS. Best for UI-heavy Apps, Idle Games, and Text adventures. Most accessible."
              selected={data.renderStyle === RenderStyle.DOM} 
              onClick={() => update({ renderStyle: RenderStyle.DOM })}
              icon={<Monitor size={18}/>}
           />
           <ChoiceCard 
              label={RenderStyle.Canvas} 
              description="HTML5 Canvas. High performance for moving objects. Best for Action, Platformers, Shooters."
              selected={data.renderStyle === RenderStyle.Canvas} 
              onClick={() => update({ renderStyle: RenderStyle.Canvas })}
              icon={<Layers size={18}/>}
           />
           {data.projectType !== ProjectType.App && (
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

      <QuestionGroup label="Visual Assets" required error={errors.assetStyle} tooltip="We use code-generated assets to keep the app self-contained (no broken image links).">
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

      <QuestionGroup label="Color Theme" required error={errors.colorTheme}>
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

      <QuestionGroup label="Audio System" required tooltip="Procedural audio uses Web Audio API to generate sound without files.">
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
             <label className="text-sm font-bold text-slate-600 mb-2 block">Audio Style</label>
             <Select 
                options={[
                  'Retro / 8-bit (Chiptune)', 
                  'Lo-Fi / Chill (Soft Synths)', 
                  'Sci-Fi / Futuristic (Beeps & Drones)', 
                  'Realistic / Foley (Percussive)', 
                  'Chaotic / Glitch'
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
  <SectionWrapper title="Action Mechanics" description="Twitch reflexes and combat logic.">
     <QuestionGroup label="Sub-Genre" required error={errors.actionGenre}>
        <Select options={['Platformer', 'Top-Down Shooter', 'Twin Stick', 'Endless Runner', 'Beat \'em up', 'Arena Survival']} value={data.actionGenre} onChange={(e) => update({ actionGenre: e.target.value })} />
     </QuestionGroup>
     <QuestionGroup label="Perspective" required error={errors.actionView}>
        <Select options={['Side View (2D)', 'Top Down', 'Isometric', 'First Person (Raycasting/3D)']} value={data.actionView} onChange={(e) => update({ actionView: e.target.value })} />
     </QuestionGroup>
     <QuestionGroup label="Core Mechanics (Select multiple)" required helpText="What actions does the player perform?">
         <SelectionGrid>
             {[
               { l: 'Jumping / Gravity', d: 'Platformer physics.' },
               { l: 'Shooting', d: 'Projectiles or hitscan.' },
               { l: 'Dashing', d: 'Quick movement bursts.' },
               { l: 'Melee Combat', d: 'Close range attacks.' },
               { l: 'Stealth', d: 'Vision cones and hiding.' },
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
  <SectionWrapper title="Puzzle Logic" description="Brain teasers and physics.">
     <QuestionGroup label="Puzzle Type" required error={errors.puzzleType}>
        <Select options={['Match-3 / Grid', 'Physics / Gravity', 'Word / Logic', 'Sokoban / Pushing', 'Hidden Object', 'Maze']} value={data.puzzleType} onChange={(e) => update({ puzzleType: e.target.value })} />
     </QuestionGroup>
     <QuestionGroup label="Primary Mechanic" required helpText="e.g. Swapping tiles, drawing lines, cutting ropes" error={errors.puzzleMechanic}>
        <TextInput value={data.puzzleMechanic} onChange={(e) => update({ puzzleMechanic: e.target.value })} placeholder="Describe the main interaction..." />
     </QuestionGroup>
     <QuestionGroup label="Level Generation" required error={errors.puzzleLevelGen} tooltip="Procedural means infinite levels created by code. Handcrafted means fixed data.">
        <Select options={['Procedural (Infinite)', 'Handcrafted (Fixed List)', 'Daily Challenge']} value={data.puzzleLevelGen} onChange={(e) => update({ puzzleLevelGen: e.target.value })} />
     </QuestionGroup>
  </SectionWrapper>
);

// 3. RPG Details
export const StepRPGDetails: React.FC<StepProps> = ({ data, update, errors }) => (
  <SectionWrapper title="RPG Systems" description="Stats, stories, and worlds.">
     <QuestionGroup label="Setting Style" required error={errors.rpgSetting}>
        <Select options={['High Fantasy', 'Cyberpunk / Sci-Fi', 'Post-Apocalyptic', 'Modern Mystery', 'Eldritch Horror']} value={data.rpgSetting} onChange={(e) => update({ rpgSetting: e.target.value })} />
     </QuestionGroup>
     <QuestionGroup label="Combat System" required error={errors.rpgCombat}>
        <Select options={['Turn-Based (Menu)', 'Real-Time Action', 'Tactical Grid', 'Auto-Battler', 'No Combat (Story only)']} value={data.rpgCombat} onChange={(e) => update({ rpgCombat: e.target.value })} />
     </QuestionGroup>
     <QuestionGroup label="Class / Progression" required error={errors.rpgClassSystem}>
        <Select options={['Class-based (Warrior/Mage)', 'Skill Tree', 'Loot based (Gear is power)', 'Simple Leveling']} value={data.rpgClassSystem} onChange={(e) => update({ rpgClassSystem: e.target.value })} />
     </QuestionGroup>
  </SectionWrapper>
);

// 4. Strategy Details
export const StepStrategyDetails: React.FC<StepProps> = ({ data, update, errors }) => (
  <SectionWrapper title="Simulation & Strategy" description="Management and growth.">
     <QuestionGroup label="Sim Type" required error={errors.simType}>
        <Select options={['Tycoon / Business', 'City Builder', 'Farming / Life Sim', 'Tower Defense', 'Idle / Clicker', 'God Game']} value={data.simType} onChange={(e) => update({ simType: e.target.value })} />
     </QuestionGroup>
     <QuestionGroup label="Primary Resource" required helpText="What do players collect? e.g. Gold, Energy, Happiness." error={errors.simGoal}>
        <TextInput value={data.simGoal} onChange={(e) => update({ simGoal: e.target.value })} placeholder="Resource name..." />
     </QuestionGroup>
     <QuestionGroup label="Economy Complexity" required error={errors.simEconomy}>
        <Select options={['Simple (Number goes up)', 'Resource Chains (Wood -> Plank -> House)', 'Market Driven (Supply/Demand)']} value={data.simEconomy} onChange={(e) => update({ simEconomy: e.target.value })} />
     </QuestionGroup>
  </SectionWrapper>
);

// 5. Creative Details
export const StepCreativeDetails: React.FC<StepProps> = ({ data, update, errors }) => (
  <SectionWrapper title="Creative Tool" description="Empower the user to make art.">
     <QuestionGroup label="Tool Type" required error={errors.creativeToolType}>
        <Select options={['Pixel Art Editor', 'Vector / Shape Designer', 'Music / Sequencer', 'Generative Art', 'Text / Poetry Maker']} value={data.creativeToolType} onChange={(e) => update({ creativeToolType: e.target.value })} />
     </QuestionGroup>
     <QuestionGroup label="Output / Share" required error={errors.creativeOutput}>
        <TextInput value={data.creativeOutput} onChange={(e) => update({ creativeOutput: e.target.value })} placeholder="e.g. Save as PNG, Playback loop..." />
     </QuestionGroup>
  </SectionWrapper>
);

// 6. App Details (Enhanced)
export const StepAppDetails: React.FC<StepProps> = ({ data, update, errors }) => (
  <SectionWrapper title="App Specifications" description="Define the utility.">
     <QuestionGroup label="App Archetype" required error={errors.appType}>
        <Select options={['Dashboard / Analytics', 'To-Do / Tracker', 'Note Taking / Knowledge', 'Social / Feed', 'Calculator / Converter']} value={data.appType} onChange={(e) => update({ appType: e.target.value })} />
     </QuestionGroup>
     <QuestionGroup label="Data Model" required error={errors.appDataModel} tooltip="Local Storage is easiest for offline apps. Mock API simulates a real server.">
        <Select options={['Local Storage (Persist on device)', 'Session only (Clears on refresh)', 'Mock API (Simulated Backend)']} value={data.appDataModel} onChange={(e) => update({ appDataModel: e.target.value })} />
     </QuestionGroup>
     <QuestionGroup label="UI Density" required error={errors.appUiDensity}>
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
             <QuestionGroup label="Player Count" required error={errors.partyPlayers}>
                <SelectionGrid>
                    {['2', '3', '4'].map(p => (
                        <ChoiceCard key={p} label={`${p} Players`} selected={data.partyPlayers === p} onClick={() => update({ partyPlayers: p })} />
                    ))}
                </SelectionGrid>
            </QuestionGroup>
            <QuestionGroup label="Round Length" required error={errors.partyRoundLength}>
                <Select options={['30s Blitz', '60s Standard', '90s Long']} value={data.partyRoundLength} onChange={(e) => update({ partyRoundLength: e.target.value })} />
            </QuestionGroup>
            <QuestionGroup label="Match Format" required error={errors.partyMatchFormat}>
                <Select options={['Best of 3', 'Best of 5', 'Mario Party Style (Board + Minigames)']} value={data.partyMatchFormat} onChange={(e) => update({ partyMatchFormat: e.target.value })} />
            </QuestionGroup>
            <QuestionGroup label="Chaos Rule" required helpText="e.g. Controls swap every 10s" error={errors.partyChaosRule}>
                 <TextInput value={data.partyChaosRule} onChange={(e) => update({ partyChaosRule: e.target.value })} placeholder="Describe the chaos..." />
            </QuestionGroup>
             <QuestionGroup label="Minigame Ideas" required helpText="List 3 concepts">
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
            <QuestionGroup label="Max Players" required error={errors.mpPlayerCount}>
                 <SelectionGrid>
                    {['1', '2', '3', '4'].map(p => (
                        <ChoiceCard key={p} label={p} selected={data.mpPlayerCount === p} onClick={() => update({ mpPlayerCount: p })} />
                    ))}
                 </SelectionGrid>
            </QuestionGroup>

            <QuestionGroup label="Mode" error={errors.mpStyle}>
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

            <QuestionGroup label="Control Scheme" required error={errors.mpControls} tooltip="Gamepads need the Gamepad API. Touch needs on-screen joysticks.">
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
            <QuestionGroup label="Features (Select at least 1)" required error={errors.progressionFeatures}>
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
            <QuestionGroup label="Allowed Tone" required error={errors.allowedVibes}>
                 <SelectionGrid>
                    {ALLOWED_VIBES.map(opt => (
                        <ChoiceCard key={opt} label={opt} type="checkbox" selected={data.allowedVibes.includes(opt)} onClick={() => toggleAllow(opt)} />
                    ))}
                </SelectionGrid>
            </QuestionGroup>

            <QuestionGroup label="Strictly Forbidden" required error={errors.notAllowed}>
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

    return (
        <SectionWrapper title="Review" description="Final touches.">
            <QuestionGroup label="Accessibility Features" tooltip="Good practices to make your game playable by everyone.">
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

            <QuestionGroup label="Extra Requirements" helpText="Ranked mode, achievements, specific libraries?">
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
