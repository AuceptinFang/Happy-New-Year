<template>
  <div class="punishment-page">
    <div class="content">
      <div class="text-container">
        <transition-group name="fade">
          <p v-for="(text, index) in visibleTexts" 
             :key="index" 
             class="punishment-text"
             :style="{ animationDelay: `${index * 0.5}s` }">
            {{ text }}
          </p>
        </transition-group>
      </div>
      <button 
        class="punishment-btn" 
        @click="handleClick"
        :disabled="isAnimating"
        :class="{ 'disabled': isAnimating }">
        {{ buttonText }}
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

// 示例文本组，之后可以替换为实际内容
const textGroups = [
  [
    "先验感性论",
    "康德",
    "无论一种知识以什么方式以及通过什么手段与对象发生关系，它与对象直接发生关系所凭借的以及一切思维当做手段所追求的，就是直观。",
    "但直观只是在对象被给予我们时才发生；而这对于我们人来说，又至少只是通过对象以某种方式刺激心灵才是可能的。通过我们被对象刺激的方式获得表象的能力（感受性）叫做感性。",
    "因此，借助于感性，对象被给予我们，而且惟有感性才给我们提供直观；但直观通过知性被思维，从知性产生出概念。不过，一切思维，无论它是直截了当地（直接地），还是转弯抹角地（间接地），都必须借助于某些标志最终与直观、从而在我们这里与感性发生关系，因为对象不能以别的方式被给予我们。",
    "如果我们被一个对象所刺激，则对象对表象能力的作用就是感觉。通过感觉与对象发生关系的那些直观就叫做经验性的。一个经验性直观的未被规定的对象就叫做显象。",
    "在显象中，我把与感觉相应的东西称为显象的质料，而把使得显象的杂多能够在某些关系中得到整理的东西称为显象的形式。",
    "由于感觉惟有在其中才能得到整理并被置于某种形式之中的东西，自身不可能又是感觉，所以，虽然一切显象的质料只是后天被给予我们的，但显象的形式却为了显象而必须全都已经先天地蕴涵在心灵中，因而可以与一切感觉分离开来予以考察。",
    "我把一切在其中找不到任何属于感觉的东西的表象称为纯粹的（在先验的意义上）。据此，一般感性直观的纯粹形式将在心灵中先天地找到，显象的一切杂多将以这种形式在某些关系中被直观。",
    "感性的这种纯形式自身也叫做纯直观。",
    "这样，如果我从一个物体的表象中把知性所思维的东西如实体、力、可分性等等都除去，此外把属于感觉的东西如不可入性、硬、颜色等等也除去，那么，从这个经验性的直观中还给我剩下了某种东西，即广延和形状。",
    "它们属于纯直观，即便没有感官或者感觉的一个现实的对象，纯直观也先天地作为一个纯然的感性形式存在于心灵中。"
  ],
  [
    "伦理学",
    "斯宾诺莎",
    "第五部分 论理智的力量或人的自由",
    "公则",
    "(一) 假如两个相反的动作，在同一个主体里被激动起来，那么它们将必然发生变化：或者是两个都变，或者是只有其中的一个发生变化，一直到两者彼此不再反对时为止。",
    "(二) 结果的力量为它的原因的力量所决定，因为它的本质为它的原因的本质所解释或决定。(从第三部分命题七看来这条公则是很明白的。)",
    "命题一 思想和事物的观念在心灵内是怎样排列和连系着，身体的感触和事物的形象在身体内也恰好是那样排列和联系着。",
    "观念的次序和联系(据第二部分命题七)与事物的次序和联系是相同的，反之(据第二部分命题六和命题七绎理)事物的次序和联系与观念的次序和联系也是相同的。",
    "所以观念的次序和联系在心灵里(据第二部分命题十八)既然依照身体的感触的次序和联系，反之(据第三部分命题二)身体的感触的次序和联系也依照心灵里面思想和事物的观念的次序和联系。此证。",
    "......"
  ],
  [
    "精神现象学",
    "黑格尔",
    "第一章 感性确定性；这一个和意谓",
    "那最初或者直接是我们的对象的知识，不外那本身是直接的知识，亦即对于直接的或者现存着的东西的知识。",
    "我们对待它也同样必须采取直接的或者接纳的态度，因此对于这种知识，必须只象它所呈现给我们那样，不加改变，并且不让在这种认识中夹杂有概念的把握。",
    "感性确定性的这种具体内容使得它立刻显得好象是最丰富的知识，甚至是一种无限丰富的知识。",
    "对于这种无限丰富的内容，无论我们追溯它通过空间和时间而呈现给我们的广度，或我们从这种丰富的材料中取出一片断，通过深入剖析去钻研它的深度，都没有极限。",
    "此外，感性确定性又好象是最真实的知识，因为它对于对象还没有省略掉任何东西，而让对象整个地、完备地呈现在它面前。",
    "但是，事实上，这种确定性所提供的也可以说是最抽象、最贫乏的真理。它对于它所知道的仅仅说出了这么多：它存在着。",
    "而它的真理性仅仅包含着事情的存在。",
    "另一方面，在这种确定性里，意识只是一个纯自我，或者说，在这种认识里，我只是一个纯粹的这一个，而对象也只是一个纯粹的这一个。",
    "......"
  ]
]

export default {
  name: 'PunishmentPage',
  setup() {
    const router = useRouter()
    const currentTextIndex = ref(0)
    const visibleTexts = ref([])
    const isAnimating = ref(false)
    const selectedTextGroup = ref(textGroups[Math.floor(Math.random() * textGroups.length)])

    const buttonText = computed(() => {
      if (currentTextIndex.value === 0) return '接受惩罚'
      if (currentTextIndex.value < selectedTextGroup.value.length) return '继续接受惩罚'
      return '进入下一关'
    })

    const showNextText = () => {
      if (currentTextIndex.value >= selectedTextGroup.value.length) {
        router.push('/game') // 或其他下一关的路由
        return
      }

      isAnimating.value = true
      visibleTexts.value.push(selectedTextGroup.value[currentTextIndex.value])
      
      // 文本显示动画时间
      setTimeout(() => {
        isAnimating.value = false
        currentTextIndex.value++
      }, 2000) // 2秒的动画时间
    }

    const handleClick = () => {
      if (!isAnimating.value) {
        showNextText()
      }
    }

    return {
      visibleTexts,
      buttonText,
      isAnimating,
      handleClick
    }
  }
}
</script>

<style scoped>
.punishment-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a1a 0%, #333333 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.content {
  max-width: 600px;
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
}

.text-container {
  min-height: 200px;
  margin-bottom: 2rem;
}

.punishment-text {
  color: #ff4d4d;
  font-size: 1.2rem;
  margin: 1rem 0;
  text-align: center;
  opacity: 0;
  animation: fadeIn 2s forwards;
  text-shadow: 0 0 10px rgba(255, 77, 77, 0.3);
}

.punishment-btn {
  width: 100%;
  padding: 1rem;
  font-size: 1.2rem;
  background: linear-gradient(45deg, #ff4d4d, #ff8c1a);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.punishment-btn:not(.disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 77, 77, 0.4);
}

.punishment-btn.disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
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

.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style> 