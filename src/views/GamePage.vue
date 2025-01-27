<template>
  <div class="game-page">
    <div class="content">
      <div class="question-container">
        <div class="story-text">
          <p>终于，你来到了最后一关...</p>
          <p>解开这道数学题，出口似乎就在眼前。</p>
        </div>
        <h2 class="question-title">解答下面的数学题：</h2>
        <div class="question-image">
          <img src="/images/1737707617386.jpg" alt="数学题" class="math-image">
        </div>
        
        <div class="options-container">
          <div class="option-item" :class="{ selected: selectedAnswer === 'A' }" @click="selectAnswer('A')">
            <span class="option-label">A.</span>
            <span class="option-text">0</span>
          </div>
          <div class="option-item" :class="{ selected: selectedAnswer === 'B' }" @click="selectAnswer('B')">
            <span class="option-label">B.</span>
            <span class="option-text">1</span>
          </div>
          <div class="option-item" :class="{ selected: selectedAnswer === 'C' }" @click="selectAnswer('C')">
            <span class="option-label">C.</span>
            <span class="option-text">2</span>
          </div>
          <div class="option-item" :class="{ selected: selectedAnswer === 'D' }" @click="selectAnswer('D')">
            <span class="option-label">D.</span>
            <span class="option-text">3</span>
          </div>
        </div>

        <button 
          class="submit-btn"
          @click="checkAnswer"
          v-if="selectedAnswer && !answered"
        >
          提交答案
        </button>

        <div class="result-message" v-if="answered">
          <p :class="{ 'correct': isCorrect, 'incorrect': !isCorrect }">
            {{ isCorrect ? '恭喜你答对了！' : '很遗憾，答错了...' }}
          </p>
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

    const selectAnswer = (answer) => {
      if (!answered.value) {
        selectedAnswer.value = answer
      }
    }

    const checkAnswer = () => {
      if (!selectedAnswer.value) return
      
      answered.value = true
      isCorrect.value = selectedAnswer.value === 'D'
      
      if (isCorrect.value) {
        setTimeout(() => {
          router.push('/endpoint')
        }, 1500)
      } else {
        setTimeout(() => {
          router.push('/punishment')
        }, 1500)
      }
    }

    return {
      selectedAnswer,
      answered,
      isCorrect,
      selectAnswer,
      checkAnswer
    }
  }
}
</script>

<style scoped>
.game-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f3ff 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: clamp(1rem, 3vw, 2rem);
}

.content {
  width: min(1200px, 95%);
  background: rgba(255, 255, 255, 0.95);
  border-radius: clamp(15px, 3vw, 20px);
  box-shadow: 0 10px 30px rgba(33, 150, 243, 0.1);
  padding: clamp(1.5rem, 4vw, 3rem);
}

.question-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(1.5rem, 4vw, 2.5rem);
}

.story-text {
  text-align: center;
  margin-bottom: 2rem;
  color: #1976d2;
  font-size: clamp(1rem, 2.5vw, 1.2rem);
  line-height: 1.6;
  text-shadow: 1px 1px 2px rgba(25, 118, 210, 0.1);
}

.story-text p {
  margin: 0.5rem 0;
}

.question-title {
  color: #1976d2;
  font-size: clamp(1.5rem, 4vw, 2rem);
  text-align: center;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(25, 118, 210, 0.1);
}

.question-image {
  width: min(1000px, 90%);
  margin: 0 auto;
}

.math-image {
  width: 100%;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.options-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: clamp(1rem, 2vw, 1.5rem);
  width: min(1000px, 90%);
  margin: 0 auto;
}

.option-item {
  flex: 1;
  min-width: 120px;
  max-width: 200px;
  background: white;
  padding: clamp(1rem, 2vw, 1.5rem);
  border-radius: 12px;
  border: 2px solid #bbdefb;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  box-shadow: 0 4px 6px rgba(25, 118, 210, 0.1);
}

.option-item:hover {
  transform: translateY(-2px);
  border-color: #1976d2;
  box-shadow: 0 6px 12px rgba(25, 118, 210, 0.15);
}

.option-item.selected {
  background: #1976d2;
  border-color: #1976d2;
  color: white;
}

.option-label {
  font-size: clamp(1.1rem, 2.5vw, 1.3rem);
  font-weight: bold;
}

.option-text {
  font-size: clamp(1rem, 2vw, 1.2rem);
}

.submit-btn {
  background: linear-gradient(135deg, #1976d2 0%, #2196f3 100%);
  color: white;
  border: none;
  padding: clamp(0.8rem, 2vw, 1.2rem) clamp(2rem, 5vw, 3rem);
  border-radius: 12px;
  font-size: clamp(1rem, 2.5vw, 1.2rem);
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(25, 118, 210, 0.2);
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(25, 118, 210, 0.3);
  background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
}

.result-message {
  text-align: center;
  font-size: clamp(1.1rem, 3vw, 1.3rem);
  font-weight: bold;
  margin-top: clamp(1rem, 3vw, 2rem);
}

.correct {
  color: #4caf50;
}

.incorrect {
  color: #f44336;
}

@media (max-width: 768px) {
  .content {
    padding: clamp(1rem, 3vw, 1.5rem);
  }

  .options-container {
    flex-direction: column;
    align-items: stretch;
  }

  .option-item {
    max-width: none;
  }
}

@media (max-width: 480px) {
  .game-page {
    padding: 0.5rem;
  }

  .content {
    width: 100%;
    border-radius: 0;
  }
}
</style> 