import React from 'react';
import { ShatterEvent, TileType } from '../types';

interface ShatterParticleOverlayProps {
  shatterEvents: ShatterEvent[];
}

const TILE_PARTICLE_COLORS: Record<TileType, { primary: string; secondary: string; light: string }> = {
  [TileType.RUBY]: { primary: '#f43f5e', secondary: '#be123c', light: '#ffe4e6' },
  [TileType.AMBER]: { primary: '#f97316', secondary: '#c2410c', light: '#ffedd5' },
  [TileType.TOPAZ]: { primary: '#eab308', secondary: '#ca8a04', light: '#fef9c3' },
  [TileType.EMERALD]: { primary: '#10b981', secondary: '#047857', light: '#d1fae5' },
  [TileType.SAPPHIRE]: { primary: '#0ea5e9', secondary: '#0369a1', light: '#e0f2fe' },
  [TileType.AMETHYST]: { primary: '#c026d3', secondary: '#7e22ce', light: '#fae8ff' },
};

const SHARD_CLIP_PATHS = [
  'polygon(50% 0%, 100% 100%, 0% 80%)',
  'polygon(20% 0%, 90% 10%, 100% 90%, 0% 70%)',
  'polygon(0% 0%, 100% 0%, 60% 100%)',
  'polygon(30% 0%, 100% 60%, 40% 100%, 0% 30%)',
  'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
];

export function generateShatterShards(row: number, col: number, type: TileType): ShatterEvent {
  const id = `shatter_${row}_${col}_${Date.now()}_${Math.random()}`;
  const colors = TILE_PARTICLE_COLORS[type] || TILE_PARTICLE_COLORS[TileType.RUBY];
  const shardCount = 14;
  const shards = [];

  for (let i = 0; i < shardCount; i++) {
    const angle = (i / shardCount) * Math.PI * 2 + (Math.random() * 0.4 - 0.2);
    const speed = 40 + Math.random() * 85;
    const colorChoice = i % 3 === 0 ? colors.light : i % 2 === 0 ? colors.primary : colors.secondary;
    const clip = SHARD_CLIP_PATHS[i % SHARD_CLIP_PATHS.length];

    shards.push({
      id: `shard_${i}`,
      x: 0,
      y: 0,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      rot: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 720,
      size: 7 + Math.random() * 9,
      color: colorChoice,
      clipPath: clip,
    });
  }

  return {
    id,
    row,
    col,
    type,
    shards,
  };
}

export const ShatterParticleOverlay: React.FC<ShatterParticleOverlayProps> = ({ shatterEvents }) => {
  if (shatterEvents.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
      {shatterEvents.map((evt) => {
        const leftPercent = ((evt.col + 0.5) / 8) * 100;
        const topPercent = ((evt.row + 0.5) / 8) * 100;
        const colors = TILE_PARTICLE_COLORS[evt.type] || TILE_PARTICLE_COLORS[TileType.RUBY];

        return (
          <div
            key={evt.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
          >
            {/* 1. Shockwave Glass Burst Ring */}
            <div
              className="absolute -inset-6 rounded-full border-2 border-white/90 shadow-[0_0_16px_rgba(255,255,255,0.9)] animate-ping"
              style={{
                animationDuration: '0.45s',
                borderColor: colors.light,
              }}
            />

            {/* 2. Center Flash Glow */}
            <div
              className="absolute w-12 h-12 -left-6 -top-6 rounded-full blur-md animate-out fade-out duration-300"
              style={{ backgroundColor: colors.primary, opacity: 0.8 }}
            />

            {/* 3. Flying Crystalline Shards */}
            {evt.shards.map((shard) => (
              <div
                key={shard.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 shadow-lg"
                style={{
                  width: `${shard.size}px`,
                  height: `${shard.size * 1.3}px`,
                  backgroundColor: shard.color,
                  clipPath: shard.clipPath,
                  boxShadow: `0 0 8px ${shard.color}`,
                  animation: `shard-fly-${shard.id} 0.6s cubic-bezier(0.12, 0, 0.39, 0) forwards`,
                }}
              >
                <style>{`
                  @keyframes shard-fly-${shard.id} {
                    0% {
                      transform: translate(0px, 0px) rotate(${shard.rot}deg) scale(1.1);
                      opacity: 1;
                    }
                    60% {
                      transform: translate(${shard.vx * 0.7}px, ${shard.vy * 0.7 + 12}px) rotate(${shard.rot + shard.rotSpeed * 0.6}deg) scale(0.9);
                      opacity: 0.9;
                    }
                    100% {
                      transform: translate(${shard.vx}px, ${shard.vy + 36}px) rotate(${shard.rot + shard.rotSpeed}deg) scale(0.3);
                      opacity: 0;
                    }
                  }
                `}</style>
                {/* Shard Glass Glint */}
                <div className="w-full h-1/2 bg-white/70" />
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};
