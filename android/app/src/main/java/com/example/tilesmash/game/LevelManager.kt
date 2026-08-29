package com.example.tilesmash.game

import com.example.tilesmash.model.DifficultyMode
import kotlin.math.max

data class LevelData(
    val level: Int,
    val targetScore: Int,
    val moves: Int,
    val description: String = ""
)

object LevelManager {
    private val PRESET_BASE = listOf(
        Pair(1000, 26),
        Pair(2200, 25),
        Pair(3600, 24),
        Pair(5200, 22),
        Pair(7500, 20)
    )

    fun getLevel(levelNumber: Int, difficulty: DifficultyMode = DifficultyMode.NORMAL): LevelData {
        val (baseTarget, baseMoves) = if (levelNumber in 1..PRESET_BASE.size) {
            PRESET_BASE[levelNumber - 1]
        } else {
            val target = 7500 + (levelNumber - 5) * 2600
            val moves = max(16, 20 - ((levelNumber - 5) / 2))
            Pair(target, moves)
        }

        val scaledMoves = when (difficulty) {
            DifficultyMode.EASY -> baseMoves + 8
            DifficultyMode.NORMAL -> baseMoves
            DifficultyMode.HARD -> max(14, baseMoves - 7)
        }

        val scaledTarget = when (difficulty) {
            DifficultyMode.EASY -> (baseTarget * 0.85f).toInt()
            DifficultyMode.NORMAL -> baseTarget
            DifficultyMode.HARD -> (baseTarget * 1.35f).toInt()
        }

        return LevelData(
            level = levelNumber,
            targetScore = scaledTarget,
            moves = scaledMoves,
            description = "Level $levelNumber (${difficulty.label})"
        )
    }
}
