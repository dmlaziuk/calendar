import Vue from 'vue/dist/vue.esm'
import Vuex from 'vuex'
import moment from 'moment-timezone'
import Axios from 'axios'

moment.tz.setDefault('UTC')

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentYear: 2018,
    currentMonth: 1,
    eventFormPosX: 0,
    eventFormPosY: 0,
    eventFormActive: false,
    eventFormDate: moment(),
    events: []
  },
  mutations: {
    setCurrentMonth (state, payload) {
      state.currentMonth = payload
    },
    setCurrentYear (state, payload) {
      state.currentYear = payload
    },
    eventFormPos (state, payload) {
      state.eventFormPosX = payload.x
      state.eventFormPosY = payload.y
    },
    eventFormActive (state, payload) {
      state.eventFormActive = payload
    },
    addEvent (state, payload) {
      state.events.push(payload)
    },
    eventFormDate (state, payload) {
      state.eventFormDate = payload
    }
  },
  actions: {
    addEvent (context, payload) {
      return new Promise((resolve, reject) => {
        let event = {
          event: {
            description: payload,
            event_date: context.state.eventFormDate
          }
        }
        Axios.post('/events', event).then(response => {
          if (response.status === 201) {
            context.commit('addEvent', event.event)
            resolve()
          } else {
            reject(Error('Cannot post to server'))
          }
        })
      })
    }
  }
})
