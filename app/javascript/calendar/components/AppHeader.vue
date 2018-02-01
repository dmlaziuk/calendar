<template>
  <div id="header">
    <div>
      <img src="../../assets/logo.png">
      <h1>Vue.js on Rails Calendar</h1>
    </div>
    <div>
      <current-month/>
    </div>
  </div>
</template>

<script>
import CurrentMonth from './CurrentMonth.vue'
export default {
  components: { CurrentMonth }
}
</script>
