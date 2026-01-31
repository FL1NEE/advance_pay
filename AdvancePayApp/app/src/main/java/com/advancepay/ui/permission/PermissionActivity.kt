package com.advancepay.ui.permission

import android.content.Intent
import android.os.Bundle
import android.provider.Settings
import androidx.appcompat.app.AppCompatActivity
import com.advancepay.databinding.ActivityPermissionBinding
import com.advancepay.ui.auth.LoginActivity

class PermissionActivity : AppCompatActivity() {

    private lateinit var binding: ActivityPermissionBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityPermissionBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Проверяем, есть ли уже разрешение
        if (isNotificationServiceEnabled()) {
            navigateToLogin()
            return
        }

        binding.btnEnable.setOnClickListener {
            openNotificationSettings()
        }
    }

    override fun onResume() {
        super.onResume()
        // Проверяем при возврате из настроек
        if (isNotificationServiceEnabled()) {
            navigateToLogin()
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

    private fun navigateToLogin() {
        startActivity(Intent(this, LoginActivity::class.java))
        finish()
    }
}
