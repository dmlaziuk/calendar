import Vue from 'vue/dist/vue.esm'
import Vuex from 'vuex'
import moment from 'moment-timezone'

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
        fetch('/events').then(response => { return response.json() })
          .then(json => {
            let newEvents = json.map(event => {
              return {
                id: event.id,
                description: event.description,
                event_date: moment(event.event_date)
              }
            })
            context.commit('initEvents', newEvents)
          })
          .catch(() => alert('Cannot get events from server:')
          )
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
        fetch('/events', {
          method: 'post',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(event)
        })
          .then(response => { return response.json() })
          .then(json => {
            event = {
              id: json.id,
              description: payload,
              event_date: context.state.eventFormDate
            }
            context.commit('addEvent', event)
            resolve()
          })
          .catch(() => alert('Cannot save event on server'))
      })
    },
    deleteEvent (context, payload) {
      return new Promise((resolve, reject) => {
        fetch(`/events/${payload}`, {method: 'delete'})
          .then(response => {
            context.commit('deleteEvent', payload)
            resolve()
          })
          .catch(() => alert('Cannot delete event on server'))
      })
    }
  }
})
