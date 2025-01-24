<template>
  <div class="container">
    <div class="content-wrapper">
      <h1>歪果仁取名中心</h1>
      
      <div class="story-section">
        <div class="story-card">
          <p class="story-text">注意到头顶上的云不对劲后，你机灵地逃了出来</p>
          <p class="story-text">“这里是哪里？”抬起头，你看到了一块红色的牌子</p>
          <p class="story-text">“TikTok被封禁以后，类似的奇奇怪怪的网站也多了起来”</p>
          <p class="story-text">你摇摇头，但是遏制不住好奇心：</p>
          <p class="story-text">“如果，我是说如果，开发者没做异常输入处理呢...”</p>
        </div>
      </div>
      
      <form id="nameForm" @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="englishName">英文名字:</label>
          <input 
            type="text" 
            id="englishName" 
            v-model="englishName" 
            placeholder="请输入英文名"
            required
          >
        </div>
        
        <div class="form-group">
          <label for="birthdate">出生日期:</label>
          <div class="date-inputs">
            <select v-model="birthYear" required>
              <option value="">年</option>
              <option v-for="year in years" :key="year" :value="year">
                {{year}}年
              </option>
            </select>
            <select v-model="birthMonth" @change="updateDays" required>
              <option value="">月</option>
              <option v-for="month in 12" :key="month" :value="month">
                {{month}}月
              </option>
            </select>
            <select v-model="birthDay" required>
              <option value="">日</option>
              <option v-for="day in days" :key="day" :value="day">
                {{day}}日
              </option>
            </select>
          </div>
          <div class="zodiac-display" v-if="zodiac">
            您的星座是: <span class="zodiac-text">{{getZodiacDisplay(zodiac)}}</span>
          </div>
        </div>

        <button type="submit" class="submit-btn" :disabled="!isFormValid">
          <span class="button-text">开始起名</span>
          <span class="button-icon">✨</span>
        </button>
      </form>

      <div id="baguaAnimation" v-show="showBagua" class="bagua-container">
        <svg width="300" height="300" viewBox="0 0 300 300">
          <defs>
            <radialGradient id="symbolGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" style="stop-color:#c41e3a;stop-opacity:0.8"/>
              <stop offset="100%" style="stop-color:#c41e3a;stop-opacity:0.3"/>
            </radialGradient>
          </defs>
          <g transform="translate(150,150)">
            <template v-for="(bagua, index) in baguaSymbols" :key="index">
              <g :transform="'rotate(' + (index * 45) + ')'">
                <text x="0" y="-120" 
                  text-anchor="middle" 
                  class="bagua-symbol"
                  :transform="'rotate(' + (-index * 45) + ')'"
                  style="font-size: 36px; fill: url(#symbolGradient);">
                  {{ bagua.symbol }}
                </text>
                <text x="0" y="-85"
                  text-anchor="middle"
                  class="bagua-name"
                  :transform="'rotate(' + (-index * 45) + ')'"
                  style="font-size: 18px; fill: #c41e3a;">
                  {{ bagua.name }}
                </text>
              </g>
            </template>
          </g>
        </svg>
      </div>

      <div id="result" v-show="showResult" :class="{ 'show': showResult }">
        <h2>你的中文名字是：</h2>
        <p id="chineseName">{{ generatedName }}</p>
        <div class="explanation-box">
          <p id="nameExplanation">{{ nameExplanation }}</p>
        </div>
        <router-link to="/game" class="next-btn">
          <span class="button-text">继续探索</span>
          <span class="button-icon">→</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const englishName = ref('')
const birthYear = ref('')
const birthMonth = ref('')
const birthDay = ref('')
const days = ref([])
const showBagua = ref(false)
const showResult = ref(false)
const resultOpacity = ref(0)
const generatedName = ref('')
const nameExplanation = ref('')

// 生成年份选项（1950-2024）
const years = Array.from({length: 75}, (_, i) => 2024 - i)

