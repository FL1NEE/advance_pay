package com.advancepay.ui.views

import android.animation.ValueAnimator
import android.content.Context
import android.graphics.*
import android.util.AttributeSet
import android.view.View
import android.view.animation.LinearInterpolator
import kotlin.math.cos
import kotlin.math.sin
import kotlin.random.Random

class AnimatedSphereView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = 0
) : View(context, attrs, defStyleAttr) {

    private val spherePaint = Paint(Paint.ANTI_ALIAS_FLAG)
    private val glowPaint = Paint(Paint.ANTI_ALIAS_FLAG)
    private val particlePaint = Paint(Paint.ANTI_ALIAS_FLAG)
    private val highlightPaint = Paint(Paint.ANTI_ALIAS_FLAG)

    private var rotationAngle = 0f
    private var pulseScale = 1f

    private val particles = mutableListOf<Particle>()
    private val particleCount = 20

    private val colorRed = Color.parseColor("#E62E2E")
    private val colorPurple = Color.parseColor("#8B5CF6")
    private val colorDarkPurple = Color.parseColor("#4C1D95")

    private var isWorking = true

    private val rotationAnimator = ValueAnimator.ofFloat(0f, 360f).apply {
        duration = 8000
        repeatCount = ValueAnimator.INFINITE
        interpolator = LinearInterpolator()
        addUpdateListener {
            rotationAngle = it.animatedValue as Float
            invalidate()
        }
    }

    private val pulseAnimator = ValueAnimator.ofFloat(0.95f, 1.05f).apply {
        duration = 2000
        repeatCount = ValueAnimator.INFINITE
        repeatMode = ValueAnimator.REVERSE
        addUpdateListener {
            pulseScale = it.animatedValue as Float
            invalidate()
        }
    }

    init {
        initParticles()
    }

    private fun initParticles() {
        particles.clear()
        repeat(particleCount) {
            particles.add(Particle(
                angle = Random.nextFloat() * 360f,
                radius = Random.nextFloat() * 0.3f + 0.35f,
                size = Random.nextFloat() * 3f + 2f,
                speed = Random.nextFloat() * 0.5f + 0.3f,
                alpha = Random.nextInt(100, 255)
            ))
        }
    }

    override fun onAttachedToWindow() {
        super.onAttachedToWindow()
        startAnimations()
    }

    override fun onDetachedFromWindow() {
        super.onDetachedFromWindow()
        stopAnimations()
    }

    fun startAnimations() {
        if (!rotationAnimator.isRunning) {
            rotationAnimator.start()
        }
        if (!pulseAnimator.isRunning) {
            pulseAnimator.start()
        }
    }

    fun stopAnimations() {
        rotationAnimator.cancel()
        pulseAnimator.cancel()
    }

    fun setWorking(working: Boolean) {
        isWorking = working
        invalidate()
    }

    override fun onDraw(canvas: Canvas) {
        super.onDraw(canvas)

        val centerX = width / 2f
        val centerY = height / 2f
        val baseRadius = minOf(width, height) / 2f * 0.7f
        val radius = baseRadius * pulseScale

        // Draw outer glow
        val glowRadius = radius * 1.4f
        glowPaint.shader = RadialGradient(
            centerX, centerY, glowRadius,
            intArrayOf(
                if (isWorking) Color.parseColor("#40E62E2E") else Color.parseColor("#40888888"),
                Color.TRANSPARENT
            ),
            floatArrayOf(0.3f, 1f),
            Shader.TileMode.CLAMP
        )
        canvas.drawCircle(centerX, centerY, glowRadius, glowPaint)

        // Draw main sphere with gradient
        spherePaint.shader = RadialGradient(
            centerX - radius * 0.3f,
            centerY - radius * 0.3f,
            radius * 1.5f,
            if (isWorking) {
                intArrayOf(colorRed, colorPurple, colorDarkPurple)
            } else {
                intArrayOf(Color.parseColor("#666666"), Color.parseColor("#444444"), Color.parseColor("#222222"))
            },
            floatArrayOf(0f, 0.5f, 1f),
            Shader.TileMode.CLAMP
        )
        canvas.drawCircle(centerX, centerY, radius, spherePaint)

        // Draw rotating particles
        if (isWorking) {
            particles.forEach { particle ->
                val particleAngle = Math.toRadians((particle.angle + rotationAngle * particle.speed).toDouble())
                val particleRadius = radius * particle.radius
                val px = centerX + cos(particleAngle).toFloat() * particleRadius
                val py = centerY + sin(particleAngle).toFloat() * particleRadius

                particlePaint.color = Color.WHITE
                particlePaint.alpha = particle.alpha
                canvas.drawCircle(px, py, particle.size, particlePaint)
            }
        }

        // Draw highlight
        highlightPaint.shader = RadialGradient(
            centerX - radius * 0.3f,
            centerY - radius * 0.3f,
            radius * 0.6f,
            intArrayOf(
                Color.parseColor("#60FFFFFF"),
                Color.TRANSPARENT
            ),
            null,
            Shader.TileMode.CLAMP
        )
        canvas.drawCircle(centerX - radius * 0.2f, centerY - radius * 0.2f, radius * 0.5f, highlightPaint)
    }

    private data class Particle(
        val angle: Float,
        val radius: Float,
        val size: Float,
        val speed: Float,
        val alpha: Int
    )
}
