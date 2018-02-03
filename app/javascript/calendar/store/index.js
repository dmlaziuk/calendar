import Vue from 'vue/dist/vue.esm'
import Vuex from 'vuex'
import moment from 'moment-timezone'
import Axios from 'axios'

moment.tz.setDefault('UTC')

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentYear: moment().get('year'),
    currentMonth: moment().get('month') + 1,
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
    initEvents (state, payload) {
      state.events = payload
    },
    addEvent (state, payload) {
      state.events.push(payload)
    },
    eventFormDate (state, payload) {
      state.eventFormDate = payload
    }
  },
  actions: {
    initEvents (context) {
      return new Promise((resolve, reject) => {
        Axios.get('/events').then((response) => {
          if (response.status === 200) {
            let newEvents = response.data.map((item) => {
              return { description: item.description, event_date: moment(item.event_date) }
            })
            context.commit('initEvents', newEvents)
            resolve()
          } else {
            reject(Error('Cannot get events from server'))
          }
        })
      })
    },
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
