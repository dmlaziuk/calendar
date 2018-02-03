Vue.js on Rails Calendar
========================

### 1. Description

**Vue.js on Rails Calendar** is a calendar app like **Google Calendar**.
This project uses **Vue.js** framework for front-end and **Ruby on Rails** for back-end API calls.
Front-end taken from [Ultimate Vue.js Developers Course](http://bit.ly/2mPK8ny).
Making Vue.js run on Rails described in [Reference tutorial](https://github.com/multpix/rails-webpacker-vue).

### 2. Dependencies

- node 9.4
- yarn 1.3
- webpacker 3.2
- vue 2.5
- ruby 2.4
- rails 5.1
- foreman 0.64

### 3. Installation

```
$ bundle install
$ npm install
```

To properly run `webpack` server we have to configure `Babel` in `.babelrc`:

```
{
  "presets": [
    ["env", {
      "modules": false,
      "targets": {
        "browsers": "> 1%",
        "uglify": true
      },
      "useBuiltIns": true
    }]
  ],

  "plugins": [
    "syntax-dynamic-import",
    "transform-object-rest-spread",
    ["transform-class-properties", { "spec": true }]
  ]
}
```

### 4. Running

```
$ ./bin/server
```

By default server runs in development mode.

Content of `bin/server`:

```bash
#!/bin/bash -i
bundle exec foreman start -f Procfile.dev
```

Content of `Procfile.dev`:

```
rails: bundle exec rails s
# watch: ./bin/webpack-watcher
wpack: ./bin/webpack-dev-server
```

It runs Foreman with 2 processes:

- `webpack-dev-server`
- `rails server`

Then you can browse `localhost:5000`.

### 5. Directory structure

Directory structure described in `rails/webpacker` [documentation](https://github.com/rails/webpacker/blob/master/docs/folder-structure.md).

```
app
|-javascript
  |-pack
  | |-calendar.js
  |-calendar
  | |-components
  | | |-App.vue
  | | |-AppHeader.vue
  | | |-Calendar.vue
  | | |-CalendarDay.vue
  | | |-CurrentMonth.vue
  | | |-DayBar.vue
  | | |-EventForm.vue
  | |-store
  | | |-index.js
  | |-styles
  | | |-styles.scss
  | |-index.js
  |-assets
    |-logo.png
    |-Muli-Light.ttf
    |-Muli-Regular.ttf
```

### 6. Front-end

According to **Webpacker**, every file in `pack` directory corresponds to one entry point (output file) in Rails View.

We have one entry point `pack/calendar.js`. It runs `calendar/index.js`:

```js
import 'calendar'
```

In `calendar/index.js` we create root Vue instance to represent `#app` element in DOM:

```js
import './styles/calendar'
import Vue from 'vue/dist/vue.esm'
import App from './components/App.vue'

document.addEventListener('DOMContentLoaded', () => {
  return new Vue({
    el: '#app',
    ...App
  })
})
```

All Vue components implemented as SFCs — Single File Components.

Components tree:

```
App
|-AppHeader
| |-CurrentMonth
|-DayBar
|-Calendar
| |-CalendarDay
|-EventForm
```

#### 6.1. App component

Template:

```html
<div id="app">
  <app-header/>
  <day-bar/>
  <calendar/>
  <event-form/>
</div>
```

Script:

```js
import store from '../store'
import Calendar from './Calendar.vue'
import DayBar from './DayBar.vue'
import AppHeader from './AppHeader.vue'
import EventForm from './EventForm.vue'

export default {
  store,
  components: { AppHeader, DayBar, Calendar, EventForm },
  beforeCreate() {
    this.$store.dispatch('initEvents')
  }
}
```

In `App` component we include `Vuex.Store` implemented in separate file `calendar/store/index.js`.

And in `beforeCreate` hook we dispatch `initEvents` action to `Vuex.Store`.

Vue.js Component Lifecycle:

![Lifecycle](https://vuejs.org/images/lifecycle.png)

Vue.js data/computed/methods comparison:

  Type  | readable?|writeable?|arguments?|computed?|cached?|
:------:|:--------:|:--------:|:--------:|:-------:|:-----:|
  data  |    +     |    +     |    -     |    -    |   -   |
computed|    +     |    +     |    -     |    +    |   +   |
 methods|    +     |    -     |    +     |    +    |   -   |

#### 6.2. AppHeader component

Template:

```html
<div id="header">
  <div>
    <img src="../../assets/logo.png">
    <h1>Vue.js on Rails Calendar</h1>
  </div>
  <div>
    <current-month/>
  </div>
</div>
```

#### 6.3. CurrentMonth component

Template:

```html
<div id="current-month">
  <div>{{ formattedDate }}</div>
  <button @click="dec">-</button>
  <button @click="inc">+</button>
</div>
```

Script:

```js
export default {
  computed: {
    formattedDate () { /* current month -- current year */ },
    year () { /* return current year from the store */ },
    month () { /* return current month from the store */ }
  },
  methods: {
    inc () { /* increment month */ },
    dec () { /* decrement month */ }
  }
}
```

#### 6.4. DayBar component

Template:

```html
<div id="day-bar">
  <div>Mon</div>
  <div>Tue</div>
  <div>Wed</div>
  <div>Thu</div>
  <div>Fri</div>
  <div>Sat</div>
  <div>Sun</div>
</div>
```

#### 6.5. Calendar component

Template:

```html
<div id="calendar">
  <div v-for="week in weeks" class="calendar-week">
    <calendar-day v-for="day in week" :day="day"/>
  </div>
</div>
```

Script:

```js
export default {
  computed: {
    year () { /* return current year from the store */ },
    month () { /* return current month from the store */ },
    days () { /* form array of [some days of previous month to form full week,
                 all days in current month,
                 some days of following month to form full week]  */ },
    weeks () { /* form array of weeks in month */ }
  },
  components: { CalendarDay }
```

#### 6.6. CalendarDay component

Template:

```html
<div id="calendar-day" :class="classObject" @click="captureClick">
    {{ day.format('D') }}
    <ul class="event-list">
      <li v-for="event in events">{{ event.description }}</li>
    </ul>
</div>
```

Script:

```js
import moment from 'moment-timezone'
export default {
  computed: {
    classObject () { /* form class attribute for <div id="calendar-day" ...> */ },
    events () { /* return all events for this day */ }
  },
  props: [ 'day' ],
  methods: {
    captureClick (event) { /* sends current coordinates of mouse,
                              sends day, that have been clicked,
                              activates EventForm component */ }
  }
}
```

#### 6.7. EventForm component

Template:

```html
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
```

Script:

```js
export default {
  data: () => {
    return {
      description: ''
    }
  },
  computed: {
    active () { /* is form active or not */ },
    top () { /* Y position */ },
    left () { /* X position */ },
    date () { /* day, that have been clicked */ }
  },
  methods: {
    create () { /* sends 'addEvent',
                   deactivates EventForm component */ },
    close () { /* deactivates EventForm component */ }
  },
  directives: {
    focus: {
      update (el) {
        el.focus()
      }
    }
  }
}
```

#### 6.8. Vuex

**Vuex** is a **state management pattern**. It serves as a **centralized store** for all the components in an application, with rules ensuring that the state can only be mutated in a predictable fashion. It is used when **multiple components share common state**.

**Architecture** of Vuex applications:

![Vuex](https://vuex.vuejs.org/en/images/vuex.png)

Vuex **Core concepts**:

- state:
 - stores all data
- getters:
 - computed methods of state
- mutations:
 - the only way to change state
 - syncronous methods
- actions:
 - commit mutations
 - return a promise
 - asyncronous
- modules:
 - divides store into modules

Implemented in `calendar/store/index.js`:

```js
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
    setCurrentMonth (state, payload) { state.currentMonth = payload },
    setCurrentYear (state, payload) { state.currentYear = payload },
    eventFormPos (state, payload) { /* ... */ },
    eventFormActive (state, payload) { state.eventFormActive = payload },
    initEvents (state, payload) { state.events = payload },
    addEvent (state, payload) { state.events.push(payload) },
    eventFormDate (state, payload) { state.eventFormDate = payload }
  },
  actions: {
    initEvents (context) { /* back-end API call to get all events stored in database */ },
    addEvent (context, payload) { /* back-end API call to store event in database */ }
  }
})
```

### 7. Back-end

#### 7.1. Routes

`config/routes.rb`:

```ruby
Rails.application.routes.draw do
  get 'calendar/index'
  root 'calendar#index'
  resources :events
end
```

#### 7.2. Controller and View for Front-end

`app/controllers/calendar_controller.rb`:

```ruby
class CalendarController < ApplicationController
  def index 
  end
end
```

We have one entry point `calendar` implemented as `app/javascript/packs/calendar.js`.  
To include this entry point to Rails View we have to use `javascript_pack_tag` helper.  
To include styles from our entry point we have to use `stylesheet_pack_tag` helper.

`app/views/layout/application.html.erb`:

```erb
<!DOCTYPE html>
<html>
  <head>
    <title>Calendar</title>
    <%= csrf_meta_tags %>

    <%= stylesheet_link_tag    'application', media: 'all' %>
    <%= javascript_include_tag 'application' %>
    <%= stylesheet_pack_tag 'calendar' %>
    <%= javascript_pack_tag 'calendar' %>
  </head>

  <body>
    <%= yield %>
  </body>
</html>
```

`app/views/calendar/index.html`:

```html
<div id="app">
  <calendar/>
</div>
```

#### 7.3. Model and Controller for Back-end API

`db/migrate/create_events.rb`:

```ruby
class CreateEvents < ActiveRecord::Migration[5.1]
  def change
    create_table :events do |t|
      t.date :event_date
      t.string :description

      t.timestamps
    end
  end
end
```

`app/models/event.rb`:

```ruby
class Event < ApplicationRecord
  validates :description, presence: true
  validates :event_date, presence: true
end
```

`app/controllers/events_controller.rb`:

```ruby
class EventsController < ActionController::API
  before_action :set_event, only: [:show, :update, :destroy]

  # GET /events
  def index
    @events = Event.all
    json_response(@events)
  end

  # POST /events
  def create
    @event = Event.create!(event_params)
    json_response(@event, :created)
  end

  # GET /events/:id
  def show
    json_response(@event)
  end

  # PUT /events/:id
  def update
    @event.update(event_params)
    head :no_content
  end

  # DELETE /events/:id
  def destroy
    @event.destroy
    head :no_content
  end

  private

  def event_params
    # whitelist params
    params.require(:event).permit(:event_date, :description)
  end

  def set_event
    @event = Event.find(params[:id])
  end

  def json_response(object, status = :ok)
    render json: object, status: status
  end
end
```