// 根据月份更新天数
function updateDays() {
  if (!birthMonth.value) {
    days.value = []
    return
  }
  
  const daysInMonth = new Date(
    birthYear.value || new Date().getFullYear(),
    birthMonth.value,
    0
  ).getDate()
  
  days.value = Array.from({length: daysInMonth}, (_, i) => i + 1)
}

// 监听月份变化
watch(birthMonth, () => {
  updateDays()
  if (birthDay.value > days.value.length) {
    birthDay.value = days.value.length
  }
  updateZodiac()
})

// 监听年份变化
watch(birthYear, () => {
  updateDays()
})

// 监听日期变化
watch(birthDay, () => {
  updateZodiac()
})

// 计算表单是否有效
const isFormValid = computed(() => {
  return englishName.value && birthYear.value && birthMonth.value && birthDay.value
})

// 获取星座显示文本
function getZodiacDisplay(zodiacKey) {
  const zodiacNames = {
    'aries': '白羊座 ♈',
    'taurus': '金牛座 ♉',
    'gemini': '双子座 ♊',
    'cancer': '巨蟹座 ♋',
    'leo': '狮子座 ♌',
    'virgo': '处女座 ♍',
    'libra': '天秤座 ♎',
    'scorpio': '天蝎座 ♏',
    'sagittarius': '射手座 ♐',
    'capricorn': '摩羯座 ♑',
    'aquarius': '水瓶座 ♒',
    'pisces': '双鱼座 ♓'
  }
  return zodiacNames[zodiacKey]
}

// 根据日期判断星座
const zodiac = ref('')
function updateZodiac() {
  if (!birthMonth.value || !birthDay.value) return
  
  const month = parseInt(birthMonth.value)
  const day = parseInt(birthDay.value)
  
  const zodiacDates = [
    { sign: 'capricorn', startMonth: 12, startDay: 22 },
    { sign: 'aquarius', startMonth: 1, startDay: 20 },
    { sign: 'pisces', startMonth: 2, startDay: 19 },
    { sign: 'aries', startMonth: 3, startDay: 21 },
    { sign: 'taurus', startMonth: 4, startDay: 20 },
    { sign: 'gemini', startMonth: 5, startDay: 21 },
    { sign: 'cancer', startMonth: 6, startDay: 21 },
    { sign: 'leo', startMonth: 7, startDay: 23 },
    { sign: 'virgo', startMonth: 8, startDay: 23 },
    { sign: 'libra', startMonth: 9, startDay: 23 },
    { sign: 'scorpio', startMonth: 10, startDay: 23 },
    { sign: 'sagittarius', startMonth: 11, startDay: 22 },
    { sign: 'capricorn', startMonth: 12, startDay: 22 }
  ]
  
  for (let i = 0; i < zodiacDates.length - 1; i++) {
    const currentSign = zodiacDates[i]
    const nextSign = zodiacDates[i + 1]
    
    if (
      (month === currentSign.startMonth && day >= currentSign.startDay) ||
      (month === nextSign.startMonth && day < nextSign.startDay)
    ) {
      zodiac.value = currentSign.sign
      return
    }
  }
}

// 英文名到中文音译的映射表
const nameMapping = {
  'a': ['艾', '安', '奥', '埃', '阿'],
  'b': ['贝', '柏', '布', '巴', '博'],
  'c': ['克', '卡', '科', '凯', '康'],
  'd': ['德', '戴', '丹', '道', '迪'],
  'e': ['埃', '尔', '恩', '艾', '伊'],
  'f': ['弗', '芬', '方', '费', '福'],
  'g': ['格', '戈', '古', '甘', '盖'],
  'h': ['赫', '霍', '汉', '海', '华'],
  'i': ['伊', '艾', '埃', '依', '爱'],
  'j': ['杰', '金', '江', '君', '静'],
  'k': ['凯', '卡', '科', '柯', '康'],
  'l': ['莱', '路', '兰', '林', '李'],
  'm': ['麦', '米', '马', '梅', '明'],
  'n': ['尼', '娜', '纳', '诺', '宁'],
  'o': ['奥', '欧', '鸥', '澳', '欧'],
  'p': ['帕', '佩', '普', '派', '珀'],
  'q': ['奇', '琪', '齐', '秋', '青'],
  'r': ['瑞', '莱', '然', '若', '蕊'],
  's': ['斯', '史', '山', '森', '舒'],
  't': ['特', '托', '泰', '图', '汤'],
  'u': ['尤', '优', '悠', '宇', '玉'],
  'v': ['维', '薇', '威', '韦', '微'],
  'w': ['威', '文', '万', '维', '韦'],
  'x': ['希', '西', '席', '夏', '晓'],
  'y': ['伊', '雅', '优', '叶', '杨'],
  'z': ['泽', '哲', '卓', '志', '子']
}

