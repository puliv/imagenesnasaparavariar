<template>
  <div id="app">
    <div class="navbar">
      <div class="navbar__title">
        <img src="./assets/img/nasa.png" alt="" />
        <h3>Imágenes de la NASA para variar</h3>
      </div>
      <div class="select__date">
        <button class="btn al-azar" @click="random">Al azar</button>
        <button class="btn select-date" @click="selectDate">Seleccionar fecha</button>
      </div>
    </div>
    <v-calendar
      v-if="show_calendar"
      :attributes="attributes"
      @dayclick="onDayClick"
      :max-date="today"
      :min-date="min_date"
    />
    <div class="home">
      <div class="home__title">
        <h1>
          {{ home_title !== null ? home_title : "" }}
          <br />
          {{ dateSelected !== null ? dateSelected : "" }}
        </h1>
      </div>
      <div class="home__container">
        <div class="home__left">
          <Spinner v-if="show_spinner" />
          <div class="img">
            <img alt="" v-if="home_video == null && home_img !== null" :src="home_img" />
          </div>
          <div class="vid">
            <LazyYoutube v-if="home_video !== null" :src="home_video" ref="lazyVideo" />
          </div>
        </div>
        <div class="home__right">
          <div class="text">
            {{ home_text }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { LazyYoutube } from "vue-lazytube";
import "../src/assets/scss/style.scss";
import Spinner from "./components/Spinner.vue";

export default {
  name: "App",
  components: {
    LazyYoutube,
    Spinner
  },
  data() {
    return {
      home_img: null,
      home_text: null,
      home_video: "",
      home_title: null,
      dateSelected: null,
      min_date: "1995-06-16",
      days: [],
      today: new Date(),
      show_calendar: false,
      show_spinner: false
    };
  },
  computed: {
    dates() {
      return this.days.map((day) => day.date);
    },
    attributes() {
      return this.dates.map((date) => ({
        highlight: true,
        dates: date
      }));
    }
  },
  methods: {
    getData() {
      var api =
        "https://api.nasa.gov/planetary/apod?api_key=rsLmxghvWRUQWRVjQhKN6Jg750ipPyTEnIjQ0Xrj";
      this.axios.get(api).then((response) => {
        var data = response.data;
        console.log("data", data);
        this.dateSelected = this.formatDate(this.today).split("-").reverse().join("/");

        if (data.media_type == "video") {
          this.home_title = data.title;
          this.home_video = data.url;
        }
        if (data.media_type == "image") {
          this.home_img = data.url;
          this.home_video = null;
          this.home_title = data.title;
        }

        this.home_text = data.explanation;
      });
    },
    async getImageByDay(day) {
      var api_key = "rsLmxghvWRUQWRVjQhKN6Jg750ipPyTEnIjQ0Xrj";
      var date = day.split("-");

      var api = `https://api.nasa.gov/planetary/apod?api_key=${api_key}&date=${
        date[0] + "-" + date[1] + "-" + date[2]
      }`;

      console.log(api);

      this.axios.get(api).then((response) => {
        // console.log(response.data);
        var _data = response.data;
        this.show_calendar = false;
        this.show_spinner = false;
        if (_data.media_type == "image") {
          this.home_img = _data.url;
          this.home_title = _data.title;
          this.home_video = null;
          this.home_text = _data.explanation;
          this.dateSelected = day.split("-").reverse().join("/");
        }
      });
    },
    onDayClick(day) {
      const idx = this.days.findIndex((d) => d.id === day.id);
      this.show_spinner = true;
      this.home_img = null;
      this.home_video = null;
      this.days = [];
      if (idx >= 0) {
        this.days.splice(idx, 1);
      } else {
        this.days.push({
          id: day.id,
          date: day.date
        });
      }
      this.getImageByDay(day.id);
    },
    selectDate() {
      this.show_calendar = !this.show_calendar;
      this.$ga.event("Botón", "click", "Seleccionar fecha");
    },
    random() {
      var start = this.min_date;
      var end = this.today;
      var date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
      var result = this.formatDate(date);
      this.show_spinner = true;
      this.home_img = null;
      this.home_video = null;
      // console.log(result);
      this.getImageByDay(result);
      this.$ga.event("Botón", "click", "Al Azar");
      return result;
    },
    formatDate(date) {
      var d = new Date(date),
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear();

      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;
      return [year, month, day].join("-");
    }
  },
  mounted() {
    this.getData();
    this.min_date = new Date(this.min_date);
    console.log(this.min_date);
  }
};
</script>
