<template>
  <div class="support-page">
    <div class="hearts">
      <div class="heart" v-for="n in 6" :key="n"></div>
    </div>
    <div class="content">
      <h1 class="title">感谢你的支持！</h1>
      <div class="message-box">
        <p class="praise">恭喜你发现作者留下的彩蛋！没想到你这么贴心，真的愿意支持开发者呢！</p>
        <p class="hint">既然你这么真诚，那我也要告诉你一个秘密：</p>
        <div class="secret">
          <p>真正的秘钥其实是：</p>
          <p class="key-text">1314520</p>
          <p class="key-meaning">一生一世我爱你</p>
        </div>
      </div>
      <div class="qrcode-section">
        <p class="support-text">如果你真的想支持开发者：</p>
        <div class="qrcode-placeholder">
          <!-- 这里放收款码 -->
          <p>收款码待添加</p>
        </div>
      </div>
      <router-link to="/chat">
        <button class="return-btn">返回继续解谜</button>
      </router-link>
    </div>
    <div class="floating-elements">
      <div class="star" v-for="n in 10" :key="`star-${n}`"></div>
    </div>
  </div>
</template>

<script setup>
// 纯展示页面，不需要特殊逻辑
</script>

<style scoped>
.support-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #ff69b4, #ff1493);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.content {
  max-width: 600px;
  background: rgba(255, 255, 255, 0.95);
  padding: 2rem;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 2;
}

.title {
  color: #ff1493;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.message-box {
  background: rgba(255, 192, 203, 0.2);
  padding: 2rem;
  border-radius: 15px;
  margin-bottom: 2rem;
}

.praise {
  color: #ff1493;
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.hint {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
}

.secret {
  background: rgba(255, 20, 147, 0.1);
  padding: 1.5rem;
  border-radius: 10px;
  margin: 1rem 0;
}

.key-text {
  font-size: 2rem;
  color: #ff1493;
  font-weight: bold;
  margin: 1rem 0;
}

.key-meaning {
  color: #666;
  font-style: italic;
}

.qrcode-section {
  margin: 2rem 0;
}

.support-text {
  color: #666;
  margin-bottom: 1rem;
}

.qrcode-placeholder {
  width: 200px;
  height: 200px;
  background: rgba(0, 0, 0, 0.1);
  margin: 1rem auto;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
}

.return-btn {
  padding: 1rem 2rem;
  font-size: 1.2rem;
  background: linear-gradient(45deg, #ff1493, #ff69b4);
  color: white;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.return-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 20, 147, 0.4);
}

/* 装饰元素 */
.hearts {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.heart {
  position: absolute;
  width: 20px;
  height: 20px;
  background: rgba(255, 255, 255, 0.6);
  transform: rotate(45deg);
  animation: floatHeart 4s infinite ease-in-out;
}

.heart::before,
.heart::after {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.6);
}

.heart::before {
  left: -10px;
}

.heart::after {
  top: -10px;
}

.heart:nth-child(1) { left: 10%; animation-delay: 0s; }
.heart:nth-child(2) { left: 30%; animation-delay: 0.5s; }
.heart:nth-child(3) { left: 50%; animation-delay: 1s; }
.heart:nth-child(4) { left: 70%; animation-delay: 1.5s; }
.heart:nth-child(5) { left: 90%; animation-delay: 2s; }
.heart:nth-child(6) { left: 20%; top: 20%; animation-delay: 2.5s; }

@keyframes floatHeart {
  0%, 100% {
    transform: translateY(0) rotate(45deg);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-20px) rotate(45deg);
    opacity: 0.9;
  }
}

.floating-elements {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.star {
  position: absolute;
  width: 4px;
  height: 4px;
  background: white;
  border-radius: 50%;
  animation: twinkle 2s infinite ease-in-out;
}

@keyframes twinkle {
  0%, 100% {
    opacity: 0.2;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.5);
  }
}

.star:nth-child(1) { left: 5%; top: 10%; animation-delay: 0s; }
.star:nth-child(2) { left: 15%; top: 30%; animation-delay: 0.2s; }
.star:nth-child(3) { left: 25%; top: 50%; animation-delay: 0.4s; }
.star:nth-child(4) { left: 35%; top: 70%; animation-delay: 0.6s; }
.star:nth-child(5) { left: 45%; top: 90%; animation-delay: 0.8s; }
.star:nth-child(6) { right: 5%; top: 10%; animation-delay: 1s; }
.star:nth-child(7) { right: 15%; top: 30%; animation-delay: 1.2s; }
.star:nth-child(8) { right: 25%; top: 50%; animation-delay: 1.4s; }
.star:nth-child(9) { right: 35%; top: 70%; animation-delay: 1.6s; }
.star:nth-child(10) { right: 45%; top: 90%; animation-delay: 1.8s; }
</style> 