// 星座特质映射
const zodiacTraits = {
  'aries': {
    traits: ['勇', '志', '威', '雄', '朗', '昂', '旭', '阳', '炜', '烨'],
    description: '充满活力与领导力'
  },
  'taurus': {
    traits: ['宁', '泰', '安', '稳', '真', '固', '恒', '厚', '朴', '实'],
    description: '稳重可靠'
  },
  'gemini': {
    traits: ['灵', '慧', '智', '巧', '睿', '敏', '颖', '聪', '双', '思'],
    description: '机智灵活'
  },
  'cancer': {
    traits: ['善', '恩', '惠', '仁', '和', '温', '柔', '淳', '纯', '良'],
    description: '温柔体贴'
  },
  'leo': {
    traits: ['豪', '华', '明', '耀', '阳', '光', '辉', '煌', '熙', '晖'],
    description: '光芒四射'
  },
  'virgo': {
    traits: ['纯', '洁', '思', '敏', '慎', '雅', '静', '秀', '婉', '清'],
    description: '追求完美'
  },
  'libra': {
    traits: ['平', '和', '雅', '致', '美', '均', '衡', '中', '庸', '韵'],
    description: '优雅平和'
  },
  'scorpio': {
    traits: ['玄', '秘', '深', '智', '谋', '略', '远', '思', '察', '洞'],
    description: '深邃神秘'
  },
  'sagittarius': {
    traits: ['博', '达', '远', '志', '飞', '翔', '翼', '腾', '跃', '奔'],
    description: '追求自由'
  },
  'capricorn': {
    traits: ['建', '功', '业', '实', '稳', '立', '基', '永', '恒', '固'],
    description: '脚踏实地'
  },
  'aquarius': {
    traits: ['新', '奇', '创', '独', '特', '异', '超', '越', '变', '革'],
    description: '独特创新'
  },
  'pisces': {
    traits: ['梦', '幻', '艺', '灵', '慧', '诗', '韵', '美', '意', '境'],
    description: '富有想象力'
  }
}

// 五行属性映射
const elementMapping = {
  spring: ['木', '竹', '松', '青', '翠', '芳', '苗', '茗', '荣', '华'],
  summer: ['火', '炎', '焱', '炫', '晖', '煜', '炜', '熙', '晗', '烨'],
  autumn: ['金', '铭', '钧', '锋', '铮', '铭', '钰', '锦', '钊', '铄'],
  winter: ['水', '泽', '润', '涵', '渊', '潮', '沛', '济', '洋', '汐'],
  earth: ['土', '地', '坤', '固', '厚', '载', '山', '岳', '峰', '壤']
}

function getSeason(date) {
  const month = new Date(date).getMonth() + 1
  if (month >= 3 && month <= 5) return 'spring'
  if (month >= 6 && month <= 8) return 'summer'
  if (month >= 9 && month <= 11) return 'autumn'
  return 'winter'
}

