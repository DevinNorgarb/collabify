<template>
  <!-- <q-select
      outlined
      v-model="voiceSelect"
      :options="optionsVoice"
      label="Idiomas"
      class="col-12"
      emit-value
      map-options
    /> -->
  <div style="background-color: black !important;" class=" bg-black">
    <q-btn
      push
      color="green"
      round
      size="lg"
      icon="keyboard_voice"
      @click="record()"
      style="z-index: 10000; right: 10px; position: absolute; top: -630%; "
    />
    <!-- class="float-right"  -->

    <q-page-sticky
      v-if="btnStop"
      position="bottom-right"
      style="z-index: 10000; margin-right: 20px; ;"
      :offset="[15, 18]"
    >
      <q-btn fab icon="stop" color="negative" @click="stop()" />
    </q-page-sticky>

    <!--
    <!-- <div
      class="col-12 text-center"
      style="z-index: 10000; margin-right: 20px; margin-bottom: 20%;"
    >
      <q-toggle v-model="continuous" label="Contínuo" left-label />
    </div> -->

    <!-- <q-page-sticky v-if="btnStop" position="bottom-right" :offset="[15, 18]">
      <q-btn fab icon="keyboard_voice" color="primary" @click="record()" />
    </q-page-sticky> -->
    <!-- <div style="z-index: 10000; margin-right: 20px; margin-bottom: 20%;"> -->
    <q-page-sticky
      v-if="btnStop"
      position="bottom-right"
      style="z-index: 10000; margin-right: 20px; ;"
      :offset="[15, 18]"
    >
      <q-btn fab icon="stop" color="negative" @click="stop()" />
    </q-page-sticky>
  </div>
  <!-- </div> -->
</template>

<script>
export default {
  name: "PageIndex",
  data() {
    return {
      text: "",
      voiceSelect: "en-ZA",
      optionsVoice: [],
      continuous: false,
      btnStop: false
    };
  },
  mounted() {
    this.setVoices();
  },
  methods: {
    setVoices() {
      let id = setInterval(() => {
        if (this.optionsVoice.length === 0) {
          this.voicesList();
        } else {
          clearInterval(id);
        }
      }, 50);
    },
    voicesList() {
      if (typeof speechSynthesis === "undefined") {
        return;
      }
      let teste = window.speechSynthesisInstance;
      this.optionsVoice = teste.getVoices().map(voice => ({
        label: voice.name,
        value: voice.lang
      }));
    },
    record() {
      this.btnStop = true;
      this.$speechToText
        .start(this.voiceSelect, this.continuous)
        .then(suc => {
          //console.log("retornou", suc);
          this.text += " " + suc;
          if (this.continuous) {
            this.record();
          } else {
            this.btnStop = false;
          }
        })
        .catch(() => {
          //console.log("erro no retorno");
          this.btnStop = false;
        });
    },
    stop() {
      this.$speechToText.stop();
      this.btnStop = false;
    }
  }
};
</script>
