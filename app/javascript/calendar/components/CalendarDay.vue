<template>
  <div id="calendar-day" :class="classObject" @click="captureClick">
      {{ day.format('D') }}
      <ul class="event-list">
        <li v-for="event in events">{{ event.description }}</li>
      </ul>
  </div>
</template>

<script>
import moment from 'moment-timezone'
export default {
  computed: {
    classObject () {
      let today = this.day.isSame(moment(), 'day')
      let eventFormActive = this.$store.state.eventFormActive
      let eventFormDate = this.$store.state.eventFormDate
      return {
        day: true,
        today,
        past: this.day.isSameOrBefore(moment(), 'day') && !today,
        active: eventFormDate.isSame(this.day, 'day') && eventFormActive
      }
    },
    events () {
      return this.$store.state.events.filter(event => event.date.isSame(this.day, 'day'))
    }
  },
  props: [ 'day' ],
  methods: {
    captureClick (event) {
      this.$store.commit('eventFormPos', { x: event.clientX, y: event.clientY })
      this.$store.commit('eventFormActive', true)
      this.$store.commit('eventFormDate', this.day)
    }
  }
}
</script>
