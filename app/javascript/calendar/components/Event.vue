<template>
  <li>
    {{ event.description }}
    <button id="close-button" @click.stop="deleteEvent">&#10005;</button>
  </li>
</template>
<script>
export default {
  props: [ 'event' ],
  methods: {
    deleteEvent () {
      this.$store.dispatch('deleteEvent', this.event.id)
    }
  }
}
</script>
