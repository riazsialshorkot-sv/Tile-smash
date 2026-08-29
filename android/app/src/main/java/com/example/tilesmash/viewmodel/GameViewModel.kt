package com.example.tilesmash.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.tilesmash.data.GamePreferences
import com.example.tilesmash.game.BoardGenerator
import com.example.tilesmash.game.LevelManager
import com.example.tilesmash.game.Match3Engine
import com.example.tilesmash.game.MatchDetector
import com.example.tilesmash.game.SoundEffectsManager
import com.example.tilesmash.model.GameState
import com.example.tilesmash.model.Position
import com.example.tilesmash.model.SpecialTile
import com.example.tilesmash.model.Tile
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import kotlin.math.max

class GameViewModel(application: Application) : AndroidViewModel(application) {

    private val preferences = GamePreferences(application)
    val soundManager = SoundEffectsManager(application)

    private val _gameState = MutableStateFlow(GameState())
    val gameState: StateFlow<GameState> = _gameState.asStateFlow()

    init {
        soundManager.isSoundEnabled = preferences.isSoundEnabled
        startLevel(1)
    }

    fun startLevel(levelNumber: Int) {
        val levelData = LevelManager.getLevel(levelNumber)
        val initialBoard = BoardGenerator.generatePlayableBoard()

        _gameState.update {
            it.copy(
                board = initialBoard,
                score = 0,
                movesRemaining = levelData.moves,
                currentLevel = levelNumber,
                targetScore = levelData.targetScore,
                comboCount = 0,
                isProcessing = false,
                isPaused = false,
                isGameOver = false,
                isLevelComplete = false,
                soundEnabled = preferences.isSoundEnabled,
                selectedTile = null,
                hintTiles = null,
                highScore = preferences.highScore,
                unlockedLevel = preferences.unlockedLevel,
                activeLineBlast = null,
                floatingScores = emptyList(),
                comboBanner = null
            )
        }
    }

    fun onTileClicked(pos: Position) {
        val state = _gameState.value
        if (state.isProcessing || state.isPaused || state.isGameOver || state.isLevelComplete) return

        if (state.selectedTile == null) {
            soundManager.playSelect()
            _gameState.update { it.copy(selectedTile = pos, hintTiles = null) }
        } else {
            if (state.selectedTile == pos) {
                // Deselect
                _gameState.update { it.copy(selectedTile = null) }
            } else if (state.selectedTile.isAdjacentTo(pos)) {
                // Try swap
                performSwap(state.selectedTile, pos)
            } else {
                // Select new
                soundManager.playSelect()
                _gameState.update { it.copy(selectedTile = pos, hintTiles = null) }
            }
        }
    }

    fun onTileSwiped(from: Position, direction: String) {
        val state = _gameState.value
        if (state.isProcessing || state.isPaused || state.isGameOver || state.isLevelComplete) return

        val to = when (direction) {
            "UP" -> Position(max(0, from.row - 1), from.col)
            "DOWN" -> Position(minOf(Match3Engine.BOARD_SIZE - 1, from.row + 1), from.col)
            "LEFT" -> Position(from.row, max(0, from.col - 1))
            "RIGHT" -> Position(from.row, minOf(Match3Engine.BOARD_SIZE - 1, from.col + 1))
            else -> from
        }

        if (to != from && from.isAdjacentTo(to)) {
            performSwap(from, to)
        }
    }

    private fun performSwap(from: Position, to: Position) {
        viewModelScope.launch {
            _gameState.update { it.copy(isProcessing = true, selectedTile = null, hintTiles = null) }

            val currentBoard = _gameState.value.board
            val fromTile = currentBoard[from.row][from.col]
            val toTile = currentBoard[to.row][to.col]

            if (fromTile == null || toTile == null) {
                _gameState.update { it.copy(isProcessing = false) }
                return@launch
            }

            // 1. Color Bomb Special handling
            if (fromTile.special == SpecialTile.COLOR_BOMB || toTile.special == SpecialTile.COLOR_BOMB) {
                soundManager.playSpecial()
                val targetType = if (fromTile.special == SpecialTile.COLOR_BOMB) toTile.type else fromTile.type
                val (newBoard, bombScore) = Match3Engine.activateColorBomb(currentBoard, from, targetType)

                _gameState.update {
                    it.copy(
                        board = newBoard,
                        score = it.score + bombScore,
                        movesRemaining = it.movesRemaining - 1
                    )
                }

                delay(250)
                runCascadesLoop(newBoard, combo = 1)
                return@launch
            }

            // 2. Standard Swap
            val swappedBoard = Match3Engine.swapTiles(currentBoard, from, to)
            soundManager.playSwap()
            _gameState.update { it.copy(board = swappedBoard) }

            delay(200)

            val matches = MatchDetector.findMatches(swappedBoard)
            if (matches.isEmpty()) {
                // Invalid swap -> swap back
                soundManager.playInvalidSwap()
                _gameState.update { it.copy(board = currentBoard, isProcessing = false) }
                return@launch
            }

            // Valid swap!
            _gameState.update { it.copy(movesRemaining = it.movesRemaining - 1) }
            runCascadesLoop(swappedBoard, combo = 1)
        }
    }

