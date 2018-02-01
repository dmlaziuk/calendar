<template>
  <div id="calendar">
    <div v-for="week in weeks" class="calendar-week">
      <calendar-day v-for="day in week" :day="day"/>
    </div>
  </div>
</template>

<script>
import moment from 'moment-timezone'
import Vue from 'vue'
import CalendarDay from './CalendarDay.vue'

export default {
  computed: {
    year () {
      return this.$store.state.currentYear
    },
    month () {
      return this.$store.state.currentMonth
    },
    days () {
      let days = []
      let currentDay = moment(`${this.year}-${this.month}-1`, 'YYYY-M-D')
      // Adding all days in current month
      do {
        days.push(currentDay)
        currentDay = moment(currentDay).add(1, 'days')
      } while ((currentDay.month() + 1) === this.month)
      // Add previous days to start
      const SUNDAY = 0;
      const MONDAY = 1;
      currentDay = moment(days[0])
      while (currentDay.day() !== MONDAY) {
        currentDay = moment(currentDay).subtract(1, 'days')
        days.unshift(currentDay)
      }
      // Add following days to end
      currentDay = moment(days[days.length - 1])
      while (currentDay.day() !== SUNDAY) {
        currentDay = moment(currentDay).add(1, 'days')
        days.push(currentDay)
      }
      return days
    },
    weeks () {
      let weeks = []
      let week = []
      for (let day of this.days) {
        week.push(day)
        if (week.length === 7) {
          weeks.push(week)
          week = []
        }
      }
      return weeks
    }
  },
  components: { CalendarDay }
}
</script>
