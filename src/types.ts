export enum TileType {
  RUBY = 'RUBY',          // Red Gem / Heart
  AMBER = 'AMBER',        // Orange Sun / Flame
  TOPAZ = 'TOPAZ',        // Yellow Star
  EMERALD = 'EMERALD',    // Green Leaf / Emerald
  SAPPHIRE = 'SAPPHIRE',  // Blue Water / Hexagon
  AMETHYST = 'AMETHYST',  // Purple Diamond
}

export enum SpecialTile {
  NONE = 'NONE',
  LINE_BLAST_HORIZONTAL = 'LINE_BLAST_HORIZONTAL',
  LINE_BLAST_VERTICAL = 'LINE_BLAST_VERTICAL',
  COLOR_BOMB = 'COLOR_BOMB',
}

export interface Position {
  row: number;
  col: number;
}

export interface Tile {
  id: string;
  type: TileType;
  special: SpecialTile;
  row: number;
  col: number;
  isMatched?: boolean;
  isNew?: boolean;
  isHinted?: boolean;
}

export interface Match {
  tiles: Tile[];
  type: TileType;
  isSpecialCreation?: SpecialTile;
  creationPosition?: Position;
  direction?: 'HORIZONTAL' | 'VERTICAL' | 'CROSS';
}

export interface FloatingScore {
  id: string;
  text: string;
  x: number;
  y: number;
  color?: string;
  scale?: number;
}

export interface LevelConfig {
  level: number;
  targetScore: number;
  moves: number;
  description?: string;
}

export interface GameState {
  board: (Tile | null)[][];
  score: number;
  movesRemaining: number;
  currentLevel: number;
  targetScore: number;
  comboCount: number;
  isProcessing: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  isLevelComplete: boolean;
  soundEnabled: boolean;
  selectedTile: Position | null;
  hintTiles: Position[] | null;
  highScore: number;
  unlockedLevel: number;
  levelBestScores: Record<number, number>;
}
