import React, { useState } from 'react';
import { DifficultyMode } from '../types';
import { Play, Trophy, Volume2, VolumeX, Sparkles, Shield, Flame, Star, Info, HelpCircle } from 'lucide-react';

const START_POSTER_SRC = '/start-poster.jpg';
const APP_ICON_SRC = '/app-icon.jpg';

interface StartScreenProps {
  onStartGame: (difficulty: DifficultyMode) => void;
  highScore: number;
  unlockedLevel: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenAndroidViewer: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  onStartGame,
  highScore,
  unlockedLevel,
  soundEnabled,
  onToggleSound,
  onOpenAndroidViewer,
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyMode>('NORMAL');
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  const DIFFICULTY_OPTIONS: {
    id: DifficultyMode;
    label: string;
    badge: string;
    movesDesc: string;
    subDesc: string;
    gradient: string;
    border: string;
    icon: React.ReactNode;
    ringColor: string;
  }[] = [
    {
      id: 'EASY',
      label: 'Easy Mode',
      badge: 'Relaxed & Fun',
      movesDesc: '35 Moves / Level',
      subDesc: 'Generous move counts & relaxed scoring goals.',
      gradient: 'from-emerald-950/90 via-teal-900/80 to-slate-900/90',
      border: 'border-emerald-500/50',
      icon: <Shield className="w-5 h-5 text-emerald-400" />,
      ringColor: 'ring-emerald-400',
    },
    {
      id: 'NORMAL',
      label: 'Normal Mode',
      badge: 'Classic Balance',
      movesDesc: '26 Moves / Level',
      subDesc: 'Classic Match-3 strategy with balanced targets.',
      gradient: 'from-amber-950/90 via-orange-900/80 to-slate-900/90',
      border: 'border-amber-500/60',
      icon: <Star className="w-5 h-5 text-amber-400" />,
      ringColor: 'ring-amber-400',
    },
    {
      id: 'HARD',
      label: 'Hard Mode',
      badge: 'Master Challenge',
      movesDesc: '18 Moves + 1.5x Multiplier',
      subDesc: 'Fast-paced puzzle test with 1.5x score bonus.',
      gradient: 'from-rose-950/90 via-red-900/80 to-slate-900/90',
      border: 'border-rose-500/60',
      icon: <Flame className="w-5 h-5 text-rose-400" />,
      ringColor: 'ring-rose-400',
    },
  ];

