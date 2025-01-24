<template>
  <div class="end-point">
    <div class="celebration">
      <div class="dragon"></div>
      <div class="confetti-container">
        <div class="confetti" v-for="n in 20" :key="n"></div>
      </div>
    </div>
    <div class="content">
      <h1 class="title">恭喜通关！</h1>
      <div class="blessings">
        <p class="blessing-text">祝您新春快乐</p>
        <p class="blessing-text">龙年大吉</p>
        <p class="blessing-detail">愿您在新的一年里：</p>
        <ul class="blessing-list">
          <li>事业腾飞 🐉</li>
          <li>身体健康 ⭐</li>
          <li>阖家欢乐 🏮</li>
        </ul>
      </div>
      <router-link to="/">
        <button class="back-btn">再玩一次</button>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EndPoint'
}
</script>

<style scoped>
.end-point {
  min-height: 100vh;
  background: linear-gradient(135deg, #ff1a1a 0%, #ff8c1a 100%);
  padding: clamp(1rem, 3vw, 2rem);
  text-align: center;
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.content {
  max-width: min(800px, 95%);
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: clamp(1.5rem, 4vw, 2.5rem);
  border-radius: 20px;
  position: relative;
  z-index: 2;
}

.title {
  font-size: clamp(2rem, 6vw, 3rem);
  color: #ffd700;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
  margin-bottom: clamp(1.5rem, 4vw, 2rem);
  font-family: "Microsoft YaHei", sans-serif;
}

.blessings {
  margin: clamp(1.5rem, 4vw, 2rem) 0;
}

.blessing-text {
  font-size: clamp(1.2rem, 4vw, 2rem);
  color: #fff;
  margin: 1rem 0;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.2);
}

.blessing-detail {
  font-size: clamp(1rem, 2.5vw, 1.2rem);
  color: #ffd700;
  margin: 1.5rem 0 1rem;
}

.blessing-list {
  list-style: none;
  padding: 0;
  margin: 1rem 0 2rem;
}

.blessing-list li {
  font-size: clamp(1rem, 3vw, 1.3rem);
  color: #fff;
  margin: 0.8rem 0;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.2);
}

.back-btn {
  padding: clamp(0.8rem, 2vw, 1.2rem) clamp(1.5rem, 3vw, 2rem);
  font-size: clamp(1rem, 2.5vw, 1.2rem);
  background: linear-gradient(45deg, #ffd700, #ffb700);
  color: #d4380d;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  margin: 0 auto;
  display: block;
  max-width: 300px;
  width: 100%;
}

.back-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  background: linear-gradient(45deg, #ffb700, #ffd700);
}

.confetti-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.confetti {
  position: absolute;
  width: clamp(5px, 1.5vw, 10px);
  height: clamp(5px, 1.5vw, 10px);
  background: #ffd700;
  animation: confetti-fall 3s linear infinite;
}

@keyframes confetti-fall {
  0% {
    transform: translateY(-100%) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(360deg);
    opacity: 0;
  }
}

.confetti:nth-child(even) {
  background: #ff4d4d;
}

.confetti:nth-child(3n) {
  background: #fff;
}

.confetti:nth-child(4n) {
  background: #ffb700;
}

.confetti:nth-child(1) { left: 5%; animation-delay: -0.5s; animation-duration: 2.5s; }
.confetti:nth-child(2) { left: 10%; animation-delay: -1s; animation-duration: 2.8s; }
.confetti:nth-child(3) { left: 15%; animation-delay: -1.5s; animation-duration: 3.1s; }
.confetti:nth-child(4) { left: 20%; animation-delay: -2s; animation-duration: 2.7s; }
.confetti:nth-child(5) { left: 25%; animation-delay: -2.5s; animation-duration: 3.2s; }
.confetti:nth-child(6) { left: 30%; animation-delay: -1.8s; animation-duration: 2.9s; }
.confetti:nth-child(7) { left: 35%; animation-delay: -1.2s; animation-duration: 3.3s; }
.confetti:nth-child(8) { left: 40%; animation-delay: -2.2s; animation-duration: 2.6s; }
.confetti:nth-child(9) { left: 45%; animation-delay: -1.7s; animation-duration: 3.0s; }
.confetti:nth-child(10) { left: 50%; animation-delay: -2.3s; animation-duration: 2.8s; }
.confetti:nth-child(11) { left: 55%; animation-delay: -1.9s; animation-duration: 3.1s; }
.confetti:nth-child(12) { left: 60%; animation-delay: -1.6s; animation-duration: 2.9s; }
.confetti:nth-child(13) { left: 65%; animation-delay: -2.1s; animation-duration: 3.2s; }
.confetti:nth-child(14) { left: 70%; animation-delay: -1.4s; animation-duration: 2.7s; }
.confetti:nth-child(15) { left: 75%; animation-delay: -2.4s; animation-duration: 3.0s; }
.confetti:nth-child(16) { left: 80%; animation-delay: -1.8s; animation-duration: 2.8s; }
.confetti:nth-child(17) { left: 85%; animation-delay: -2.2s; animation-duration: 3.1s; }
.confetti:nth-child(18) { left: 90%; animation-delay: -1.5s; animation-duration: 2.9s; }
.confetti:nth-child(19) { left: 95%; animation-delay: -2.0s; animation-duration: 3.2s; }
.confetti:nth-child(20) { left: 100%; animation-delay: -1.7s; animation-duration: 2.6s; }

.dragon {
  position: absolute;
  top: 20px;
  right: -100px;
  width: 200px;
  height: 100px;
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 50"><path d="M10,25 Q30,0 50,25 T90,25" fill="none" stroke="%23ffd700" stroke-width="3"/></svg>') no-repeat;
  animation: dragon-float 10s infinite ease-in-out;
}

@keyframes dragon-float {
  0% {
    transform: translateX(0) rotate(0deg);
  }
  50% {
    transform: translateX(-800px) rotate(-5deg);
  }
  100% {
    transform: translateX(0) rotate(0deg);
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .content {
    padding: 1.5rem;
  }

  .back-btn {
    width: 90%;
  }

  .confetti {
    display: none;
  }
}

/* 小屏幕适配 */
@media (max-width: 480px) {
  .content {
    padding: 1rem;
    margin: 1rem;
  }

  .title {
    font-size: 2rem;
  }

  .blessing-text {
    font-size: 1.5rem;
  }

  .blessing-list li {
    font-size: 1.1rem;
  }
}
</style> 