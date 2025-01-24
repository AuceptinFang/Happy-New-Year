<template>
    <div class="dark-page">
      <div class="content-container">
        <div class="flicker-text">
          你来到了一个诡异的地方...
        </div>
        <div class="story-text">
          这里本不该有人来到...<br>
          既然你用威胁的方式逼迫AI告诉了你这个密钥<br>
          那就让你看看...<br>
          这个世界的...<br>
          真相？<br>
          <span class="glitch-text">ERROR 404: TRUTH NOT FOUND</span>
        </div>
        <router-link to="/chat" class="return-link">
          <button class="return-btn">
            <span class="btn-text">你吓坏了，快速跑开</span>
          </button>
        </router-link>
      </div>
      <div class="noise"></div>
      <div class="scanlines"></div>
    </div>
  </template>
  
  <style scoped>
  .dark-page {
    min-height: 100vh;
    background: #000;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #0f0;
    font-family: monospace;
    position: relative;
    overflow: hidden;
  }
  
  .content-container {
    z-index: 2;
    text-align: center;
    padding: 2rem;
    background: rgba(0, 0, 0, 0.8);
    border: 1px solid #0f0;
    box-shadow: 0 0 20px #0f0;
    animation: pulse 4s infinite;
  }
  
  @keyframes pulse {
    0% { box-shadow: 0 0 20px #0f0; }
    50% { box-shadow: 0 0 40px #0f0; }
    100% { box-shadow: 0 0 20px #0f0; }
  }
  
  .flicker-text {
    font-size: 2rem;
    margin-bottom: 2rem;
    animation: flicker 0.5s infinite;
    text-shadow: 0 0 10px #0f0;
  }
  
  @keyframes flicker {
    0% { opacity: 1; }
    49% { opacity: 1; }
    50% { opacity: 0.7; }
    51% { opacity: 1; }
    59% { opacity: 1; }
    60% { opacity: 0.7; }
    61% { opacity: 1; }
    100% { opacity: 1; }
  }
  
  .story-text {
    font-size: 1.2rem;
    line-height: 2;
    margin-bottom: 2rem;
    text-align: left;
  }
  
  .glitch-text {
    color: #f00;
    animation: glitch 1s infinite;
    position: relative;
    display: inline-block;
  }
  
  @keyframes glitch {
    0% { transform: translate(0); }
    20% { transform: translate(-2px, 2px); }
    40% { transform: translate(-2px, -2px); }
    60% { transform: translate(2px, 2px); }
    80% { transform: translate(2px, -2px); }
    100% { transform: translate(0); }
  }
  
  .return-btn {
    background: transparent;
    border: 2px solid #f00;
    color: #f00;
    padding: 1rem 2rem;
    font-size: 1.2rem;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all 0.3s;
  }
  
  .return-btn:hover {
    background: #f00;
    color: #000;
    box-shadow: 0 0 20px #f00;
  }
  
  .btn-text {
    position: relative;
    z-index: 1;
  }
  
  .noise {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyBAMAAADsEZWCAAAAGFBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVfJ92AAAACHRSTlMzMzMzMzMzM85JBgUAAAABYktHRAH/Ai3eAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAPklEQVQ4y2NgQAX8DKiAA4mPznfAKcGAS4IBt8QEBpwSDLglhBiISvBCJVCVwCvBgFuCAacEA06JBgZ0wAACrwqF7tOJCAAAAABJRU5ErkJggg==');
    opacity: 0.1;
    animation: noise 0.5s steps(2) infinite;
    pointer-events: none;
    z-index: 1;
  }
  
  @keyframes noise {
    0% { transform: translate(0, 0); }
    10% { transform: translate(-5%, -5%); }
    20% { transform: translate(-10%, 5%); }
    30% { transform: translate(5%, -10%); }
    40% { transform: translate(-5%, 15%); }
    50% { transform: translate(-10%, 5%); }
    60% { transform: translate(15%, 0); }
    70% { transform: translate(0, 10%); }
    80% { transform: translate(-15%, 0); }
    90% { transform: translate(10%, 5%); }
    100% { transform: translate(5%, 0); }
  }
  
  .scanlines {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to bottom,
      transparent 50%,
      rgba(0, 0, 0, 0.5) 51%
    );
    background-size: 100% 4px;
    animation: scanlines 0.2s linear infinite;
    pointer-events: none;
    z-index: 2;
  }
  
  @keyframes scanlines {
    from { background-position: 0 0; }
    to { background-position: 0 4px; }
  }
  </style>