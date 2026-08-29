package com.example.tilesmash.game

import android.content.Context
import android.media.AudioAttributes
import android.media.SoundPool
import android.media.ToneGenerator
import android.media.AudioManager
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class SoundEffectsManager(context: Context) {
    var isSoundEnabled: Boolean = true
    private var toneGen: ToneGenerator? = null

    init {
        try {
            toneGen = ToneGenerator(AudioManager.STREAM_MUSIC, 70)
        } catch (e: Exception) {
            toneGen = null
        }
    }

    fun playSelect() {
        if (!isSoundEnabled) return
        try {
            toneGen?.startTone(ToneGenerator.TONE_PROP_BEEP, 50)
        } catch (_: Exception) {}
    }

    fun playSwap() {
        if (!isSoundEnabled) return
        try {
            toneGen?.startTone(ToneGenerator.TONE_PROP_PROMPT, 80)
        } catch (_: Exception) {}
    }

    fun playInvalidSwap() {
        if (!isSoundEnabled) return
        try {
            toneGen?.startTone(ToneGenerator.TONE_PROP_NACK, 120)
        } catch (_: Exception) {}
    }

    fun playSmash(combo: Int = 1) {
        if (!isSoundEnabled) return
        try {
            val tone = when (combo) {
                1 -> ToneGenerator.TONE_SUP_CONFIRM
                2 -> ToneGenerator.TONE_PROP_ACK
                else -> ToneGenerator.TONE_CDMA_ALERT_AUTOREDIAL_LITE
            }
            toneGen?.startTone(tone, 100)
        } catch (_: Exception) {}
    }

    fun playSpecial() {
        if (!isSoundEnabled) return
        try {
            toneGen?.startTone(ToneGenerator.TONE_CDMA_NETWORK_USA_RINGBACK, 200)
        } catch (_: Exception) {}
    }

    fun playLevelComplete() {
        if (!isSoundEnabled) return
        try {
            toneGen?.startTone(ToneGenerator.TONE_CDMA_HIGH_PBX_L, 350)
        } catch (_: Exception) {}
    }

    fun playGameOver() {
        if (!isSoundEnabled) return
        try {
            toneGen?.startTone(ToneGenerator.TONE_CDMA_MED_PBX_SLS, 300)
        } catch (_: Exception) {}
    }

    fun release() {
        try {
            toneGen?.release()
        } catch (_: Exception) {}
    }
}
