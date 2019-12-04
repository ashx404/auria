<template>
  <a href="#" v-on="music()">Play ANS.mid</a>
</template>

<script>
export default {
  methods: {
    music() {
      MIDIjs.play("../assets/ANS.mid");
    }
  }
};
</script>

<style>
</style>