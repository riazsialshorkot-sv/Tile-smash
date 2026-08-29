import React, { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Tile,
  Position,
  GameState,
  FloatingScore,
  SpecialTile,
  TileType,
} from './types';
import {
  BOARD_SIZE,
  generatePlayableBoard,
  cloneBoard,
  swapInBoard,
  areAdjacent,
  findMatches,
  findPossibleMoves,
  shuffleBoard,
  calculateMatchScore,
  getLevelConfig,
  createTile,
} from './game/match3Engine';
import { soundManager } from './utils/audio';
import { TopBar } from './components/TopBar';
import { GameBoard } from './components/GameBoard';
import { GameControls } from './components/GameControls';
import { PauseDialog, GameOverDialog, LevelCompleteDialog } from './components/Dialogs';
import { AndroidProjectViewer } from './components/AndroidProjectViewer';

const STORAGE_KEY = 'tilesmash_game_data_v1';

export default function App() {
  const [gameState, setGameState] = useState<GameState>(() => {
    let savedHighScore = 0;
    let savedUnlockedLevel = 1;
    let savedSound = true;
    let savedBestScores: Record<number, number> = {};

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        savedHighScore = parsed.highScore || 0;
        savedUnlockedLevel = parsed.unlockedLevel || 1;
        savedSound = parsed.soundEnabled ?? true;
        savedBestScores = parsed.levelBestScores || {};
      }
    } catch {
      // Ignore localstorage read error
    }

    soundManager.enabled = savedSound;
    const initialLevel = 1;
    const levelConfig = getLevelConfig(initialLevel);

    return {
      board: generatePlayableBoard(),
      score: 0,
      movesRemaining: levelConfig.moves,
      currentLevel: initialLevel,
      targetScore: levelConfig.targetScore,
      comboCount: 0,
      isProcessing: false,
      isPaused: false,
      isGameOver: false,
      isLevelComplete: false,
      soundEnabled: savedSound,
      selectedTile: null,
      hintTiles: null,
      highScore: savedHighScore,
      unlockedLevel: savedUnlockedLevel,
      levelBestScores: savedBestScores,
    };
  });

  const [floatingScores, setFloatingScores] = useState<FloatingScore[]>([]);
  const [comboBanner, setComboBanner] = useState<string | null>(null);
  const [activeLineBlast, setActiveLineBlast] = useState<{ type: 'HORIZONTAL' | 'VERTICAL'; index: number } | null>(null);
  const [activeColorBlast, setActiveColorBlast] = useState<Position | null>(null);
  const [isAndroidViewerOpen, setIsAndroidViewerOpen] = useState(false);
  const [shuffleNotice, setShuffleNotice] = useState(false);

  // Save persistence on change
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          highScore: gameState.highScore,
          unlockedLevel: gameState.unlockedLevel,
          soundEnabled: gameState.soundEnabled,
          levelBestScores: gameState.levelBestScores,
        })
      );
    } catch {
      // Ignore write errors
    }
  }, [gameState.highScore, gameState.unlockedLevel, gameState.soundEnabled, gameState.levelBestScores]);

  const addFloatingScore = useCallback((text: string, row: number, col: number, color?: string, scale: number = 1) => {
    const id = `score_${Date.now()}_${Math.random()}`;
    const x = ((col + 0.5) / BOARD_SIZE) * 100;
    const y = ((row + 0.5) / BOARD_SIZE) * 100;
    setFloatingScores((prev) => [...prev, { id, text, x, y, color, scale }]);

    setTimeout(() => {
      setFloatingScores((prev) => prev.filter((item) => item.id !== id));
    }, 900);
  }, []);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#fbbf24', '#f43f5e', '#38bdf8', '#34d399', '#a855f7'],
      });
    } catch {
      // Ignore if canvas-confetti fails
    }
  };

  /**
   * Process match-3 cascades recursively
   */
  const processCascades = useCallback(
    async (
      initialBoard: (Tile | null)[][],
      comboMultiplier: number = 1,
      accumulatedScore: number = 0
    ): Promise<{ finalBoard: (Tile | null)[][]; totalScoreEarned: number }> => {
      let currentBoard = cloneBoard(initialBoard);
      const matches = findMatches(currentBoard);

      if (matches.length === 0) {
        return { finalBoard: currentBoard, totalScoreEarned: accumulatedScore };
      }

      // Show combo banner for cascade chain reactions
      if (comboMultiplier > 1) {
        setComboBanner(`COMBO x${comboMultiplier}!`);
        soundManager.playCombo(comboMultiplier);
        setTimeout(() => setComboBanner(null), 1200);
      }

      // Identify tiles to remove & special tiles to create
      const tilesToRemove = new Set<string>();
      const specialTilesToCreate: { pos: Position; special: SpecialTile; type: TileType }[] = [];

      matches.forEach((match) => {
        const matchScore = calculateMatchScore(match.tiles.length, comboMultiplier);
        accumulatedScore += matchScore;

        const centerTile = match.tiles[Math.floor(match.tiles.length / 2)];
        addFloatingScore(
          `+${matchScore}`,
          centerTile.row,
          centerTile.col,
          comboMultiplier > 1 ? '#f59e0b' : '#34d399',
          comboMultiplier > 1 ? 1.25 : 1
        );

        match.tiles.forEach((t) => {
          tilesToRemove.add(`${t.row},${t.col}`);

          // Trigger special line blast if already present on tile
          if (t.special === SpecialTile.LINE_BLAST_HORIZONTAL) {
            setActiveLineBlast({ type: 'HORIZONTAL', index: t.row });
            soundManager.playSpecial();
            for (let c = 0; c < BOARD_SIZE; c++) {
              tilesToRemove.add(`${t.row},${c}`);
            }
          } else if (t.special === SpecialTile.LINE_BLAST_VERTICAL) {
            setActiveLineBlast({ type: 'VERTICAL', index: t.col });
            soundManager.playSpecial();
            for (let r = 0; r < BOARD_SIZE; r++) {
              tilesToRemove.add(`${r},${t.col}`);
            }
          }
        });

        // Special Tile forging
        if (match.isSpecialCreation) {
          specialTilesToCreate.push({
            pos: { row: centerTile.row, col: centerTile.col },
            special: match.isSpecialCreation,
            type: match.type,
          });
        }
      });

      soundManager.playSmash(comboMultiplier);

      // Brief smash animation delay
      await new Promise((r) => setTimeout(r, 280));
      setActiveLineBlast(null);

      // Remove matched tiles
      for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
          if (tilesToRemove.has(`${r},${c}`)) {
            currentBoard[r][c] = null;
          }
        }
      }

      // Re-insert newly created special tiles at their origin
      specialTilesToCreate.forEach((spec) => {
        currentBoard[spec.pos.row][spec.pos.col] = createTile(
          spec.pos.row,
          spec.pos.col,
          spec.type,
          spec.special
        );
      });

      // Collapse columns: tiles fall down
      for (let c = 0; c < BOARD_SIZE; c++) {
        let emptyRow = BOARD_SIZE - 1;
        for (let r = BOARD_SIZE - 1; r >= 0; r--) {
          if (currentBoard[r][c] !== null) {
            if (r !== emptyRow) {
              currentBoard[emptyRow][c] = currentBoard[r][c];
              currentBoard[emptyRow][c]!.row = emptyRow;
              currentBoard[r][c] = null;
            }
            emptyRow--;
          }
        }

        // Spawn new tiles at top for empty spaces
        for (let r = emptyRow; r >= 0; r--) {
          currentBoard[r][c] = createTile(r, c);
        }
      }

      // Update state for falling tiles
      setGameState((prev) => ({
        ...prev,
        board: cloneBoard(currentBoard),
        score: prev.score + accumulatedScore,
      }));

      await new Promise((r) => setTimeout(r, 220));

      // Cascade recursion with next multiplier
      return processCascades(currentBoard, comboMultiplier + 1, accumulatedScore);
    },
    [addFloatingScore]
  );

  /**
   * Handle Swapping 2 Tiles
   */
  const handleSwap = useCallback(
    async (from: Position, to: Position) => {
      if (gameState.isProcessing || gameState.isPaused || gameState.isGameOver || gameState.isLevelComplete) {
        return;
      }

      if (!areAdjacent(from, to)) {
        setGameState((prev) => ({ ...prev, selectedTile: to, hintTiles: null }));
        return;
      }

      setGameState((prev) => ({ ...prev, isProcessing: true, selectedTile: null, hintTiles: null }));

      const testBoard = cloneBoard(gameState.board);
      const fromTile = testBoard[from.row][from.col];
      const toTile = testBoard[to.row][to.col];

      if (!fromTile || !toTile) {
        setGameState((prev) => ({ ...prev, isProcessing: false }));
        return;
      }

      // 1. Color Bomb Special Activation
      if (fromTile.special === SpecialTile.COLOR_BOMB || toTile.special === SpecialTile.COLOR_BOMB) {
        soundManager.playSpecial();
        swapInBoard(testBoard, from, to);
        setGameState((prev) => ({ ...prev, board: cloneBoard(testBoard) }));

        const targetColor = fromTile.special === SpecialTile.COLOR_BOMB ? toTile.type : fromTile.type;
        setActiveColorBlast(from);

        await new Promise((r) => setTimeout(r, 300));
        setActiveColorBlast(null);

        // Destroy all tiles of targetColor
        let removedCount = 0;
        for (let r = 0; r < BOARD_SIZE; r++) {
          for (let c = 0; c < BOARD_SIZE; c++) {
            if (testBoard[r][c]?.type === targetColor || (r === from.row && c === from.col) || (r === to.row && c === to.col)) {
              testBoard[r][c] = null;
              removedCount++;
            }
          }
        }

        const bombScore = removedCount * 40;
        addFloatingScore(`+${bombScore}`, from.row, from.col, '#ec4899', 1.3);

        // Collapse columns
        for (let c = 0; c < BOARD_SIZE; c++) {
          let emptyRow = BOARD_SIZE - 1;
          for (let r = BOARD_SIZE - 1; r >= 0; r--) {
            if (testBoard[r][c] !== null) {
              if (r !== emptyRow) {
                testBoard[emptyRow][c] = testBoard[r][c];
                testBoard[emptyRow][c]!.row = emptyRow;
                testBoard[r][c] = null;
              }
              emptyRow--;
            }
          }
          for (let r = emptyRow; r >= 0; r--) {
            testBoard[r][c] = createTile(r, c);
          }
        }

        const remainingMoves = gameState.movesRemaining - 1;
        const newScore = gameState.score + bombScore;

        const { finalBoard, totalScoreEarned } = await processCascades(testBoard, 1, 0);
        const finalScore = newScore + totalScoreEarned;

        finishTurn(finalBoard, finalScore, remainingMoves);
        return;
      }

      // 2. Normal Swap Check
      swapInBoard(testBoard, from, to);
      soundManager.playSwap();
      setGameState((prev) => ({ ...prev, board: cloneBoard(testBoard) }));

      await new Promise((r) => setTimeout(r, 200));

      const matches = findMatches(testBoard);

      if (matches.length === 0) {
        // Invalid swap - bounce back
        soundManager.playInvalidSwap();
        swapInBoard(testBoard, from, to);
        setGameState((prev) => ({
          ...prev,
          board: cloneBoard(testBoard),
          isProcessing: false,
        }));
        return;
      }

      // Valid move! Decrement move
      const remainingMoves = gameState.movesRemaining - 1;
      const { finalBoard, totalScoreEarned } = await processCascades(testBoard, 1, 0);
      const finalScore = gameState.score + totalScoreEarned;

      finishTurn(finalBoard, finalScore, remainingMoves);
    },
    [gameState, processCascades, addFloatingScore]
  );

  /**
   * Finalize the player turn: evaluate win/loss/shuffles
   */
  const finishTurn = (board: (Tile | null)[][], newScore: number, remainingMoves: number) => {
    let playableBoard = board;

    // Check if any valid moves remain on the board
    const moves = findPossibleMoves(playableBoard);
    if (moves.length === 0 && newScore < gameState.targetScore && remainingMoves > 0) {
      setShuffleNotice(true);
      playableBoard = shuffleBoard(playableBoard);
      setTimeout(() => setShuffleNotice(false), 2000);
    }

    const isComplete = newScore >= gameState.targetScore;
    const isOver = !isComplete && remainingMoves <= 0;

    let updatedHighScore = Math.max(gameState.highScore, newScore);
    let updatedUnlocked = gameState.unlockedLevel;
    let updatedBest = { ...gameState.levelBestScores };

    if (isComplete) {
      soundManager.playLevelComplete();
      triggerConfetti();
      updatedUnlocked = Math.max(gameState.unlockedLevel, gameState.currentLevel + 1);
      const prevLevelBest = updatedBest[gameState.currentLevel] || 0;
      if (newScore > prevLevelBest) {
        updatedBest[gameState.currentLevel] = newScore;
      }
    } else if (isOver) {
      soundManager.playGameOver();
    }

    setGameState((prev) => ({
      ...prev,
      board: playableBoard,
      score: newScore,
      movesRemaining: remainingMoves,
      isProcessing: false,
      isLevelComplete: isComplete,
      isGameOver: isOver,
      highScore: updatedHighScore,
      unlockedLevel: updatedUnlocked,
      levelBestScores: updatedBest,
    }));
  };

  /**
   * Tap-to-select tile click handler
   */
  const handleTileClick = (pos: Position) => {
    if (gameState.isProcessing || gameState.isPaused) return;

    if (!gameState.selectedTile) {
      soundManager.playSelect();
      setGameState((prev) => ({ ...prev, selectedTile: pos, hintTiles: null }));
    } else {
      if (gameState.selectedTile.row === pos.row && gameState.selectedTile.col === pos.col) {
        // Deselect
        setGameState((prev) => ({ ...prev, selectedTile: null }));
      } else {
        // Try swap
        handleSwap(gameState.selectedTile, pos);
      }
    }
  };

  /**
   * Swipe gesture handler
   */
  const handleTileSwipe = (from: Position, direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    let to: Position = { ...from };
    if (direction === 'UP') to.row = Math.max(0, from.row - 1);
    if (direction === 'DOWN') to.row = Math.min(BOARD_SIZE - 1, from.row + 1);
    if (direction === 'LEFT') to.col = Math.max(0, from.col - 1);
    if (direction === 'RIGHT') to.col = Math.min(BOARD_SIZE - 1, from.col + 1);

    if (to.row !== from.row || to.col !== from.col) {
      handleSwap(from, to);
    }
  };

  /**
   * Hint Button Handler
   */
  const handleHint = () => {
    if (gameState.isProcessing || gameState.isPaused) return;
    const possibleMoves = findPossibleMoves(gameState.board);

    if (possibleMoves.length > 0) {
      const hint = possibleMoves[0];
      setGameState((prev) => ({
        ...prev,
        hintTiles: [hint.from, hint.to],
        selectedTile: null,
      }));
      soundManager.playSelect();
    } else {
      // Auto shuffle
      const newBoard = shuffleBoard(gameState.board);
      setGameState((prev) => ({ ...prev, board: newBoard, hintTiles: null }));
    }
  };

  /**
   * Restart Level Handler
   */
  const handleRestart = (levelNumber?: number) => {
    const targetLevel = levelNumber ?? gameState.currentLevel;
    const levelConfig = getLevelConfig(targetLevel);

    setGameState((prev) => ({
      ...prev,
      board: generatePlayableBoard(),
      score: 0,
      movesRemaining: levelConfig.moves,
      currentLevel: targetLevel,
      targetScore: levelConfig.targetScore,
      comboCount: 0,
      isProcessing: false,
      isPaused: false,
      isGameOver: false,
      isLevelComplete: false,
      selectedTile: null,
      hintTiles: null,
    }));
  };

  /**
   * Next Level Handler
   */
  const handleNextLevel = () => {
    handleRestart(gameState.currentLevel + 1);
  };

  const handleToggleSound = () => {
    const nextVal = !gameState.soundEnabled;
    soundManager.enabled = nextVal;
    setGameState((prev) => ({ ...prev, soundEnabled: nextVal }));
  };

  const movesBonus = gameState.movesRemaining * 100;
  const totalScoreWithBonus = gameState.score + movesBonus;

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-0 sm:p-4 overflow-hidden relative font-sans select-none">
      {/* Dynamic Ambient Background Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      {/* Main Mobile Frame Shell */}
      <div className="w-full max-w-md h-screen sm:h-[92vh] sm:max-h-[820px] bg-slate-950/90 sm:border-2 sm:border-slate-800 sm:rounded-[36px] shadow-2xl flex flex-col justify-between overflow-hidden relative backdrop-blur-xl">
        {/* Top Game Bar */}
        <TopBar
          level={gameState.currentLevel}
          score={gameState.score}
          targetScore={gameState.targetScore}
          movesRemaining={gameState.movesRemaining}
          highScore={gameState.highScore}
        />

        {/* Shuffle Notice Pill */}
        {shuffleNotice && (
          <div className="absolute top-28 inset-x-0 flex justify-center z-40 animate-bounce">
            <div className="bg-amber-500 text-slate-950 font-game font-bold px-4 py-1 rounded-full shadow-lg border border-white">
              No moves! Shuffling board...
            </div>
          </div>
        )}

        {/* Center 8x8 Playable Board */}
        <GameBoard
          board={gameState.board}
          selectedTile={gameState.selectedTile}
          hintTiles={gameState.hintTiles}
          floatingScores={floatingScores}
          isProcessing={gameState.isProcessing}
          activeLineBlast={activeLineBlast}
          activeColorBlast={activeColorBlast}
          comboBanner={comboBanner}
          onTileClick={handleTileClick}
          onTileSwipe={handleTileSwipe}
          onTileSwap={handleSwap}
        />

        {/* Bottom Game Action Controls */}
        <GameControls
          onRestart={() => handleRestart()}
          onHint={handleHint}
          onToggleSound={handleToggleSound}
          onPause={() => setGameState((prev) => ({ ...prev, isPaused: true }))}
          onOpenAndroidViewer={() => setIsAndroidViewerOpen(true)}
          soundEnabled={gameState.soundEnabled}
          isProcessing={gameState.isProcessing}
          hintActive={gameState.hintTiles !== null}
        />
      </div>

      {/* Pause Dialog Modal */}
      <PauseDialog
        isOpen={gameState.isPaused}
        onResume={() => setGameState((prev) => ({ ...prev, isPaused: false }))}
        onRestart={() => handleRestart()}
        onToggleSound={handleToggleSound}
        soundEnabled={gameState.soundEnabled}
      />

      {/* Game Over Dialog Modal */}
      <GameOverDialog
        isOpen={gameState.isGameOver}
        score={gameState.score}
        level={gameState.currentLevel}
        targetScore={gameState.targetScore}
        highScore={gameState.highScore}
        onTryAgain={() => handleRestart()}
        onRestartLevel1={() => handleRestart(1)}
      />

      {/* Level Complete Celebration Dialog Modal */}
      <LevelCompleteDialog
        isOpen={gameState.isLevelComplete}
        level={gameState.currentLevel}
        score={gameState.score}
        bonus={movesBonus}
        totalScore={totalScoreWithBonus}
        onNextLevel={handleNextLevel}
        onReplay={() => handleRestart()}
      />

      {/* Android Project Source Code Viewer */}
      <AndroidProjectViewer
        isOpen={isAndroidViewerOpen}
        onClose={() => setIsAndroidViewerOpen(false)}
      />
    </div>
  );
}
