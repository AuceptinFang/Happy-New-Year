<template>
  <div class="game-container" :class="{ 'dark-theme': isDarkMode }" @click="handleGameAreaClick" @touchstart="handleGameAreaClick">
    <div class="dino-game">
      <button class="theme-toggle" @click.stop="toggleTheme">
        <div class="toggle-icon">
          <div class="sun" v-if="!isDarkMode">☀️</div>
          <div class="moon" v-else>🌙</div>
        </div>
      </button>
      <div class="score-board">
        <div class="score">得分: {{ score }}</div>
        <div class="high-score">最高分: {{ highScore }}</div>
      </div>
      <div class="game-area" ref="gameArea">
        <div class="story-text" v-if="!gameStarted">
          <h2>前方危险！</h2>
          <p>穿过大门后，你发现前方有无数奇怪的图形朝你冲来！</p>
          <p>按空格键或点击屏幕可以跳跃，躲避障碍物。</p>
          <button class="start-game-btn" @click.stop="startGameWithStory">开始挑战</button>
        </div>
        <div 
          class="dino" 
          :class="{ 'jump': isJumping }"
          :style="{ transform: `translateY(-${dinoBottom}px)` }"
        >
          <div class="dino-eye"></div>
        </div>
        <div 
          v-for="(obstacle, index) in obstacles" 
          :key="index" 
          class="obstacle"
          :class="obstacle.type"
          :style="{ 
            transform: `translateX(${obstacle.position}px)`,
            height: obstacle.height + 'px',
            width: obstacle.width + 'px',
            bottom: obstacle.bottom + 'px'
          }"
        ></div>
        <div class="ground"></div>
        
        <router-link to="/name" class="cloud-button-container">
          <div class="cloud-button">
            <div class="cloud-body">
              <div class="cloud-circle circle1"></div>
              <div class="cloud-circle circle2"></div>
              <div class="cloud-circle circle3"></div>
              <div class="cloud-circle circle4"></div>
              <div class="cloud-base"></div>
            </div>
          </div>
        </router-link>
      </div>
      
      <div v-if="isGameOver" class="game-over">
        <h2>游戏结束</h2>
        <p>得分: {{ score }}</p>
        <button @click.stop="resetGame" class="restart-btn">重新开始</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

const score = ref(0)
const highScore = ref(0)
const isJumping = ref(false)
const dinoBottom = ref(0)
const obstacles = ref([])
const gameLoop = ref(null)
const isGameOver = ref(false)
const obstacleSpawnInterval = ref(null)
const lastJumpTime = ref(0)
const isDarkMode = ref(false)
const gameStarted = ref(false)

const JUMP_HEIGHT = 150
const JUMP_DURATION = 500
const BASE_SPEED = 5
const MIN_SPAWN_INTERVAL = 1000
const MAX_SPAWN_INTERVAL = 2000

// 计算当前游戏速度
const getCurrentSpeed = () => {
  return BASE_SPEED + Math.floor(score.value / 100)
}

// 计算下一个障碍物生成时间
const getNextSpawnInterval = () => {
  return Math.random() * (MAX_SPAWN_INTERVAL - MIN_SPAWN_INTERVAL) + MIN_SPAWN_INTERVAL
}

const jump = () => {
  if (!isJumping.value && !isGameOver.value) {
    isJumping.value = true
    let jumpStart = performance.now()
    
    const animate = (currentTime) => {
      const elapsed = currentTime - jumpStart
      
      if (elapsed < JUMP_DURATION) {
        // 使用正弦函数使跳跃更自然
        const progress = elapsed / JUMP_DURATION
        const height = Math.sin(progress * Math.PI) * JUMP_HEIGHT
        dinoBottom.value = height
        requestAnimationFrame(animate)
      } else {
        dinoBottom.value = 0
        isJumping.value = false
      }
    }
    
    requestAnimationFrame(animate)
  }
}

