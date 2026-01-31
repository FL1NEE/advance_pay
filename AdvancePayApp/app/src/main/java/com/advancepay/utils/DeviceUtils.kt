package com.advancepay.utils

import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.os.BatteryManager
import android.os.Build

object DeviceUtils {

    /**
     * Получить уровень батареи в процентах
     */
    fun getBatteryLevel(context: Context): Int {
        val batteryIntent = context.registerReceiver(
            null,
            IntentFilter(Intent.ACTION_BATTERY_CHANGED)
        )
        val level = batteryIntent?.getIntExtra(BatteryManager.EXTRA_LEVEL, -1) ?: -1
        val scale = batteryIntent?.getIntExtra(BatteryManager.EXTRA_SCALE, -1) ?: -1

        return if (level >= 0 && scale > 0) {
            (level * 100 / scale.toFloat()).toInt()
        } else {
            0
        }
    }

    /**
     * Проверить, заряжается ли устройство
     */
    fun isCharging(context: Context): Boolean {
        val batteryIntent = context.registerReceiver(
            null,
            IntentFilter(Intent.ACTION_BATTERY_CHANGED)
        )
        val status = batteryIntent?.getIntExtra(BatteryManager.EXTRA_STATUS, -1) ?: -1
        return status == BatteryManager.BATTERY_STATUS_CHARGING ||
                status == BatteryManager.BATTERY_STATUS_FULL
    }

    /**
     * Проверить наличие интернета
     */
    fun hasInternetConnection(context: Context): Boolean {
        val connectivityManager = context.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            val network = connectivityManager.activeNetwork ?: return false
            val capabilities = connectivityManager.getNetworkCapabilities(network) ?: return false

            return capabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET) &&
                    capabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_VALIDATED)
        } else {
            @Suppress("DEPRECATION")
            val networkInfo = connectivityManager.activeNetworkInfo
            @Suppress("DEPRECATION")
            return networkInfo != null && networkInfo.isConnected
        }
    }

    /**
     * Проверить все условия работы
     */
    fun isDeviceReady(context: Context): Boolean {
        val batteryLevel = getBatteryLevel(context)
        val hasInternet = hasInternetConnection(context)
        return batteryLevel > 30 && hasInternet
    }

    /**
     * Получить статус для отображения
     */
    fun getStatusMessage(context: Context): String {
        val batteryLevel = getBatteryLevel(context)
        val hasInternet = hasInternetConnection(context)

        return when {
            batteryLevel <= 30 -> "Низкий заряд батареи: $batteryLevel%"
            !hasInternet -> "Нет подключения к интернету"
            else -> "Работает"
        }
    }
}