// 八卦符号
const baguaSymbols = [
  { name: '乾', symbol: '☰', attribute: '天' },
  { name: '坤', symbol: '☷', attribute: '地' },
  { name: '震', symbol: '☳', attribute: '雷' },
  { name: '巽', symbol: '☴', attribute: '风' },
  { name: '坎', symbol: '☵', attribute: '水' },
  { name: '离', symbol: '☲', attribute: '火' },
  { name: '艮', symbol: '☶', attribute: '山' },
  { name: '兑', symbol: '☱', attribute: '泽' }
]

function generateChineseName(englishName, birthdate, zodiac) {
  const processedName = englishName.toLowerCase().replace(/\s+/g, '')
  
  // 选择姓氏（更灵活的选择）
  const commonSurnames = {
    single: ['李', '王', '张', '刘', '陈', '杨', '赵', '黄', '周', '吴', '郑', '孙', '马', '朱', '胡', '林', '高', '何', '郭', '罗'],
    double: ['欧阳', '司马', '诸葛', '南宫', '东方', '独孤', '慕容', '宇文', '上官', '夏侯']
  }
  
  // 根据随机概率选择单姓或双姓（80%概率选择单姓）
  const surname = Math.random() < 0.8
    ? commonSurnames.single[Math.floor(Math.random() * commonSurnames.single.length)]
    : commonSurnames.double[Math.floor(Math.random() * commonSurnames.double.length)]

  // 获取英文名首字母对应的中文音译
  const firstChar = processedName[0]
  const translitChar = nameMapping[firstChar] 
    ? nameMapping[firstChar][Math.floor(Math.random() * nameMapping[firstChar].length)]
    : '华'

  // 获取星座特质
  const zodiacTrait = zodiacTraits[zodiac].traits[Math.floor(Math.random() * zodiacTraits[zodiac].traits.length)]
  
  // 根据出生日期获取五行属性
  const season = getSeason(birthdate)
  const elementChar = elementMapping[season][Math.floor(Math.random() * elementMapping[season].length)]

  // 生成名字（考虑单双姓情况）
  const fullName = surname.length === 1
    ? surname + translitChar + elementChar
    : surname + zodiacTrait + elementChar

  // 获取生肖
  const birthYear = new Date(birthdate).getFullYear()
  const zodiacAnimal = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'][(birthYear - 1900) % 12]

  // 生成详细解释
  const explanation = `
    【姓氏寓意】
    ${surname}氏${surname.length === 1 ? '单姓' : '双姓'}，源远流长。${
      surname.length === 1 
        ? '为中华姓氏之一，历史悠久，人才辈出。'
        : '为中国传统复姓，典故深远，彰显尊贵。'
    }

    【名字构成】
    ${surname.length === 1 
      ? `名字由"${translitChar}"和"${elementChar}"二字组成：
         "${translitChar}"字取自英文名 ${englishName} 的谐音，寓意与西方文化的美好连结；
         "${elementChar}"字体现${getSeason(birthdate)}季节的特质，${
           season === 'spring' ? '如春木般充满生机与希望' :
           season === 'summer' ? '似烈火般热情似火、光芒四射' :
           season === 'autumn' ? '若秋金般坚毅果断、光华内敛' :
           '似静水般智慧深邃、包容万物'
         }。`
      : `名字由"${zodiacTrait}"和"${elementChar}"二字组成：
         "${zodiacTrait}"字展现${zodiacTraits[zodiac].description}的优雅气质；
         "${elementChar}"字寄托${getSeason(birthdate)}季节的自然灵韵。`
    }

    【星座特质】
    生于${getZodiacDisplay(zodiac).split(' ')[0]}，具${zodiacTraits[zodiac].description}的特质。
    ${zodiac === 'aries' ? '如旭日东升，朝气蓬勃' :
      zodiac === 'taurus' ? '似山岳巍峨，沉稳可靠' :
      zodiac === 'gemini' ? '智慧双生，灵动多变' :
      zodiac === 'cancer' ? '似水柔情，心系家园' :
      zodiac === 'leo' ? '如狮王般威严尊贵，光芒万丈' :
      zodiac === 'virgo' ? '追求完美，心思细腻' :
      zodiac === 'libra' ? '秉持公正，优雅和谐' :
      zodiac === 'scorpio' ? '深邃如渊，智慧如海' :
      zodiac === 'sagittarius' ? '箭指苍穹，追求自由' :
      zodiac === 'capricorn' ? '踏实坚毅，志存高远' :
      zodiac === 'aquarius' ? '独树一帜，创新求变' :
      '心怀梦想，浪漫多情'}

    【生肖印记】
    ${birthYear}年出生，属${zodiacAnimal}。${
      zodiacAnimal === '鼠' ? '机灵聪慧，善于钻营' :
      zodiacAnimal === '牛' ? '勤恳踏实，力大无穷' :
      zodiacAnimal === '虎' ? '威严勇猛，王者之风' :
      zodiacAnimal === '兔' ? '温柔敏感，优雅灵动' :
      zodiacAnimal === '龙' ? '气势磅礴，龙腾九天' :
      zodiacAnimal === '蛇' ? '智慧优雅，深藏不露' :
      zodiacAnimal === '马' ? '奔放不羁，自由驰骋' :
      zodiacAnimal === '羊' ? '温顺和善，艺术情怀' :
      zodiacAnimal === '猴' ? '聪明灵活，活泼好动' :
      zodiacAnimal === '鸡' ? '勤劳守时，光明磊落' :
      zodiacAnimal === '狗' ? '忠诚可靠，守护正义' :
      '善良温和，福气深厚'}

    【五行相生】
    生于${getSeason(birthdate)}季，五行属${
      season === 'spring' ? '木，代表生长、希望。如青松翠柏，四季常青' :
      season === 'summer' ? '火，代表温暖、光明。似烈日当空，光耀万物' :
      season === 'autumn' ? '金，代表坚毅、果断。若秋霜傲骨，铮铮铁骨' :
      '水，代表智慧、包容。似深海汪洋，广纳百川'
    }。

    【名字寄语】
    愿这个名字如同璀璨的星辰，指引你前行的方向。
    承载着父母的期望，寄托着美好的祝愿。
    望你${
      season === 'spring' ? '如春木般茁壮成长，生机勃勃' :
      season === 'summer' ? '似烈火般热情洋溢，光芒四射' :
      season === 'autumn' ? '若秋金般坚毅果断，成就非凡' :
      '似静水般智慧深邃，包容天下'
    }。
    前程似锦，未来可期！
  `

  return { name: fullName, explanation: explanation.trim() }
}

