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
  background: linear-gradient(135deg, #f6f8fa 0%, #e9ecef 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: clamp(1rem, 3vw, 2rem);
}

.content {
  width: 100%;
  max-width: 900px;
  background: white;
  border-radius: 15px;
  padding: clamp(1rem, 3vw, 2rem);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
}

.question-container {
  max-width: min(800px, 95%);
  width: 100%;
  background: white;
  border-radius: 15px;
  padding: clamp(1rem, 3vw, 2rem);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
}

.question-title {
  font-size: clamp(1.2rem, 4vw, 1.8rem);
  color: #333;
  margin-bottom: 1.5rem;
  text-align: center;
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
  margin: 0 auto 2rem;
  text-align: center;
}

.question-image img {
  width: 100%;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.options-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: clamp(0.5rem, 2vw, 1rem);
  margin-bottom: 2rem;
}

.option-item {
  padding: clamp(0.8rem, 2vw, 1.2rem);
  background: #f8f9fa;
  border: 2px solid #dee2e6;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: clamp(0.9rem, 2.5vw, 1.1rem);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.option-item:hover {
  background: #e9ecef;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
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
  color: #333;
  font-size: 1.2rem;
  font-weight: 500;
}

.submit-btn {
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
  padding: clamp(0.8rem, 2vw, 1.2rem);
  font-size: clamp(1rem, 2.5vw, 1.2rem);
  background: linear-gradient(45deg, #007bff, #0056b3);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: block;
}

.submit-btn:hover {
  background: linear-gradient(45deg, #0056b3, #004085);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
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
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 10px;
  font-size: clamp(0.9rem, 2.5vw, 1.1rem);
}

.result-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.correct {
  background: #d4edda;
  color: #155724;
}

.incorrect {
  background: #f8d7da;
  color: #721c24;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .options-container {
    grid-template-columns: 1fr;
  }

  .option-item {
    text-align: left;
  }

  .submit-btn {
    width: 90%;
  }
}

/* 小屏幕适配 */
@media (max-width: 480px) {
  .question-container {
    padding: 1rem;
  }

  .question-image {
    margin: 1rem auto;
  }

  .option-item {
    padding: 0.8rem;
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
  color: #333;
  font-size: clamp(1rem, 2.5vw, 1.2rem);
  line-height: 1.6;
  margin: clamp(0.8rem, 2vw, 1rem) 0;
  background: rgba(255, 255, 255, 0.95);
  padding: clamp(1.5rem, 4vw, 2rem);
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 10;
  max-width: min(600px, 90%);
  margin: 0 auto;
}

.story-text h2 {
  color: #ff4d4d;
  font-size: clamp(1.5rem, 4vw, 2rem);
  margin-bottom: clamp(1rem, 3vw, 1.5rem);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.story-text p {
  margin: clamp(0.8rem, 2vw, 1rem) 0;
  text-shadow: none;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .story-text {
    padding: 1.2rem;
    margin: 1rem;
  }
}
</style> 