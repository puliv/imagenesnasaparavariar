<template>
  <div id="app">
    <div class="navbar">
      <div class="navbar__title">
        <h3>¿Qué imagen de la NASA eres según tu fecha de nacimiento?</h3>
      </div>
      <div class="select__date">
        <button>Select Date</button>
      </div>
    </div>
    <!-- <v-calendar :attributes="attributes" @dayclick="onDayClick" :max-date="today" /> -->
    <div class="home">
      <div class="home__title">
        <h1>
          {{ home_title !== null ? home_title : "" }}
        </h1>
      </div>
      <div class="home__container" :class="video_active && 'active'">
        <div class="home__left">
          <img alt="" v-if="home_video == null" :src="home_img" />
          <LazyYoutube v-if="home_video !== null" :src="home_video" ref="lazyVideo" />
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

export default {
  name: "App",
  components: {
    LazyYoutube
  },
  data() {
    return {
      home_img: null,
      home_text: null,
      home_video: "",
      home_title: null,
      dateSelected: null,
      days: [],
      today: new Date(),
      video_active: false
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
      var date = day.id.split("-");

      var api = `https://api.nasa.gov/planetary/apod?api_key=${api_key}&date=${
        date[0] + "-" + date[1] + "-" + date[2]
      }`;

      this.axios.get(api).then((response) => {
        // console.log(response.data);
        var _data = response.data;
        if (_data.media_type == "image") {
          this.home_img = _data.url;
          this.home_title = _data.title;
          this.home_video = null;
          this.home_text = _data.explanation;
        }
      });
    },
    onDayClick(day) {
      const idx = this.days.findIndex((d) => d.id === day.id);
      this.days = [];
      if (idx >= 0) {
        this.days.splice(idx, 1);
      } else {
        this.days.push({
          id: day.id,
          date: day.date
        });
      }
      this.getImageByDay(day);
    },
    handleClick(event) {
      console.log(event);
      this.$refs["lazyVideo"][event]();
      this.video_active = true;
      console.log(this.video_active);
    }
  },
  mounted() {
    this.getData();
  }
};
</script>
