import { Tile, TileType, SpecialTile, Position, Match, LevelConfig, DifficultyMode } from '../types';

export const BOARD_SIZE = 8;
export const ALL_TILE_TYPES: TileType[] = [
  TileType.RUBY,
  TileType.AMBER,
  TileType.TOPAZ,
  TileType.EMERALD,
  TileType.SAPPHIRE,
  TileType.AMETHYST,
];

export const LEVEL_CONFIGS: LevelConfig[] = [
  { level: 1, targetScore: 1000, moves: 30, description: 'Match 3 tiles to get started!' },
  { level: 2, targetScore: 2000, moves: 28, description: 'Match 4 to create a Line Blast!' },
  { level: 3, targetScore: 3500, moves: 25, description: 'Match 5 to forge a Color Bomb!' },
  { level: 4, targetScore: 5000, moves: 25, description: 'Trigger massive cascades!' },
  { level: 5, targetScore: 7500, moves: 22, description: 'Master the tile smashes!' },
];

export function getLevelConfig(level: number, difficulty: DifficultyMode = 'NORMAL'): LevelConfig {
  let base: LevelConfig;
  if (level <= LEVEL_CONFIGS.length) {
    base = { ...LEVEL_CONFIGS[level - 1] };
  } else {
    // Progressively harder generated levels
    const targetScore = Math.floor(7500 + (level - 5) * 2800);
    const moves = Math.max(18, Math.floor(22 - (level - 5) * 0.5));
    base = {
      level,
      targetScore,
      moves,
      description: `Level ${level} Challenge`,
    };
  }

  // Adjust for difficulty
  if (difficulty === 'EASY') {
    return {
      ...base,
      moves: base.moves + 8,
      targetScore: Math.round(base.targetScore * 0.8),
      description: `${base.description || `Level ${level}`} (Relaxed)`,
    };
  }
  if (difficulty === 'HARD') {
    return {
      ...base,
      moves: Math.max(14, base.moves - 7),
      targetScore: Math.round(base.targetScore * 1.35),
      description: `${base.description || `Level ${level}`} (Master)`,
    };
  }

  return base;
}

