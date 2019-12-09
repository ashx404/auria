<template>
  <div class="player">
    <p>
      <a href="#" @click="bruh()">Play YOUR LOCATION</a>
      &nbsp; &nbsp;
    </p>
    <p>
      <a href="#" onclick="MIDIjs.stop(); ">Stop Playback</a>
    </p>

    <div style="font-size: 71%;font-size: 71%">
      MIDIjs status:
      <span id="MIDIjs.message" style="color: green">Initializing ...</span>
      <div>
        MIDIjs audio time (s):
        <span id="MIDIjs.audio_time" style="color: green">-</span>
      </div>
    </div>

    <div class="bruh">BRUH</div>
  </div>
</template>
 <script type="text/javascript" src="//www.midijs.net/lib/midi.js"></script>
<script>
export default {
  data() {
    return {};
  },
  methods: {
    bruh() {
      //   alert("ggg");
      MIDIjs.play("../../static/midi/ANS.mid");
    }
  }
};
</script>

<style>
</style>