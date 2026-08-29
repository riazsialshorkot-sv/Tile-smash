package com.example.tilesmash.model

data class FloatingScore(
    val id: String,
    val text: String,
    val row: Int,
    val col: Int,
    val colorHex: Long = 0xFFFACC15
)

data class GameState(
    val screen: AppScreen = AppScreen.START,
    val difficulty: DifficultyMode = DifficultyMode.NORMAL,
    val board: List<List<Tile?>> = emptyList(),
    val score: Int = 0,
    val movesRemaining: Int = 26,
    val currentLevel: Int = 1,
    val targetScore: Int = 1000,
    val comboCount: Int = 0,
    val isProcessing: Boolean = false,
    val isPaused: Boolean = false,
    val isGameOver: Boolean = false,
    val isLevelComplete: Boolean = false,
    val soundEnabled: Boolean = true,
    val selectedTile: Position? = null,
    val hintTiles: List<Position>? = null,
    val highScore: Int = 0,
    val unlockedLevel: Int = 1,
    val levelBestScores: Map<Int, Int> = emptyMap(),
    val activeLineBlast: Pair<String, Int>? = null, // "HORIZONTAL" or "VERTICAL", index
    val floatingScores: List<FloatingScore> = emptyList(),
    val comboBanner: String? = null
)
