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

const fields = () => ({
  email: null,
  password: null,
  confirm_password: null,
  name: null,
  user: {}
})
export default {
  name: "SpotifyAuth",
  data () {
    return {
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
      // var endUrl = "https://commandify.devswebdev.com";
      var endUrl = "http://192.168.8.105:8080";
      // this.getUser.redirectUri;

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
        console.log(params);


        this.user = params;

        if (evt.url.includes(endUrl)) {
          browser.close();
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

      // if (thi) {

      // }
      this.useInAppBrowser()

      return








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
    show () {
      // this.form.url = null
      this.form = fields()
      this.$refs.reg.show()
      this.$nextTick(() => {
        log('IS FORM AVAILABLE?? ', !!this.$refs.mainForm)
        this.$refs.mainForm.resetValidation()
      })
    },
    async ok () {
      this.$v.form.$touch()
      if (this.$v.form.$error) {
        return
      }

      // this.$refs.settings.hide()
      console.log('IP SETTINS', this.form)
      // console.log('RESP IP SETTINS', ))
      // this.$store.dispatch('commons/updateSettings', params)
      this.loading = true
      this.$store.dispatch('auth/register', this.form)
        .then(res => {
          console.log('res', res)
          // this.$q.notify({
          //   icon: 'mdi-check-circle-outline',
          //   message: res,
          //   timeout: 1000,
          //   color: 'positive'
          // })
          this.$emit('register-status', true)
          this.$refs.reg.hide()
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
