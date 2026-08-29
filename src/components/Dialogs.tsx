import React from 'react';
import { Play, RotateCcw, Volume2, VolumeX, ArrowRight, Trophy, Star, Sparkles } from 'lucide-react';

interface PauseDialogProps {
  isOpen: boolean;
  onResume: () => void;
  onRestart: () => void;
  onToggleSound: () => void;
  soundEnabled: boolean;
}

export const PauseDialog: React.FC<PauseDialogProps> = ({
  isOpen,
  onResume,
  onRestart,
  onToggleSound,
  soundEnabled,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xs bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-700/80 rounded-2xl p-6 shadow-2xl flex flex-col items-center gap-5 text-center">
        <div className="w-14 h-14 rounded-2xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400 shadow-inner">
          <Play className="w-7 h-7 ml-0.5 fill-sky-400" />
        </div>

        <div>
          <h2 className="font-game text-2xl font-bold tracking-wider text-white">
            GAME PAUSED
          </h2>
          <p className="text-xs text-slate-400 mt-1">Take a breath, champion!</p>
        </div>

        <div className="w-full flex flex-col gap-2.5">
          <button
            id="btn-pause-resume"
            onClick={onResume}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40 active:scale-95 transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            Resume Game
          </button>

          <button
            id="btn-pause-restart"
            onClick={onRestart}
            className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <RotateCcw className="w-4 h-4 text-amber-400" />
            Restart Level
          </button>

          <button
            id="btn-pause-sound"
            onClick={onToggleSound}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-300 font-semibold text-xs flex items-center justify-center gap-2 transition-all"
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-emerald-400" /> Sound is ON
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-rose-400" /> Sound is MUTED
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

interface GameOverDialogProps {
  isOpen: boolean;
  score: number;
  level: number;
  targetScore: number;
  highScore: number;
  onTryAgain: () => void;
  onRestartLevel1: () => void;
}

export const GameOverDialog: React.FC<GameOverDialogProps> = ({
  isOpen,
  score,
  level,
  targetScore,
  highScore,
  onTryAgain,
  onRestartLevel1,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-sm bg-gradient-to-b from-slate-900 to-slate-950 border border-rose-500/40 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center gap-4 relative overflow-hidden">
        {/* Top Glow Header */}
        <div className="w-16 h-16 rounded-full bg-rose-500/20 border border-rose-500/50 flex items-center justify-center text-rose-400 shadow-lg shadow-rose-950/50">
          <RotateCcw className="w-8 h-8" />
        </div>

        <div>
          <h2 className="font-game text-3xl font-bold tracking-wider text-rose-400 drop-shadow">
            GAME OVER
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Out of moves on Level {level}</p>
        </div>

        {/* Score Board Card */}
        <div className="w-full bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex flex-col gap-2 shadow-inner">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Final Score:</span>
            <span className="font-game text-lg font-bold text-amber-300">{score.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Target Needed:</span>
            <span className="font-game text-sm font-semibold text-emerald-400">{targetScore.toLocaleString()}</span>
          </div>
          <div className="h-px bg-slate-800 my-1" />
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400 flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-amber-400" /> Best Record:
            </span>
            <span className="font-bold text-white">{highScore.toLocaleString()}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2.5 mt-2">
          <button
            id="btn-gameover-tryagain"
            onClick={onTryAgain}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-rose-900/40 active:scale-95 transition-all"
          >
            <RotateCcw className="w-5 h-5" />
            Try Again
          </button>

          <button
            id="btn-gameover-home"
            onClick={onRestartLevel1}
            className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-all active:scale-95"
          >
            Restart from Level 1
          </button>
        </div>
      </div>
    </div>
  );
};

interface LevelCompleteDialogProps {
  isOpen: boolean;
  level: number;
  score: number;
  bonus: number;
  totalScore: number;
  onNextLevel: () => void;
  onReplay: () => void;
}

export const LevelCompleteDialog: React.FC<LevelCompleteDialogProps> = ({
  isOpen,
  level,
  score,
  bonus,
  totalScore,
  onNextLevel,
  onReplay,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in zoom-in-95 duration-300">
      <div className="w-full max-w-sm bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-amber-400/60 rounded-3xl p-6 shadow-2xl shadow-amber-500/20 flex flex-col items-center text-center gap-4 relative overflow-hidden">
        {/* Animated Celebration Sparks */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-amber-400/10 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-emerald-400/10 rounded-full blur-xl pointer-events-none" />

        {/* Header Stars */}
        <div className="flex items-center gap-2 my-1">
          <Star className="w-8 h-8 fill-amber-400 text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)] animate-bounce" style={{ animationDelay: '0.1s' }} />
          <Star className="w-11 h-11 fill-amber-400 text-amber-200 drop-shadow-[0_0_12px_rgba(251,191,36,1)] animate-bounce" style={{ animationDelay: '0.25s' }} />
          <Star className="w-8 h-8 fill-amber-400 text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)] animate-bounce" style={{ animationDelay: '0.4s' }} />
        </div>

        <div>
          <h2 className="font-game text-3xl font-extrabold tracking-wide bg-gradient-to-r from-amber-300 via-yellow-200 to-emerald-300 bg-clip-text text-transparent drop-shadow">
            LEVEL COMPLETE!
          </h2>
          <p className="text-xs font-semibold text-emerald-400 mt-1 flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Fantastic Job! Level {level} Cleared
          </p>
        </div>

        {/* Score Summary Box */}
        <div className="w-full bg-slate-950/80 border border-slate-800/90 rounded-2xl p-4 flex flex-col gap-2 shadow-inner">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Level Score:</span>
            <span className="font-game text-base font-bold text-slate-200">{score.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Moves Left Bonus:</span>
            <span className="font-game text-base font-bold text-emerald-400">+{bonus.toLocaleString()}</span>
          </div>
          <div className="h-px bg-slate-800 my-1" />
          <div className="flex justify-between items-center text-base">
            <span className="font-bold text-amber-300">Total Score:</span>
            <span className="font-game text-xl font-black text-amber-300">{totalScore.toLocaleString()}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2.5 mt-2">
          <button
            id="btn-level-next"
            onClick={onNextLevel}
            className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-white font-extrabold text-lg flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/50 active:scale-95 transition-all"
          >
            <span>Next Level</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            id="btn-level-replay"
            onClick={onReplay}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 font-semibold text-xs transition-all active:scale-95"
          >
            Replay Level {level}
          </button>
        </div>
      </div>
    </div>
  );
};
