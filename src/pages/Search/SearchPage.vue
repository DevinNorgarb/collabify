<template>
  <!-- <q-page padding>
\    <q-page class="q-pa-md body-class">
      <template v-if="data">
        <dynamic-table
          :title="'Search Music'"
          :data="data"
          :columns="columns"
          :actions="['action 1', 'action 2', 'action 3']"
          :search-field="filter"
          :inner-loading="loading"
          theme="secondary"
          @search-change="filter = $event"
          :selection-mode="selectionMode"
          @selection-mode-change="
          selectionMode =  'single'
          modeChanged()
        "
          @action-1="doAction"
          @action-2="doAction"
          :grid="$q.platform.is.mobile"
          actions-display-type="bottom menu"
          action-invoke-type="instant"
          search-input-placeholder="Search Name"
          search
          grid-card-style="vertical"
          :row-options="[5, 10, 20, 30, 40, 50]"
          :pagination="pagination"
          ref="table"
          @update:pagination="pagChange"
        />
      </template>
      <template v-else>
        <span>No data, do something like fetch data from server etc...</span>
      </template>
    </q-page>
  </q-page> -->

  <q-page>
    <div class="q-pa-md">
      <q-input
        class="q-pb-md"
        outlined
        :color="'primary'"
        dense
        :debounce="searchDebounce"
        v-model="filter"
        :placeholder=" 'Search'"
        :class="$q.screen.width <= 405 ? 'full-width' : ''"
      >
        <template v-slot:append>
          <q-icon
            name="mdi-magnify"
            :color="'primary'"
          />
        </template>
      </q-input>
      <q-table
        style="height: 400px"
        title="Treats"
        :data="dataTracks"
        :columns="columns"
        row-key="id"
        virtual-scroll
        :pagination.sync="pagination"
        :rows-per-page-options="[0]"
      ></q-table>
    </div>
  </q-page>
</template>

<script>
import DynamicTable from 'components/Tables/Dynamic'
import EventBus from "assets/utils/EventBus";

var SpotifyWebApi = require('spotify-web-api-node');
var dataTracksArray = []
export default {
  name: 'SearchPage',
  components: {
    DynamicTable
  },
  watch: {
    tracks: function (val) {

        console.log("track changes");

      var test = Object.assign({}, val)

      console.log(test[0].name);

      this.dataTracks = []
      // this.dataTracks.push(test)

      // console.log(val);
      // this.$nextTick(() => {
      //   this.$set(this.dataTracks, "tracks", val)
      // })

        // this.$set(this.dataTracks, "tracks", val)

        // this.dataTracks = val

      //   this.$set(this.dataTracks, val)
      // this.$nextTick(() => {
      //   this.$set(this.prefixes[key], 'rpki', '1')

      // })

      // console.log("-----------------");

      // // console.log(val);
      // dataTracksArray = []

      //   //  = val
      // this.dataTracks = Object.assign({}, val)
      for (let index = 0; index < val.length; index++) {
        const element = val[index];

        this.dataTracks.push(element)
        // this.$nextTick(function () {
        //   this.$set(this.dataTracks[index], 'name', element.name)
        //   this.$set(this.dataTracks[index], 'id', element.id)
        // })
      }



    },
    filter: function (val, oldval) {
      this.$store.dispatch('spotifyAuth/search', val)
      this.$nextTick(() => {
        this.$set(this.dataTracks, "tracks", val)
      })
  // this.
  }
  },
  computed: {
    tracks () {
      // this.$set(this.dataTracksArray, "tracks", ...this.$store.state.spotifyAuth.search_tracks.items)
      return this.$store.state.spotifyAuth.search_tracks.items
    }
  },
  mounted () {
    console.log(this.$store.state.spotifyAuth.user.accessToken);
  },
  methods: {
    modeChanged () {
      console.log('modechanged', this.selectionMode)
    },
    doAction (val) {
      console.log('onAction', val)
    },
    pagChange (evt) {
      console.log('pagChange', evt)
      this.pagination = evt
    }
  },
  data () {
    return {

      dataTracksArray: [],
      searchDebounce: 1000,
      dataTracks: [],
      pagination: { rowsPerPage: 10, page: 1 },
      tableTitle: 'Search Music',
      selectionMode: 'none',
      loading: false,
      filter: '',
      // selected: [],
      columns: [
        {
          name: 'name',
          required: true,
          label: 'name',
          align: 'left',
          field: 'name',
          // format: val => `${val}`,
          sortable: true
        },
        {
          name: 'id',
          align: 'center',
          label: 'id',
          field: 'id',
          sortable: true,
          // isRating: false,
          // style: 'width: 150px'
        },
        {
          name: 'artist',
          align: 'center',
          label: 'Rating',
          field: row => row.artists.map(artist => {
            return artist.name + " "
          }),
          sortable: true,
          // isRating: false,
          // style: 'width: 150px'
        }

      ],
      data: this.dataTracks
      // || [
      //   {
      //     name: 'Frozen Yogurt',
      //     calories: 159,
      //     fat: 6.0,
      //     carbs: 24,
      //     protein: 4.0,
      //     sodium: 87,
      //     calcium: '14%',
      //     iron: '1%',
      //     rating: 1
      //   }

      // ]
    }
  },

  created () {
    EventBus.$on('search_tracks', ([payload]) => {
       console.log(payload);
    })

   }

}
</script>
