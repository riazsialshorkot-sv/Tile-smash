import React from 'react';
import { Tile, TileType, SpecialTile } from '../types';

interface TileComponentProps {
  tile: Tile | null;
  isSelected: boolean;
  isHinted: boolean;
  isDragging?: boolean;
  isTargetPartner?: boolean;
  offset?: { x: number; y: number } | null;
  onClick?: () => void;
  onPointerDown?: (e: React.PointerEvent<HTMLDivElement>) => void;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
}

const TILE_STYLES: Record<
  TileType,
  {
    bg: string;
    border: string;
    shadow: string;
    icon: string;
    label: string;
  }
> = {
  [TileType.RUBY]: {
    bg: 'from-rose-500 via-red-500 to-rose-700',
    border: 'border-rose-300/70',
    shadow: 'shadow-rose-950/60',
    icon: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
    label: 'Ruby',
  },
  [TileType.AMBER]: {
    bg: 'from-amber-400 via-orange-500 to-amber-600',
    border: 'border-amber-200/70',
    shadow: 'shadow-orange-950/60',
    icon: 'M12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2Z',
    label: 'Amber',
  },
  [TileType.TOPAZ]: {
    bg: 'from-yellow-300 via-amber-400 to-yellow-600',
    border: 'border-yellow-100/80',
    shadow: 'shadow-yellow-950/60',
    icon: 'M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z',
    label: 'Topaz',
  },
  [TileType.EMERALD]: {
    bg: 'from-emerald-400 via-green-500 to-emerald-700',
    border: 'border-emerald-200/70',
    shadow: 'shadow-emerald-950/60',
    icon: 'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z',
    label: 'Emerald',
  },
  [TileType.SAPPHIRE]: {
    bg: 'from-sky-400 via-blue-500 to-indigo-600',
    border: 'border-sky-200/70',
    shadow: 'shadow-blue-950/60',
    icon: 'M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z',
    label: 'Sapphire',
  },
  [TileType.AMETHYST]: {
    bg: 'from-fuchsia-400 via-purple-500 to-purple-800',
    border: 'border-purple-200/70',
    shadow: 'shadow-purple-950/60',
    icon: 'M6 2L18 2L22 8L12 22L2 8L6 2Z',
    label: 'Amethyst',
  },
};

export const TileComponent: React.FC<TileComponentProps> = ({
  tile,
  isSelected,
  isHinted,
  isDragging = false,
  isTargetPartner = false,
  offset = null,
  onClick,
  onPointerDown,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
}) => {
  if (!tile) {
    return <div className="w-full h-full rounded-xl sm:rounded-2xl bg-slate-900/40 border border-slate-800/40" />;
  }

  const style = TILE_STYLES[tile.type] || TILE_STYLES[TileType.RUBY];
  const isColorBomb = tile.special === SpecialTile.COLOR_BOMB;
  const isHorizontalLine = tile.special === SpecialTile.LINE_BLAST_HORIZONTAL;
  const isVerticalLine = tile.special === SpecialTile.LINE_BLAST_VERTICAL;

  const hasOffset = offset && (offset.x !== 0 || offset.y !== 0);

  const transformStyle: React.CSSProperties = {
    touchAction: 'none',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    ...(hasOffset
      ? {
          transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${isDragging ? 1.12 : 1.04})`,
          zIndex: isDragging ? 50 : 30,
          transition: 'none',
        }
      : {
          transition: 'transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.18s ease',
        }),
  };

  return (
    <div
      id={`tile-${tile.row}-${tile.col}`}
      onClick={onClick}
      onPointerDown={onPointerDown}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      draggable={!isDragging}
      className={`relative w-full h-full cursor-grab active:cursor-grabbing select-none rounded-xl sm:rounded-2xl flex items-center justify-center
        ${isSelected ? 'scale-110 z-20 shadow-2xl ring-4 ring-white ring-offset-2 ring-offset-slate-950' : 'hover:scale-[1.03] active:scale-95'}
        ${isHinted ? 'animate-hint ring-2 ring-yellow-300 ring-offset-1 ring-offset-slate-900 z-10' : ''}
        ${isColorBomb ? 'animate-rainbow' : ''}
        ${isDragging ? 'shadow-2xl ring-2 ring-white/90' : ''}
        ${isTargetPartner ? 'ring-2 ring-amber-300/80 shadow-lg' : ''}
      `}
      style={transformStyle}
    >
      {/* 3D Tile Background & Gradient */}
      <div
        className={`w-full h-full rounded-xl sm:rounded-2xl bg-gradient-to-b ${
          isColorBomb
            ? 'from-amber-300 via-rose-500 to-indigo-600'
            : style.bg
        } border-t-2 border-l border-b-2 border-r ${
          isColorBomb ? 'border-white/90' : style.border
        } shadow-lg ${style.shadow} flex items-center justify-center overflow-hidden relative pointer-events-none`}
      >
        {/* Glossy Top Glass Pill Reflection */}
        <div className="absolute top-1 left-1.5 right-1.5 h-1/3 rounded-t-lg bg-gradient-to-b from-white/65 to-white/5 pointer-events-none" />

        {/* Bottom Ambient Shadow for 3D Depth */}
        <div className="absolute bottom-0 inset-x-0 h-1/4 bg-black/30 rounded-b-xl pointer-events-none" />

        {/* Center SVG Icon / Glyph */}
        {!isColorBomb && (
          <svg
            viewBox="0 0 24 24"
            className="w-5 h-5 sm:w-7 sm:h-7 fill-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] transition-transform duration-150"
          >
            <path d={style.icon} />
          </svg>
        )}

        {/* Special Tile: Color Bomb */}
        {isColorBomb && (
          <div className="relative flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6 sm:w-8 sm:h-8 fill-yellow-200 drop-shadow-[0_0_8px_rgba(255,255,255,0.9)] animate-spin"
              style={{ animationDuration: '6s' }}
            >
              <path d="M12 2L14.4 7.2L20 8L16 12.1L17 17.8L12 15.2L7 17.8L8 12.1L4 8L9.6 7.2L12 2Z" />
            </svg>
            <span className="absolute text-[10px] font-black text-white uppercase tracking-tighter drop-shadow">
              ALL
            </span>
          </div>
        )}

        {/* Special Tile: Horizontal Line Blast Badge */}
        {isHorizontalLine && (
          <div className="absolute inset-0 flex items-center justify-between px-1 pointer-events-none">
            <div className="w-2 h-2 rounded-full bg-white animate-ping" />
            <div className="h-1 flex-1 mx-0.5 bg-gradient-to-r from-white via-yellow-200 to-white rounded-full shadow-[0_0_8px_#fff]" />
            <div className="w-2 h-2 rounded-full bg-white animate-ping" />
          </div>
        )}

        {/* Special Tile: Vertical Line Blast Badge */}
        {isVerticalLine && (
          <div className="absolute inset-0 flex flex-col items-center justify-between py-1 pointer-events-none">
            <div className="w-2 h-2 rounded-full bg-white animate-ping" />
            <div className="w-1 flex-1 my-0.5 bg-gradient-to-b from-white via-yellow-200 to-white rounded-full shadow-[0_0_8px_#fff]" />
            <div className="w-2 h-2 rounded-full bg-white animate-ping" />
          </div>
        )}

        {/* Pulsing Sparkle Overlay for Special Tiles */}
        {(isHorizontalLine || isVerticalLine) && (
          <div className="absolute inset-0 rounded-xl bg-white/20 animate-pulse pointer-events-none" />
        )}
      </div>
    </div>
  );
};
