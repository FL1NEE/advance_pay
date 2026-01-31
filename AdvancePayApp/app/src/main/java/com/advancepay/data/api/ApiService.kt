package com.advancepay.data.api

import com.advancepay.data.models.*
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.*
import java.util.concurrent.TimeUnit

interface ApiService {

    @POST("api/v1/auth/login")
    @FormUrlEncoded
    suspend fun login(
        @Field("username") username: String,
        @Field("password") password: String
    ): Response<LoginResponse>

    @GET("api/v1/auth/me")
    suspend fun getCurrentUser(): Response<UserResponse>

    @POST("api/v1/bank-notifications")
    suspend fun sendBankNotification(
        @Body notification: BankNotificationCreate
    ): Response<BankNotificationResponse>

    @GET("api/v1/bank-notifications")
    suspend fun getBankNotifications(
        @Query("page") page: Int = 1,
        @Query("page_size") pageSize: Int = 50
    ): Response<BankNotificationListResponse>

    @POST("api/v1/bank-notifications/device-status")
    suspend fun updateDeviceStatus(
        @Body status: DeviceStatusUpdate
    ): Response<Map<String, Any>>

    companion object {
        // Для эмулятора используйте: http://10.0.2.2:8081/
        // Для реального устройства с ngrok: https://da084c102d2e.ngrok-free.app/
        private const val BASE_URL = "https://da084c102d2e.ngrok-free.app/"

        fun create(token: String? = null): ApiService {
            val loggingInterceptor = HttpLoggingInterceptor().apply {
                level = HttpLoggingInterceptor.Level.BODY
            }

            val clientBuilder = OkHttpClient.Builder()
                .addInterceptor(loggingInterceptor)
                .connectTimeout(30, TimeUnit.SECONDS)
                .readTimeout(30, TimeUnit.SECONDS)
                .writeTimeout(30, TimeUnit.SECONDS)

            // Добавляем токен если есть
            if (token != null) {
                clientBuilder.addInterceptor { chain ->
                    val request = chain.request().newBuilder()
                        .addHeader("Authorization", "Bearer $token")
                        .build()
                    chain.proceed(request)
                }
            }

            val client = clientBuilder.build()

            val retrofit = Retrofit.Builder()
                .baseUrl(BASE_URL)
                .client(client)
                .addConverterFactory(GsonConverterFactory.create())
                .build()

            return retrofit.create(ApiService::class.java)
        }
    }
}
