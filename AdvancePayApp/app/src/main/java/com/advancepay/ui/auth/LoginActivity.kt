package com.advancepay.ui.auth

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.advancepay.data.api.ApiService
import com.advancepay.data.repository.TokenManager
import com.advancepay.databinding.ActivityLoginBinding
import com.advancepay.ui.main.MainActivity
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch

class LoginActivity : AppCompatActivity() {

    private lateinit var binding: ActivityLoginBinding
    private lateinit var tokenManager: TokenManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)

        tokenManager = TokenManager(this)

        // Проверяем, есть ли уже токен
        lifecycleScope.launch {
            val token = tokenManager.token.first()
            if (!token.isNullOrEmpty()) {
                // Токен есть, проверяем его валидность
                if (validateToken(token)) {
                    navigateToMain()
                }
            }
        }

        setupListeners()
    }

    private fun setupListeners() {
        binding.btnLogin.setOnClickListener {
            val username = binding.etUsername.editText?.text.toString().trim()
            val password = binding.etPassword.editText?.text.toString().trim()

            if (username.isEmpty() || password.isEmpty()) {
                Toast.makeText(this, "Заполните все поля", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            login(username, password)
        }
    }

    private fun login(username: String, password: String) {
        showLoading(true)

        lifecycleScope.launch {
            try {
                val api = ApiService.create()
                val response = api.login(username, password)

                if (response.isSuccessful && response.body() != null) {
                    val token = response.body()!!.accessToken
                    tokenManager.saveToken(token)

                    Toast.makeText(this@LoginActivity, "Вход выполнен", Toast.LENGTH_SHORT).show()
                    navigateToMain()
                } else {
                    val errorMsg = when (response.code()) {
                        401 -> "Неверный логин или пароль"
                        else -> "Ошибка: ${response.code()}"
                    }
                    Toast.makeText(this@LoginActivity, errorMsg, Toast.LENGTH_LONG).show()
                }

            } catch (e: Exception) {
                Toast.makeText(
                    this@LoginActivity,
                    "Ошибка подключения: ${e.message}",
                    Toast.LENGTH_LONG
                ).show()
            } finally {
                showLoading(false)
            }
        }
    }

    private suspend fun validateToken(token: String): Boolean {
        return try {
            val api = ApiService.create(token)
            val response = api.getCurrentUser()
            response.isSuccessful
        } catch (e: Exception) {
            false
        }
    }

    private fun navigateToMain() {
        startActivity(Intent(this, MainActivity::class.java))
        finish()
    }

    private fun showLoading(show: Boolean) {
        binding.progressBar.visibility = if (show) View.VISIBLE else View.GONE
        binding.btnLogin.isEnabled = !show
        binding.etUsername.isEnabled = !show
        binding.etPassword.isEnabled = !show
    }
}