  return (
    <div className="relative w-full min-h-screen bg-slate-950 flex flex-col items-center justify-center p-3 sm:p-6 overflow-x-hidden">
      {/* Background Poster Artwork */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <img
          src={START_POSTER_SRC}
          alt="Tile Smash Background"
          className="w-full h-full object-cover opacity-35 scale-105 blur-[2px]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/70 to-slate-950/95" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-md flex flex-col items-center gap-4 my-auto">
        {/* Top Header Utilities */}
        <div className="w-full flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-amber-300 text-xs font-bold shadow-md">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>High Score: {highScore.toLocaleString()}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-toggle-sound-start"
              onClick={onToggleSound}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/70 text-slate-300 hover:text-white transition-all active:scale-95 shadow-md"
              title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
            </button>
            <button
              id="btn-how-to-play"
              onClick={() => setShowHowToPlay(true)}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/70 text-slate-300 hover:text-white transition-all active:scale-95 shadow-md"
              title="How to Play"
            >
              <HelpCircle className="w-4 h-4 text-sky-400" />
            </button>
          </div>
        </div>

        {/* Hero Branding Plaque */}
        <div className="flex flex-col items-center text-center mt-2 group">
          {/* Glowing App Icon Emblem */}
          <div className="relative mb-2">
            <div className="absolute -inset-2 bg-gradient-to-tr from-amber-500 via-rose-500 to-sky-500 rounded-3xl blur-md opacity-60 group-hover:opacity-80 transition duration-500" />
            <img
              src={APP_ICON_SRC}
              alt="Tile Smash Icon"
              className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl sm:rounded-3xl border-2 border-yellow-300/80 shadow-2xl object-cover transform transition-transform hover:scale-105 duration-300"
            />
          </div>

          {/* Title Text */}
          <h1 className="font-game text-3xl sm:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-rose-400 drop-shadow-[0_4px_12px_rgba(245,158,11,0.5)]">
            SMASH TILE
          </h1>
          <p className="text-xs text-slate-300 font-semibold tracking-wide mt-0.5">
            Crystalline Match-3 with Glass Shattering Physics
          </p>
        </div>

        {/* Difficulty Selection Section */}
        <div className="w-full bg-slate-900/90 border border-slate-800/90 rounded-2xl p-3.5 shadow-2xl backdrop-blur-md flex flex-col gap-2.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Choose Difficulty
            </span>
            <span className="text-[11px] font-semibold text-sky-400">
              Unlocked Level: {unlockedLevel}
            </span>
          </div>

          {/* Difficulty Cards */}
          <div className="flex flex-col gap-2">
            {DIFFICULTY_OPTIONS.map((opt) => {
              const isSelected = selectedDifficulty === opt.id;
              return (
                <button
                  key={opt.id}
                  id={`btn-difficulty-${opt.id.toLowerCase()}`}
                  onClick={() => setSelectedDifficulty(opt.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all duration-200 relative overflow-hidden bg-gradient-to-r ${
                    opt.gradient
                  } ${
                    isSelected
                      ? `${opt.border} ring-2 ${opt.ringColor} shadow-lg scale-[1.01]`
                      : 'border-slate-800/80 hover:border-slate-700 opacity-75 hover:opacity-95'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-black/40 border border-white/10">
                        {opt.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">
                            {opt.label}
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-white/15 text-slate-200">
                            {opt.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-0.5">
                          {opt.subDesc}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-black text-amber-300">
                        {opt.movesDesc}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Big Launch Play Button */}
          <button
            id="btn-start-playing"
            onClick={() => onStartGame(selectedDifficulty)}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:via-orange-400 hover:to-rose-400 active:scale-[0.98] text-white font-game text-lg font-black tracking-wide uppercase shadow-xl shadow-orange-500/30 border-t border-yellow-200/80 flex items-center justify-center gap-2.5 transition-all mt-1 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-white" />
            Play {selectedDifficulty} Mode
          </button>
        </div>

        {/* Bottom Android Project Link & Info */}
        <div className="w-full flex items-center justify-between text-xs text-slate-400 px-2">
          <span>Match 4+ for Line Blast & Color Bombs</span>
          <button
            id="btn-open-android-code-start"
            onClick={onOpenAndroidViewer}
            className="text-emerald-400 hover:text-emerald-300 font-semibold underline transition-colors"
          >
            Android APK Code
          </button>
        </div>
      </div>

      {/* How to Play Modal */}
      {showHowToPlay && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-5 max-w-sm w-full shadow-2xl flex flex-col gap-3.5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-game text-xl text-amber-300 font-bold flex items-center gap-2">
                <Info className="w-5 h-5 text-sky-400" />
                How to Play
              </h3>
              <button
                onClick={() => setShowHowToPlay(false)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-2.5 text-xs text-slate-300">
              <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <strong className="text-white block font-semibold">Click & Drag to Swap:</strong>
                  Drag any tile or click 2 adjacent tiles to trade positions and form rows or columns of 3+ matching gems.
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-rose-500 text-white font-black flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <strong className="text-white block font-semibold">Glass Smashing Cascades:</strong>
                  Shatter tiles with realistic glass crunch audio and spark physics. Gravity pulls new tiles downward for chain reaction combos!
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-purple-500 text-white font-black flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <strong className="text-white block font-semibold">Special Tiles:</strong>
                  Match 4 to craft a <strong>Line Blast</strong> laser tile. Match 5 to forge a prismatic <strong>Color Bomb</strong>!
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowHowToPlay(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition-all"
            >
              Got It!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
