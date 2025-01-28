<template>
  <div class="resolution-container">
    <div class="header">
      <h1>新年锦囊生成器 🧧</h1>
      <p>输入你的新年目标，获取小花(❁´◡`❁)专属建议</p>
    </div>

    <div class="input-section">
      <textarea
        v-model="userGoal"
        placeholder="请输入你的新年目标，例如：今年我要健康减重10斤"
        class="goal-input"
      ></textarea>
      <button 
        @click="generateAdvice" 
        :disabled="isGenerating"
        class="generate-btn"
      >
        {{ isGenerating ? '锦囊生成中...✨' : '生成新年锦囊' }}
      </button>
    </div>

    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>

    <div v-if="advices.length > 0" class="icons-container">
      <div 
        v-for="(_, index) in 3" 
        :key="index"
        class="icon-wrapper"
        @click="toggleAdvice(index)"
      >
        <div 
          class="advice-icon"
          :class="{ active: selectedAdviceIndex === index }"
        >
          {{ getIcon(index) }}
        </div>
      </div>
    </div>

    <div 
      v-if="selectedAdviceIndex !== null" 
      class="active-advice"
    >
      {{ advices[selectedAdviceIndex] }}
    </div>

    <div v-if="isGenerating" class="loading">
      <div class="loader"></div>
      <p>小花🏵️正在思考中...</p>
    </div>
  </div>

<!-- 新增的可爱按钮 -->
<div v-if="advices.length > 0" class="next-step-btn">
  <button 
    @click="goToNextPage"
    class="cute-button"
  >
    🌸 开启新年运势 →
  </button>
</div>

</template>

<script setup>
import { ref } from 'vue';
import OpenAI from 'openai';
import { useRouter } from 'vue-router'

const openai = new OpenAI({
  baseURL: import.meta.env.VITE_DEEPSEEK_BASE_URL,
  apiKey: import.meta.env.VITE_DEEPSEEK_API_KEY,
  dangerouslyAllowBrowser: true
});

const userGoal = ref('');
const advices = ref([]);
const isGenerating = ref(false);
const errorMessage = ref('');
const selectedAdviceIndex = ref(null); 
const router = useRouter()

const icons = ['🎯', '💡', '✨'];

const getIcon = (index) => icons[index % 3];

const toggleAdvice = (index) => {
  selectedAdviceIndex.value = 
    selectedAdviceIndex.value === index ? null : index;
};

const systemPrompt = `你是一个新年目标规划专家，用中文提供切实可行的建议。请根据用户的目标：
1. 生成3条具体建议（用数字序号标出）
2. 每条建议包含一个表情符号
3. 使用口语化、激励性的语气
4. 每条不超过30字
5. 每一条都要加入颜文字
6. 多用可爱的语气词，如喵~
格式示例：
1. 🏃 每周至少3次30分钟有氧运动喵~（比如快走、游泳）~(￣▽￣)~*
2. 🥗 饮食记录法：每天拍照记录三餐，周末复盘调整(✿◕‿◕✿)
3. 💤 保证每天7小时睡眠，设置固定就寝闹钟啦o(*^▽^*)┛`;

const generateAdvice = async () => {
// 重置选中状态
selectedAdviceIndex.value = null;

if (!userGoal.value.trim()) {
  errorMessage.value = '请输入你的新年目标';
  setTimeout(() => errorMessage.value = '', 2000);
  return;
}

isGenerating.value = true;
advices.value = [];
errorMessage.value = '';

try {
  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userGoal.value }
  ];

  const stream = await openai.chat.completions.create({
    model: "deepseek-chat",
    messages: messages,
    stream: true,
    max_tokens: 500
  });

  let fullResponse = '';
  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || '';
    fullResponse += content;
    
    // 实时解析建议（可选，根据是否需要流式展示）
    const parsedAdvices = parseAdvices(fullResponse);
    if (parsedAdvices.length > 0) {
      advices.value = parsedAdvices;
    }
  }

  // 最终解析
  advices.value = parseAdvices(fullResponse);

} catch (error) {
  console.error('API Error:', error);
  errorMessage.value = '锦囊生成失败，请稍后再试';
  setTimeout(() => errorMessage.value = '', 3000);
} finally {
  isGenerating.value = false;
}
};

  // 保持原有解析逻辑
const parseAdvices = (text) => {
  // 强化正则表达式匹配
  const adviceRegex = /\d+\.\s*([\u{1F300}-\u{1F9FF}]+\s*)+(.+?)(?=\n\d+\.|$)/gu;
  const matches = [...text.matchAll(adviceRegex)];
  return matches.slice(0, 3).map(m => m[2].trim());
  };

const goToNextPage = () => {
router.push('/dino')
}
</script>

<style scoped>
/* 整体容器 */
.resolution-container {
max-width: 800px;
margin: 2rem auto;
padding: 2rem;
background-color: #f9f9f9;
border-radius: 20px;
box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
from {
  opacity: 0;
  transform: translateY(20px);
}
to {
  opacity: 1;
  transform: translateY(0);
}
}

/* 标题和描述 */
.header h1 {
font-size: 2.5rem;
color: #2c3e50;
margin-bottom: 0.5rem;
text-align: center;
}

.header p {
font-size: 1.2rem;
color: #7f8c8d;
text-align: center;
margin-bottom: 2rem;
}

/* 输入区域 */
.input-section {
display: flex;
flex-direction: column;
align-items: center;
gap: 1rem;
}

.goal-input {
width: 100%;
padding: 1rem;
font-size: 1.2rem;
border-radius: 10px;
border: 1px solid #ccc;
outline: none;
resize: none;
box-sizing: border-box;
}

.goal-input:focus {
border-color: #f39c12;
box-shadow: 0 0 5px rgba(243, 156, 18, 0.5);
}

/* 按钮样式 */
.generate-btn {
background-color: #f39c12;
color: white;
padding: 1rem 2rem;
font-size: 1.2rem;
border: none;
border-radius: 10px;
cursor: pointer;
transition: background-color 0.3s ease;
}

.generate-btn:disabled {
background-color: #bdc3c7;
cursor: not-allowed;
}

.generate-btn:hover {
background-color: #e67e22;
}

/* 错误消息 */
.error-message {
color: #e74c3c;
font-size: 1.2rem;
text-align: center;
margin-top: 1rem;
opacity: 0;
animation: fadeInMessage 0.5s ease-out forwards;
}

@keyframes fadeInMessage {
from {
  opacity: 0;
}
to {
  opacity: 1;
}
}

/* 图标容器 */
.icons-container {
display: flex;
justify-content: center;
gap: 2rem;
margin-top: 2rem;
}

.icon-wrapper {
cursor: pointer;
transition: transform 0.3s ease;
}

.icon-wrapper:hover {
transform: translateY(-5px);
}

.advice-icon {
width: 80px;
height: 80px;
background: #fff;
border-radius: 50%;
display: flex;
align-items: center;
justify-content: center;
font-size: 2.5rem;
box-shadow: 0 4px 15px rgba(231, 76, 60, 0.1);
transition: all 0.3s ease;
border: 2px solid transparent;
}

.advice-icon.active {
border-color: #f1c40f;
box-shadow: 0 4px 20px rgba(241, 196, 15, 0.3);
transform: scale(1.1);
}

/* 显示建议的区域 */
.active-advice {
text-align: center;
padding: 1.5rem;
margin: 2rem auto;
max-width: 600px;
background: white;
border-radius: 15px;
box-shadow: 0 4px 12px rgba(231, 76, 60, 0.1);
animation: fadeInAdvice 0.3s ease;
}

@keyframes fadeInAdvice {
from {
  opacity: 0;
  transform: translateY(10px);
}
to {
  opacity: 1;
  transform: translateY(0);
}
}

/* 加载动画 */
.loading {
display: flex;
justify-content: center;
align-items: center;
flex-direction: column;
margin-top: 2rem;
}

.loader {
border: 4px solid #f3f3f3;
border-top: 4px solid #3498db;
border-radius: 50%;
width: 40px;
height: 40px;
animation: spin 1s linear infinite;
}

@keyframes spin {
0% { transform: rotate(0deg); }
100% { transform: rotate(360deg); }
}

.loading p {
font-size: 1.2rem;
color: #7f8c8d;
margin-top: 1rem;
}

.next-step-btn {
text-align: center;
margin: 2rem 0;
animation: bounce 2s infinite;
}

.cute-button {
background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%);
padding: 1rem 2rem;
border: none;
border-radius: 30px;
color: white;
font-size: 1.2rem;
cursor: pointer;
box-shadow: 0 4px 15px rgba(255, 105, 180, 0.3);
transition: all 0.3s ease;
display: inline-flex;
align-items: center;
gap: 0.5rem;
}

.cute-button:hover {
transform: translateY(-2px);
box-shadow: 0 6px 20px rgba(255, 105, 180, 0.4);
background: linear-gradient(135deg, #ff7eb3 0%, #ff758c 100%);
}

.cute-button:active {
transform: scale(0.98);
}

@keyframes bounce {
0%, 100% { transform: translateY(0); }
50% { transform: translateY(-5px); }
}

</style>