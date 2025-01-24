<template>
  <div class="end-point">
    <h1>终点页面</h1>
    <router-link to="/">
      <button class="back-btn">返回起点</button>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'EndPoint'
}
</script>

<style scoped>
.end-point {
  padding: 20px;
  text-align: center;
}

.back-btn {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.back-btn:hover {
  background-color: #da190b;
}
</style> 