async function handleSubmit() {
  showBagua.value = true
  showResult.value = false
  resultOpacity.value = 0

  // 构建完整的出生日期字符串
  const birthdate = `${birthYear.value}-${String(birthMonth.value).padStart(2, '0')}-${String(birthDay.value).padStart(2, '0')}`

  // 等待八卦动画
  await new Promise(resolve => setTimeout(resolve, 3000))
  
  const result = generateChineseName(englishName.value, birthdate, zodiac.value)
  generatedName.value = result.name
  nameExplanation.value = result.explanation
  
  showBagua.value = false
  showResult.value = true
}

onMounted(() => {
  // 初始化年份选择器
  updateDays()
})
</script>

<style scoped>
.container {
  max-width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #fff5f5 0%, #fff0f0 100%);
  font-family: 'Microsoft YaHei', sans-serif;
  position: relative;
  padding: 2rem 0;
}

.content-wrapper {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(196, 30, 58, 0.1);
}

h1 {
  text-align: center;
  color: #c41e3a;
  margin-bottom: 3rem;
  font-size: 2.5rem;
  text-shadow: 2px 2px 4px rgba(196, 30, 58, 0.1);
}

.story-section {
  margin-bottom: 3rem;
}

.story-card {
  background: #fff;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(196, 30, 58, 0.1);
  text-align: center;
}

.story-card h3 {
  color: #c41e3a;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  text-shadow: 1px 1px 2px rgba(196, 30, 58, 0.1);
}

