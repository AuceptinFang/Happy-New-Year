<template>
  <div class="game-page">
    <div class="content">
      <div class="question-container">
        <h2 class="question-title">解答下面的数学题：</h2>
        <div class="math-question">
          <p>若已知 f(π) = 2 且 ∫[f(x) + f''(x)]sinx dx = 5，则 f(0) = ?</p>
          <div class="options">
            <label class="option">
              <input type="radio" v-model="selectedAnswer" value="0">
              <span>A. 0</span>
            </label>
            <label class="option">
              <input type="radio" v-model="selectedAnswer" value="1">
              <span>B. 1</span>
            </label>
            <label class="option">
              <input type="radio" v-model="selectedAnswer" value="2">
              <span>C. 2</span>
            </label>
            <label class="option">
              <input type="radio" v-model="selectedAnswer" value="3">
              <span>D. 3</span>
            </label>
          </div>
        </div>
        <div class="button-container">
          <button 
            class="submit-btn" 
            @click="checkAnswer" 
            v-if="!answered && selectedAnswer">
            提交答案
          </button>
          <router-link 
            to="/punishment" 
            v-if="answered && !isCorrect">
            <button class="punishment-btn">接受惩罚</button>
          </router-link>
          <div class="result-message" v-if="answered">
            {{ isCorrect ? '恭喜你答对了！' : '答错了...' }}
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

    const checkAnswer = () => {
      if (!selectedAnswer.value) return
      answered.value = true
      isCorrect.value = selectedAnswer.value === '3' // D选项是正确答案
      
      // 如果选择了ABC，自动跳转到惩罚页面
      if (['0', '1', '2'].includes(selectedAnswer.value)) {
        setTimeout(() => {
          router.push('/punishment')
        }, 1000) // 延迟1秒跳转，让用户看到答错提示
      }
    }

    return {
      selectedAnswer,
      answered,
      isCorrect,
      checkAnswer
    }
  }
}
</script>

<style scoped>
.game-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #2c3e50, #3498db);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.content {
  width: 100%;
  max-width: 800px;
  min-height: 600px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.question-container {
  width: 100%;
  max-width: 600px;
  text-align: center;
}

.question-title {
  color: #fff;
  font-size: 1.8rem;
  margin-bottom: 2rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.math-question {
  background: rgba(255, 255, 255, 0.15);
  padding: 2rem;
  border-radius: 15px;
  margin-bottom: 2rem;
}

.math-question p {
  color: #fff;
  font-size: 1.2rem;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-start;
  padding: 0 2rem;
}

.option {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  width: 100%;
  text-align: left;
}

.option:hover {
  background: rgba(255, 255, 255, 0.1);
}

.option input[type="radio"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.button-container {
  margin-top: 2rem;
}

.submit-btn, .punishment-btn {
  padding: 1rem 2rem;
  font-size: 1.2rem;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn {
  background: linear-gradient(45deg, #2ecc71, #27ae60);
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(46, 204, 113, 0.4);
}

.punishment-btn {
  background: linear-gradient(45deg, #e74c3c, #c0392b);
}

.punishment-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(231, 76, 60, 0.4);
}

.result-message {
  margin-top: 1rem;
  font-size: 1.2rem;
  color: #fff;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}
</style> 