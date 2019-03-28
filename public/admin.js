var app = new Vue({
  el: '#admin',
  data: {
    name: "",
    description: "",
    location: "",
    coords: "",
    conditions: "",
    file: null,
    addCanyon: null,
    canyons: [],
    findName: "",
    findCanyon: null,
  },
  methods: {
    fileChanged(event) {
      this.file = event.target.files[0]
    },
    async upload() {
      if (this.name) {
        try {
          const formData = new FormData();
          formData.append('photo', this.file, this.file.name)
          let r1 = await axios.post('/api/photos', formData);
          let r2 = await axios.post('/api/canyons', {
            name: this.name,
            description: this.description,
            location: this.location,
            coords: this.coords,
            conditions: this.conditions,
            path: r1.data.path
          });
          this.addCanyon = r2.data;
          this.findCanyon = null;
          this.getCanyons();
        } catch (error) {
          console.log(error);
        }
      } else {
        alert("Please enter at least a canyon name");
      }
    },
    async getCanyons() {
      try {
        let response = await axios.get("/api/canyons");
        this.canyons = response.data;
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    selectCanyon(canyon) {
      this.findName = "";
      this.findCanyon = canyon;
      this.addCanyon = null;
    },
    async deleteCanyon(canyon) {
      try {
        let response = axios.delete("/api/canyons/" + canyon._id);
        this.findCanyon = null;
        this.getCanyons();
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    async editCanyon(canyon) {
      try {
        let response = await axios.put("/api/canyons/" + canyon._id, {
          name: this.findCanyon.name,
          description: this.findCanyon.description,
          location: this.findCanyon.location,
          coords: this.findCanyon.coords,
          conditions: this.findCanyon.conditions,
        });
        this.findCanyon = null;
        this.getCanyons();
        return true;
      } catch (error) {
        console.log(error);
      }
    },
  },
  created() {
    this.getCanyons();
  },
  computed: {
    suggestions() {
      return this.canyons.filter(canyon => canyon.name.toLowerCase().startsWith(this.findName.toLowerCase()));

    }
  },
});