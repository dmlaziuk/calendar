<template>
  <div id="event-form" :class="{ active: active }" :style="{ top: top, left: left }">
    <h4>Add an event</h4>
    <p>{{ date.format('dddd, MMM Do') }}</p>
    <div class="text">
      <input v-focus class="text" v-model="description" placeholder="Vacation" @keyup.enter="create">
      <div class="buttons">
        <button @click="create">Create</button>
      </div>
    </div>
    <button id="close-button" @click="close">&#10005;</button>
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      description: ''
    }
  },
  computed: {
    active () {
      return this.$store.state.eventFormActive
    },
    top () {
      return `${this.$store.state.eventFormPosY}px`
    },
    left () {
      return `${this.$store.state.eventFormPosX}px`
    },
    date () {
      return this.$store.state.eventFormDate
    }
  },
  methods: {
    create () {
      if (this.description.length > 0) {
        this.$store.dispatch('addEvent', this.description).then(() => {
          this.description = ''
          this.$store.commit('eventFormActive', false)
        })
      }
    },
    close () {
      this.$store.commit('eventFormActive', false)
    }
  },
  directives: {
    focus: {
      update (el) {
        el.focus()
      }
    }
  }
}
</script>
