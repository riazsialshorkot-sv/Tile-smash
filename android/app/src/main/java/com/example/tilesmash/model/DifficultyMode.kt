package com.example.tilesmash.model

enum class DifficultyMode(val label: String, val movesDelta: Int, val scoreMultiplier: Float) {
    EASY("Easy", 8, 1.0f),
    NORMAL("Normal", 0, 1.2f),
    HARD("Hard", -8, 1.5f)
}
