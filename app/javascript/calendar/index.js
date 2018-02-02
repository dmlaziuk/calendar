import './styles/calendar'
import moment from 'moment-timezone'
import Vue from 'vue/dist/vue.esm'
import App from './components/App.vue'
import Axios from 'axios'
import store from './store'

moment.tz.setDefault('UTC')

document.addEventListener('DOMContentLoaded', () => {
  Axios.get('/events').then((response) => {
    let events = response.data.map((item) => {
      return { description: item.description, event_date: moment(item.event_date) }
    })
    let initialState = Object.assign({}, store.state, { events })
    store.replaceState(initialState)
  })

  const app = new Vue({
    el: '#app',
    store,
    ...App
  })
})
