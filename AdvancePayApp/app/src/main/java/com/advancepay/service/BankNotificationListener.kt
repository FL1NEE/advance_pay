package com.advancepay.service

import android.content.Intent
import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import android.util.Log
import com.advancepay.data.api.ApiService
import com.advancepay.data.models.BankNotificationCreate
import com.advancepay.data.repository.TokenManager
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.first
import java.text.SimpleDateFormat
import java.util.*

class BankNotificationListener : NotificationListenerService() {

    private val TAG = "BankNotificationListener"
    private val scope = CoroutineScope(Dispatchers.IO + SupervisorJob())
    private lateinit var tokenManager: TokenManager

    companion object {
        // Режим отладки - ловить ВСЕ уведомления для теста
        private const val DEBUG_MODE = true

        // Список пакетов банковских приложений
        private val BANK_PACKAGES = setOf(
            "ru.sberbankmobile",           // Сбербанк
            "ru.sberbank.sberbankid",      // Сбербанк ID
            "ru.sberbank.spasibo",         // СберСпасибо
            "ru.sberbank.sbbol",           // Сбербанк Бизнес
            "ru.sberbank",                 // Сбербанк (общий)
            "com.idamob.tinkoff.android",  // Тинькофф
            "com.tinkoff.investing",       // Тинькофф Инвестиции
            "ru.vtb24.mobilebanking.android", // ВТБ
            "ru.vtb.mobilebanking",        // ВТБ Онлайн
            "ru.alfabank.mobile.android",  // Альфа-Банк
            "ru.alfabank.oavdo.amc",       // Альфа-Мобайл
            "com.rbs.mobile.android",      // Россельхозбанк
            "ru.raiffeisennews",           // Райффайзен
            "ru.unicredit.mobile.app",     // ЮниКредит
            "ru.rosbank.android",          // Росбанк
            "ru.psbank.mobile",            // ПромСвязьБанк
            "ru.mobilebank.android",       // МТС Банк
            "com.sovest.android",          // Совесть
            "com.openbank.app",            // Открытие
            "ru.otp.mobile",               // ОТП Банк
            "ru.bspb.android",             // БСП Банк
            "ru.gazprombank.android",      // Газпромбанк
            "com.yandex.bank",             // Яндекс Банк
            "ru.yoomoney.wallet"           // ЮMoney
        )
    }

    override fun onCreate() {
        super.onCreate()
        tokenManager = TokenManager(this)
        Log.d(TAG, "BankNotificationListener created")
    }

    override fun onNotificationPosted(sbn: StatusBarNotification) {
        val packageName = sbn.packageName

        val notification = sbn.notification
        val extras = notification.extras

        val title = extras.getCharSequence("android.title")?.toString() ?: ""
        val text = extras.getCharSequence("android.text")?.toString() ?: ""

        // В режиме отладки логируем ВСЕ уведомления
        if (DEBUG_MODE) {
            Log.d(TAG, "DEBUG: Notification from $packageName: $title - $text")
        }

        // Проверяем, что это банковское приложение
        val isBankApp = BANK_PACKAGES.contains(packageName) ||
                        packageName.contains("bank", ignoreCase = true) ||
                        packageName.contains("sber", ignoreCase = true) ||
                        packageName.contains("tinkoff", ignoreCase = true)

        // В режиме отладки отправляем ВСЕ уведомления
        if (!DEBUG_MODE && !isBankApp) {
            return
        }

        // Пропускаем системные уведомления
        if (packageName.startsWith("com.android.") || packageName.startsWith("android")) {
            if (!DEBUG_MODE) return
        }

        val appName = getAppName(packageName)

        Log.d(TAG, "Processing notification from $appName: $title - $text")

        // Отправляем на сервер
        sendNotificationToServer(
            packageName = packageName,
            appName = appName,
            title = title,
            text = text,
            postedTime = sbn.postTime
        )
    }

    private fun sendNotificationToServer(
        packageName: String,
        appName: String,
        title: String,
        text: String,
        postedTime: Long
    ) {
        scope.launch {
            try {
                val token = tokenManager.token.first()
                if (token.isNullOrEmpty()) {
                    Log.w(TAG, "No auth token, skipping notification send")
                    return@launch
                }

                val api = ApiService.create(token)

                val dateFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", Locale.US)
                val postedTimeStr = dateFormat.format(Date(postedTime))

                val notification = BankNotificationCreate(
                    appPackage = packageName,
                    appName = appName,
                    notificationTitle = title,
                    notificationText = text,
                    postedTime = postedTimeStr,
                    rawData = null
                )

                val response = api.sendBankNotification(notification)

                if (response.isSuccessful) {
                    Log.d(TAG, "Notification sent successfully: ${response.body()?.id}")
                    // Обновляем статус в MainActivity
                    sendBroadcast(Intent("com.advancepay.NOTIFICATION_SENT"))
                } else {
                    Log.e(TAG, "Failed to send notification: ${response.code()}")
                }

            } catch (e: Exception) {
                Log.e(TAG, "Error sending notification", e)
            }
        }
    }

    private fun getAppName(packageName: String): String {
        return when {
            packageName.contains("sberbank", ignoreCase = true) -> "Сбербанк"
            packageName.contains("tinkoff", ignoreCase = true) -> "Тинькофф"
            packageName.contains("vtb", ignoreCase = true) -> "ВТБ"
            packageName.contains("alfa", ignoreCase = true) -> "Альфа-Банк"
            packageName.contains("gazprom", ignoreCase = true) -> "Газпромбанк"
            packageName.contains("rosbank", ignoreCase = true) -> "Росбанк"
            packageName.contains("raiffeisen", ignoreCase = true) -> "Райффайзен"
            packageName.contains("yandex", ignoreCase = true) -> "Яндекс"
            packageName.contains("yoomoney", ignoreCase = true) -> "ЮMoney"
            else -> packageName
        }
    }

    override fun onDestroy() {
        scope.cancel()
        super.onDestroy()
        Log.d(TAG, "BankNotificationListener destroyed")
    }
}