let nextTileId = 1;
export function generateUniqueId(): string {
  return `tile_${nextTileId++}_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
}

export function getRandomTileType(): TileType {
  const index = Math.floor(Math.random() * ALL_TILE_TYPES.length);
  return ALL_TILE_TYPES[index];
}

export function createTile(row: number, col: number, type?: TileType, special: SpecialTile = SpecialTile.NONE): Tile {
  return {
    id: generateUniqueId(),
    type: type || getRandomTileType(),
    special,
    row,
    col,
  };
}

/**
 * Checks if 2 positions are adjacent horizontally or vertically
 */
export function areAdjacent(pos1: Position, pos2: Position): boolean {
  const rowDiff = Math.abs(pos1.row - pos2.row);
  const colDiff = Math.abs(pos1.col - pos2.col);
  return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
}

/**
 * Clones the 8x8 grid
 */
export function cloneBoard(board: (Tile | null)[][]): (Tile | null)[][] {
  return board.map((row) => row.map((tile) => (tile ? { ...tile } : null)));
}

/**
 * Detects all horizontal & vertical matches, including intersections (L, T, cross)
 */
export function findMatches(board: (Tile | null)[][]): Match[] {
  const matches: Match[] = [];
  const visitedHorizontal = new Set<string>();
  const visitedVertical = new Set<string>();

  // 1. Horizontal Matches
  for (let r = 0; r < BOARD_SIZE; r++) {
    let matchLength = 1;
    for (let c = 0; c < BOARD_SIZE; c++) {
      const current = board[r][c];
      const next = c + 1 < BOARD_SIZE ? board[r][c + 1] : null;

      if (current && next && current.type === next.type) {
        matchLength++;
      } else {
        if (matchLength >= 3 && current) {
          const matchedTiles: Tile[] = [];
          for (let i = 0; i < matchLength; i++) {
            const t = board[r][c - i];
            if (t) {
              matchedTiles.push(t);
              visitedHorizontal.add(`${t.row},${t.col}`);
            }
          }
          matches.push({
            tiles: matchedTiles,
            type: current.type,
            direction: 'HORIZONTAL',
            isSpecialCreation:
              matchLength === 4
                ? SpecialTile.LINE_BLAST_HORIZONTAL
                : matchLength >= 5
                ? SpecialTile.COLOR_BOMB
                : undefined,
          });
        }
        matchLength = 1;
      }
    }
  }

  // 2. Vertical Matches
  for (let c = 0; c < BOARD_SIZE; c++) {
    let matchLength = 1;
    for (let r = 0; r < BOARD_SIZE; r++) {
      const current = board[r][c];
      const next = r + 1 < BOARD_SIZE ? board[r + 1][c] : null;

      if (current && next && current.type === next.type) {
        matchLength++;
      } else {
        if (matchLength >= 3 && current) {
          const matchedTiles: Tile[] = [];
          for (let i = 0; i < matchLength; i++) {
            const t = board[r - i][c];
            if (t) {
              matchedTiles.push(t);
              visitedVertical.add(`${t.row},${t.col}`);
            }
          }
          matches.push({
            tiles: matchedTiles,
            type: current.type,
            direction: 'VERTICAL',
            isSpecialCreation:
              matchLength === 4
                ? SpecialTile.LINE_BLAST_VERTICAL
                : matchLength >= 5
                ? SpecialTile.COLOR_BOMB
                : undefined,
          });
        }
        matchLength = 1;
      }
    }
  }

  return matches;
}

/**
 * Finds all possible valid moves on the board
 */
export function findPossibleMoves(board: (Tile | null)[][]): { from: Position; to: Position }[] {
  const possibleMoves: { from: Position; to: Position }[] = [];

  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const current = board[r][c];
      if (!current) continue;

      // Check swap with Right
      if (c + 1 < BOARD_SIZE) {
        const testBoard = cloneBoard(board);
        swapInBoard(testBoard, { row: r, col: c }, { row: r, col: c + 1 });
        if (current.special === SpecialTile.COLOR_BOMB || (testBoard[r][c + 1]?.special === SpecialTile.COLOR_BOMB)) {
          possibleMoves.push({ from: { row: r, col: c }, to: { row: r, col: c + 1 } });
        } else if (findMatches(testBoard).length > 0) {
          possibleMoves.push({ from: { row: r, col: c }, to: { row: r, col: c + 1 } });
        }
      }

      // Check swap with Down
      if (r + 1 < BOARD_SIZE) {
        const testBoard = cloneBoard(board);
        swapInBoard(testBoard, { row: r, col: c }, { row: r + 1, col: c });
        if (current.special === SpecialTile.COLOR_BOMB || (testBoard[r + 1][c]?.special === SpecialTile.COLOR_BOMB)) {
          possibleMoves.push({ from: { row: r, col: c }, to: { row: r + 1, col: c } });
        } else if (findMatches(testBoard).length > 0) {
          possibleMoves.push({ from: { row: r, col: c }, to: { row: r + 1, col: c } });
        }
      }
    }
  }

  return possibleMoves;
}

export function swapInBoard(board: (Tile | null)[][], pos1: Position, pos2: Position) {
  const temp = board[pos1.row][pos1.col];
  board[pos1.row][pos1.col] = board[pos2.row][pos2.col];
  board[pos2.row][pos2.col] = temp;

  if (board[pos1.row][pos1.col]) {
    board[pos1.row][pos1.col]!.row = pos1.row;
    board[pos1.row][pos1.col]!.col = pos1.col;
  }
  if (board[pos2.row][pos2.col]) {
    board[pos2.row][pos2.col]!.row = pos2.row;
    board[pos2.row][pos2.col]!.col = pos2.col;
  }
}

/**
 * Creates an initial board with NO existing matches and AT LEAST one valid move.
 */
export function generatePlayableBoard(): (Tile | null)[][] {
  let board: (Tile | null)[][] = [];
  let attempts = 0;

  while (attempts < 100) {
    attempts++;
    board = [];
    for (let r = 0; r < BOARD_SIZE; r++) {
      const row: (Tile | null)[] = [];
      for (let c = 0; c < BOARD_SIZE; c++) {
        // Exclude types that would immediately create a match of 3
        const invalidTypes: TileType[] = [];
        if (c >= 2 && row[c - 1] && row[c - 2] && row[c - 1]!.type === row[c - 2]!.type) {
          invalidTypes.push(row[c - 1]!.type);
        }
        if (r >= 2 && board[r - 1][c] && board[r - 2][c] && board[r - 1][c]!.type === board[r - 2][c]!.type) {
          invalidTypes.push(board[r - 1][c]!.type);
        }

        const validTypes = ALL_TILE_TYPES.filter((t) => !invalidTypes.includes(t));
        const selectedType = validTypes[Math.floor(Math.random() * validTypes.length)] || getRandomTileType();
        row.push(createTile(r, c, selectedType));
      }
      board.push(row);
    }

    // Verify it has at least one valid move
    const moves = findPossibleMoves(board);
    if (moves.length > 0 && findMatches(board).length === 0) {
      return board;
    }
  }

  return board;
}

/**
 * Shuffles an existing board ensuring no immediate matches and at least one valid move
 */
export function shuffleBoard(board: (Tile | null)[][]): (Tile | null)[][] {
  const existingTiles: Tile[] = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c]) {
        existingTiles.push(board[r][c]!);
      }
    }
  }

  let attempts = 0;
  while (attempts < 100) {
    attempts++;
    // Shuffle tiles
    for (let i = existingTiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [existingTiles[i], existingTiles[j]] = [existingTiles[j], existingTiles[i]];
    }

    const newBoard: (Tile | null)[][] = [];
    let idx = 0;
    for (let r = 0; r < BOARD_SIZE; r++) {
      const row: (Tile | null)[] = [];
      for (let c = 0; c < BOARD_SIZE; c++) {
        const t = { ...existingTiles[idx++], row: r, col: c };
        row.push(t);
      }
      newBoard.push(row);
    }

    if (findMatches(newBoard).length === 0 && findPossibleMoves(newBoard).length > 0) {
      return newBoard;
    }
  }

  return generatePlayableBoard();
}

/**
 * Calculates score for removed tiles and cascade multiplier
 */
export function calculateMatchScore(
  tileCount: number,
  comboMultiplier: number,
  difficulty: DifficultyMode = 'NORMAL'
): number {
  let baseScore = 30;
  if (tileCount === 3) baseScore = 30;
  else if (tileCount === 4) baseScore = 60;
  else if (tileCount === 5) baseScore = 100;
  else if (tileCount >= 6) baseScore = 150 + (tileCount - 6) * 30;

  const difficultyMultiplier = difficulty === 'HARD' ? 1.5 : difficulty === 'EASY' ? 1.0 : 1.2;
  return Math.round(baseScore * Math.max(1, comboMultiplier) * difficultyMultiplier);
}
