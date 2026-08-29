import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Tile, Position, FloatingScore, ShatterEvent } from '../types';
import { TileComponent } from './TileComponent';
import { ShatterParticleOverlay } from './ShatterParticleOverlay';
import { BOARD_SIZE, areAdjacent } from '../game/match3Engine';

interface GameBoardProps {
  board: (Tile | null)[][];
  selectedTile: Position | null;
  hintTiles: Position[] | null;
  floatingScores: FloatingScore[];
  shatterEvents?: ShatterEvent[];
  isProcessing: boolean;
  activeLineBlast: { type: 'HORIZONTAL' | 'VERTICAL'; index: number } | null;
  activeColorBlast: Position | null;
  comboBanner: string | null;
  onTileClick: (pos: Position) => void;
  onTileSwipe: (from: Position, direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => void;
  onTileSwap?: (from: Position, to: Position) => void;
}

interface DragState {
  from: Position;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  pointerId: number;
  target: Position | null;
  offsetX: number;
  offsetY: number;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  board,
  selectedTile,
  hintTiles,
  floatingScores,
  shatterEvents = [],
  isProcessing,
  activeLineBlast,
  activeColorBlast,
  comboBanner,
  onTileClick,
  onTileSwipe,
  onTileSwap,
}) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [draggedHtmlTile, setDraggedHtmlTile] = useState<Position | null>(null);

  // Measure cell size dynamically for proportional offsets
  const getCellSize = useCallback((): number => {
    if (boardRef.current) {
      return (boardRef.current.clientWidth - 20) / BOARD_SIZE;
    }
    return 44;
  }, []);

  const handlePointerDown = (row: number, col: number, e: React.PointerEvent<HTMLDivElement>) => {
    if (isProcessing) return;
    if (board[row][col] === null) return;

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture fails on certain platforms
    }

    setDragState({
      from: { row, col },
      startX: e.clientX,
      startY: e.clientY,
      currentX: e.clientX,
      currentY: e.clientY,
      pointerId: e.pointerId,
      target: null,
      offsetX: 0,
      offsetY: 0,
    });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState || isProcessing || dragState.pointerId !== e.pointerId) return;

    const cellSize = getCellSize();
    const rawDx = e.clientX - dragState.startX;
    const rawDy = e.clientY - dragState.startY;
    const absDx = Math.abs(rawDx);
    const absDy = Math.abs(rawDy);

    let target: Position | null = null;
    let offsetX = 0;
    let offsetY = 0;

    const { row, col } = dragState.from;

    if (absDx > absDy) {
      // Horizontal dominant drag
      if (rawDx > 0) {
        if (col < BOARD_SIZE - 1) {
          target = { row, col: col + 1 };
          offsetX = Math.min(rawDx, cellSize);
        } else {
          offsetX = rawDx * 0.15; // Edge friction resistance
        }
      } else {
        if (col > 0) {
          target = { row, col: col - 1 };
          offsetX = Math.max(rawDx, -cellSize);
        } else {
          offsetX = rawDx * 0.15; // Edge friction resistance
        }
      }
    } else {
      // Vertical dominant drag
      if (rawDy > 0) {
        if (row < BOARD_SIZE - 1) {
          target = { row: row + 1, col };
          offsetY = Math.min(rawDy, cellSize);
        } else {
          offsetY = rawDy * 0.15; // Edge friction resistance
        }
      } else {
        if (row > 0) {
          target = { row: row - 1, col };
          offsetY = Math.max(rawDy, -cellSize);
        } else {
          offsetY = rawDy * 0.15; // Edge friction resistance
        }
      }
    }

    setDragState((prev) =>
      prev
        ? {
            ...prev,
            currentX: e.clientX,
            currentY: e.clientY,
            target,
            offsetX,
            offsetY,
          }
        : null
    );
  };

  const handlePointerUpOrCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState || dragState.pointerId !== e.pointerId) return;

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }

    const { from, startX, startY, currentX, currentY, target } = dragState;
    const cellSize = getCellSize();
    const dx = currentX - startX;
    const dy = currentY - startY;
    const distance = Math.hypot(dx, dy);
    const swapThreshold = Math.max(18, cellSize * 0.35);

    setDragState(null);

    if (isProcessing) return;

    if (distance < 10) {
      // Crisp Tap / Click
      onTileClick(from);
    } else if (distance >= swapThreshold && target) {
      // Drag / Swipe exchange
      if (onTileSwap) {
        onTileSwap(from, target);
      } else {
        // Fallback to swipe direction
        const absDx = Math.abs(dx);
        const absDy = Math.abs(dy);
        if (absDx > absDy) {
          onTileSwipe(from, dx > 0 ? 'RIGHT' : 'LEFT');
        } else {
          onTileSwipe(from, dy > 0 ? 'DOWN' : 'UP');
        }
      }
    } else if (distance >= 14) {
      // Smaller swipe gesture recognition
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);
      if (absDx > absDy) {
        onTileSwipe(from, dx > 0 ? 'RIGHT' : 'LEFT');
      } else {
        onTileSwipe(from, dy > 0 ? 'DOWN' : 'UP');
      }
    }
  };

  // HTML5 Drag and Drop Support
  const handleHtmlDragStart = (r: number, c: number, e: React.DragEvent<HTMLDivElement>) => {
    if (isProcessing) return;
    setDraggedHtmlTile({ row: r, col: c });
    e.dataTransfer.setData('text/plain', JSON.stringify({ row: r, col: c }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleHtmlDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleHtmlDrop = (r: number, c: number, e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (isProcessing) return;

    let fromPos: Position | null = draggedHtmlTile;
    if (!fromPos) {
      try {
        fromPos = JSON.parse(e.dataTransfer.getData('text/plain'));
      } catch {
        fromPos = null;
      }
    }

    if (fromPos && (fromPos.row !== r || fromPos.col !== c)) {
      if (areAdjacent(fromPos, { row: r, col: c })) {
        if (onTileSwap) {
          onTileSwap(fromPos, { row: r, col: c });
        } else {
          onTileClick(fromPos);
          onTileClick({ row: r, col: c });
        }
      }
    }
    setDraggedHtmlTile(null);
  };

  const isPositionHinted = (r: number, c: number): boolean => {
    if (!hintTiles) return false;
    return hintTiles.some((pos) => pos.row === r && pos.col === c);
  };

  const isPositionSelected = (r: number, c: number): boolean => {
    if (!selectedTile) return false;
    return selectedTile.row === r && selectedTile.col === c;
  };

  // Calculate live drag offsets for source tile and partner tile
  const getTileDragProps = (r: number, c: number) => {
    if (!dragState) {
      return { isDragging: false, isTargetPartner: false, offset: null };
    }

    const isSource = dragState.from.row === r && dragState.from.col === c;
    const isTarget = dragState.target && dragState.target.row === r && dragState.target.col === c;

    if (isSource) {
      return {
        isDragging: true,
        isTargetPartner: false,
        offset: { x: dragState.offsetX, y: dragState.offsetY },
      };
    }

    if (isTarget) {
      return {
        isDragging: false,
        isTargetPartner: true,
        offset: { x: -dragState.offsetX, y: -dragState.offsetY },
      };
    }

    return { isDragging: false, isTargetPartner: false, offset: null };
  };

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center p-2 relative">
      {/* Combo Banner Animation */}
      {comboBanner && (
        <div className="absolute top-0 z-40 transform -translate-y-2 pointer-events-none animate-bounce">
          <div className="bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 text-white font-game text-xl sm:text-2xl font-black px-5 py-1.5 rounded-full shadow-2xl border-2 border-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
            {comboBanner}
          </div>
        </div>
      )}

      {/* Outer 8x8 Board Container */}
      <div
        ref={boardRef}
        id="game-board-container"
        onPointerMove={handlePointerMove}
        className="w-full max-w-[390px] aspect-square bg-slate-900/95 border-2 border-slate-700/80 rounded-3xl p-2.5 shadow-2xl shadow-slate-950/80 relative flex items-center justify-center overflow-hidden touch-none"
      >
        {/* Subtle grid background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />

        {/* 8x8 Grid */}
        <div className="grid grid-cols-8 grid-rows-8 gap-1 sm:gap-1.5 w-full h-full relative z-10">
          {board.map((rowTiles, r) =>
            rowTiles.map((tile, c) => {
              const dragProps = getTileDragProps(r, c);
              return (
                <div
                  key={`cell-${r}-${c}`}
                  className="w-full h-full relative"
                  onPointerUp={handlePointerUpOrCancel}
                  onPointerCancel={handlePointerUpOrCancel}
                >
                  <TileComponent
                    tile={tile}
                    isSelected={isPositionSelected(r, c)}
                    isHinted={isPositionHinted(r, c)}
                    isDragging={dragProps.isDragging}
                    isTargetPartner={dragProps.isTargetPartner}
                    offset={dragProps.offset}
                    onPointerDown={(e) => handlePointerDown(r, c, e)}
                    onDragStart={(e) => handleHtmlDragStart(r, c, e)}
                    onDragOver={handleHtmlDragOver}
                    onDrop={(e) => handleHtmlDrop(r, c, e)}
                  />
                </div>
              );
            })
          )}
        </div>

        {/* Active Line Blast Laser Beam Effect */}
        {activeLineBlast && activeLineBlast.type === 'HORIZONTAL' && (
          <div
            className="absolute left-0 right-0 h-4 bg-gradient-to-r from-transparent via-yellow-200 to-transparent shadow-[0_0_24px_#fff] z-30 pointer-events-none animate-pulse"
            style={{
              top: `${((activeLineBlast.index + 0.5) / BOARD_SIZE) * 100}%`,
              transform: 'translateY(-50%)',
            }}
          />
        )}
        {activeLineBlast && activeLineBlast.type === 'VERTICAL' && (
          <div
            className="absolute top-0 bottom-0 w-4 bg-gradient-to-b from-transparent via-yellow-200 to-transparent shadow-[0_0_24px_#fff] z-30 pointer-events-none animate-pulse"
            style={{
              left: `${((activeLineBlast.index + 0.5) / BOARD_SIZE) * 100}%`,
              transform: 'translateX(-50%)',
            }}
          />
        )}

        {/* Dynamic Glass Breaking Shatter Particle Overlay */}
        <ShatterParticleOverlay shatterEvents={shatterEvents} />

        {/* Floating Scores Overlay */}
        {floatingScores.map((item) => (
          <div
            key={item.id}
            className="absolute font-game font-black text-lg sm:text-xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] pointer-events-none z-40 transition-all duration-700 ease-out"
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              color: item.color || '#facc15',
              transform: `translate(-50%, -50%) scale(${item.scale || 1})`,
              animation: 'float-up 0.8s ease-out forwards',
            }}
          >
            {item.text}
          </div>
        ))}
      </div>
    </div>
  );
};
