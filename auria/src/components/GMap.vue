<template>
  <div class="over">
    <div v-if="show === true" class="spinner">
      <div class="double-bounce1"></div>
      <div class="double-bounce2"></div>
    </div>

    <transition
      name="custom-classes-transition"
      enter-active-class="animated tada"
      leave-active-class="animated bounceOutRight"
    >
      <div class="map" v-bind:style="styleObject">
        <div class="google-map" id="map"></div>
      </div>
    </transition>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "GMap",
  data() {
    return {
      styleObject: {
        opacity: "80%",
        color: "gray",
        show: true
      }
    };
  },
  methods: {
    renderMap(a, b, c) {
      let self = this;
      axios
        .post("http://localhost:3000/t", {
          lat: this.$route.params.lat,
          lon: this.$route.params.lon
        })
        .then(res => {
          alert("Hi");
          function sayHi() {
            self.show = false;
            self.color = undefined;
            self.opacity = 0;
          }

          setTimeout(sayHi, 1000);
        });
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
.btn {
  z-index: 1;
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
.spinner {
  width: 40px;
  height: 40px;

  position: relative;
  margin: 100px auto;
}

.double-bounce1,
.double-bounce2 {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #333;
  opacity: 0.6;
  position: absolute;
  top: 0;
  left: 0;

  -webkit-animation: sk-bounce 2s infinite ease-in-out;
  animation: sk-bounce 2s infinite ease-in-out;
}

.double-bounce2 {
  -webkit-animation-delay: -1s;
  animation-delay: -1s;
}

@-webkit-keyframes sk-bounce {
  0%,
  100% {
    -webkit-transform: scale(0);
  }
  50% {
    -webkit-transform: scale(1);
  }
}

@keyframes sk-bounce {
  0%,
  100% {
    transform: scale(0);
    -webkit-transform: scale(0);
  }
  50% {
    transform: scale(1);
    -webkit-transform: scale(1);
  }
}
</style>
