<template>
  <q-layout view="lHh Lpr lFf">
    <!-- lFf -->
    <!-- lHh lpr lFf lHh Lpr fff-->
    <q-header
      elevated
      class="toolbar-grad"
    >
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
          v-touch-hold:1000.mouse.stop="touchHeld"
        >
          <q-icon name="menu" />
        </q-btn>

        <q-toolbar-title>Commandify</q-toolbar-title>

        <!-- <div>Commandify</div> -->
        <q-btn
          :icon="$q.dark.isActive ? 'mdi-brightness-5' : 'mdi-brightness-4'"
          flat
          dense
          round
          @click="$q.dark.isActive ? $q.dark.set(false) : $q.dark.set(true)"
          no-caps
        >
        </q-btn>
      </q-toolbar>
        <q-tabs>
          <q-route-tab
            icon="record_voice_over"
            to="/"
            active-class
            replace
            label="Command"
          />

          <q-route-tab
            icon="search"
            to="/search-page"
            replace
            label="search"
          />
        </q-tabs>
      <router-view
        name="tabs"
        ref="mainTab"
      />
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
    >
      <!-- TODO:: move drawer items to a separate file -->
      <q-list>
        <q-item
          clickable
          to="/home"
        >
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Home</q-item-label>
            <q-item-label caption>Home</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator />
        <base-drawer />
        <q-separator />
        <q-item
          clickable
          @click="logout()"
          v-ripple
        >
          <q-item-section avatar>
            <q-icon name="mdi-logout-variant" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Logout</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-footer
      class="text-white"
      reveal
      v-if="false"
    >
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg">
          </q-avatar>Title
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>

    <q-page-container>
      <transition
        enter-active-class="animated fadeInLeft"
        leave-active-class="animated fadeOutRight"
        mode="out-in"
      >
        <router-view />
      </transition>
    </q-page-container>
  </q-layout>
</template>

<script>
import BaseDrawer from 'components/Drawers/BaseDrawer'
import { openURL } from 'quasar'
import { mapFields } from 'assets/utils/vuex-utils'
import fooStoreModule from 'features/stores-index.js'

export default {
  name: 'MyLayout',
  components: {
    BaseDrawer
  },
  data () {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop,
      hasTabs: false
    }
  },
  computed: {
    ...mapFields('commons', ['pageMeta'])
  },
  preFetch ({ store }) {
    store.registerModule('foo', fooStoreModule)
    return store.dispatch('foo/inc')
  },
  methods: {
    openURL,
    touchHeld () {
      console.log('Touch held!')
      alert('Touch held!')
    },
    checkTabs () {

      this.$nextTick(() => {
        this.hasTabs = !!(this.$refs.toolbarTab || this.$refs.mainTab)
        // if (this.$refs.toolbarTab) {
        this.hasTabs = true
        // } else if (this.$refs.mainTab) {
        //   this.hasTabs = true
        // } else {
        //   this.hasTabs = false
        // }
        console.log('hasTabs =>', this.hasTabs)
      })
    },
    logout () {
      this.$q.dialog({
        title: 'Logout',
        message: 'Are you sure you want to logout?',
        ok: {
          flat: true,
          color: 'warning'
        },
        cancel: {
          color: 'secondary',
          flat: true
        },
        persistent: true
      }).onOk(() => {
        // reset states
        // this.$store.dispatch('resetAllState')
        this.$store.commit('commons/updateField', { path: 'isAuth', value: false })
        this.$store.commit('auth/updateField', { path: 'token', value: null })
        this.$router.replace('/')
      }).onCancel(() => {
        // console.log('>>>> Cancel')
        // do nothing
      })
    }
  },
  mounted () {
    console.log(this.$q.platform.is.desktop)
    this.$q.dark.set(true) // or false or "auto"

    this.checkTabs()
  },
  updated: function () {
    this.checkTabs()
  }
}
</script>

<style scoped>
/* .toolbar-grad {
  background-image: linear-gradient(to bottom right, #ec268f 0%, #bc1e72 75%);
} */
</style>
