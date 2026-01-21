
export enum ProjectType {
  Action = 'Action / Arcade',
  Puzzle = 'Puzzle / Logic',
  RPG = 'RPG / Adventure',
  Strategy = 'Strategy / Tactics',
  Simulation = 'Simulation / Tycoon',
  Party = 'Party / Minigames',
  Creative = 'Creative / Art Tool',
  App = 'Utility / Productivity',
  Educational = 'Educational / Trivia',
  Music = 'Music / Rhythm',
  VisualNovel = 'Visual Novel',
}

export enum SpeedMode {
  Quick = 'Quick (2 min)',
  Full = 'Full (5 min)',
  Custom = 'Custom (Build Your Own)',
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
  projectType: ProjectType[]; // Changed to Array for Hybrid Genres
  speedMode: SpeedMode | null;
  customSections: string[];

  // Section 1.5: About You (New)
  authorName: string;
  authorInterests: string[];
  playerType: string;

  // Section 2: Core Identity
  title: string;
  pitch: string;
  vibes: string[];
  vibeOther: string;
  themes: string[]; // New: Selected generic themes
  customTheme: string; // Renamed from 'theme' for specific details
  intensity: number;

  // Section 2.5: Visuals & Tech
  renderStyle: string;
  assetStyle: string;
  colorTheme: string;
  includeSound: boolean;
  audioStyle: string;

  // --- GENRE SPECIFIC FIELDS ---

  // Action
  actionGenre: string;
  actionView: string;
  actionMechanics: string[];

  // Puzzle
  puzzleType: string;
  puzzleMechanic: string;
  puzzleLevelGen: string;

  // RPG
  rpgSetting: string;
  rpgView: string;
  rpgCombat: string;
  rpgClassSystem: string;

  // Strategy / Sim
  simType: string;
  simGoal: string;
  simEconomy: string;

  // Creative
  creativeToolType: string;
  creativeOutput: string;

  // Party
  partyPlayers: string;
  partyRoundLength: string;
  partyMatchFormat: string;
  partyChaosRule: string;
  partyComeback: string;
  partyMinigames: Minigame[];

  // App
  appType: string;
  appDataModel: string;
  appUiDensity: string;

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
  
  // Accessibility
  accessibilityFeatures: string[];

  // Finish
  extras: string;
}

export const INITIAL_DATA: FormData = {
  projectType: [],
  speedMode: null,
  customSections: [],
  
  authorName: '',
  authorInterests: [],
  playerType: '',

  title: '',
  pitch: '',
  vibes: [],
  vibeOther: '',
  themes: [],
  customTheme: '',
  intensity: 3,
  
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
  AboutYou = 'About You',
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
