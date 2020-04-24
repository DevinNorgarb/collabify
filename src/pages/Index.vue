<template>
  <q-page class="flex flex-center">
    <div class="column justify-center items-center">
      <div>
        <h5>Please Sign in to Spotify</h5>
      </div>
      <div>
        <spotify-auth/>
      </div>
      <div>
        <code>
          {{ response }}
        </code>
      </div>
    </div>
  </q-page>
</template>

<style></style>

<script>
import SpotifyAuth from "../features/Auth/ui/SpotifyAuth.vue";
export default {
  name: 'PageIndex',
  components: {
    "spotify-auth": SpotifyAuth
  },
  data () {
    return {
      color: 'primary',
      response: '',
      loading: false
    }
  },
  created () {
    console.log('hey index.vue')
  },
  methods: {
    // async makeRequest () {
    //   let response
    //   let color = 'negative'
    //   this.loading = true

    //   try {
    //     response = ''
    //     let req = await fetch(process.env.api + '/test')

    //     if (!req.ok) throw new Error('error request')

    //     let {data} = await req.json()
    //     response = data
    //     color = 'positive'
    //   } catch (err) {
    //     console.log(err)
    //     response = err.message
    //   }

    //   setTimeout(() => {
    //     this.response = response
    //     this.color = color
    //     this.loading = false
    //   }, 700)
    // }

    auth (network) {
      const hello = this.hello;
      hello(network).login().then(() => {
        const authRes = hello(network).getAuthResponse();
        /*
          performs operations using the token from authRes
        */
        hello(network).api('me').then(function (json) {
          const profile = json;
          /*
            performs operations using the user info from profile
          */
        });
      })
    },

    makeRequest () {
      //   let response
      //   let color = 'negative'
      this.loading = true
      this.$axios
        .get('/test')
        .then(res => {
          console.log('res', res)
          this.loading = false
        })
        .catch(err => {
          this.loading = false
          console.log('err', err)
        })

      //   try {
      //     response = ''
      //     let req = await fetch(process.env.api + '/test')

      //     if (!req.ok) throw new Error('error request')

      //     let {data} = await req.json()
      //     response = data
      //     color = 'positive'
      //   } catch (err) {
      //     console.log(err)
      //     response = err.message
      //   }

      //   setTimeout(() => {
      //     this.response = response
      //     this.color = color
      //     this.loading = false
      //   }, 700)
    }
  }
}
</script>
