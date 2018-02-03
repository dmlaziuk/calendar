import './styles/calendar'
import Vue from 'vue/dist/vue.esm'
import App from './components/App.vue'

document.addEventListener('DOMContentLoaded', () => {
  return new Vue({
    el: '#app',
    ...App
  })
})
