package com.example.tilesmash.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import com.example.tilesmash.model.AppScreen
import com.example.tilesmash.ui.theme.Slate950
import com.example.tilesmash.viewmodel.GameViewModel

@Composable
fun GameScreen(
    viewModel: GameViewModel,
    modifier: Modifier = Modifier
) {
    val state by viewModel.gameState.collectAsState()

    // 1. Render Start Screen
    if (state.screen == AppScreen.START) {
        StartScreen(
            highScore = state.highScore,
            unlockedLevel = state.unlockedLevel,
            soundEnabled = state.soundEnabled,
            onToggleSound = { viewModel.toggleSound() },
            onStartGame = { difficulty -> viewModel.startGame(difficulty) },
            modifier = modifier
        )
        return
    }

    // 2. Render Active Gameplay Screen
    Box(
        modifier = modifier
            .fillMaxSize()
            .background(Slate950),
        contentAlignment = Alignment.Center
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .navigationBarsPadding()
                .statusBarsPadding(),
            verticalArrangement = Arrangement.SpaceBetween,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Top Section with Home Button & Difficulty badge
            TopBar(
                level = state.currentLevel,
                score = state.score,
                targetScore = state.targetScore,
                movesRemaining = state.movesRemaining,
                highScore = state.highScore,
                difficulty = state.difficulty,
                onHome = { viewModel.goToStartScreen() }
            )

            // Main Section: 8x8 Board
            GameBoard(
                board = state.board,
                selectedTile = state.selectedTile,
                hintTiles = state.hintTiles,
                floatingScores = state.floatingScores,
                comboBanner = state.comboBanner,
                activeLineBlast = state.activeLineBlast,
                onTileClick = { pos -> viewModel.onTileClicked(pos) },
                onTileSwipe = { pos, dir -> viewModel.onTileSwiped(pos, dir) }
            )

            // Bottom Section: Controls
            GameControls(
                onRestart = { viewModel.restartCurrentLevel() },
                onHint = { viewModel.requestHint() },
                onToggleSound = { viewModel.toggleSound() },
                onPause = { viewModel.pauseGame() },
                soundEnabled = state.soundEnabled,
                isProcessing = state.isProcessing,
                isHintActive = state.hintTiles != null
            )
        }

        // Dialogs
        PauseDialog(
            isOpen = state.isPaused,
            soundEnabled = state.soundEnabled,
            onResume = { viewModel.resumeGame() },
            onRestart = { viewModel.restartCurrentLevel() },
            onHome = { viewModel.goToStartScreen() },
            onToggleSound = { viewModel.toggleSound() }
        )

        GameOverDialog(
            isOpen = state.isGameOver,
            finalScore = state.score,
            level = state.currentLevel,
            targetScore = state.targetScore,
            highScore = state.highScore,
            onTryAgain = { viewModel.restartCurrentLevel() },
            onRestartFromLevel1 = { viewModel.startLevel(1, state.difficulty) },
            onHome = { viewModel.goToStartScreen() }
        )

        val movesBonus = state.movesRemaining * 100
        LevelCompleteDialog(
            isOpen = state.isLevelComplete,
            level = state.currentLevel,
            score = state.score,
            movesBonus = movesBonus,
            totalScore = state.score + movesBonus,
            onNextLevel = { viewModel.nextLevel() },
            onReplay = { viewModel.restartCurrentLevel() },
            onHome = { viewModel.goToStartScreen() }
        )
    }
}
