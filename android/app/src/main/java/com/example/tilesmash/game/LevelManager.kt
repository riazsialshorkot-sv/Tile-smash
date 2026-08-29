package com.example.tilesmash.game

import kotlin.math.max

data class LevelData(
    val level: Int,
    val targetScore: Int,
    val moves: Int,
    val description: String = ""
)

object LevelManager {
    private val PRESET_LEVELS = listOf(
        LevelData(1, 1000, 30, "Match 3 tiles to get started!"),
        LevelData(2, 2000, 28, "Match 4 to create a Line Blast!"),
        LevelData(3, 3500, 25, "Match 5 to forge a Color Bomb!"),
        LevelData(4, 5000, 25, "Trigger massive cascades!"),
        LevelData(5, 7500, 22, "Master the tile smashes!")
    )

    fun getLevel(levelNumber: Int): LevelData {
        if (levelNumber in 1..PRESET_LEVELS.size) {
            return PRESET_LEVELS[levelNumber - 1]
        }
        // Dynamically generated progressive levels
        val targetScore = 7500 + (levelNumber - 5) * 2800
        val moves = max(18, 22 - ((levelNumber - 5) / 2))
        return LevelData(
            level = levelNumber,
            targetScore = targetScore,
            moves = moves,
            description = "Level $levelNumber Challenge"
        )
    }
}
