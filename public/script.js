var app = new Vue({
  el: '#app',
  data: {
    canyons: [],
  },
  methods: {
    async getCanyons() {
      try {
        let response = await axios.get("/api/canyons");
        this.canyons = response.data;
        return true;
      } catch (error) {
        console.log(error);
      }
    }
  },
  created() {
    this.getCanyons();
  },
});