const createObstacle = () => {
  const types = ['cactus', 'rock', 'bird']
  const type = types[Math.floor(Math.random() * types.length)]
  
  let height, width, bottom
  switch(type) {
    case 'cactus':
      height = 40 + Math.random() * 20
      width = 20
      bottom = 0
      break
    case 'rock':
      height = 30
      width = 30
      bottom = 0
      break
    case 'bird':
      height = 30
      width = 40
      bottom = 100  // 飞鸟在空中的高度
      break
  }

  obstacles.value.push({
    position: 800,
    type,
    height,
    width,
    bottom,
    passed: false
  })
}

const updateGame = () => {
  if (isGameOver.value) return

  const currentSpeed = getCurrentSpeed()
  const dinoBox = {
    left: 50,
    right: 90,
    bottom: dinoBottom.value,
    top: dinoBottom.value + 60
  }

  for (let i = obstacles.value.length - 1; i >= 0; i--) {
    const obstacle = obstacles.value[i]
    obstacle.position -= currentSpeed

    const obstacleBox = {
      left: obstacle.position,
      right: obstacle.position + obstacle.width,
      bottom: obstacle.bottom,  // 使用障碍物的bottom属性
      top: obstacle.bottom + obstacle.height  // 根据bottom计算top
    }

    // 碰撞检测
    if (
      !obstacle.passed &&
      dinoBox.right > obstacleBox.left &&
      dinoBox.left < obstacleBox.right &&
      dinoBox.top > obstacleBox.bottom &&
      dinoBox.bottom < obstacleBox.top
    ) {
      isGameOver.value = true
      if (score.value > highScore.value) {
        highScore.value = score.value
      }
      return
    }

    // 得分检测
    if (!obstacle.passed && obstacleBox.right < dinoBox.left) {
      score.value += 20
      obstacle.passed = true
    }

    // 移除超出屏幕的障碍物
    if (obstacle.position < -50) {
      obstacles.value.splice(i, 1)
    }
  }
}

const resetGame = () => {
  score.value = 0
  obstacles.value = []
  isGameOver.value = false
  dinoBottom.value = 0
  isJumping.value = false
  
  // 重新启动游戏循环
  if (gameLoop.value) clearInterval(gameLoop.value)
  if (obstacleSpawnInterval.value) clearInterval(obstacleSpawnInterval.value)
  
  startGame()
}

const startGame = () => {
  gameLoop.value = setInterval(updateGame, 16)
  spawnObstacles()
}

const spawnObstacles = () => {
  const spawn = () => {
    createObstacle()
    obstacleSpawnInterval.value = setTimeout(spawn, getNextSpawnInterval())
  }
  spawn()
}

const handleGameAreaClick = (event) => {
  // 如果点击的是按钮或者游戏还没开始，不触发跳跃
  if (
    event.target.closest('.start-game-btn') || 
    event.target.closest('.restart-btn') || 
    !gameStarted.value
  ) {
    return
  }
  
  event.preventDefault()
  if (!isGameOver.value) {
    jump()
  }
}

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
}

const startGameWithStory = () => {
  gameStarted.value = true
  startGame()
}

onMounted(() => {
  // 不要立即开始游戏，等待用户点击开始按钮
  window.addEventListener('keydown', handleKeyPress)
})

onUnmounted(() => {
  if (gameLoop.value) clearInterval(gameLoop.value)
  if (obstacleSpawnInterval.value) clearTimeout(obstacleSpawnInterval.value)
  window.removeEventListener('keydown', handleKeyPress)
})
</script>

<style scoped>
.game-container {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #87CEEB 0%, #4169E1 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(1rem, 3vw, 2rem);
  position: relative;
  overflow: hidden;
}

/* 添加背景动画效果 */
.game-container::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.2) 0%, transparent 10%),
    radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.2) 0%, transparent 10%);
  animation: floatingLight 10s infinite linear;
}

