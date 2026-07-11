package com.camaplus.app.healthconnect

import android.content.Intent
import android.net.Uri
import android.os.Build
import androidx.activity.ComponentActivity
import androidx.health.connect.client.HealthConnectClient
import kotlin.jvm.JvmStatic

object HealthConnectSettingsNavigator {

    private const val HEALTH_CONNECT_PACKAGE = "com.google.android.apps.healthdata"

    @JvmStatic
    fun openSettings(activity: ComponentActivity): Boolean {
        val status = HealthConnectClient.sdkStatus(activity)
        if (status == HealthConnectClient.SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED) {
            return openPlayStore(activity)
        }
        if (status != HealthConnectClient.SDK_AVAILABLE) {
            return openPlayStore(activity)
        }

        return try {
            val intent =
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
                    Intent("android.health.connect.action.MANAGE_HEALTH_PERMISSIONS")
                        .putExtra(Intent.EXTRA_PACKAGE_NAME, activity.packageName)
                } else {
                    Intent("androidx.health.ACTION_HEALTH_CONNECT_SETTINGS")
                }
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            activity.startActivity(intent)
            true
        } catch (_: Exception) {
            openHealthConnectApp(activity) || openPlayStore(activity)
        }
    }

    private fun openHealthConnectApp(activity: ComponentActivity): Boolean {
        val intent = activity.packageManager.getLaunchIntentForPackage(HEALTH_CONNECT_PACKAGE)
            ?: return false
        activity.startActivity(intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK))
        return true
    }

    private fun openPlayStore(activity: ComponentActivity): Boolean {
        return try {
            val intent = Intent(
                Intent.ACTION_VIEW,
                Uri.parse("market://details?id=$HEALTH_CONNECT_PACKAGE"),
            ).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            activity.startActivity(intent)
            true
        } catch (_: Exception) {
            false
        }
    }
}
