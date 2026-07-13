package com.camaplus.app.speech

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.speech.RecognitionListener
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer
import java.util.Locale

/**
 * Android SpeechRecognizer wrapper for ko-KR STT.
 * All public methods must be called on the main thread.
 */
class SpeechRecognitionHelper(
    private val context: Context,
    private val listener: Listener,
) {
    interface Listener {
        fun onStarted()
        fun onPartial(transcript: String)
        fun onFinal(transcript: String)
        fun onEnded()
        fun onError(code: String, message: String)
    }

    private val mainHandler = Handler(Looper.getMainLooper())
    private var recognizer: SpeechRecognizer? = null
    private var listening = false
    private var maxDurationMs = 60_000L
    private var timeoutRunnable: Runnable? = null

    fun isAvailable(): Boolean = SpeechRecognizer.isRecognitionAvailable(context)

    fun start(
        locale: String = "ko-KR",
        partialResults: Boolean = true,
        prompt: String? = null,
        maxDurationMs: Int = 60_000,
    ) {
        if (!isAvailable()) {
            listener.onError("UNAVAILABLE", "Speech recognition is not available on this device")
            return
        }
        if (listening) {
            stopInternal(cancel = true)
        }

        this.maxDurationMs = maxDurationMs.coerceIn(5_000, 120_000).toLong()

        val speechRecognizer = SpeechRecognizer.createSpeechRecognizer(context)
        recognizer = speechRecognizer
        speechRecognizer.setRecognitionListener(createRecognitionListener())

        val intent =
            Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
                putExtra(
                    RecognizerIntent.EXTRA_LANGUAGE_MODEL,
                    RecognizerIntent.LANGUAGE_MODEL_FREE_FORM,
                )
                putExtra(RecognizerIntent.EXTRA_LANGUAGE, locale.ifBlank { "ko-KR" })
                putExtra(RecognizerIntent.EXTRA_LANGUAGE_PREFERENCE, locale.ifBlank { "ko-KR" })
                putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, partialResults)
                putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 1)
                putExtra(RecognizerIntent.EXTRA_CALLING_PACKAGE, context.packageName)
                if (!prompt.isNullOrBlank()) {
                    putExtra(RecognizerIntent.EXTRA_PROMPT, prompt)
                }
            }

        listening = true
        speechRecognizer.startListening(intent)
        scheduleTimeout()
    }

    fun stop() {
        if (!listening) {
            return
        }
        clearTimeout()
        try {
            recognizer?.stopListening()
        } catch (_: Exception) {
            stopInternal(cancel = true)
            listener.onEnded()
        }
    }

    fun cancel() {
        stopInternal(cancel = true)
        listener.onEnded()
    }

    fun destroy() {
        stopInternal(cancel = true)
    }

    private fun stopInternal(cancel: Boolean) {
        clearTimeout()
        listening = false
        try {
            if (cancel) {
                recognizer?.cancel()
            }
            recognizer?.destroy()
        } catch (_: Exception) {
            // ignore
        }
        recognizer = null
    }

    private fun scheduleTimeout() {
        clearTimeout()
        val runnable =
            Runnable {
                if (listening) {
                    try {
                        recognizer?.stopListening()
                    } catch (_: Exception) {
                        stopInternal(cancel = true)
                        listener.onError("TIMEOUT", "Speech recognition timed out")
                        listener.onEnded()
                    }
                }
            }
        timeoutRunnable = runnable
        mainHandler.postDelayed(runnable, maxDurationMs)
    }

    private fun clearTimeout() {
        timeoutRunnable?.let { mainHandler.removeCallbacks(it) }
        timeoutRunnable = null
    }

    private fun createRecognitionListener(): RecognitionListener {
        return object : RecognitionListener {
            override fun onReadyForSpeech(params: Bundle?) {
                listener.onStarted()
            }

            override fun onBeginningOfSpeech() = Unit

            override fun onRmsChanged(rmsdB: Float) = Unit

            override fun onBufferReceived(buffer: ByteArray?) = Unit

            override fun onEndOfSpeech() = Unit

            override fun onError(error: Int) {
                val (code, message) = mapError(error)
                listening = false
                clearTimeout()
                try {
                    recognizer?.destroy()
                } catch (_: Exception) {
                    // ignore
                }
                recognizer = null
                // NO_MATCH / SPEECH_TIMEOUT are soft errors — still end session
                listener.onError(code, message)
                listener.onEnded()
            }

            override fun onResults(results: Bundle?) {
                val text = extractBestResult(results)
                listening = false
                clearTimeout()
                try {
                    recognizer?.destroy()
                } catch (_: Exception) {
                    // ignore
                }
                recognizer = null
                if (!text.isNullOrBlank()) {
                    listener.onFinal(text.trim())
                } else {
                    listener.onError("NO_MATCH", "No speech match")
                }
                listener.onEnded()
            }

            override fun onPartialResults(partialResults: Bundle?) {
                val text = extractBestResult(partialResults)
                if (!text.isNullOrBlank()) {
                    listener.onPartial(text.trim())
                }
            }

            override fun onEvent(eventType: Int, params: Bundle?) = Unit
        }
    }

    private fun extractBestResult(bundle: Bundle?): String? {
        val list = bundle?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
        return list?.firstOrNull()
    }

    private fun mapError(error: Int): Pair<String, String> {
        return when (error) {
            SpeechRecognizer.ERROR_AUDIO -> "AUDIO_ERROR" to "Audio recording error"
            SpeechRecognizer.ERROR_CLIENT -> "CLIENT_ERROR" to "Speech client error"
            SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS ->
                "PERMISSION_DENIED" to "Microphone permission denied"
            SpeechRecognizer.ERROR_NETWORK,
            SpeechRecognizer.ERROR_NETWORK_TIMEOUT,
            -> "NETWORK_ERROR" to "Network error during speech recognition"
            SpeechRecognizer.ERROR_NO_MATCH -> "NO_MATCH" to "No speech match"
            SpeechRecognizer.ERROR_RECOGNIZER_BUSY ->
                "BUSY" to "Speech recognizer is busy"
            SpeechRecognizer.ERROR_SERVER -> "SERVER_ERROR" to "Speech server error"
            SpeechRecognizer.ERROR_SPEECH_TIMEOUT ->
                "TIMEOUT" to "No speech input"
            else -> "UNKNOWN" to "Speech recognition error ($error)"
        }
    }

    companion object {
        @JvmStatic
        fun isRecognitionAvailable(context: Context): Boolean {
            return SpeechRecognizer.isRecognitionAvailable(context)
        }

        @JvmStatic
        fun defaultLocale(): String = Locale.KOREAN.toLanguageTag()
    }
}
