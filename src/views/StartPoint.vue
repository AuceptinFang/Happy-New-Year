<template>
  <div class="start-point">
    <div class="lanterns">
      <div class="lantern left"></div>
      <div class="lantern right"></div>
    </div>
    <div class="content">
      <h1 class="title">新春迷宫大冒险</h1>
      <p class="subtitle">龙年吉祥 · 欢乐起航</p>
      <div class="story-box">
        <p class="story-text">你睁开眼睛，发现自己置身于一个陌生而神秘的世界。</p>
        <p class="story-text">四周环绕着祥和的新春气息，却又透着一丝诡异。</p>
        <p class="story-text">前方似乎有什么在等待着你...</p>
      </div>
      <div class="decoration">
        <span class="cloud left"></span>
        <span class="cloud right"></span>
      </div>
      <router-link to="/chat">
        <button class="navigate-btn">开启冒险之旅</button>
      </router-link>
    </div>
    <div class="fireworks">
      <div class="firework"></div>
      <div class="firework"></div>
      <div class="firework"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StartPoint'
}
</script>

<style scoped>
.start-point {
  min-height: 100vh;
  background: linear-gradient(135deg, #ff4d4d 0%, #ff8c1a 100%);
  padding: 20px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.content {
  position: relative;
  z-index: 2;
  padding: 2rem;
}

.title {
  font-size: 3.5rem;
  color: #fff;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
  margin-bottom: 1rem;
  font-family: "Microsoft YaHei", sans-serif;
}

.subtitle {
  font-size: 1.5rem;
  color: #ffd700;
  margin-bottom: 2rem;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.2);
}

.navigate-btn {
  padding: 15px 40px;
  font-size: 1.2rem;
  background: linear-gradient(45deg, #ffd700, #ffb700);
  color: #d4380d;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.navigate-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  background: linear-gradient(45deg, #ffb700, #ffd700);
}

.lantern {
  width: 60px;
  height: 80px;
  background: #ff4d4d;
  border-radius: 30px;
  position: absolute;
  top: 40px;
  box-shadow: 0 0 20px rgba(255, 77, 77, 0.6);
  animation: swing 3s infinite ease-in-out;
}

.lantern.left {
  left: 10%;
}

.lantern.right {
  right: 10%;
  animation-delay: 0.5s;
}

.lantern::before {
  content: "福";
  color: #ffd700;
  font-size: 24px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

@keyframes swing {
  0%, 100% { transform: rotate(-5deg); }
  50% { transform: rotate(5deg); }
}

.firework {
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  animation: firework 2s infinite;
}

.firework:nth-child(1) {
  top: 20%;
  left: 20%;
  animation-delay: 0s;
}

.firework:nth-child(2) {
  top: 30%;
  right: 20%;
  animation-delay: 0.6s;
}

.firework:nth-child(3) {
  top: 15%;
  left: 50%;
  animation-delay: 1.2s;
}

@keyframes firework {
  0% { 
    transform: scale(1);
    background: #ffd700;
    box-shadow: 0 0 20px #ffd700;
  }
  50% {
    transform: scale(20);
    opacity: 0.5;
  }
  100% {
    transform: scale(40);
    opacity: 0;
  }
}

.cloud {
  position: absolute;
  width: 100px;
  height: 30px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  animation: float 4s infinite ease-in-out;
}

.cloud.left {
  left: 15%;
  top: 40%;
}

.cloud.right {
  right: 15%;
  top: 60%;
  animation-delay: 2s;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.story-box {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 1.5rem;
  border-radius: 15px;
  margin: 2rem auto;
  max-width: 600px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.story-text {
  color: #fff;
  font-size: 1.2rem;
  margin: 0.8rem 0;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.3);
  line-height: 1.6;
}
</style> 