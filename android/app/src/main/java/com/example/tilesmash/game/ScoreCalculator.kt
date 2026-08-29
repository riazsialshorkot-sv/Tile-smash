package com.example.tilesmash.game

import kotlin.math.max

object ScoreCalculator {
    /**
     * 3 tiles: 30 points
     * 4 tiles: 60 points
     * 5 tiles: 100 points
     * 6+ tiles: 150+ points
     * Cascade bonus: x1, x2, x3, x4...
     */
    fun calculateScore(tileCount: Int, cascadeMultiplier: Int = 1): Int {
        val baseScore = when {
            tileCount <= 3 -> 30
            tileCount == 4 -> 60
            tileCount == 5 -> 100
            else -> 150 + (tileCount - 6) * 30
        }
        return baseScore * max(1, cascadeMultiplier)
    }
}
