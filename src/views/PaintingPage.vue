<template>
  <div class="snake-artist">
    <div class="couplet-container">
      <div class="horizontal-scroll">画一条蛇</div>
      <div class="vertical-couplets">
        <div class="couplet left">蛇行翠柳随风舞</div>
        <div class="couplet right">喜气盈门贺岁福</div>
      </div>
    </div>
    <canvas 
      ref="canvas"
      @mousedown="startDrawing"   
      @mousemove="drawing"        
      @mouseup="stopDrawing"      
      @mouseleave="stopDrawing"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="stopDrawing"
      @touchcancel="stopDrawing"   
    ></canvas>

    <div class="control-panel">
      <button @click="clearCanvas" class="snake-btn">
        🐍 重新绘制
      </button>
      
      <button 
        @click="evaluateDrawing" 
        :disabled="isEvaluating"
        class="snake-btn magic-btn"
      >
        🔮 {{ isEvaluating ? '分析中...' : '分析画作' }}
      </button>
    </div>

    <div v-if="score !== null" class="crystal-ball">
      <div class="score-display">
        蛇相似度: {{ score }}%
        <span v-if="score >= 80" class="success">🎉 是条好蛇！</span>
        <span v-if="score < 80" class="fail">😢 再试一次...</span>
      </div>
      <div class="snake-progress">
        <div 
          class="snake-bar" 
          :style="{ width: score + '%' }"
          :class="{ 'success-bar': score >= 80 }"
        ></div>
      </div>
      <div class="feedback-text" v-if="feedback">
        {{ feedback }}
      </div>
      <button 
        v-if="score >= 80" 
        @click="goToNextPage" 
        class="next-btn"
      >
        继续探索 →
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const canvas = ref(null)
    const ctx = ref(null)
    const isDrawing = ref(false)
    const path = ref([])
    const score = ref(null)
    const isEvaluating = ref(false)
    const feedback = ref('')
    const router = useRouter()

    // 初始化画布
    onMounted(() => {
      if (!canvas.value) {
        console.error('Canvas 未找到')
        return
      }
      try {
        // 根据设备像素比调整画布尺寸
        const dpr = window.devicePixelRatio || 1
        const rect = canvas.value.getBoundingClientRect()
        
        // 设置画布的实际尺寸
        canvas.value.width = rect.width * dpr
        canvas.value.height = rect.height * dpr
        
        ctx.value = canvas.value.getContext('2d')
        if (!ctx.value) {
          throw new Error('无法获取 Canvas 上下文')
        }
        
        // 缩放上下文以匹配设备像素比
        ctx.value.scale(dpr, dpr)
        
        // 设置绘图样式
        ctx.value.lineWidth = 8
        ctx.value.lineCap = 'round'
        ctx.value.strokeStyle = '#4CAF50'
        
        // 绘制初始背景
        ctx.value.fillStyle = '#fff8f0'
        ctx.value.fillRect(0, 0, rect.width, rect.height)
        
        // 添加窗口大小改变事件监听
        const handleResize = () => {
          const newRect = canvas.value.getBoundingClientRect()
          canvas.value.width = newRect.width * dpr
          canvas.value.height = newRect.height * dpr
          ctx.value.scale(dpr, dpr)
          ctx.value.lineWidth = 8
          ctx.value.lineCap = 'round'
          ctx.value.strokeStyle = '#4CAF50'
          ctx.value.fillStyle = '#fff8f0'
          ctx.value.fillRect(0, 0, newRect.width, newRect.height)
        }
        
        window.addEventListener('resize', handleResize)
        
        // 组件卸载时移除事件监听
        onUnmounted(() => {
          window.removeEventListener('resize', handleResize)
        })
      } catch (error) {
        console.error('Canvas 初始化错误:', error)
      }
    })

    // 计算路径的总长度
    const calculatePathLength = () => {
      let length = 0
      for (let i = 1; i < path.value.length; i++) {
        const dx = path.value[i].x - path.value[i-1].x
        const dy = path.value[i].y - path.value[i-1].y
        length += Math.sqrt(dx * dx + dy * dy)
      }
      return length
    }

    // 计算路径的曲折度（通过计算方向变化）
    const calculateCurvature = () => {
      let directionChanges = 0
      for (let i = 2; i < path.value.length; i++) {
        const prev = path.value[i-2]
        const curr = path.value[i-1]
        const next = path.value[i]
        
        const dx1 = curr.x - prev.x
        const dy1 = curr.y - prev.y
        const dx2 = next.x - curr.x
        const dy2 = next.y - curr.y
        
        // 计算两个向量的点积
        const dotProduct = dx1 * dx2 + dy1 * dy2
        const mag1 = Math.sqrt(dx1 * dx1 + dy1 * dy1)
        const mag2 = Math.sqrt(dx2 * dx2 + dy2 * dy2)
        
        // 计算角度变化
        if (mag1 > 0 && mag2 > 0) {
          const cosTheta = dotProduct / (mag1 * mag2)
          if (cosTheta < 0.95) { // 大约 18 度以上的转弯
            directionChanges++
          }
        }
      }
      return directionChanges
    }

    // 计算起点和终点的距离
    const calculateEndpointDistance = () => {
      if (path.value.length < 2) return 0
      const start = path.value[0]
      const end = path.value[path.value.length - 1]
      const dx = end.x - start.x
      const dy = end.y - start.y
      return Math.sqrt(dx * dx + dy * dy)
    }

    // 评估绘画
    const evaluateDrawing = () => {
      if (path.value.length < 5) {
        alert('🐍 请多画一些！')
        return
      }

      isEvaluating.value = true
      
      try {
        // 计算各个维度的分数
        const pathLength = calculatePathLength()
        const curvature = calculateCurvature()
        const endpointDistance = calculateEndpointDistance()
        
        // 长度评分 (0-30分)
        const expectedLength = Math.min(canvas.value.width, canvas.value.height) * 0.8
        const lengthScore = Math.min(30, (pathLength / expectedLength) * 30)
        
        // 曲折度评分 (0-35分)
        const expectedCurves = Math.max(3, Math.floor(pathLength / 100))
        const curvatureScore = Math.min(35, (curvature / expectedCurves) * 35)
        
        // 起终点距离评分 (0-25分)
        const maxDistance = pathLength * 0.3
        const distanceScore = Math.max(0, 25 - (endpointDistance / maxDistance) * 25)
        
        // 平滑度评分 (0-10分)
        const smoothnessScore = Math.min(10, calculateSmoothnessScore())
        
        // 总分（确保不超过100分）
        const totalScore = Math.min(100, Math.round(lengthScore + curvatureScore + distanceScore + smoothnessScore))
        score.value = totalScore

        // 生成反馈
        let feedbackText = []
        if (lengthScore < 20) feedbackText.push('蛇蛇可以再长一些')
        if (curvatureScore < 25) feedbackText.push('可以画得更蜿蜒一些')
        if (distanceScore < 15) feedbackText.push('头尾可以更接近一些')
        if (smoothnessScore < 5) feedbackText.push('线条可以更流畅一些')
        
        feedback.value = feedbackText.length > 0 
          ? '提示：' + feedbackText.join('，') + '。'
          : '画得不错！'
      } catch (err) {
        console.error('评估错误:', err)
        score.value = null
        feedback.value = '出错了，请重试'
      } finally {
        isEvaluating.value = false
      }
    }

    // 计算路径的平滑度
    const calculateSmoothnessScore = () => {
      if (path.value.length < 3) return 0
      
      let smoothnessSum = 0
      for (let i = 2; i < path.value.length; i++) {
        const p1 = path.value[i-2]
        const p2 = path.value[i-1]
        const p3 = path.value[i]
        
        // 计算两个向量的角度变化
        const v1x = p2.x - p1.x
        const v1y = p2.y - p1.y
        const v2x = p3.x - p2.x
        const v2y = p3.y - p2.y
        
        // 计算向量夹角的余弦值
        const dotProduct = v1x * v2x + v1y * v2y
        const mag1 = Math.sqrt(v1x * v1x + v1y * v1y)
        const mag2 = Math.sqrt(v2x * v2x + v2y * v2y)
        
        if (mag1 > 0 && mag2 > 0) {
          const cosTheta = dotProduct / (mag1 * mag2)
          // 角度变化越大，平滑度越低
          smoothnessSum += Math.abs(cosTheta)
        }
      }
      
      // 计算平均平滑度并转换为分数
      const avgSmoothness = smoothnessSum / (path.value.length - 2)
      return Math.min(10, avgSmoothness * 10)
    }

    // 开始绘制
    const startDrawing = (e) => {
      isDrawing.value = true
      path.value = []
      const rect = canvas.value.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      path.value.push({ x, y })
      ctx.value.beginPath()
      ctx.value.moveTo(x, y)
    }

    // 绘制中
    const drawing = (e) => {
      if (!isDrawing.value) return
      const rect = canvas.value.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      path.value.push({ x, y })
      ctx.value.lineTo(x, y)
      ctx.value.stroke()
    }

    // 停止绘制
    const stopDrawing = () => {
      isDrawing.value = false
    }

    // 清除画布
    const clearCanvas = () => {
      ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
      ctx.value.fillStyle = '#fff8f0'
      ctx.value.fillRect(0, 0, canvas.value.width, canvas.value.height)
      score.value = null
      feedback.value = ''
      path.value = []
    }

    // 添加跳转到下一页的方法
    const goToNextPage = () => {
      router.push('/game')
    }

    const handleTouchStart = (e) => {
      e.preventDefault()
      const touch = e.touches[0]
      const rect = canvas.value.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      
      // 计算触摸点相对于画布的准确位置
      const x = (touch.clientX - rect.left) * (canvas.value.width / (rect.width * dpr))
      const y = (touch.clientY - rect.top) * (canvas.value.height / (rect.height * dpr))
      
      isDrawing.value = true
      path.value = []
      path.value.push({ x, y })
      
      ctx.value.beginPath()
      ctx.value.moveTo(x, y)
    }

    const handleTouchMove = (e) => {
      e.preventDefault()
      if (!isDrawing.value) return
      
      const touch = e.touches[0]
      const rect = canvas.value.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      
      // 计算触摸点相对于画布的准确位置
      const x = (touch.clientX - rect.left) * (canvas.value.width / (rect.width * dpr))
      const y = (touch.clientY - rect.top) * (canvas.value.height / (rect.height * dpr))
      
      path.value.push({ x, y })
      ctx.value.lineTo(x, y)
      ctx.value.stroke()
    }

    return {
      canvas,
      isDrawing,
      score,
      isEvaluating,
      feedback,
      startDrawing,
      drawing,
      stopDrawing,
      handleTouchStart,
      handleTouchMove,
      clearCanvas,
      evaluateDrawing,
      goToNextPage
    }
  }
}
</script>

