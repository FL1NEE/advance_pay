package com.advancepay.data.models

import com.google.gson.annotations.SerializedName
import java.math.BigDecimal

// Auth models
data class LoginRequest(
    val username: String,
    val password: String
)

data class LoginResponse(
    @SerializedName("access_token")
    val accessToken: String,
    @SerializedName("token_type")
    val tokenType: String = "bearer"
)

data class UserResponse(
    val id: String,
    val username: String,
    val email: String?,
    val role: String,
    @SerializedName("team_id")
    val teamId: String?,
    @SerializedName("team_name")
    val teamName: String?,
    @SerializedName("is_active")
    val isActive: Boolean,
    @SerializedName("working_balance")
    val workingBalance: BigDecimal,
    @SerializedName("security_deposit")
    val securityDeposit: BigDecimal,
    @SerializedName("security_deposit_required")
    val securityDepositRequired: BigDecimal,
    @SerializedName("pending_balance")
    val pendingBalance: BigDecimal,
    @SerializedName("created_at")
    val createdAt: String
)

// Bank notification models
data class BankNotificationCreate(
    @SerializedName("app_package")
    val appPackage: String,
    @SerializedName("app_name")
    val appName: String?,
    @SerializedName("notification_title")
    val notificationTitle: String,
    @SerializedName("notification_text")
    val notificationText: String,
    @SerializedName("posted_time")
    val postedTime: String,
    @SerializedName("raw_data")
    val rawData: String?
)

data class BankNotificationResponse(
    val id: String,
    @SerializedName("user_id")
    val userId: String,
    @SerializedName("app_package")
    val appPackage: String,
    @SerializedName("app_name")
    val appName: String?,
    @SerializedName("notification_title")
    val notificationTitle: String,
    @SerializedName("notification_text")
    val notificationText: String,
    @SerializedName("posted_time")
    val postedTime: String,
    val amount: BigDecimal?,
    @SerializedName("card_last4")
    val cardLast4: String?,
    @SerializedName("operation_type")
    val operationType: String?,
    @SerializedName("is_processed")
    val isProcessed: Boolean,
    @SerializedName("created_at")
    val createdAt: String
)

data class BankNotificationListResponse(
    val items: List<BankNotificationResponse>,
    val total: Int,
    val page: Int,
    @SerializedName("page_size")
    val pageSize: Int
)

data class DeviceStatusUpdate(
    @SerializedName("battery_level")
    val batteryLevel: Int,
    @SerializedName("is_charging")
    val isCharging: Boolean,
    @SerializedName("has_internet")
    val hasInternet: Boolean,
    @SerializedName("is_working")
    val isWorking: Boolean,
    @SerializedName("last_notification_time")
    val lastNotificationTime: String?
)

data class ErrorResponse(
    val detail: String
)
