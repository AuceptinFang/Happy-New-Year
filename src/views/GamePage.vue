<template>
  <div class="game-page">
    <div class="content">
      <div class="question-container">
        <div class="story-section">
          <h3 class="story-title">终点就在眼前！</h3>
          <p class="story-text">经过重重考验，你终于来到了最后一关。</p>
          <p class="story-text">前方就是通往自由的大门，但还需要通过最后一道考验...</p>
          <p class="story-text">一道来自东方的数学题，正等待着你的解答。</p>
        </div>
        <h2 class="question-title">解答下面的数学题</h2>
        <div class="question-content">
          <div class="question-image">
            <img src="/images/1737707617386.jpg" alt="数学题" class="math-image">
          </div>
          <div class="options-container">
            <label class="option-item" :class="{ 'selected': selectedAnswer === 'A' }">
              <input type="radio" v-model="selectedAnswer" value="A">
              <span class="option-text">A. 0</span>
            </label>
            <label class="option-item" :class="{ 'selected': selectedAnswer === 'B' }">
              <input type="radio" v-model="selectedAnswer" value="B">
              <span class="option-text">B. 1</span>
            </label>
            <label class="option-item" :class="{ 'selected': selectedAnswer === 'C' }">
              <input type="radio" v-model="selectedAnswer" value="C">
              <span class="option-text">C. 2</span>
            </label>
            <label class="option-item" :class="{ 'selected': selectedAnswer === 'D' }">
              <input type="radio" v-model="selectedAnswer" value="D">
              <span class="option-text">D. 3</span>
            </label>
          </div>
          <button 
            v-if="selectedAnswer && !hasAnswered" 
            @click="checkAnswer" 
            class="submit-btn">
            <span class="btn-text">提交答案</span>
            <span class="btn-icon">→</span>
          </button>
          <div v-if="hasAnswered" 
            class="result-message" 
            :class="{ 'correct': isCorrect, 'incorrect': !isCorrect }">
            <div class="result-icon">{{ isCorrect ? '✓' : '✗' }}</div>
            <div class="result-text">{{ isCorrect ? '恭喜你答对了！' : '很遗憾，答错了。' }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'GamePage',
  setup() {
    const router = useRouter()
    const selectedAnswer = ref('')
    const answered = ref(false)
    const isCorrect = ref(false)
    const hasAnswered = ref(false)

    const checkAnswer = () => {
      if (!selectedAnswer.value) return
      answered.value = true
      hasAnswered.value = true
      isCorrect.value = selectedAnswer.value === 'D' // D选项是正确答案
      
      if (selectedAnswer.value === 'D') {
        setTimeout(() => {
          router.push('/endpoint')  // 修改为小写的 endpoint 路由
        }, 1500)
      } else {
        // 如果选择了ABC，自动跳转到惩罚页面
        setTimeout(() => {
          router.push('/punishment')
        }, 1500) // 延迟1.5秒跳转，让用户看到答错提示
      }
    }

    return {
      selectedAnswer,
      answered,
      isCorrect,
      hasAnswered,
      checkAnswer
    }
  }
}
</script>

<style scoped>
.game-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e, #16213e, #1a1a2e);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  font-family: 'Microsoft YaHei', sans-serif;
}

.content {
  width: 100%;
  max-width: 900px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-radius: 30px;
  padding: 3rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.question-container {
  width: 100%;
}

.question-title {
  color: #fff;
  font-size: 2.2rem;
  margin-bottom: 2.5rem;
  text-align: center;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  letter-spacing: 2px;
}

.question-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.question-image {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.math-image {
  width: 100%;
  height: auto;
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
}

.math-image:hover {
  transform: scale(1.02);
}

.options-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  width: 100%;
  max-width: 600px;
  margin: 2rem auto;
}

.option-item {
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  padding: 1.2rem 2rem;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.option-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.option-item.selected {
  background: rgba(64, 156, 255, 0.2);
  border-color: #409cff;
}

.option-item input[type="radio"] {
  width: 20px;
  height: 20px;
  margin: 0;
  cursor: pointer;
}

.option-text {
  color: #fff;
  font-size: 1.2rem;
  font-weight: 500;
}

.submit-btn {
  background: linear-gradient(45deg, #409cff, #3178ff);
  border: none;
  padding: 1rem 3rem;
  border-radius: 12px;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1rem auto;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(64, 156, 255, 0.4);
}

.btn-text {
  font-weight: 500;
}

.btn-icon {
  font-size: 1.4rem;
  transition: transform 0.3s ease;
}

.submit-btn:hover .btn-icon {
  transform: translateX(5px);
}

.result-message {
  text-align: center;
  padding: 1.5rem;
  border-radius: 15px;
  font-size: 1.3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  animation: fadeIn 0.5s ease;
}

.result-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.correct {
  color: #4cd137;
}

.incorrect {
  color: #ff4757;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .content {
    padding: 2rem;
  }

  .question-title {
    font-size: 1.8rem;
  }

  .options-container {
    grid-template-columns: 1fr;
  }

  .option-item {
    padding: 1rem 1.5rem;
  }

  .option-text {
    font-size: 1.1rem;
  }
}

.story-section {
  text-align: center;
  margin-bottom: 2rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.story-title {
  color: #fff;
  font-size: 2rem;
  margin-bottom: 1.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.story-text {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  line-height: 1.8;
  margin: 0.8rem 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}
</style> 