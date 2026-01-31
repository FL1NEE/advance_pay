package com.advancepay.ui.main

import android.content.*
import android.os.Build
import android.os.Bundle
import android.provider.Settings
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.lifecycle.lifecycleScope
import com.advancepay.R
import com.advancepay.data.api.ApiService
import com.advancepay.data.repository.TokenManager
import com.advancepay.databinding.ActivityMainBinding
import com.advancepay.service.MonitoringForegroundService
import com.advancepay.ui.auth.LoginActivity
import com.advancepay.ui.history.HistoryActivity
import com.advancepay.ui.views.AnimatedSphereView
import com.advancepay.utils.DeviceUtils
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    private lateinit var tokenManager: TokenManager
    private var username: String = ""

    private val statusReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
            updateStatus()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        tokenManager = TokenManager(this)

        setupListeners()
        loadUserInfo()
        checkNotificationAccess()
        startMonitoringService()
        startStatusUpdates()

        // Регистрируем receiver для обновлений
        val filter = IntentFilter().apply {
            addAction("com.advancepay.STATUS_UPDATE")
            addAction("com.advancepay.NOTIFICATION_SENT")
        }
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.TIRAMISU) {
            registerReceiver(statusReceiver, filter, android.content.Context.RECEIVER_EXPORTED)
        } else {
            registerReceiver(statusReceiver, filter)
        }
    }

    private fun setupListeners() {
        binding.btnHistory.setOnClickListener {
            startActivity(Intent(this, HistoryActivity::class.java))
        }

        binding.btnLogout.setOnClickListener {
            showLogoutDialog()
        }

        binding.warningCard.setOnClickListener {
            openNotificationSettings()
        }
    }

    private fun loadUserInfo() {
        lifecycleScope.launch {
            try {
                val token = tokenManager.token.first()
                if (token.isNullOrEmpty()) {
                    navigateToLogin()
                    return@launch
                }

                val api = ApiService.create(token)
                val response = api.getCurrentUser()

                if (response.isSuccessful && response.body() != null) {
                    val user = response.body()!!
                    username = user.username
                    binding.tvUsername.text = "Пользователь: ${user.username}"
                    binding.tvBalance.text = "Баланс: ${user.workingBalance} USDT"
                } else {
                    if (response.code() == 401) {
                        navigateToLogin()
                    }
                }

            } catch (e: Exception) {
                Toast.makeText(this@MainActivity, "Ошибка загрузки: ${e.message}", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun checkNotificationAccess() {
        val enabled = isNotificationServiceEnabled()

        if (!enabled) {
            binding.warningCard.visibility = android.view.View.VISIBLE
        } else {
            binding.warningCard.visibility = android.view.View.GONE
        }
    }

    private fun isNotificationServiceEnabled(): Boolean {
        val flat = Settings.Secure.getString(
            contentResolver,
            "enabled_notification_listeners"
        )
        return flat?.contains(packageName) == true
    }

    private fun openNotificationSettings() {
        val intent = Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS)
        startActivity(intent)
    }

    private fun startMonitoringService() {
        val serviceIntent = Intent(this, MonitoringForegroundService::class.java)

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            startForegroundService(serviceIntent)
        } else {
            startService(serviceIntent)
        }
    }

    private fun startStatusUpdates() {
        lifecycleScope.launch {
            while (true) {
                updateStatus()
                delay(5000) // Обновляем каждые 5 секунд
            }
        }
    }

    private fun updateStatus() {
        val isReady = DeviceUtils.isDeviceReady(this)
        val statusMessage = DeviceUtils.getStatusMessage(this)
        val batteryLevel = DeviceUtils.getBatteryLevel(this)
        val hasInternet = DeviceUtils.hasInternetConnection(this)

        // Обновляем UI
        binding.tvStatus.text = statusMessage
        binding.tvBattery.text = "Батарея: $batteryLevel%"
        binding.tvInternet.text = if (hasInternet) "Интернет: Есть" else "Интернет: Нет"

        // Обновляем цвет текста статуса
        val statusColor = if (isReady) {
            ContextCompat.getColor(this, R.color.status_working)
        } else {
            ContextCompat.getColor(this, R.color.status_error)
        }
        binding.tvStatus.setTextColor(statusColor)

        // Обновляем анимированную сферу
        binding.statusIndicator.setWorking(isReady)
    }

    private fun showLogoutDialog() {
        AlertDialog.Builder(this)
            .setTitle("Выход")
            .setMessage("Вы уверены, что хотите выйти?")
            .setPositiveButton("Да") { _, _ ->
                logout()
            }
            .setNegativeButton("Отмена", null)
            .show()
    }

    private fun logout() {
        lifecycleScope.launch {
            tokenManager.clearToken()

            // Останавливаем сервис
            stopService(Intent(this@MainActivity, MonitoringForegroundService::class.java))

            navigateToLogin()
        }
    }

    private fun navigateToLogin() {
        startActivity(Intent(this, LoginActivity::class.java))
        finish()
    }

    override fun onResume() {
        super.onResume()
        checkNotificationAccess()
        updateStatus()
    }

    override fun onDestroy() {
        super.onDestroy()
        try {
            unregisterReceiver(statusReceiver)
        } catch (e: Exception) {
            // Receiver already unregistered
        }
    }
}
