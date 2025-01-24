<template>
  <div class="start-point">
    <h1>起点页面</h1>
    <router-link to="/endpoint">
      <button class="navigate-btn">前往终点</button>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'StartPoint'
}
</script>

<style scoped>
.start-point {
  padding: 20px;
  text-align: center;
}

.navigate-btn {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.navigate-btn:hover {
  background-color: #45a049;
}
</style> 