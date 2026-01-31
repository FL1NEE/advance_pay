package com.advancepay.service

import android.app.*
import android.content.Intent
import android.os.Build
import android.os.IBinder
import android.util.Log
import androidx.core.app.NotificationCompat
import com.advancepay.R
import com.advancepay.data.api.ApiService
import com.advancepay.data.models.DeviceStatusUpdate
import com.advancepay.data.repository.TokenManager
import com.advancepay.ui.main.MainActivity
import com.advancepay.utils.DeviceUtils
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.first
import java.text.SimpleDateFormat
import java.util.*

class MonitoringForegroundService : Service() {

    private val TAG = "MonitoringService"
    private val CHANNEL_ID = "monitoring_channel"
    private val NOTIFICATION_ID = 1001
    private val scope = CoroutineScope(Dispatchers.IO + SupervisorJob())
    private lateinit var tokenManager: TokenManager

    private var statusUpdateJob: Job? = null

    override fun onCreate() {
        super.onCreate()
        tokenManager = TokenManager(this)
        createNotificationChannel()
        Log.d(TAG, "MonitoringForegroundService created")
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        Log.d(TAG, "Service started")

        val notification = createNotification("Мониторинг активен")
        startForeground(NOTIFICATION_ID, notification)

        // Запускаем периодическую отправку статуса
        startStatusUpdates()

        return START_STICKY
    }

    private fun startStatusUpdates() {
        statusUpdateJob?.cancel()
        statusUpdateJob = scope.launch {
            while (isActive) {
                try {
                    updateDeviceStatus()
                    updateNotification()
                } catch (e: Exception) {
                    Log.e(TAG, "Error updating status", e)
                }
                delay(60_000) // Каждые 60 секунд
            }
        }
    }

    private suspend fun updateDeviceStatus() {
        try {
            val token = tokenManager.token.first()
            if (token.isNullOrEmpty()) {
                Log.w(TAG, "No auth token")
                return
            }

            val api = ApiService.create(token)

            val batteryLevel = DeviceUtils.getBatteryLevel(this)
            val isCharging = DeviceUtils.isCharging(this)
            val hasInternet = DeviceUtils.hasInternetConnection(this)
            val isWorking = DeviceUtils.isDeviceReady(this)

            val status = DeviceStatusUpdate(
                batteryLevel = batteryLevel,
                isCharging = isCharging,
                hasInternet = hasInternet,
                isWorking = isWorking,
                lastNotificationTime = null
            )

            val response = api.updateDeviceStatus(status)

            if (response.isSuccessful) {
                Log.d(TAG, "Status updated successfully")
            } else {
                Log.e(TAG, "Failed to update status: ${response.code()}")
            }

        } catch (e: Exception) {
            Log.e(TAG, "Error updating device status", e)
        }
    }

    private fun updateNotification() {
        val statusMessage = DeviceUtils.getStatusMessage(this)
        val notification = createNotification(statusMessage)
        val notificationManager = getSystemService(NOTIFICATION_SERVICE) as NotificationManager
        notificationManager.notify(NOTIFICATION_ID, notification)

        // Отправляем broadcast для обновления UI
        sendBroadcast(Intent("com.advancepay.STATUS_UPDATE"))
    }

    private fun createNotification(message: String): Notification {
        val notificationIntent = Intent(this, MainActivity::class.java)
        val pendingIntent = PendingIntent.getActivity(
            this,
            0,
            notificationIntent,
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        )

        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("AdvancePay")
            .setContentText(message)
            .setSmallIcon(R.drawable.ic_notification)
            .setContentIntent(pendingIntent)
            .setOngoing(true)
            .build()
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "Мониторинг работы",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Показывает статус работы приложения"
            }

            val notificationManager = getSystemService(NotificationManager::class.java)
            notificationManager.createNotificationChannel(channel)
        }
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onDestroy() {
        statusUpdateJob?.cancel()
        scope.cancel()
        super.onDestroy()
        Log.d(TAG, "Service destroyed")
    }
}