.story-text {
  color: #333;
  font-size: 1.1rem;
  line-height: 1.8;
  margin: 0.8rem 0;
}

.form-group {
  margin-bottom: 2rem;
  background: #fff;
  padding: 1.5rem;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(196, 30, 58, 0.1);
}

label {
  display: block;
  margin-bottom: 0.8rem;
  font-weight: bold;
  color: #333;
  font-size: 1.1rem;
}

.date-inputs {
  display: flex;
  gap: 1rem;
}

.date-inputs select {
  flex: 1;
  padding: 0.8rem;
  border: 1px solid #ffcdd2;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.date-inputs select:hover {
  border-color: #c41e3a;
}

input {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ffcdd2;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

input:focus, select:focus {
  outline: none;
  border-color: #c41e3a;
  box-shadow: 0 0 0 3px rgba(196, 30, 58, 0.1);
}

.zodiac-display {
  margin-top: 1rem;
  text-align: center;
  font-size: 1.1rem;
  color: #666;
  background: #fff5f5;
  padding: 0.8rem;
  border-radius: 8px;
}

.zodiac-text {
  color: #c41e3a;
  font-weight: bold;
  margin-left: 0.5rem;
}

.submit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #c41e3a 0%, #ff4d6d 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(196, 30, 58, 0.2);
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(196, 30, 58, 0.3);
  background: linear-gradient(135deg, #ff4d6d 0%, #c41e3a 100%);
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.button-text {
  margin-right: 0.5rem;
}

.button-icon {
  font-size: 1.4rem;
}

.bagua-container {
  margin: 2rem 0;
  text-align: center;
  animation: fadeIn 0.5s ease;
  position: relative;
}

.bagua-container::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 240px;
  height: 240px;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(196, 30, 58, 0.1) 0%, rgba(196, 30, 58, 0) 70%);
  border-radius: 50%;
  z-index: -1;
}

.bagua-symbol {
  animation: rotateBagua 3s infinite linear;
  filter: drop-shadow(0 0 5px #c41e3a);
}

.bagua-name {
  opacity: 0.8;
  animation: rotateBagua 3s infinite linear;
}

@keyframes rotateBagua {
  from { 
    transform: rotate(0deg); 
    filter: drop-shadow(0 0 5px #c41e3a);
  }
  50% { 
    filter: drop-shadow(0 0 10px #c41e3a);
  }
  to { 
    transform: rotate(360deg);
    filter: drop-shadow(0 0 5px #c41e3a);
  }
}

#result {
  margin-top: 2rem;
  text-align: center;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.5s ease;
}

#result.show {
  opacity: 1;
  transform: translateY(0);
}

#chineseName {
  font-size: 3rem;
  color: #c41e3a;
  margin: 1.5rem 0;
  text-shadow: 2px 2px 4px rgba(196, 30, 58, 0.1);
}

.explanation-box {
  background: #fff;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(196, 30, 58, 0.1);
  margin-top: 1.5rem;
}

#nameExplanation {
  color: #333;
  line-height: 1.8;
  font-size: 1.1rem;
  white-space: pre-line;
}

.next-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 2rem;
  margin-top: 2rem;
  background: linear-gradient(135deg, #c41e3a 0%, #ff4d6d 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(196, 30, 58, 0.2);
  text-decoration: none;
}

.next-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(196, 30, 58, 0.3);
  background: linear-gradient(135deg, #ff4d6d 0%, #c41e3a 100%);
}

.next-btn .button-text {
  margin-right: 0.8rem;
}

.next-btn .button-icon {
  font-size: 1.4rem;
  transition: transform 0.3s ease;
}

.next-btn:hover .button-icon {
  transform: translateX(5px);
}

@media (max-width: 600px) {
  .content-wrapper {
    padding: 1rem;
  }
  
  h1 {
    font-size: 2rem;
  }
  
  .date-inputs {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  #chineseName {
    font-size: 2.5rem;
  }
}
</style> 