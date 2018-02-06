import Vue from 'vue/dist/vue.esm'
import Vuex from 'vuex'
import moment from 'moment-timezone'
import { normalize, schema } from 'normalizr'

const eventSchema = new schema.Entity('events')
const eventsArraySchema = new schema.Array(eventSchema)

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
    db: {
      entities: {
        events: {}
      },
      result: []
    }
  },
  getters: {
    events: state => {
      return state.db.result.map(id => state.db.entities.events[id])
    }
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
    initDB (state, payload) {
      state.db = payload
    },
    addEvent (state, payload) {
      state.db.result.push(payload.id)
      state.db.entities.events[payload.id] = payload
    },
    deleteEvent (state, payload) {
      state.db.entities.events[payload] = undefined
      state.db.result.splice(state.db.result.indexOf(payload), 1)
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
            context.commit('initDB', normalize(newEvents, eventsArraySchema))
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
