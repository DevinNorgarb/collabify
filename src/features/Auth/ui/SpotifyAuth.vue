<template>
  <!-- <q-card> -->
  <q-card-section>
    <div class="text-h6">
      <q-btn
        @click="auth('spotify')"
        color="green"
        class="full-width"
        icon="fab fa-spotify"
        label="Login Using Spotify"
        size=""
      >
      </q-btn>
    </div>
  </q-card-section>
</template>

<script>
import { log } from 'assets/utils/app-utils'
import { required, email, sameAs } from 'vuelidate/lib/validators'
import { axios, setAuthHeader, appModeVuex } from "boot/axios";


const fields = () => ({
  email: null,
  password: null,
  confirm_password: null,
  name: null
  // user: {}
})
export default {
  name: "SpotifyAuth",
  data () {
    return {
      user: {},
      loading: false,
      form: {
        ...fields()
      }
    }
  },
  validations: {
    form: {
      email: { required, email },
      password: { required },
      confirm_password: { required, sameAsPassword: sameAs('password') },
      name: { required }
    }
  },
  watch: {
    user: async function (val, oldVal) {
      console.log(val, oldVal);
      if (val.id) {
        val.name  = val.displayName
        this.loading = true
        var rawData = JSON.parse(val._raw);
        val.email = rawData.email
        this.$store.dispatch('spotifyAuth/login', val)
         .then(res => {
          this.$router.replace('/home')
       })
        .catch(e => {
        })
        .finally(_ => { this.loading = false })
      }
    }
  },
  methods: {
    shown () {
      this.$refs.mainForm.resetValidation()
    },
    setNameText () {
      var nameText = this.user;
      localStorage.setItem('name', nameText);
      alert('Value set');
    },
    useInAppBrowser () {
      var authorizeURL = `http://192.168.8.105:8888/auth/spotify`;
      var endUrl = "http://192.168.8.105:8080";
      var browser = cordova.InAppBrowser.open(
        authorizeURL,
        "_blank",
        "location=no",
        // "location=no",
        "hidden=yes"
      );

      window.plugins.spinnerDialog.show(null, "Loading", true);

      browser.addEventListener("loadstop", evt => {
        window.plugins.spinnerDialog.hide();
      });
      browser.addEventListener("loaderror", evt => {
        window.plugins.spinnerDialog.hide();
        browser.close();
      });

      browser.addEventListener("loadstart", evt => {
        var url_string = evt.url;
        var url = new URL(url_string);
        var params = this.parse_query_string(url.search);


        if (evt.url.includes(endUrl)) {
          browser.close();
          this.user = params;
          window.plugins.spinnerDialog.hide();
        }
      });
    },

    parse_query_string (query) {
      var vars = query.split("&");
      var query_string = {};
      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        var key = decodeURIComponent(pair[0]);
        var value = decodeURIComponent(pair[1]);
        // If first entry with this name
        if (typeof query_string[key] === "undefined") {
          query_string[key] = decodeURIComponent(value);
          // If second entry with this name
        } else if (typeof query_string[key] === "string") {
          var arr = [query_string[key], decodeURIComponent(value)];
          query_string[key] = arr;
          // If third or later entry with this name
        } else {
          query_string[key].push(decodeURIComponent(value));
        }
      }
      return query_string;
    },

    auth (network) {
      this.useInAppBrowser()
    },
    show () {
      // this.form.url = null
      this.form = fields()
      this.$refs.reg.show()
      this.$nextTick(() => {
        this.$refs.mainForm.resetValidation()
      })
    },
    async ok () {
      this.$v.form.$touch()
      if (this.$v.form.$error) {
        return
      }
      console.log('IP SETTINS', this.form)
      this.$store.dispatch('commons/updateSettings', params)
      this.loading = true
      this.$store.dispatch('auth/register', this.form)
        .then(res => {
          console.log('res', res)
          this.$router.replace('/home')

        })
        .catch(e => {
          console.log(e)
          // this.$q.notify({
          //   color: 'negative',
          //   icon: 'mdi-alert-circle-outline',
          //   message: e,
          //   timeout: 1000
          // })
        })
        .finally(_ => { this.loading = false })
    }
  }
}
</script>

<style>
</style>
