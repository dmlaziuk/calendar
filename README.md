Vue.js on Rails Calendar
========================

### Description

Vue.js on Rails Calendar is a calendar app like Google Calendar.
This project uses Vue.js framework for front-end and Ruby on Rails for back-end API calls.
Front-end taken from [Ultimate Vue.js Developers Course](http://bit.ly/2mPK8ny).
Making Vue.js running on Rails described in [Reference tutorial](https://github.com/multpix/rails-webpacker-vue).

### Dependencies

- node 9.4
- yarn 1.3
- webpacker 3.2
- vue 2.5
- ruby 2.4
- rails 5.1

### Installation

```
$ bundle install
$ npm install
```

### Running

By default it runs in development mode

```
$ ./bin/server
```

It runs Foreman with 2 processes:

- `webpack-dev-server`
- `rails server`

Then you can browse `localhost:5000`.

### Directory structure

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

### Project description

According to **Webpacker**, every file in `pack` directory corresponds to one entry point (output file) in Rails View.

We have one entry point `pack/calendar.js`. It runs `calendar/index.js`.

In `calendar/index.js` we add

![Vuex](https://vuex.vuejs.org/en/images/vuex.png)
