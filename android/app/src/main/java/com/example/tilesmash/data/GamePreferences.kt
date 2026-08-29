package com.example.tilesmash.data

import android.content.Context
import android.content.SharedPreferences

class GamePreferences(context: Context) {
    private val prefs: SharedPreferences = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

    companion object {
        private const val PREFS_NAME = "tile_smash_prefs"
        private const val KEY_HIGH_SCORE = "key_high_score"
        private const val KEY_UNLOCKED_LEVEL = "key_unlocked_level"
        private const val KEY_SOUND_ENABLED = "key_sound_enabled"
        private const val PREFIX_LEVEL_SCORE = "key_level_score_"
    }

    var highScore: Int
        get() = prefs.getInt(KEY_HIGH_SCORE, 0)
        set(value) = prefs.edit().putInt(KEY_HIGH_SCORE, value).apply()

    var unlockedLevel: Int
        get() = prefs.getInt(KEY_UNLOCKED_LEVEL, 1)
        set(value) = prefs.edit().putInt(KEY_UNLOCKED_LEVEL, value).apply()

    var isSoundEnabled: Boolean
        get() = prefs.getBoolean(KEY_SOUND_ENABLED, true)
        set(value) = prefs.edit().putBoolean(KEY_SOUND_ENABLED, value).apply()

    fun getLevelBestScore(level: Int): Int {
        return prefs.getInt("$PREFIX_LEVEL_SCORE$level", 0)
    }

    fun setLevelBestScore(level: Int, score: Int) {
        val currentBest = getLevelBestScore(level)
        if (score > currentBest) {
            prefs.edit().putInt("$PREFIX_LEVEL_SCORE$level", score).apply()
        }
    }
}
