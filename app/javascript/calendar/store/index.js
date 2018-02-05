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
    deleteEvent (state, payload) {
      let index = state.events.findIndex(i => i.id === payload)
      state.events.splice(index, 1)
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
              return {
                id: item.id,
                description: item.description,
                event_date: moment(item.event_date)
              }
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
          if (response.status === 200) {
            event = {
              id: response.data.id,
              description: payload,
              event_date: context.state.eventFormDate
            }
            context.commit('addEvent', event)
            resolve()
          } else {
            reject(Error('Cannot post event to server'))
          }
        })
      })
    },
    deleteEvent (context, payload) {
      console.log()
      return new Promise((resolve, reject) => {
        Axios.delete('/events/' + payload).then(response => {
          if (response.status === 204) {
            context.commit('deleteEvent', payload)
            resolve()
          } else {
            reject(Error(`Cannot delete event id=${payload} on server`))
          }
        })
      })
    }
  }
})
