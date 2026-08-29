import React from 'react';
import { RotateCcw, Lightbulb, Volume2, VolumeX, Pause, Code2 } from 'lucide-react';

interface GameControlsProps {
  onRestart: () => void;
  onHint: () => void;
  onToggleSound: () => void;
  onPause: () => void;
  onOpenAndroidViewer?: () => void;
  soundEnabled: boolean;
  isProcessing: boolean;
  hintActive: boolean;
}

export const GameControls: React.FC<GameControlsProps> = ({
  onRestart,
  onHint,
  onToggleSound,
  onPause,
  onOpenAndroidViewer,
  soundEnabled,
  isProcessing,
  hintActive,
}) => {
  return (
    <div className="w-full max-w-md mx-auto px-3 py-2 flex items-center justify-between gap-2">
      {/* Restart Button */}
      <button
        id="btn-restart"
        onClick={onRestart}
        disabled={isProcessing}
        title="Restart Game"
        className="flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-slate-900/90 hover:bg-slate-800 active:scale-95 border border-slate-800 text-slate-300 hover:text-white transition-all disabled:opacity-50 disabled:pointer-events-none shadow-md"
      >
        <RotateCcw className="w-5 h-5 text-amber-400 mb-0.5" />
        <span className="text-[10px] font-bold tracking-tight">Restart</span>
      </button>

      {/* Hint Button */}
      <button
        id="btn-hint"
        onClick={onHint}
        disabled={isProcessing}
        title="Get a Move Hint"
        className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl active:scale-95 border transition-all disabled:opacity-50 disabled:pointer-events-none shadow-md ${
          hintActive
            ? 'bg-amber-500/20 border-amber-400 text-amber-300 ring-2 ring-amber-400/40'
            : 'bg-slate-900/90 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white'
        }`}
      >
        <Lightbulb className={`w-5 h-5 mb-0.5 ${hintActive ? 'text-yellow-300 animate-bounce' : 'text-yellow-400'}`} />
        <span className="text-[10px] font-bold tracking-tight">Hint</span>
      </button>

      {/* Sound Toggle Button */}
      <button
        id="btn-sound"
        onClick={onToggleSound}
        title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
        className="flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-slate-900/90 hover:bg-slate-800 active:scale-95 border border-slate-800 text-slate-300 hover:text-white transition-all shadow-md"
      >
        {soundEnabled ? (
          <Volume2 className="w-5 h-5 text-emerald-400 mb-0.5" />
        ) : (
          <VolumeX className="w-5 h-5 text-rose-400 mb-0.5" />
        )}
        <span className="text-[10px] font-bold tracking-tight">
          {soundEnabled ? 'Sound ON' : 'Muted'}
        </span>
      </button>

      {/* Pause Button */}
      <button
        id="btn-pause"
        onClick={onPause}
        title="Pause Game"
        className="flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-slate-900/90 hover:bg-slate-800 active:scale-95 border border-slate-800 text-slate-300 hover:text-white transition-all shadow-md"
      >
        <Pause className="w-5 h-5 text-sky-400 mb-0.5" />
        <span className="text-[10px] font-bold tracking-tight">Pause</span>
      </button>

      {/* Android Project Source Code Button */}
      {onOpenAndroidViewer && (
        <button
          id="btn-android-code"
          onClick={onOpenAndroidViewer}
          title="View Android Studio Source Files"
          className="flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-gradient-to-tr from-emerald-950 to-teal-900/80 hover:from-emerald-900 hover:to-teal-800 active:scale-95 border border-emerald-500/40 text-emerald-300 hover:text-emerald-200 transition-all shadow-md"
        >
          <Code2 className="w-5 h-5 text-emerald-400 mb-0.5" />
          <span className="text-[10px] font-bold tracking-tight">Playing</span>
        </button>
      )}
    </div>
  );
};
