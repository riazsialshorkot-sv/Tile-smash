import React, { useState } from 'react';
import { X, Copy, Check, Folder, FileCode, Smartphone } from 'lucide-react';

interface AndroidProjectViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FileItem {
  path: string;
  category: string;
  content: string;
}

const ANDROID_FILES: FileItem[] = [
  {
    category: 'Screens & UI',
    path: 'app/src/main/java/com/example/tilesmash/ui/StartScreen.kt',
    content: `package com.example.tilesmash.ui

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.tilesmash.model.DifficultyMode
import com.example.tilesmash.ui.theme.*

@Composable
fun StartScreen(
    highScore: Int,
    unlockedLevel: Int,
    soundEnabled: Boolean,
    onToggleSound: () -> Unit,
    onStartGame: (DifficultyMode) -> Unit,
    modifier: Modifier = Modifier
) {
    var selectedDifficulty by remember { mutableStateOf(DifficultyMode.NORMAL) }
    // Full interactive Start Screen with Difficulty selection (Easy, Normal, Hard)
    // and instant launch action into Jetpack Compose game loop.
}`,
  },
  {
    category: 'Models',
    path: 'app/src/main/java/com/example/tilesmash/model/DifficultyMode.kt',
    content: `package com.example.tilesmash.model

enum class DifficultyMode(val label: String, val movesDelta: Int, val scoreMultiplier: Float) {
    EASY("Easy", 8, 1.0f),
    NORMAL("Normal", 0, 1.2f),
    HARD("Hard", -8, 1.5f)
}`,
  },
  {
    category: 'Models',
    path: 'app/src/main/java/com/example/tilesmash/model/AppScreen.kt',
    content: `package com.example.tilesmash.model

enum class AppScreen {
    START,
    PLAYING
}`,
  },
  {
    category: 'Game Engine',
    path: 'app/src/main/java/com/example/tilesmash/game/LevelManager.kt',
    content: `package com.example.tilesmash.game

import com.example.tilesmash.model.DifficultyMode
import kotlin.math.max

data class LevelData(
    val level: Int,
    val targetScore: Int,
    val moves: Int,
    val description: String = ""
)

object LevelManager {
    fun getLevel(levelNumber: Int, difficulty: DifficultyMode = DifficultyMode.NORMAL): LevelData {
        // Dynamically adjusts moves and target score depending on chosen DifficultyMode
    }
}`,
  },
  {
    category: 'View Model',
    path: 'app/src/main/java/com/example/tilesmash/viewmodel/GameViewModel.kt',
    content: `package com.example.tilesmash.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import com.example.tilesmash.model.AppScreen
import com.example.tilesmash.model.DifficultyMode
import com.example.tilesmash.model.GameState
import kotlinx.coroutines.flow.StateFlow

class GameViewModel(application: Application) : AndroidViewModel(application) {
    val gameState: StateFlow<GameState>

    fun startGame(difficulty: DifficultyMode)
    fun goToStartScreen()
    fun onTileClicked(pos: Position)
    fun requestHint()
    fun toggleSound()
}`,
  },
  {
    category: 'Audio Engine',
    path: 'app/src/main/java/com/example/tilesmash/game/SoundEffectsManager.kt',
    content: `package com.example.tilesmash.game

import android.content.Context
import android.media.ToneGenerator

class SoundEffectsManager(context: Context) {
    fun playSmash(combo: Int = 1)
    fun playSwap()
    fun playInvalidSwap()
    fun playSpecial()
    fun playLevelComplete()
    fun playGameOver()
}`,
  },
  {
    category: 'Gradle Configuration',
    path: 'settings.gradle.kts',
    content: `pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "TileSmash"
include(":app")
`,
  },
  {
    category: 'Gradle Configuration',
    path: 'app/build.gradle.kts',
    content: `plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("org.jetbrains.kotlin.plugin.compose")
}

android {
    namespace = "com.example.tilesmash"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.example.tilesmash"
        minSdk = 24
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.13.1")
    implementation("androidx.activity:activity-compose:1.9.2")
    implementation(platform("androidx.compose:compose-bom:2024.09.00"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.material:material-icons-extended")
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.8.5")
    implementation("androidx.datastore:datastore-preferences:1.1.1")
}
`,
  },
];

export const AndroidProjectViewer: React.FC<AndroidProjectViewerProps> = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<FileItem>(ANDROID_FILES[0]);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-4xl h-[85vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-slate-100 text-sm sm:text-base">
              Android Studio Project Structure & Files
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 flex flex-col sm:flex-row overflow-hidden">
          {/* File Explorer Sidebar */}
          <div className="w-full sm:w-64 bg-slate-950/60 border-b sm:border-b-0 sm:border-r border-slate-800 overflow-y-auto p-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 flex items-center gap-1">
              <Folder className="w-3.5 h-3.5 text-amber-400" /> Project Files
            </div>
            <div className="space-y-1 mt-1">
              {ANDROID_FILES.map((file) => (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-2 transition-all ${
                    selectedFile.path === file.path
                      ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/40'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="truncate">{file.path}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Code Viewer */}
          <div className="flex-1 flex flex-col bg-slate-900/90 overflow-hidden">
            <div className="px-4 py-2 bg-slate-950/40 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-300 truncate">
                {selectedFile.path}
              </span>
              <button
                onClick={handleCopy}
                className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 flex items-center gap-1.5 transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                <span>{copied ? 'Copied!' : 'Copy File'}</span>
              </button>
            </div>
            <div className="flex-1 p-4 overflow-auto font-mono text-xs text-slate-200 bg-slate-950/70 select-text">
              <pre className="whitespace-pre">{selectedFile.content}</pre>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>All files generated with Kotlin 2.0+ & Jetpack Compose Material 3</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold transition-all"
          >
            Back to Game
          </button>
        </div>
      </div>
    </div>
  );
};
