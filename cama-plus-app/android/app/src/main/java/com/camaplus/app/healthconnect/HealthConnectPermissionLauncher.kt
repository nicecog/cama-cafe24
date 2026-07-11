package com.camaplus.app.healthconnect

import androidx.activity.ComponentActivity
import androidx.activity.result.ActivityResultLauncher
import androidx.health.connect.client.HealthConnectClient
import androidx.health.connect.client.PermissionController
import androidx.health.connect.client.permission.HealthPermission
import androidx.health.connect.client.records.HeartRateRecord
import kotlinx.coroutines.runBlocking
import java.util.function.Consumer
import kotlin.jvm.JvmStatic

class HealthConnectPermissionLauncher(private val activity: ComponentActivity) {

    private val requiredPermissions: Set<String> = setOf(
        HealthPermission.getReadPermission(HeartRateRecord::class),
    )

    private var pendingCallback: ((Boolean) -> Unit)? = null
    private lateinit var launcher: ActivityResultLauncher<Set<String>>

    fun register() {
        launcher = activity.registerForActivityResult(
            PermissionController.createRequestPermissionResultContract(),
        ) { granted ->
            val ok = granted.containsAll(requiredPermissions)
            pendingCallback?.invoke(ok)
            pendingCallback = null
        }
    }

    fun request(callback: (Boolean) -> Unit) {
        pendingCallback = callback
        launcher.launch(requiredPermissions)
    }

    fun requestPermission(callback: Consumer<Boolean>) {
        request { granted -> callback.accept(granted) }
    }

    suspend fun hasPermissions(): Boolean {
        val client = HealthConnectClient.getOrCreate(activity.applicationContext)
        val granted = client.permissionController.getGrantedPermissions()
        return granted.containsAll(requiredPermissions)
    }

    fun hasPermissionsBlocking(): Boolean {
        return runBlocking { hasPermissions() }
    }

    companion object {
        private val requiredPermissions: Set<String> = setOf(
            HealthPermission.getReadPermission(HeartRateRecord::class),
        )

        @JvmStatic
        fun isHealthConnectAvailable(context: android.content.Context): Boolean {
            return HealthConnectClient.sdkStatus(context) ==
                HealthConnectClient.SDK_AVAILABLE
        }

        @JvmStatic
        fun hasHeartRateReadPermissionBlocking(context: android.content.Context): Boolean {
            return runBlocking {
                val client = HealthConnectClient.getOrCreate(context.applicationContext)
                val granted = client.permissionController.getGrantedPermissions()
                granted.containsAll(requiredPermissions)
            }
        }
    }
}
