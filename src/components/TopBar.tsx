import React from 'react';
import { Trophy, Target, Sparkles } from 'lucide-react';

interface TopBarProps {
  level: number;
  score: number;
  targetScore: number;
  movesRemaining: number;
  highScore: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  level,
  score,
  targetScore,
  movesRemaining,
  highScore,
}) => {
  const progressPercent = Math.min(100, Math.round((score / targetScore) * 100));
  const isLowMoves = movesRemaining <= 5;

  return (
    <div className="w-full max-w-md mx-auto px-3 pt-2 pb-1 flex flex-col gap-2">
      {/* Title & Level Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center shadow-md shadow-rose-500/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-game text-xl font-bold tracking-wide bg-gradient-to-r from-amber-300 via-rose-300 to-sky-300 bg-clip-text text-transparent">
              TILE SMASH
            </h1>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Level {level}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-semibold text-amber-300 shadow-inner">
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span>Best: {highScore.toLocaleString()}</span>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-3 gap-2">
        {/* Score Card */}
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-2 flex flex-col items-center justify-center shadow-lg relative overflow-hidden">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Score
          </div>
          <div className="font-game text-lg sm:text-xl font-bold text-amber-300 tracking-tight">
            {score.toLocaleString()}
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-amber-500/10 rounded-full blur-sm" />
        </div>

        {/* Moves Card */}
        <div
          className={`border rounded-xl p-2 flex flex-col items-center justify-center shadow-lg transition-colors ${
            isLowMoves
              ? 'bg-rose-950/60 border-rose-500/80 animate-pulse text-rose-300'
              : 'bg-slate-900/90 border-slate-800/80 text-white'
          }`}
        >
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Moves
          </div>
          <div
            className={`font-game text-lg sm:text-xl font-bold ${
              isLowMoves ? 'text-rose-400' : 'text-sky-300'
            }`}
          >
            {movesRemaining}
          </div>
        </div>

        {/* Target Card */}
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-2 flex flex-col items-center justify-center shadow-lg">
          <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            <Target className="w-3 h-3 text-emerald-400" />
            Target
          </div>
          <div className="font-game text-lg sm:text-xl font-bold text-emerald-300">
            {targetScore.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Target Progress Bar */}
      <div className="w-full bg-slate-900/80 rounded-full h-3.5 p-0.5 border border-slate-800 shadow-inner relative overflow-hidden flex items-center">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 transition-all duration-300 shadow-[0_0_12px_rgba(52,211,153,0.6)]"
          style={{ width: `${progressPercent}%` }}
        />
        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
          {progressPercent}% Complete
        </span>
      </div>
    </div>
  );
};
