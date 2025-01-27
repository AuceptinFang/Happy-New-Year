<template>
  <div class="secret-page" 
    @click="handleClick" 
    @touchstart="handleClick">
    <canvas ref="starsCanvas" class="stars-canvas"></canvas>
    <canvas ref="fireworksCanvas" class="fireworks-canvas"></canvas>
    <!-- <audio ref="fireworkSound" src="/firework.mp3" preload="auto"></audio> -->
    
    <!-- 弹窗 -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h2>🎉 恭喜你发现彩蛋！</h2>
        <p>这是一个隐藏的烟花页面</p>
        <div class="button-group">
          <button @click="resetGame" class="action-btn play-again-btn">
            再玩一次
          </button>
          <button @click="goBack" class="action-btn back-btn">
            返回起名页
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'SecretPage',
  setup() {
    const router = useRouter()
    const starsCanvas = ref(null)
    const fireworksCanvas = ref(null)
    const fireworkSound = ref(null)
    const clickCount = ref(0)
    const showModal = ref(false)
    let starsCtx = null
    let fireworksCtx = null
    let stars = []
    let fireworks = []
    let particles = []
    let animationFrame = null

    // 添加固定的烟花颜色数组
    const fireworkColors = [
      'hsl(0, 100%, 60%)',    // 红色
      'hsl(60, 100%, 60%)',   // 黄色
      'hsl(120, 100%, 60%)',  // 绿色
      'hsl(180, 100%, 60%)',  // 青色
      'hsl(240, 100%, 60%)',  // 蓝色
      'hsl(300, 100%, 60%)'   // 紫色
    ]

    // 星星类
    class Star {
      constructor(x, y, size, speed) {
        this.x = x
        this.y = y
        this.size = size
        this.speed = speed
        this.brightness = Math.random()
        this.maxBrightness = Math.random() * 0.3 + 0.7 // 最小亮度0.7，最大亮度1
        this.phase = Math.random() * Math.PI * 2 // 随机初始相位
        this.twinkleSpeed = Math.random() * 0.015 + 0.005 // 随机闪烁速度
      }

      update() {
        // 使用正弦和余弦的组合创造更自然的闪烁效果
        const time = Date.now() * this.twinkleSpeed
        const sinValue = Math.sin(time + this.phase)
        const cosValue = Math.cos(time * 0.7 + this.phase)
        this.brightness = (((sinValue + cosValue) / 2) + 1) / 2 * this.maxBrightness
      }

      draw() {
        // 使用多层渲染创造更真实的星星效果
        const glow = this.brightness * 0.5
        
        // 绘制外层光晕
        starsCtx.fillStyle = `rgba(255, 255, 255, ${glow})`
        starsCtx.beginPath()
        starsCtx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2)
        starsCtx.fill()
        
        // 绘制内层亮点
        starsCtx.fillStyle = `rgba(255, 255, 255, ${this.brightness})`
        starsCtx.beginPath()
        starsCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        starsCtx.fill()
      }
    }

    // 烟花类
    class Firework {
      constructor(x, y, targetX, targetY) {
        this.x = x
        this.y = y
        this.startX = x
        this.startY = y
        this.targetX = targetX
        this.targetY = targetY
        this.speed = 15
        this.angle = Math.atan2(targetY - y, targetX - x)
        this.vx = Math.cos(this.angle) * this.speed
        this.vy = Math.sin(this.angle) * this.speed
        this.trail = []
        this.trailLength = 10
        // 使用固定的颜色数组中的一个颜色
        this.color = fireworkColors[Math.floor(Math.random() * fireworkColors.length)]
        this.gravity = 0.05
        this.distanceTraveled = 0
        this.totalDistance = Math.hypot(targetX - x, targetY - y)
      }

      update() {
        // 保存轨迹
        this.trail.push({ x: this.x, y: this.y })
        if (this.trail.length > this.trailLength) {
          this.trail.shift()
        }

        // 更新位置
        this.x += this.vx
        this.y += this.vy
        this.vy += this.gravity

        // 计算已行进距离
        this.distanceTraveled = Math.hypot(this.x - this.startX, this.y - this.startY)

        // 检查是否到达目标点或超过目标点
        const distance = Math.hypot(this.targetX - this.x, this.targetY - this.y)
        return distance < 5 || this.distanceTraveled >= this.totalDistance
      }

      draw() {
        fireworksCtx.strokeStyle = this.color
        fireworksCtx.lineWidth = 3
        fireworksCtx.beginPath()
        fireworksCtx.moveTo(this.trail[0]?.x || this.x, this.trail[0]?.y || this.y)
        for (let i = 1; i < this.trail.length; i++) {
          const point = this.trail[i]
          fireworksCtx.lineTo(point.x, point.y)
        }
        fireworksCtx.stroke()
      }
    }

    // 粒子类
    class Particle {
      constructor(x, y, color) {
        this.x = x
        this.y = y
        this.color = color
        this.speed = Math.random() * 15 + 5 // 基础速度，会在创建时被覆盖
        this.angle = Math.random() * Math.PI * 2
        this.vx = Math.cos(this.angle) * this.speed
        this.vy = Math.sin(this.angle) * this.speed
        this.gravity = 0.15
        this.alpha = 1
        this.decay = 0.015 // 略微增加衰减速度
        this.trail = []
        this.trailLength = 5
      }

      update() {
        // 保存轨迹
        this.trail.push({ x: this.x, y: this.y, alpha: this.alpha })
        if (this.trail.length > this.trailLength) {
          this.trail.shift()
        }

        this.x += this.vx
        this.y += this.vy
        this.vy += this.gravity
        this.alpha -= this.decay

        // 添加阻力
        this.vx *= 0.99
        this.vy *= 0.99

        return this.alpha <= 0
      }

      draw() {
        // 绘制尾迹
        fireworksCtx.beginPath()
        for (let i = 0; i < this.trail.length; i++) {
          const point = this.trail[i]
          // 使用带透明度的HSL颜色
          const color = this.color.replace(')', `, ${point.alpha})`)
          fireworksCtx.strokeStyle = color.replace('hsl', 'hsla')
          fireworksCtx.lineWidth = 2
          if (i === 0) {
            fireworksCtx.moveTo(point.x, point.y)
          } else {
            fireworksCtx.lineTo(point.x, point.y)
          }
        }
        fireworksCtx.stroke()

        // 绘制粒子
        // 使用带透明度的HSL颜色
        const fillColor = this.color.replace(')', `, ${this.alpha})`)
        fireworksCtx.fillStyle = fillColor.replace('hsl', 'hsla')
        fireworksCtx.beginPath()
        fireworksCtx.arc(this.x, this.y, 2, 0, Math.PI * 2)
        fireworksCtx.fill()
      }
    }

    // 初始化星空
    const initStars = () => {
      const { width, height } = starsCanvas.value
      const numStars = Math.floor((width * height) / 1500) // 调整星星密度
      const timestamp = Date.now() // 使用时间戳作为随机种子
      stars = []

      // 创建不同大小的星星组
      const smallStars = Math.floor(numStars * 0.6) // 60%小星星
      const mediumStars = Math.floor(numStars * 0.3) // 30%中等星星
      const largeStars = numStars - smallStars - mediumStars // 10%大星星

      // 生成小星星
      for (let i = 0; i < smallStars; i++) {
        const x = Math.random() * width
        const y = Math.random() * height
        const size = Math.random() * 0.5 + 0.5 // 0.5-1.0
        const speed = Math.random() * 0.2 + 0.1
        stars.push(new Star(x, y, size, speed))
      }

      // 生成中等星星
      for (let i = 0; i < mediumStars; i++) {
        const x = Math.random() * width
        const y = Math.random() * height
        const size = Math.random() * 0.5 + 1.0 // 1.0-1.5
        const speed = Math.random() * 0.3 + 0.2
        stars.push(new Star(x, y, size, speed))
      }

      // 生成大星星
      for (let i = 0; i < largeStars; i++) {
        const x = Math.random() * width
        const y = Math.random() * height
        const size = Math.random() * 0.5 + 1.5 // 1.5-2.0
        const speed = Math.random() * 0.4 + 0.3
        stars.push(new Star(x, y, size, speed))
      }

      // 随机打乱星星数组
      for (let i = stars.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[stars[i], stars[j]] = [stars[j], stars[i]]
      }
    }

    // 处理点击事件
    const handleClick = (event) => {
      createFirework(event)
      clickCount.value++
      
      if (clickCount.value === 10) {
        showModal.value = true
      }
    }

    // 返回起名页
    const goBack = () => {
      router.push('/name')
    }

    // 创建烟花
    const createFirework = (event) => {
      const rect = fireworksCanvas.value.getBoundingClientRect()
      let x, y
      
      if (event.touches) {
        x = event.touches[0].clientX - rect.left
        y = event.touches[0].clientY - rect.top
      } else {
        x = event.clientX - rect.left
        y = event.clientY - rect.top
      }

      // 确保坐标在画布范围内
      x = Math.max(0, Math.min(x, fireworksCanvas.value.width))
      y = Math.max(0, Math.min(y, fireworksCanvas.value.height))

      // 从底部随机位置发射烟花
      const startX = Math.random() * fireworksCanvas.value.width
      const startY = fireworksCanvas.value.height
      
      fireworks.push(new Firework(startX, startY, x, y))

      // 播放音效
      if (fireworkSound.value) {
        fireworkSound.value.currentTime = 0
        fireworkSound.value.play().catch(() => {
          // 忽略自动播放限制错误
        })
      }
    }

    // 动画循环
    const animate = () => {
      // 使用较低的透明度清除星空画布，创造拖尾效果
      starsCtx.fillStyle = 'rgba(26, 0, 51, 0.15)' // 深紫色背景带透明度
      starsCtx.fillRect(0, 0, starsCanvas.value.width, starsCanvas.value.height)

      // 更新和绘制星星
      stars.forEach(star => {
        star.update()
        star.draw()
      })

      // 完全清除烟花画布
      fireworksCtx.clearRect(0, 0, fireworksCanvas.value.width, fireworksCanvas.value.height)

      // 更新和绘制烟花
      fireworks = fireworks.filter(firework => {
        const exploded = firework.update()
        firework.draw()

        if (exploded) {
          // 减少粒子数量以提高性能
          const numParticles = 80
          
          // 创建爆炸效果
          for (let i = 0; i < numParticles; i++) {
            const particle = new Particle(firework.x, firework.y, firework.color)
            particle.speed = Math.random() * 12 + 3
            particles.push(particle)
          }
          
          return false
        }
        return true
      })

      // 更新和绘制粒子
      particles = particles.filter(particle => {
        const dead = particle.update()
        particle.draw()
        return !dead
      })

      animationFrame = requestAnimationFrame(animate)
    }

    // 调整画布大小
    const resizeCanvas = () => {
      const updateCanvas = (canvas) => {
        const width = window.innerWidth
        const height = window.innerHeight
        
        canvas.width = width
        canvas.height = height
        canvas.style.width = `${width}px`
        canvas.style.height = `${height}px`
      }

      updateCanvas(starsCanvas.value)
      updateCanvas(fireworksCanvas.value)
      
      starsCtx = starsCanvas.value.getContext('2d', { alpha: false }) // 使用不透明背景
      fireworksCtx = fireworksCanvas.value.getContext('2d', { alpha: true }) // 使用透明背景
      
      // 设置星空画布的初始背景颜色
      starsCtx.fillStyle = '#1a0033' // 深紫色背景
      starsCtx.fillRect(0, 0, starsCanvas.value.width, starsCanvas.value.height)
      
      // 重新初始化星星
      initStars()
    }

    // 修改重置函数
    const resetGame = () => {
      clickCount.value = 0
      showModal.value = false
      
      // 清空现有的烟花和粒子
      fireworks = []
      particles = []
      
      // 重新初始化星空
      starsCtx.fillStyle = '#1a0033' // 深紫色背景
      starsCtx.fillRect(0, 0, starsCanvas.value.width, starsCanvas.value.height)
      initStars()
    }

    onMounted(() => {
      resizeCanvas()
      window.addEventListener('resize', resizeCanvas)
      animate()
    })

    onUnmounted(() => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    })

    return {
      starsCanvas,
      fireworksCanvas,
      fireworkSound,
      showModal,
      handleClick,
      goBack,
      resetGame
    }
  }
}
</script>

