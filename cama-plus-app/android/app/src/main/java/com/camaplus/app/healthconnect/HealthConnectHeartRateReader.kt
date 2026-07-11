package com.camaplus.app.healthconnect

import android.content.Context
import androidx.health.connect.client.HealthConnectClient
import androidx.health.connect.client.records.HeartRateRecord
import androidx.health.connect.client.request.ReadRecordsRequest
import androidx.health.connect.client.time.TimeRangeFilter
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import kotlinx.coroutines.runBlocking
import java.time.Instant
import java.time.ZoneId
import java.time.ZonedDateTime
import java.time.format.DateTimeFormatter

object HealthConnectHeartRateReader {

    private const val MAX_SAMPLES = 500

    private val kstZone: ZoneId = ZoneId.of("Asia/Seoul")
    private val measuredAtFormatter: DateTimeFormatter =
        DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")

    data class ReadResult(
        val samples: WritableArray,
        val count: Int,
    )

    @JvmStatic
    fun readHeartRateSamplesBlocking(context: Context, daysBack: Int): ReadResult {
        return runBlocking { readHeartRateSamples(context, daysBack) }
    }

    suspend fun readHeartRateSamples(context: Context, daysBack: Int): ReadResult {
        val safeDays = daysBack.coerceIn(1, 14)
        val client = HealthConnectClient.getOrCreate(context)
        val end = Instant.now()
        val start = ZonedDateTime.now(kstZone)
            .toLocalDate()
            .minusDays((safeDays - 1).toLong())
            .atStartOfDay(kstZone)
            .toInstant()

        val request = ReadRecordsRequest(
            HeartRateRecord::class,
            timeRangeFilter = TimeRangeFilter.between(start, end),
        )

        val response = client.readRecords(request)
        val array = Arguments.createArray()
        val collected = ArrayList<WritableMap>()

        for (record in response.records) {
            for (sample in record.samples) {
                val bpm = sample.beatsPerMinute
                if (bpm < 20 || bpm > 300) {
                    continue
                }
                val measuredAt = ZonedDateTime.ofInstant(sample.time, kstZone)
                    .format(measuredAtFormatter)
                val map: WritableMap = Arguments.createMap()
                map.putString("vitalTypeCd", "HEART_RATE")
                map.putDouble("valueNum", bpm.toDouble())
                map.putString("unit", "bpm")
                map.putString("measuredAt", measuredAt)
                map.putString("sourceCd", "WEARABLE")
                collected.add(map)
            }
        }

        val trimmed =
            if (collected.size > MAX_SAMPLES) {
                collected.takeLast(MAX_SAMPLES)
            } else {
                collected
            }
        for (map in trimmed) {
            array.pushMap(map)
        }

        return ReadResult(array, array.size())
    }
}
