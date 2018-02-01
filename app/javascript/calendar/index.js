import './styles/calendar'
import moment from 'moment-timezone'
import Vue from 'vue/dist/vue.esm'
import App from './components/App.vue'
import store from './store'

moment.tz.setDefault('UTC')

document.addEventListener('DOMContentLoaded', () => {
  let events = [
    { description: 'Event 1', date: moment() },
    { description: 'Event 2', date: moment() },
    { description: 'Event 3', date: moment() }
  ]

  let initialState = Object.assign({}, store.state, { events })

  store.replaceState(initialState)

  const app =  new Vue({
    el: '#app',
    store,
    ...App
  })
})