<style scoped>
.secret-page {
  width: 100%;
  height: 100vh;
  position: relative;
  background: #1a0033; /* 深紫色背景 */
  overflow: hidden;
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

.stars-canvas,
.fireworks-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.stars-canvas {
  z-index: 1;
  background: #1a0033; /* 深紫色背景 */
}

.fireworks-canvas {
  z-index: 2;
  pointer-events: none; /* 让点击事件穿透到底层 */
  background: transparent; /* 确保背景透明 */
}

/* 添加弹窗样式 */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: rgba(255, 255, 255, 0.9);
  padding: 2rem;
  border-radius: 15px;
  text-align: center;
  max-width: 90%;
  width: 400px;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
  animation: modalFadeIn 0.3s ease;
}

.modal-content h2 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.modal-content p {
  color: #666;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
}

.button-group {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.action-btn {
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  flex: 1;
  max-width: 200px;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.back-btn {
  background: linear-gradient(135deg, #6b48ff, #00bcd4);
  color: white;
}

.play-again-btn {
  background: linear-gradient(135deg, #4CAF50, #8BC34A);
  color: white;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .secret-page {
    cursor: default;
  }
  
  .modal-content {
    width: 85%;
    padding: 1.5rem;
  }
  
  .modal-content h2 {
    font-size: 1.3rem;
  }
  
  .modal-content p {
    font-size: 1rem;
  }
  
  .button-group {
    flex-direction: column;
    gap: 0.8rem;
  }
  
  .action-btn {
    max-width: none;
    width: 100%;
    padding: 1rem;
  }
}

/* 禁用默认触摸行为 */
@media (hover: none) and (pointer: coarse) {
  .secret-page {
    user-select: none;
    -webkit-user-select: none;
  }
}
</style> 