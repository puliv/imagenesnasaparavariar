<template>
  <div id="app">
    <div class="home">
      <div class="selected-date">
        {{ home_title !== null ? home_title : "" }}
      </div>
      <v-calendar :attributes="attributes" @dayclick="onDayClick" :max-date="today" />
      <img alt="" v-if="home_video == null" :src="home_img" />
      <!-- <video :src="home_video" v-if="home_video !== null" /> -->
      <div class="text">
        {{ home_text }}
      </div>
    </div>
    <!-- <HelloWorld msg="Welcome to Your Vue.js App" /> -->
  </div>
</template>

<script>
// import HelloWorld from "./components/HelloWorld.vue";

export default {
  name: "App",
  components: {
    // HelloWorld
  },
  data() {
    return {
      home_img: null,
      home_text: null,
      home_video: null,
      home_title: null,
      dateSelected: null,
      days: [],
      today: new Date()
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
        // console.log(response.data);
        var data = response.data;

        if (data.media_type == "video") {
          var vid = data.url.split(":");
          this.home_video = "http:" + vid[1];
          // console.log(this.home_video);
          this.home_title = data.title;
        }
        if (data.media_type == "image") {
          this.home_img = data.url;
          this.home_video = null;
          this.home_title = data.title;
        }

        this.home_text = data.explanation;
      });
    },
    getImageByDay(day) {
      var api_key = "rsLmxghvWRUQWRVjQhKN6Jg750ipPyTEnIjQ0Xrj";
      var date = day.id.split("-");
      console.log(date);

      var api = `https://api.nasa.gov/planetary/apod?api_key=${api_key}&date=${
        date[0] + "-" + date[1] + "-" + date[2]
      }`;
      console.log("api", api);

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
      if (idx >= 0) {
        this.days.splice(idx, 1);
      } else {
        this.days.push({
          id: day.id,
          date: day.date
        });
      }
      this.getImageByDay(day);
    }
  },
  mounted() {
    this.getData();
  }
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;

  .home {
    text-align: center;

    img {
      object-fit: contain;
      width: 55%;
    }
  }
}
</style>
