<template>
  <div id="app">
    <div class="home">
      <v-calendar mode="date" :model-config="modelConfig" v-model="date" />
      <img alt="" :src="home_img" />
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
      date: null,
      modelConfig: {
        type: "number",
        mask: "YYYY-MM-DD" // Uses 'iso' if missing
      }
    };
  },
  methods: {
    getData() {
      var api =
        "https://api.nasa.gov/planetary/apod?api_key=rsLmxghvWRUQWRVjQhKN6Jg750ipPyTEnIjQ0Xrj";
      this.axios.get(api).then((response) => {
        console.log(response.data);

        this.home_img = response.data.url;
        this.home_text = response.data.explanation;
      });
    },
    getImageByDay(day) {
      // var year = date.year;
      // var month = date.month <= 9 ? "0" + date.month : date.month;
      // var day = date.day <= 9 ? "0" + date.day : date.day;
      console.log(day);

      var api_key = "rsLmxghvWRUQWRVjQhKN6Jg750ipPyTEnIjQ0Xrj";
      var date = day.id;
      console.log(date);

      var api = `https://api.nasa.gov/planetary/apod?api_key=${api_key}&date=${date}`;

      this.axios.get(api).then((response) => {
        console.log(response.data);
      });
    },
    onDayClick(day) {
      const idx = this.days.findIndex((d) => d.id === day.id);
      this.getImageByDay(day);
      if (idx >= 0) {
        this.days.splice(idx, 1);
      } else {
        this.days.push({
          id: day.id,
          date: day.date
        });
      }
    }
  },
  mounted() {
    this.getData();
  }
  // watch: {
  //   date: function (val) {
  //     console.log(val);
  //   }
  // }
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
