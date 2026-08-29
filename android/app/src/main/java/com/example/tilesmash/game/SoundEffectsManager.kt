package com.example.tilesmash.game

import android.content.Context
import android.media.AudioManager
import android.media.ToneGenerator
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

class SoundEffectsManager(context: Context) {
    var isSoundEnabled: Boolean = true
    private var toneGen: ToneGenerator? = null
    private val scope = CoroutineScope(Dispatchers.Default)

    init {
        try {
            toneGen = ToneGenerator(AudioManager.STREAM_MUSIC, 80)
        } catch (_: Exception) {
            toneGen = null
        }
    }

    fun playSelect() {
        if (!isSoundEnabled) return
        try {
            toneGen?.startTone(ToneGenerator.TONE_PROP_BEEP, 40)
        } catch (_: Exception) {}
    }

    fun playSwap() {
        if (!isSoundEnabled) return
        try {
            toneGen?.startTone(ToneGenerator.TONE_PROP_PROMPT, 60)
        } catch (_: Exception) {}
    }

    fun playInvalidSwap() {
        if (!isSoundEnabled) return
        try {
            toneGen?.startTone(ToneGenerator.TONE_PROP_NACK, 120)
        } catch (_: Exception) {}
    }

    /**
     * Physical glass breaking sound effect sequence with high-pitch crystalline ring
     */
    fun playSmash(combo: Int = 1) {
        if (!isSoundEnabled) return
        scope.launch {
            try {
                // High frequency sharp glass snap & shatter
                toneGen?.startTone(ToneGenerator.TONE_CDMA_KEYPAD_VOLUME_KEY_LITE, 45)
                delay(35)
                val resonanceTone = when (combo) {
                    1 -> ToneGenerator.TONE_PROP_ACK
                    2 -> ToneGenerator.TONE_SUP_CONFIRM
                    3 -> ToneGenerator.TONE_CDMA_ALERT_AUTOREDIAL_LITE
                    else -> ToneGenerator.TONE_CDMA_HIGH_PBX_L
                }
                toneGen?.startTone(resonanceTone, 80)
            } catch (_: Exception) {}
        }
    }

    fun playSpecial() {
        if (!isSoundEnabled) return
        try {
            toneGen?.startTone(ToneGenerator.TONE_CDMA_NETWORK_USA_RINGBACK, 220)
        } catch (_: Exception) {}
    }

    fun playLevelComplete() {
        if (!isSoundEnabled) return
        scope.launch {
            try {
                toneGen?.startTone(ToneGenerator.TONE_CDMA_ALERT_AUTOREDIAL_LITE, 100)
                delay(120)
                toneGen?.startTone(ToneGenerator.TONE_CDMA_HIGH_PBX_L, 160)
                delay(160)
                toneGen?.startTone(ToneGenerator.TONE_CDMA_ALERT_CALL_GUARD, 240)
            } catch (_: Exception) {}
        }
    }

    fun playGameOver() {
        if (!isSoundEnabled) return
        scope.launch {
            try {
                toneGen?.startTone(ToneGenerator.TONE_CDMA_MED_PBX_SLS, 180)
                delay(180)
                toneGen?.startTone(ToneGenerator.TONE_PROP_NACK, 250)
            } catch (_: Exception) {}
        }
    }

    fun release() {
        try {
            toneGen?.release()
        } catch (_: Exception) {}
    }
}