@keyframes floatingLight {
  0% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-20px) scale(1.1); }
  100% { transform: translateY(0) scale(1); }
}

.dino-game {
  width: min(1000px, 95%);
  height: min(400px, 50vh);
  background: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  border: none;
}

.score-board {
  position: absolute;
  top: 20px;
  right: 80px;
  font-family: 'Courier New', monospace;
  z-index: 10;
  background: rgba(255, 255, 255, 0.9);
  padding: clamp(0.5rem, 1.5vw, 1rem);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-size: clamp(0.9rem, 2vw, 1.1rem);
}

.score, .high-score {
  font-size: 18px;
  margin: 5px 0;
  color: #2c3e50;
  text-shadow: 1px 1px 0 rgba(255, 255, 255, 0.5);
}

.game-area {
  width: 100%;
  height: 100%;
  position: relative;
  touch-action: manipulation;  /* 优化移动端触摸体验 */
}

.dino {
  width: 40px;
  height: 60px;
  background: linear-gradient(135deg, #333 0%, #222 100%);
  position: absolute;
  left: 50px;
  bottom: 0;
  border-radius: 8px 8px 4px 4px;
  transition: transform 0.1s linear;
  will-change: transform;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.dino-eye {
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
  position: absolute;
  top: 12px;
  right: 8px;
  box-shadow: inset -1px -1px 2px rgba(0, 0, 0, 0.3);
}

.obstacle {
  position: absolute;
  will-change: transform;
}

.cactus {
  background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
  border-radius: 3px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.rock {
  background: linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%);
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.bird {
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
  border-radius: 50% 50% 0 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.ground {
  width: 100%;
  height: 2px;
  background: #333;
  position: absolute;
  bottom: 0;
}

.game-over {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.95);
  padding: clamp(1.5rem, 4vw, 2.5rem);
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(5px);
  width: min(300px, 80%);
  z-index: 1000;
}

.restart-btn {
  margin-top: 1rem;
  padding: clamp(0.8rem, 2vw, 1.2rem) clamp(1.5rem, 3vw, 2rem);
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: clamp(1rem, 2.5vw, 1.2rem);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
  box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
}

.restart-btn:hover {
  background: linear-gradient(135deg, #2980b9 0%, #2472a4 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(52, 152, 219, 0.4);
}

.cloud-button-container {
  position: absolute;
  top: 20px;
  left: 20px;
  text-decoration: none;
  z-index: 10;
}

.cloud-button {
  position: relative;
  width: 100px;
  height: 60px;
  cursor: pointer;
  animation: floatAndRotate 8s infinite linear;
  filter: drop-shadow(0 5px 15px rgba(255, 255, 255, 0.4));
}

@keyframes floatAndRotate {
  0% { 
    transform: rotate(0deg) translateY(0px) scale(1); 
    filter: drop-shadow(0 5px 15px rgba(255, 255, 255, 0.4));
  }
  25% { 
    transform: rotate(90deg) translateY(-8px) scale(1.05); 
    filter: drop-shadow(0 8px 20px rgba(255, 255, 255, 0.6));
  }
  50% { 
    transform: rotate(180deg) translateY(0px) scale(1); 
    filter: drop-shadow(0 5px 15px rgba(255, 255, 255, 0.4));
  }
  75% { 
    transform: rotate(270deg) translateY(8px) scale(0.95); 
    filter: drop-shadow(0 3px 10px rgba(255, 255, 255, 0.3));
  }
  100% { 
    transform: rotate(360deg) translateY(0px) scale(1); 
    filter: drop-shadow(0 5px 15px rgba(255, 255, 255, 0.4));
  }
}

.cloud-body {
  position: relative;
  width: 100%;
  height: 100%;
}

.cloud-circle {
  position: absolute;
  background: linear-gradient(135deg, #fff 0%, #f0f0f0 100%);
  border: 2px solid #333;
  border-radius: 50%;
  box-shadow: inset -2px -2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.circle1 {
  width: 30px;
  height: 30px;
  top: 8px;
  left: 15px;
  transform: scale(1.1);
}

.circle2 {
  width: 35px;
  height: 35px;
  top: 5px;
  left: 35px;
  transform: scale(1.2);
}

.circle3 {
  width: 28px;
  height: 28px;
  top: 10px;
  left: 60px;
  transform: scale(1.05);
}

.circle4 {
  width: 25px;
  height: 25px;
  top: 12px;
  left: 75px;
  transform: scale(0.95);
}

.cloud-base {
  position: absolute;
  width: 80px;
  height: 20px;
  background: linear-gradient(135deg, #fff 0%, #f0f0f0 100%);
  border: 2px solid #333;
  border-radius: 20px;
  bottom: 15px;
  left: 15px;
  box-shadow: inset -2px -2px 4px rgba(0, 0, 0, 0.1);
}

.theme-toggle {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #333;
  background: white;
  cursor: pointer;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.theme-toggle:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.toggle-icon {
  font-size: 20px;
  line-height: 1;
}

/* 暗色主题样式 */
.dark-theme {
  background: linear-gradient(135deg, #1a1a1a 0%, #2c3e50 100%);
}

.dark-theme .dino-game {
  background: #2c3e50;
  border-color: #fff;
}

.dark-theme .score-board {
  background: rgba(0, 0, 0, 0.7);
}

.dark-theme .score,
.dark-theme .high-score {
  color: #fff;
  text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.5);
}

.dark-theme .dino {
  background: linear-gradient(135deg, #fff 0%, #e0e0e0 100%);
}

.dark-theme .dino-eye {
  background: #333;
}

.dark-theme .ground {
  background: #fff;
}

.dark-theme .cactus {
  background: linear-gradient(135deg, #4cd137 0%, #44bd32 100%);
}

.dark-theme .rock {
  background: linear-gradient(135deg, #7f8fa6 0%, #718093 100%);
}

.dark-theme .bird {
  background: linear-gradient(135deg, #ff4757 0%, #ff6b81 100%);
}

.dark-theme .game-over {
  background: rgba(0, 0, 0, 0.9);
  color: #fff;
}

.dark-theme .restart-btn {
  background: linear-gradient(135deg, #0097e6 0%, #00a8ff 100%);
}

.dark-theme .restart-btn:hover {
  background: linear-gradient(135deg, #00a8ff 0%, #0097e6 100%);
}

.dark-theme .theme-toggle {
  background: #2c3e50;
  border-color: #fff;
  color: #fff;
}

.dark-theme .cloud-circle,
.dark-theme .cloud-base {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  border-color: #fff;
}

.dark-theme .cloud-button {
  filter: drop-shadow(0 5px 15px rgba(0, 0, 0, 0.4));
}

@media (max-width: 768px) {
  .cloud-button-container {
    top: 10px;
    left: 10px;
  }

  .theme-toggle {
    top: 10px;
    right: 10px;
  }

  .score-board {
    top: 10px;
    right: 60px;
  }

  .story-text h2 {
    font-size: clamp(1.4rem, 4vw, 1.8rem);
  }

  .story-text p {
    font-size: clamp(0.9rem, 3vw, 1.1rem);
  }
}

.story-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.95);
  padding: clamp(1.5rem, 4vw, 2.5rem);
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  width: min(400px, 80%);
  z-index: 1000;
  pointer-events: auto;
}

.story-text h2 {
  color: #2c3e50;
  font-size: clamp(1.4rem, 4vw, 1.8rem);
  margin-bottom: 1rem;
}

.story-text p {
  color: #34495e;
  font-size: clamp(0.9rem, 3vw, 1.1rem);
  line-height: 1.6;
  margin: 0.5rem 0;
}

.start-game-btn, .restart-btn {
  position: relative;
  z-index: 1001;
  pointer-events: auto;
}
</style> 