<style>
/* 全局背景样式 */
html {
  min-height: 100%;
  background: linear-gradient(135deg,#ffaaaa, #ffe44d);
}

body {
  min-height: 100%;
  margin: 0;
  padding: 0;
  background: linear-gradient(135deg, #ffa0a0, #ffc852);
}

#app {
  min-height: 100vh;
  background: linear-gradient(135deg, #ffaaaa, #ffe44d);
}

.snake-artist {
  max-width: 800px;
  width: 100%;
  margin: 6rem auto 2rem; /* 增加顶部边距，为横批留出空间 */
  padding: 20px;
  background: linear-gradient(135deg, #fff9f9, #fff5f5);
  color: #333333;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(255, 192, 192, 0.3);
  transition: background 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: visible;
  border: 2px solid #ffc0cb;
}

/* 添加喜庆的装饰元素 */
.snake-artist::before,
.snake-artist::after {
  content: '';
  position: absolute;
  width: 100px;
  height: 100px;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ff6b6b"><path d="M12 2l2.4 7.4h7.6l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4-6.2-4.5h7.6z"/></svg>');
  background-repeat: no-repeat;
  background-size: contain;
  opacity: 0.1;
  z-index: 0;
}

.snake-artist::before {
  top: -20px;
  left: -20px;
  transform: rotate(-45deg);
}

.snake-artist::after {
  bottom: -20px;
  right: -20px;
  transform: rotate(135deg);
}

canvas {
  width: 100%;
  height: 400px;
  border: 3px solid #ffb6c1;
  background: linear-gradient(to bottom, #ffffff, #fff9f9);
  border-radius: 8px;
  cursor: crosshair;
  display: block;
  position: relative;
  z-index: 2; /* 确保画布在最上层 */
  touch-action: none; /* 防止触摸滚动 */
}

.control-panel {
  margin-top: 1.5rem;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.snake-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 25px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s, opacity 0.2s;
  background: linear-gradient(135deg, #ffb6c1, #ffd1d1);
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  box-shadow: 0 4px 15px rgba(255, 182, 193, 0.3);
}

.snake-btn:hover {
  transform: scale(1.05);
}

.snake-btn:active {
  transform: scale(0.95);
}

.magic-btn {
  background: linear-gradient(135deg, #ffb6c1, #ffc0cb);
  color: white;
}

.crystal-ball {
  margin-top: 2rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #fff9f9, #fff5f5);
  color: #333;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(255, 182, 193, 0.2);
  width: 100%;
  border: 1px solid rgba(255, 182, 193, 0.3);
  position: relative;
  z-index: 1;
}

.score-display {
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1rem;
}

.success {
  color: #ff8da1;
  animation: snakeDance 0.5s ease;
}

.fail {
  color: #f44336;
}

.snake-progress {
  height: 20px;
  background: rgba(255, 182, 193, 0.1);
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.snake-bar {
  height: 100%;
  background: #ffb6c1;
  transition: width 0.5s ease;
}

.success-bar {
  background: linear-gradient(90deg, #ffb6c1, #ffc0cb);
}

.feedback-text {
  text-align: center;
  color: #666;
  font-size: 1.1rem;
  margin-top: 1rem;
}

@keyframes snakeDance {
  0% { transform: rotate(0deg); }
  25% { transform: rotate(5deg); }
  50% { transform: rotate(-5deg); }
  75% { transform: rotate(3deg); }
  100% { transform: rotate(0deg); }
}

@media (max-width: 768px) {
  .snake-artist {
    margin: 5rem auto 1rem;
    padding: 15px;
    width: 95%;
  }

  canvas {
    height: 300px;
    border-width: 2px;
  }

  .control-panel {
    position: relative;
    z-index: 2; /* 确保控制面板可点击 */
  }

  .crystal-ball {
    position: relative;
    z-index: 2; /* 确保评分区域可点击 */
  }

  .snake-btn {
    width: 100%;
    padding: 12px;
    font-size: 1rem;
  }

  .score-display {
    font-size: 1.2rem;
  }

  .feedback-text {
    font-size: 1rem;
  }

  .horizontal-scroll {
    width: 140px;
    font-size: 20px;
    padding: 8px 0;
    top: 15px;
  }
  
  .couplet {
    font-size: 20px;
    height: 240px;
    padding: 20px 10px;
    letter-spacing: 6px;
  }
  
  .couplet.left {
    left: 10px;
  }
  
  .couplet.right {
    right: 10px;
  }

  .next-btn {
    width: 100%;
    padding: 12px;
    font-size: 1rem;
    margin-top: 1rem;
  }
}

/* 小屏幕适配 */
@media (max-width: 480px) {
  .snake-artist {
    margin: 4rem auto 1rem;
    padding: 10px;
    width: 100%;
  }

  canvas {
    height: 250px;
  }

  .control-panel {
    padding: 0 10px;
  }

  .snake-btn {
    padding: 10px;
    font-size: 0.9rem;
  }

  .score-display {
    font-size: 1rem;
  }

  .feedback-text {
    font-size: 0.9rem;
  }

  .horizontal-scroll {
    width: 120px;
    font-size: 18px;
    padding: 6px 0;
    top: 10px;
  }

  .couplet {
    font-size: 16px;
    height: 200px;
    padding: 15px 8px;
    letter-spacing: 4px;
  }

  .couplet.left {
    left: 5px;
  }

  .couplet.right {
    right: 5px;
  }

  .next-btn {
    padding: 10px;
    font-size: 0.9rem;
  }
}

/* 触摸设备优化 */
@media (hover: none) and (pointer: coarse) {
  canvas {
    cursor: default;
    touch-action: none;
    -webkit-user-select: none;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }

  .snake-btn:hover {
    transform: none;
  }

  .snake-btn:active {
    transform: scale(0.95);
  }

  .next-btn:hover {
    transform: none;
  }

  .next-btn:active {
    transform: translateY(1px);
  }
}

/* 对联和横批样式 */
.couplet-container {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10; /* 提高层级，确保在最上层 */
}

.horizontal-scroll {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 180px;
  padding: 10px 0;
  background: linear-gradient(135deg, #e60012, #8b0000);
  color: #fff;
  font-size: 24px;
  font-weight: bold;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
  z-index: 11;
}

.vertical-couplets {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 100vh;
  display: flex;
  justify-content: space-between;
  pointer-events: none;
  z-index: 10;
}

.couplet {
  writing-mode: vertical-rl;
  font-size: 28px;
  height: 300px;
  padding: 30px 15px;
  background: linear-gradient(135deg, #e60012, #8b0000);
  color: #fff;
  letter-spacing: 8px;
  font-weight: bold;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
}

.couplet.left {
  left: 20px;
}

.couplet.right {
  right: 20px;
}

/* 添加继续探索按钮样式 */
.next-btn {
  display: block;
  margin: 20px auto 0;
  padding: 12px 24px;
  background: linear-gradient(135deg, #e60012, #8b0000);
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(230, 0, 18, 0.3);
}

.next-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(230, 0, 18, 0.4);
}

.next-btn:active {
  transform: translateY(1px);
}

@media (max-width: 768px) {
  .horizontal-scroll {
    width: 140px;
    font-size: 20px;
    padding: 8px 0;
    top: 15px;
  }
  
  .couplet {
    font-size: 20px;
    height: 240px;
    padding: 20px 10px;
    letter-spacing: 6px;
  }
  
  .couplet.left {
    left: 10px;
  }
  
  .couplet.right {
    right: 10px;
  }
  
  .next-btn {
    padding: 10px 20px;
    font-size: 14px;
  }
}
</style> 