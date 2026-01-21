
export enum ProjectType {
  Action = 'Action / Arcade',
  Puzzle = 'Puzzle / Logic',
  RPG = 'RPG / Adventure',
  Strategy = 'Strategy / Sim',
  Party = 'Party / Minigames',
  Creative = 'Creative / Art Tool',
  App = 'Utility / Productivity',
}

export enum SpeedMode {
  Quick = 'Quick (2 min)',
  Full = 'Full (5 min)',
}

export enum RenderStyle {
  DOM = 'React Components (DOM)',
  Canvas = 'HTML5 Canvas (2D)',
  ThreeJS = 'Three.js (3D)',
  SVG = 'SVG Manipulation',
}

export enum AssetStyle {
  Shapes = 'Geometric Shapes (Clean)',
  Emojis = 'Emojis (Expressive/Fast)',
  Icons = 'Lucide Icons (UI/App)',
  Text = 'Typography / ASCII',
  Pixel = 'Procedural Pixel Art',
}

export enum ColorTheme {
  Default = 'Clean / Modern',
  DarkNeon = 'Cyberpunk / Neon',
  Pastel = 'Cozy / Pastel',
  Retro = 'Retro / 8-bit',
  Monochrome = 'High Contrast / BW',
  Professional = 'Enterprise / SaaS',
}

export interface Minigame {
  name: string;
  objective: string;
}

export interface FormData {
  // Section 1: Start
  projectType: ProjectType | null;
  speedMode: SpeedMode | null;

  // Section 2: Core Identity
  title: string;
  pitch: string;
  vibes: string[];
  vibeOther: string;
  intensity: number;
  theme: string;

  // Section 2.5: Visuals & Tech
  renderStyle: string;
  assetStyle: string;
  colorTheme: string;
  includeSound: boolean;
  audioStyle: string; // New: Specific style of audio

  // --- GENRE SPECIFIC FIELDS ---

  // Action
  actionGenre: string;
  actionView: string;
  actionMechanics: string[];

  // Puzzle
  puzzleType: string;
  puzzleMechanic: string;
  puzzleLevelGen: string; // Random vs Handcrafted

  // RPG
  rpgSetting: string;
  rpgView: string;
  rpgCombat: string;
  rpgClassSystem: string;

  // Strategy / Sim
  simType: string;
  simGoal: string; // Money, Survival, domination
  simEconomy: string; // Simple, Complex

  // Creative
  creativeToolType: string; // Drawing, Music, Text
  creativeOutput: string; // Image, Sound, Story

  // Party (Existing)
  partyPlayers: string;
  partyRoundLength: string;
  partyMatchFormat: string;
  partyChaosRule: string;
  partyComeback: string;
  partyMinigames: Minigame[];

  // App
  appType: string; // Dashboard, Tracker, Social
  appDataModel: string; // LocalStorage, Mock API
  appUiDensity: string; // Spacious, Dense

  // --- SYSTEMS ---
  
  // Multiplayer
  mpPlayerCount: string;
  mpStyle: string[];
  mpControls: string;
  mpJoinButton: string;

  // Progression
  progressionFeatures: string[];
  saveProgress: string;
  surpriseEvents: string;
  bossIdea: string;

  // Content Limits
  allowedVibes: string[];
  notAllowed: string[];
  notAllowedOther: string;
  
  // Accessibility (New)
  accessibilityFeatures: string[];

  // Finish
  extras: string;
}

export const INITIAL_DATA: FormData = {
  projectType: null,
  speedMode: null,
  title: '',
  pitch: '',
  vibes: [],
  vibeOther: '',
  intensity: 3,
  theme: '',
  
  renderStyle: '',
  assetStyle: '',
  colorTheme: ColorTheme.Default,
  includeSound: true,
  audioStyle: 'Retro / 8-bit (Chiptune)',

  // Action
  actionGenre: '',
  actionView: '',
  actionMechanics: [],

  // Puzzle
  puzzleType: '',
  puzzleMechanic: '',
  puzzleLevelGen: 'Procedural (Infinite)',

  // RPG
  rpgSetting: '',
  rpgView: '',
  rpgCombat: '',
  rpgClassSystem: 'Classless (Skill based)',

  // Sim
  simType: '',
  simGoal: '',
  simEconomy: 'Simple Resource Flow',

  // Creative
  creativeToolType: '',
  creativeOutput: '',

  // Party
  partyPlayers: '',
  partyRoundLength: '',
  partyMatchFormat: '',
  partyChaosRule: '',
  partyComeback: '',
  partyMinigames: [
    { name: '', objective: '' },
    { name: '', objective: '' },
    { name: '', objective: '' },
  ],

  // App
  appType: '',
  appDataModel: 'Local Storage (Persist on device)',
  appUiDensity: 'Comfortable',

  mpPlayerCount: '1',
  mpStyle: [],
  mpControls: '',
  mpJoinButton: '',
  progressionFeatures: [],
  saveProgress: '',
  surpriseEvents: '',
  bossIdea: '',
  allowedVibes: [],
  notAllowed: [],
  notAllowedOther: '',
  accessibilityFeatures: [],
  extras: '',
};

export enum StepId {
  Start = 'Start',
  CoreIdentity = 'Core Identity',
  Visuals = 'Tech Stack',
  
  // Branching Details
  ActionDetails = 'Action Details',
  PuzzleDetails = 'Puzzle Details',
  RPGDetails = 'RPG Details',
  StrategyDetails = 'Strategy Details',
  PartyDetails = 'Party Details',
  CreativeDetails = 'Creative Details',
  AppDetails = 'App Details',

  Multiplayer = 'Multiplayer',
  Progression = 'Progression',
  ContentLimits = 'Content Limits',
  Finish = 'Finish',
}
