<template>
  <transition
    name="custom-classes-transition"
    enter-active-class="animated tada"
    leave-active-class="animated bounceOutRight"
  >
    <div class="map" v-bind:style="styleObject">
      <div class="google-map" id="map"></div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "GMap",
  data() {
    return {
      styleObject: {
        opacity: "50%",
        color: "gray"
      }
    };
  },
  methods: {
    renderMap(a, b, c) {
      var myLatLng = { lat: parseFloat(a), lng: parseFloat(b) };

      // alert(typeof a);
      map = new google.maps.Map(document.getElementById("map"), {
        center: myLatLng,
        zoom: 5,
        disableDoubleClickZoom: true,
        mapTypeId: "satellite", // disable the default map zoom on double click
        disableDefaultUI: true
      });
      var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        animation: google.maps.Animation.DROP,
        title: c + " " + a + "," + b
      });
      marker.addListener("click", toggleBounce);
    }
  },
  mounted() {
    this.renderMap(
      this.$route.params.lat,
      this.$route.params.lon,
      this.$route.params.place
    );
  }
};
</script>
<style>
@import "https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.2/animate.css";
.map {
}
.google-map {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  background: #fff;
  position: absolute;
  top: 0;
  z-index: -1;
}
</style>
