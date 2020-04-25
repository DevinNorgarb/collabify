<template>
  <q-page class="flex flex-center">
    <div class="column welcome-text q-pb-md">
          <!-- <q-route-tab
      icon="mail"
      :label="tab.meta.tabLabel"
      :to="`/table-extensions/${tab.path}`"
      exact
      v-for="tab in tabs"
      :key="tab.name"
    /> -->
  </q-tabs>
      <div>
        <!-- {{$store.spotifyAuth}} -->
        <h5>Welcome to commandify <br> </h5>
        <h5 class="text-center"> {{$store.state.spotifyAuth.user.displayName}}</h5>
      </div>
      <div>
        <div>
          <div>
            <q-btn
              class="full-width"
              @click="$router.replace('/voice-control')"
              color="primary"
              label="Get Started"
              size="18px"
            />

          </div>
        </div>
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
// import { tabs } from '../routes'

import SpotifyAuth from "../features/Auth/ui/SpotifyAuth.vue";
import { mapGetters } from 'vuex'
export default {
  name: 'PageIndex',
  components: {
    "spotify-auth": SpotifyAuth
  },
  data () {
    return {
      color: 'primary',
      response: '',
      loading: false,
      user: {}
    }
  },
  mounted () {
    // this.user = this.$store.state.spotifyAuth
    console.log(this.user);

  },
  created () {
    console.log('hey index.vue', this.$store.state)

  },
  computed: {
    // ...mapGetters({
    //   store: 'spotifyAuth/getField'
    // })
  },
  methods: {
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
<style lang="scss" scoped>
.welcome-text {
  margin-bottom: 30px;
}
</style>