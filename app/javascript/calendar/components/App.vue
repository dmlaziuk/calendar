<template>
  <div id="app">
    <app-header/>
    <day-bar/>
    <calendar/>
    <event-form/>
  </div>
</template>

<script>
import Calendar from './Calendar.vue'
import DayBar from './DayBar.vue'
import AppHeader from './AppHeader.vue'
import EventForm from './EventForm.vue'

export default {
  components: { AppHeader, DayBar, Calendar, EventForm }
}
</script>
