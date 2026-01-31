package com.advancepay.ui.history

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.advancepay.R
import com.advancepay.data.api.ApiService
import com.advancepay.data.models.BankNotificationResponse
import com.advancepay.data.repository.TokenManager
import com.advancepay.databinding.ActivityHistoryBinding
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.*

class HistoryActivity : AppCompatActivity() {

    private lateinit var binding: ActivityHistoryBinding
    private lateinit var tokenManager: TokenManager
    private lateinit var adapter: NotificationAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityHistoryBinding.inflate(layoutInflater)
        setContentView(binding.root)

        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        supportActionBar?.title = "История уведомлений"

        tokenManager = TokenManager(this)

        setupRecyclerView()
        loadHistory()

        binding.swipeRefresh.setOnRefreshListener {
            loadHistory()
        }
    }

    private fun setupRecyclerView() {
        adapter = NotificationAdapter()
        binding.recyclerView.layoutManager = LinearLayoutManager(this)
        binding.recyclerView.adapter = adapter
    }

    private fun loadHistory() {
        binding.swipeRefresh.isRefreshing = true

        lifecycleScope.launch {
            try {
                val token = tokenManager.token.first()
                if (token.isNullOrEmpty()) {
                    Toast.makeText(this@HistoryActivity, "Нет токена", Toast.LENGTH_SHORT).show()
                    finish()
                    return@launch
                }

                val api = ApiService.create(token)
                val response = api.getBankNotifications(page = 1, pageSize = 100)

                if (response.isSuccessful && response.body() != null) {
                    val notifications = response.body()!!.items
                    adapter.updateData(notifications)

                    if (notifications.isEmpty()) {
                        binding.tvEmpty.visibility = View.VISIBLE
                        binding.recyclerView.visibility = View.GONE
                    } else {
                        binding.tvEmpty.visibility = View.GONE
                        binding.recyclerView.visibility = View.VISIBLE
                    }
                } else {
                    Toast.makeText(
                        this@HistoryActivity,
                        "Ошибка загрузки: ${response.code()}",
                        Toast.LENGTH_SHORT
                    ).show()
                }

            } catch (e: Exception) {
                Toast.makeText(
                    this@HistoryActivity,
                    "Ошибка: ${e.message}",
                    Toast.LENGTH_SHORT
                ).show()
            } finally {
                binding.swipeRefresh.isRefreshing = false
            }
        }
    }

    override fun onSupportNavigateUp(): Boolean {
        finish()
        return true
    }
}

class NotificationAdapter : RecyclerView.Adapter<NotificationAdapter.ViewHolder>() {

    private val notifications = mutableListOf<BankNotificationResponse>()

    fun updateData(newNotifications: List<BankNotificationResponse>) {
        notifications.clear()
        notifications.addAll(newNotifications)
        notifyDataSetChanged()
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_notification, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.bind(notifications[position])
    }

    override fun getItemCount() = notifications.size

    class ViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val tvAppName: TextView = itemView.findViewById(R.id.tvAppName)
        private val tvTitle: TextView = itemView.findViewById(R.id.tvTitle)
        private val tvText: TextView = itemView.findViewById(R.id.tvText)
        private val tvAmount: TextView = itemView.findViewById(R.id.tvAmount)
        private val tvTime: TextView = itemView.findViewById(R.id.tvTime)

        fun bind(notification: BankNotificationResponse) {
            tvAppName.text = notification.appName ?: notification.appPackage
            tvTitle.text = notification.notificationTitle
            tvText.text = notification.notificationText

            if (notification.amount != null) {
                tvAmount.visibility = View.VISIBLE
                tvAmount.text = "${notification.amount} ₽"

                // Цвет в зависимости от типа операции
                val color = when (notification.operationType) {
                    "credit" -> 0xFF4CAF50.toInt() // зеленый
                    "debit" -> 0xFFF44336.toInt()  // красный
                    else -> 0xFF757575.toInt()      // серый
                }
                tvAmount.setTextColor(color)
            } else {
                tvAmount.visibility = View.GONE
            }

            // Форматируем время
            try {
                val inputFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", Locale.US)
                val outputFormat = SimpleDateFormat("dd.MM.yyyy HH:mm", Locale.US)
                val date = inputFormat.parse(notification.createdAt)
                tvTime.text = if (date != null) outputFormat.format(date) else notification.createdAt
            } catch (e: Exception) {
                tvTime.text = notification.createdAt
            }
        }
    }
}
