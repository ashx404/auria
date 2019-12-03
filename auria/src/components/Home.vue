<template>
  <div class="bg">
    <div class="row text-center d-flex justify-content-center logo" style="width:100%">
      <img src="../assets/AURIA.png" height="370px" />
    </div>
    <div class="text-center search-container">
      <input
        v-model="search"
        type="text"
        size="50"
        placeholder="Enter a location"
        ref="autocomplete"
        name="PlaceName"
        class="searchTextField"
        style=" margin-bottom:100px; padding:5px; border:2px solid;border-radius:4px;"
      />
    </div>
    <div class="rest text-center">
      <div id="latclicked" style="display: none"></div>
      <div id="longclicked" style="display: none"></div>
      <div id="placename" style="display: none"></div>
    </div>
    
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      search: ""
    };
  },
  methods: {},
  mounted() {
    this.autocomplete = new google.maps.places.Autocomplete(
      this.$refs.autocomplete,
      { types: ["geocode"] }
    );
    this.autocomplete.addListener("place_changed", () => {
      let place = this.autocomplete.getPlace();
      console.log(place);
      let ac = place.address_components;
      let lat = place.geometry.location.lat();
      let lon = place.geometry.location.lng();
      let city = ac[0]["short_name"];
      this.$router.push(`/music/${place.name}/${lat}/${lon}`);
      console.log(
        `The user picked ${city} with the coordinates ${lat}, ${lon}`
      );
    });
  }
};
</script>


<style >
* {
  margin: 0;
  padding: 0;
}
.bg {
  background: linear-gradient(rgb(176, 203, 207), rgb(66, 223, 235));
  background-size: cover;
  background-repeat: no-repeat;
  min-width: 100vw !important;
  max-width: 100vw !important;
  min-height: 100vh !important;
}
</style>