    private suspend fun runCascadesLoop(initialBoard: List<List<Tile?>>, combo: Int) {
        var currentBoard = initialBoard
        var currentCombo = combo
        var totalCascadeScore = 0

        while (true) {
            val stepResult = Match3Engine.processCascadeStep(currentBoard, currentCombo)
            if (stepResult == null) break

            totalCascadeScore += stepResult.scoreEarned
            soundManager.playSmash(currentCombo)

            val banner = if (currentCombo > 1) "COMBO x$currentCombo!" else null

            _gameState.update {
                it.copy(
                    board = stepResult.finalBoard,
                    score = it.score + stepResult.scoreEarned,
                    floatingScores = stepResult.floatingScores,
                    comboBanner = banner,
                    activeLineBlast = stepResult.triggeredSpecial
                )
            }

            if (stepResult.triggeredSpecial != null) {
                soundManager.playSpecial()
            }

            delay(260)
            _gameState.update { it.copy(activeLineBlast = null) }
            delay(100)

            currentBoard = stepResult.finalBoard
            currentCombo++
        }

        finalizeTurn(currentBoard)
    }

    private fun finalizeTurn(board: List<List<Tile?>>) {
        var playableBoard = board
        val state = _gameState.value

        // Check if any valid moves remain
        val moves = MatchDetector.findPossibleMoves(playableBoard)
        if (moves.isEmpty() && state.score < state.targetScore && state.movesRemaining > 0) {
            playableBoard = BoardGenerator.shuffleBoard(playableBoard)
        }

        val isLevelComplete = state.score >= state.targetScore
        val isGameOver = !isLevelComplete && state.movesRemaining <= 0

        if (isLevelComplete) {
            soundManager.playLevelComplete()
            val newUnlocked = max(state.unlockedLevel, state.currentLevel + 1)
            preferences.unlockedLevel = newUnlocked
            preferences.setLevelBestScore(state.currentLevel, state.score)
        } else if (isGameOver) {
            soundManager.playGameOver()
        }

        val newHigh = max(state.highScore, state.score)
        preferences.highScore = newHigh

        _gameState.update {
            it.copy(
                board = playableBoard,
                isProcessing = false,
                isLevelComplete = isLevelComplete,
                isGameOver = isGameOver,
                highScore = newHigh,
                unlockedLevel = preferences.unlockedLevel,
                comboBanner = null
            )
        }
    }

    fun requestHint() {
        val state = _gameState.value
        if (state.isProcessing || state.isPaused) return

        val moves = MatchDetector.findPossibleMoves(state.board)
        if (moves.isNotEmpty()) {
            soundManager.playSelect()
            val move = moves.first()
            _gameState.update {
                it.copy(
                    hintTiles = listOf(move.first, move.second),
                    selectedTile = null
                )
            }
        } else {
            // Auto shuffle
            val shuffled = BoardGenerator.shuffleBoard(state.board)
            _gameState.update { it.copy(board = shuffled, hintTiles = null) }
        }
    }

    fun toggleSound() {
        val newSoundState = !_gameState.value.soundEnabled
        soundManager.isSoundEnabled = newSoundState
        preferences.isSoundEnabled = newSoundState
        _gameState.update { it.copy(soundEnabled = newSoundState) }
    }

    fun pauseGame() {
        _gameState.update { it.copy(isPaused = true) }
    }

    fun resumeGame() {
        _gameState.update { it.copy(isPaused = false) }
    }

    fun restartCurrentLevel() {
        startLevel(_gameState.value.currentLevel)
    }

    fun nextLevel() {
        startLevel(_gameState.value.currentLevel + 1)
    }

    override fun onCleared() {
        super.onCleared()
        soundManager.release()
    }
}
